/*!
 * jQuery Shuffle Plugin
 * Uses CSS Transforms to filter down a grid of items (degrades to jQuery's animate).
 * Inspired by Isotope http://isotope.metafizzy.co/
 * Use it for whatever you want!
 * @author Glen Cheney (http://glencheney.com)
 * @version 1.6.1
 * @date 02/07/13
 */
(function($, Modernizr, undefined) {
    'use strict';


    // You can return `undefined` from the `by` function to revert to DOM order
    // This plugin does NOT return a jQuery object. It returns a plain array because
    // jQuery sorts everything in DOM order.
    $.fn.sorted = function(options) {
        var opts = $.extend({}, $.fn.sorted.defaults, options),
            arr = this.get(),
            revert = false;

        if ( !arr.length ) {
            return [];
        }

        if ( opts.randomize ) {
            return $.fn.sorted.randomize( arr );
        }

        // Sort the elements by the opts.by function.
        // If we don't have opts.by, default to DOM order
        if (opts.by !== $.noop && opts.by !== null && opts.by !== undefined) {
            arr.sort(function(a, b) {

                // Exit early if we already know we want to revert
                if ( revert ) {
                    return 0;
                }

                var valA = opts.by($(a)),
                    valB = opts.by($(b));

                // If both values are undefined, use the DOM order
                if ( valA === undefined && valB === undefined ) {
                    revert = true;
                    return 0;
                }

                return (valA < valB) ? -1 :
                    (valA > valB) ? 1 : 0;
            });
        }

        // Revert to the original array if necessary
        if ( revert ) {
            return this.get();
        }

        if ( opts.reverse ) {
            arr.reverse();
        }

        return arr;

    };

    $.fn.sorted.defaults = {
        reverse: false,
        by: null,
        randomize: false
    };


    // http://stackoverflow.com/a/962890/373422
    $.fn.sorted.randomize = function( array ) {
        var top = array.length,
            tmp, current;

        if ( !top ) {
            return array;
        }

        while ( --top ) {
            current = Math.floor( Math.random() * (top + 1) );
            tmp = array[ current ];
            array[ current ] = array[ top ];
            array[ top ] = tmp;
        }

        return array;
    };



    var Shuffle = function( $container, options ) {
        var self = this;

        $.extend(self, $.fn.shuffle.options, options, $.fn.shuffle.settings);

        self.$container = $container.addClass('shuffle');
        self.$window = $(window);
        self.unique = 'shuffle_' + $.now();

        self.fire('loading');
        self._init();
        self.fire('done');
    };

    Shuffle.prototype = {

        constructor: Shuffle,

        _init : function() {
            var self = this,
                transEndEventNames,
                resizeFunc = $.proxy( self._onResize, self ),
                afterResizeFunc = $.proxy( self._afterResize, self ),
                beforeResizeFunc;

            if ( self.hideLayoutWithFade ) {
                beforeResizeFunc = $.proxy( self._beforeResize, self );
                self._debouncedBeforeResize = self.throttle ? self.throttle( self.throttleTime, true, beforeResizeFunc ) : beforeResizeFunc;
            }

            // Get debounced versions of our resize methods
            self._debouncedResize = self.throttle ? self.throttle( self.throttleTime, afterResizeFunc ) : afterResizeFunc;

            self.$items = self._getItems().addClass('shuffle-item');
            self.transitionName = self.prefixed('transition'),
            self.transform = self.getPrefixed('transform');

            // Get offset from container
            self.offset = {
                left: parseInt( ( self.$container.css('padding-left') || 0 ), 10 ),
                top: parseInt( ( self.$container.css('padding-top') || 0 ), 10 )
            };
            self.isFluid = self.columnWidth && typeof self.columnWidth === 'function';

            // Get transitionend event name
            transEndEventNames = {
                'WebkitTransition' : 'webkitTransitionEnd',
                'MozTransition'    : 'transitionend',
                'OTransition'      : 'oTransitionEnd',
                'msTransition'     : 'MSTransitionEnd',
                'transition'       : 'transitionend'
            };
            self.transitionEndName = transEndEventNames[ self.transitionName ];

            // CSS for each item
            self.itemCss = {
                position: 'absolute',
                top: 0,
                left: 0
            };

            if ( self.$container.css('position') === 'static' ) {
                self.$container.css('position', 'relative');
            }

            // Set up css for transitions
            self.$container[0].style[ self.transitionName ] = 'height ' + self.speed + 'ms ' + self.easing;
            self._initItems( !self.showInitialTransition );

            // http://stackoverflow.com/questions/1852751/window-resize-event-firing-in-internet-explorer
            // self.windowHeight = self.$window.height();
            // self.windowWidth = self.$window.width();
            self.$window.on('resize.shuffle', resizeFunc);

            self._setColumns();
            self._resetCols();
            self.shuffle( self.group );


            if ( !self.showInitialTransition ) {
                self._initItems();
            }
        },

        filter : function( category, $collection ) {
            var self = this,
                isPartialSet = $collection !== undefined,
                $items = isPartialSet ? $collection : self.$items,
                $filtered = $();

            category = category || self.lastFilter;

            self.fire('filter');

            // Default is to show all items
            $items.removeClass('concealed filtered');

            // Loop through each item and use provided function to determine
            // whether to hide it or not.
            if ($.isFunction(category)) {
                $items.each(function() {
                    var $item = $(this),
                    passes = category.call($item[0], $item, self);
                    $item.addClass(passes ? 'filtered' : 'concealed');

                    if ( passes ) {
                        $filtered = $filtered.add($item);
                    }
                });
            }

            // Otherwise we've been passed a category to filter by
            else {
                self.group = category;
                if (category !== 'all') {
                    $items.each(function() {
                        var $this = $(this),
                        groups = $this.data('groups'),
                        keys = self.delimeter && !$.isArray( groups ) ? groups.split( self.delimeter ) : groups,
                        passes = $.inArray(category, keys) > -1,
                        theClass = passes ? 'concealed' : 'filtered';

                        $this.addClass( theClass );

                        if ( passes ) {
                            $filtered = $filtered.add($this);
                        }
                    });
                }

                // category === 'all', add filtered class to everything
                else {
                    $filtered = $items.addClass('filtered');
                }
            }

            return $filtered;
        },

        _initItems : function( withoutTransition ) {
            var self = this;

            self.$items.each(function() {
                $(this).css(self.itemCss);

                // Set CSS transition for transforms and opacity
                if ( self.supported && !withoutTransition && self.useTransition ) {
                    self._setTransition(this);
                }
            });
        },

        _setTransition : function( element ) {
            var self = this;
            element.style[self.transitionName] = self.transform + ' ' + self.speed + 'ms ' + self.easing + ', opacity ' + self.speed + 'ms ' + self.easing;
        },


        _setSequentialDelay : function( $collection ) {
            var self = this;

            if ( !self.supported ) {
                return;
            }

            // $collection can be an array of dom elements or jquery object
            $.each( $collection, function(i) {
                // This works because the transition-property: transform, opacity;
                this.style[self.transitionName + 'Delay'] = '0ms,' + ((i + 1) * self.sequentialFadeDelay) + 'ms';

                // Set the delay back to zero after one transition
                $(this).one(self.transitionEndName, function() {
                    this.style[self.transitionName + 'Delay'] = '0ms';
                });
            });
        },

        _resetDelay : function( $collection ) {
            var self = this;

            if ( !self.supported ) {
                return;
            }

            $.each( $collection, function() {
                $(this).off( self.transitionEndName );
                this.style[ self.transitionName + 'Delay' ] = '0ms';
            });
        },

        _orderItemsByDelay : function( $items ) {
            var self = this,
                $ordered = $(),
                $randomized = $(),
                ordered, randomized, merged,

            by = function( $el ) {
                return $el.data('delayOrder');
            };

            if ( !self.$ordered ) {

                $items.each(function() {
                    var delayOrder = $(this).data('delayOrder');

                    if ( delayOrder ) {
                        $ordered = $ordered.add( this );
                    } else {
                        $randomized = $randomized.add( this );
                    }
                });

                ordered = $ordered.sorted({ by: by });

            } else {
                $ordered = self.$ordered;
                ordered = self.ordered;
                $randomized = $items.not( $ordered );
            }

            // Sort randomly
            randomized = $randomized.sorted({ randomize: true });

            // Merge with the ordered array
            merged = ordered.concat( randomized );

            // Save values
            self.$ordered = $ordered;
            self.ordered = ordered;
            self.itemsOrderedByDelay = merged;
        },

        _getItems : function() {
            return this.$container.children( this.itemSelector );
        },

        // calculates number of columns
        // i.e. this.colWidth = 200
        _setColumns : function() {
            var self = this,
                containerWidth = self.$container.width(),
                gutter = typeof self.gutterWidth === 'function' ? self.gutterWidth( containerWidth ) : self.gutterWidth;

            // use fluid columnWidth function if there
            self.colWidth = self.isFluid ? self.columnWidth( containerWidth ) :
                // if not, how about the explicitly set option?
                self.columnWidth ||
                // or use the size of the first item
                self.$items.outerWidth(true) ||
                // if there's no items, use size of container
                containerWidth;

            // Don't let them set a column width of zero.
            self.colWidth = self.colWidth || containerWidth;

            self.colWidth += gutter;

            // Was flooring 4.999999999999999 to 4 :(
            self.cols = Math.floor( ( containerWidth + gutter + 0.000000000001 ) / self.colWidth );
            self.cols = Math.max( self.cols, 1 );

            // This can happen when .shuffle is called on something hidden (e.g. display:none for tabs)
            if ( !self.colWidth || isNaN( self.cols ) || !containerWidth ) {
                self.needsUpdate = true;
            } else {
                self.needsUpdate = false;
            }

            self.containerWidth = containerWidth;
        },

        /**
         * Adjust the height of the grid
         */
        setContainerSize : function() {
            var self = this,
            gridHeight = Math.max.apply( Math, self.colYs );
            self.$container.css( 'height', gridHeight + 'px' );
        },

        /**
         * Fire events with .shuffle namespace
         */
        fire : function( name ) {
            this.$container.trigger(name + '.shuffle', [this]);
        },


        /**
         * Loops through each item that should be shown
         * Calculates the x and y position and then transitions it
         * @param {array} items - array of items that will be shown/layed out in order in their array.
         *     Because jQuery collection are always ordered in DOM order, we can't pass a jq collection
         * @param {function} complete callback function
         * @param {boolean} isOnlyPosition set this to true to only trigger positioning of the items
         */
        _layout: function( items, fn, isOnlyPosition, isHide ) {
            var self = this;

            fn = fn || self.filterEnd;

            self.layoutTransitionEnded = false;
            $.each(items, function(index) {
                var $this = $(items[index]),
                //how many columns does this brick span
                colSpan = Math.ceil( $this.outerWidth(true) / self.colWidth );
                colSpan = Math.min( colSpan, self.cols );

                if ( colSpan === 1 ) {
                    // if brick spans only one column, just like singleMode
                    self._placeItem( $this, self.colYs, fn );
                } else {
                    // brick spans more than one column
                    // how many different places could this brick fit horizontally
                    var groupCount = self.cols + 1 - colSpan,
                        groupY = [],
                        groupColY,
                        i;

                    // for each group potential horizontal position
                    for ( i = 0; i < groupCount; i++ ) {
                        // make an array of colY values for that one group
                        groupColY = self.colYs.slice( i, i + colSpan );
                        // and get the max value of the array
                        groupY[i] = Math.max.apply( Math, groupColY );
                    }

                    self._placeItem( $this, groupY, fn, isOnlyPosition, isHide );
                }
            });

            // Adjust the height of the container
            self.setContainerSize();
        },

        _resetCols : function() {
            // reset columns
            var i = this.cols;
            this.colYs = [];
            while (i--) {
                this.colYs.push( 0 );
            }
        },

        _reLayout : function( callback, isOnlyPosition ) {
            var self = this;
            callback = callback || self.filterEnd;
            self._resetCols();

            // If we've already sorted the elements, keep them sorted
            if ( self.keepSorted && self.lastSort ) {
                self.sort( self.lastSort, true, isOnlyPosition );
            } else {
                self._layout( self.$items.filter('.filtered').get(), self.filterEnd, isOnlyPosition );
            }
        },

        // worker method that places brick in the columnSet with the the minY
        _placeItem : function( $item, setY, callback, isOnlyPosition, isHide ) {
            // get the minimum Y value from the columns
            var self = this,
                minimumY = Math.min.apply( Math, setY ),
                shortCol = 0;

            // Find index of short column, the first from the left where this item will go
            // if ( setY[i] === minimumY ) requires items' height to be exact every time.
            // The buffer value is very useful when the height is a percentage of the width
            for (var i = 0, len = setY.length; i < len; i++) {
                if ( setY[i] >= minimumY - self.buffer && setY[i] <= minimumY + self.buffer ) {
                    shortCol = i;
                    break;
                }
            }

            // Position the item
            var x = self.colWidth * shortCol,
            y = minimumY;
            x = Math.round( x + self.offset.left );
            y = Math.round( y + self.offset.top );

            // Save data for shrink
            $item.data( {x: x, y: y} );

            // Apply setHeight to necessary columns
            var setHeight = minimumY + $item.outerHeight(true),
            setSpan = self.cols + 1 - len;
            for ( i = 0; i < setSpan; i++ ) {
                self.colYs[ shortCol + i ] = setHeight;
            }

            var transitionObj = {
                from: 'layout',
                $this: $item,
                x: x,
                y: y,
                scale: 1
            };

            if ( !isOnlyPosition ) {
                transitionObj.opacity = 1;
                transitionObj.callback = callback;
            }

            if ( isHide ) {
                transitionObj.opacity = 0;
            }

            if ( isOnlyPosition ) {
                self._skipTransition($item[0], function() {
                    self.transition( transitionObj );
                });
            } else {
                self.transition( transitionObj );
            }

        },

        /**
         * Hides the elements that don't match our filter
         */
        shrink : function() {
            var self = this,
                $concealed = self.$items.filter('.concealed');

            // Abort if no items
            if ($concealed.length === 0) {
                return;
            }

            self.fire('shrink');

            self.shrinkTransitionEnded = false;
            $concealed.each(function() {
                var $this = $(this),
                    data = $this.data(),
                    x = parseInt( data.x, 10 ),
                    y = parseInt( data.y, 10 );

                if (!x) { x = 0; }
                if (!y) { y = 0; }

                self.transition({
                    from: 'shrink',
                    $this: $this,
                    x: x,
                    y: y,
                    scale : 0.001,
                    opacity: 0,
                    callback: self.shrinkEnd
                });
            });
        },

        _onResize : function() {
            var self = this,
                containerWidth = self.$container.width();

            // If shuffle is disabled, destroyed, or containerWidth hasn't changed, don't do anything
            if ( !self.enabled || self.destroyed || containerWidth === self.containerWidth ) {
                return;
            }

            // var height = self.$window.height(),
            //     width = self.$window.width();
            // self.windowHeight = height;
            // self.windowWidth = width;

            // This should execute the first time _onResize is called
            if ( self.hideLayoutWithFade ) {
                self._debouncedBeforeResize();
            }

            // This should execute the last time _onResize is called
            self._debouncedResize();

        },

        _afterResize : function() {
            var self = this;

            // If we're hiding the layout with a fade,
            if ( self.hideLayoutWithFade && self.supported ) {
                // recaculate column and gutter values
                self._setColumns();
                // Layout the items with only a position
                self._reLayout( false, true );
                // Change the transition-delay value accordingly
                self._setSequentialDelay( self.itemsOrderedByDelay );
                self.fire('done');
                self.$items.css('opacity', 1);
            } else {
                self.resized();
            }
        },

        _beforeResize : function() {
            var self = this;

            if ( !self.supported ) {
                return;
            }

            self.$items.css('opacity', 0);

            self.fire('loading');
            self._resetDelay( self.$items );
            self._orderItemsByDelay( self.$items );
        },

        /**
         * Uses Modernizr's prefixed() to get the correct vendor property name and sets it using jQuery .css()
         *
         * @param {jq} $el the jquery object to set the css on
         * @param {string} prop the property to set (e.g. 'transition')
         * @param {string} value the value of the prop
         */
        setPrefixedCss : function($el, prop, value) {
            $el.css(this.prefixed(prop), value);
        },


        /**
         * Returns things like webkitTransition or boxSizing
         *
         * @param {string} property to be prefixed.
         * @return {string} the prefixed css property
         */
        getPrefixed : function(prop) {
            var styleName = this.prefixed(prop);
            return styleName ? styleName.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-') : styleName;
        },

        /**
         * Transitions an item in the grid
         *
         * @param {object}  opts options
         * @param {jQuery}  opts.$this jQuery object representing the current item
         * @param {int}     opts.x translate's x
         * @param {int}     opts.y translate's y
         * @param {String}  opts.left left position (used when no transforms available)
         * @param {String}  opts.top top position (used when no transforms available)
         * @param {float}   opts.scale amount to scale the item
         * @param {float}   opts.opacity opacity of the item
         * @param {String}  opts.height the height of the item (used when no transforms available)
         * @param {String}  opts.width the width of the item (used when no transforms available)
         * @param {function} opts.callback complete function for the animation
         */
        transition: function(opts) {
            var self = this,
            transform,
            // Only fire callback once per collection's transition
            complete = function() {
                if (!self.layoutTransitionEnded && opts.from === 'layout') {
                    self.fire('layout');
                    opts.callback.call(self);
                    self.layoutTransitionEnded = true;
                } else if (!self.shrinkTransitionEnded && opts.from === 'shrink') {
                    opts.callback.call(self);
                    self.shrinkTransitionEnded = true;
                }
            };

            opts.callback = opts.callback || $.noop;

            // Use CSS Transforms if we have them
            if ( self.supported ) {

                // Make scale one if it's not preset
                if ( opts.scale === undefined ) {
                    opts.scale = 1;
                }

                if (self.threeD) {
                    transform = 'translate3d(' + opts.x + 'px, ' + opts.y + 'px, 0) scale3d(' + opts.scale + ', ' + opts.scale + ', 1)';
                } else {
                    transform = 'translate(' + opts.x + 'px, ' + opts.y + 'px) scale(' + opts.scale + ', ' + opts.scale + ')';
                }

                if ( opts.opacity !== undefined && self.useTransition ) {
                    // Update css to trigger CSS Animation
                    opts.$this.css('opacity' , opts.opacity);
                }

                if ( opts.x !== undefined ) {
                    self.setPrefixedCss(opts.$this, 'transform', transform);
                }

                if ( self.useTransition ) {
                    opts.$this.one(self.transitionEndName, complete);
                } else {
                    complete();
                }
            } else {

                var cssObj = {
                    left: opts.x,
                    top: opts.y,
                    opacity: opts.opacity
                };

                if ( self.useTransition ) {
                    // Use jQuery to animate left/top
                    opts.$this.stop(true, true).animate( cssObj, self.speed, 'swing', complete);
                } else {
                    opts.$this.css( cssObj );
                    complete();
                }
            }
        },

        shrinkEnd: function() {
            this.fire('shrunk');
        },

        filterEnd: function() {
            this.fire('filtered');
        },

        sortEnd: function() {
            this.fire('sorted');
        },

        _skipTransition : function(element, property, value) {
            var self = this,
                reflow,
                durationName = self.getPrefixed('transitionDuration'),
                duration = element.style[ durationName ];

            // Set the duration to zero so it happens immediately
            element.style[ durationName ] = '0ms'; // ms needed for firefox!

            if ( $.isFunction( property ) ) {
                property();
            } else {
                element.style[ property ] = value;
            }

            // Force reflow
            reflow = element.offsetWidth;

            // Put the duration back
            element.style[ durationName ] = duration;
        },

        _addItems : function( $newItems, animateIn, isSequential ) {
            var self = this,
                $passed;

            $newItems.addClass('shuffle-item');
            self.$items = self._getItems();
            self._initItems();
            $newItems.not($passed).css('opacity', 0);

            $passed = self.filter( undefined, $newItems );

            // How many filtered elements?
            self.visibleItems = self.$items.filter('.filtered').length;

            if ( animateIn ) {
                self._layout( $passed, null, true, true );

                if ( isSequential ) {
                    self._setSequentialDelay( $passed );
                }

                self._revealAppended( $passed );
            } else {
                self._layout( $passed );
            }
        },

        _revealAppended : function( $newFilteredItems ) {
            var self = this;

            setTimeout(function() {
                $newFilteredItems.each(function(i, el) {
                    self.transition({
                        from: 'reveal',
                        $this: $(el),
                        opacity: 1
                    });
                });
            }, self.revealAppendedDelay);
        },

        /**
         * Public Methods
         */

        /**
         * The magic. This is what makes the plugin 'shuffle'
         * @param  {String|Function} category category to filter by. Can be a function
         */
        shuffle : function( category ) {
            var self = this;

            if ( !self.enabled ) {
                return;
            }

            if (!category) {
                category = 'all';
            }

            self.filter( category );
            // Save the last filter in case elements are appended.
            self.lastFilter = category;

            // How many filtered elements?
            self.visibleItems = self.$items.filter('.filtered').length;

            self._resetCols();

            // Shrink each concealed item
            self.shrink();

            // Update transforms on .filtered elements so they will animate to their new positions
            self._reLayout();
        },

        /**
         * Gets the .filtered elements, sorts them, and passes them to layout
         *
         * @param {object} opts the options object for the sorted plugin
         * @param {Boolean} [fromFilter] was called from Shuffle.filter method.
         */
        sort: function( opts, fromFilter, isOnlyPosition ) {
            var self = this,
                items = self.$items.filter('.filtered').sorted(opts);

            if ( !fromFilter ) {
                self._resetCols();
            }

            self._layout(items, function() {
                if (fromFilter) {
                    self.filterEnd();
                }
                self.sortEnd();
            }, isOnlyPosition);

            self.lastSort = opts;
        },

        /**
         * Relayout everything
         */
        resized: function( isOnlyLayout ) {
            if ( this.enabled ) {

                if ( !isOnlyLayout ) {
                    // Get updated colCount
                    this._setColumns();
                }

                // Layout items
                this._reLayout();
            }
        },

        /**
         * Use this instead of `update()` if you don't need the columns and gutters updated
         * Maybe an image inside `shuffle` loaded (and now has a height), which means calculations
         * could be off.
         */
        layout : function() {
            this.update( true );
        },

        update : function( isOnlyLayout ) {
            this.resized( isOnlyLayout );
        },

        /**
         * New items have been appended to shuffle. Fade them in sequentially
         * @param  {jQuery}  $newItems    jQuery collection of new items
         * @param  {Boolean}  [animateIn]    If false, the new items won't animate in
         * @param  {Boolean} [isSequential] If false, new items won't sequentially fade in
         */
        appended : function( $newItems, animateIn, isSequential ) {
            // True if undefined
            animateIn = animateIn === false ? false : true;
            isSequential = isSequential === false ? false : true;

            this._addItems( $newItems, animateIn, isSequential );
        },

        disable : function() {
            this.enabled = false;
        },

        enable : function( isUpdateLayout ) {
            this.enabled = true;
            if ( isUpdateLayout !== false ) {
                this.update();
            }
        },

        destroy: function() {
            var self = this;

            self.$container.removeAttr('style').removeData('shuffle');
            self.$window.off('.shuffle');
            self.$items.removeAttr('style').removeClass('concealed filtered shuffle-item');
            self.destroyed = true;
        }

    };


    // Plugin definition
    $.fn.shuffle = function(opts, sortObj) {
        var args = Array.prototype.slice.call( arguments, 1 );
        return this.each(function() {
            var $this = $(this),
                shuffle = $this.data('shuffle');

            // If we don't have a stored shuffle, make a new one and save it
            if ( !shuffle ) {
                shuffle = new Shuffle($this, opts);
                $this.data('shuffle', shuffle);
            }

            // If passed a string, lets decide what to do with it. Or they've provided a function to filter by
            if ( $.isFunction(opts) ) {
                shuffle.shuffle( opts );

            // Key should be an object with propreties reversed and by.
            } else if (typeof opts === 'string') {
                switch( opts ) {
                    case 'sort':
                        shuffle.sort(sortObj);
                        break;
                    case 'destroy':
                    case 'update':
                    case 'appended':
                    case 'enable':
                    case 'disable':
                    case 'layout':
                        shuffle[ opts ].apply( shuffle, args );
                        break;
                    default:
                        shuffle.shuffle( opts );
                        break;
                }
            }
        });
    };

    // Overrideable options
    $.fn.shuffle.options = {
        group : 'all', // Filter group
        speed : 400, // Transition/animation speed (milliseconds)
        easing : 'ease-out', // css easing function to use
        itemSelector: '', // e.g. '.gallery-item'
        gutterWidth : 0, // a static number or function that tells the plugin how wide the gutters between columns are (in pixels)
        columnWidth : 0,// a static number or function that returns a number which tells the plugin how wide the columns are (in pixels)
        showInitialTransition : true, // If set to false, the shuffle-items will only have a transition applied to them after the first layout
        delimeter : null, // if your group is not json, and is comma delimeted, you could set delimeter to ','
        buffer: 0, // useful for percentage based heights when they might not always be exactly the same (in pixels)
        throttle: $.debounce || null,
        throttleTime: 300,
        keepSorted : true, // Keep sorted when shuffling/layout
        hideLayoutWithFade: false,
        sequentialFadeDelay: 150,
        useTransition: true // You don't want transitions on shuffle items? Fine, but you're weird
    };

    // Not overrideable
    $.fn.shuffle.settings = {
        revealAppendedDelay: 300,
        enabled: true,
        supported: Modernizr.csstransforms && Modernizr.csstransitions, // supports transitions and transforms
        prefixed: Modernizr.prefixed,
        threeD: Modernizr.csstransforms3d // supports 3d transforms
    };

})(jQuery, Modernizr);