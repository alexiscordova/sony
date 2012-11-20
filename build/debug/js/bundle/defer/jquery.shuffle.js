// No block comment at start of file for docpad bug!
/**
 * jQuery Shuffle Plugin
 * Uses CSS Transforms to filter down a grid of items (degrades to jQuery's animate).
 * Inspired by Isotope http://isotope.metafizzy.co/
 * Use it for whatever you want!
 * @author Glen Cheney (http://glencheney.com)
 * @version 1.6.1
 * @date 11/12/12
 */
;(function($, Modernizr, undefined) {
    'use strict';


    $.fn.sorted = function(options) {
        var opts = $.extend({}, $.fn.sorted.defaults, options),
            arr = this.get();

        // Sort the elements by the opts.by function.
        // If we don't have opts.by, default to DOM order
        if (opts.by !== $.noop && opts.by !== null && opts.by !== undefined) {
            arr.sort(function(a, b) {
                var valA = opts.by($(a));
                var valB = opts.by($(b));
                return (valA < valB) ? -1 : (valA > valB) ? 1 : 0;
            });
        }

        if (opts.reverse) {
            arr.reverse();
        }
        return arr;

    };

    $.fn.sorted.defaults = {
        reverse: false,
        by: null
    };

    var Shuffle = function( $container, options ) {
        var self = this;

        $.extend(self, $.fn.shuffle.options, options, $.fn.shuffle.settings);

        self.$container = $container.addClass('shuffle');
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
        var transEndEventNames = {
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
            left: 0,
            opacity: 1
        };

        // Set up css for transitions
        self.$container.css('position', 'relative')[0].style[ self.transitionName ] = 'height ' + self.speed + 'ms ' + self.easing;
        self.$items.each(function() {
            $(this).css(self.itemCss);
            
            // Set CSS transition for transforms and opacity
            if (self.supported) {
                this.style[self.transitionName] = self.transform + ' ' + self.speed + 'ms ' + self.easing + ', opacity ' + self.speed + 'ms ' + self.easing;
            }
        });
        
        // http://stackoverflow.com/questions/1852751/window-resize-event-firing-in-internet-explorer
        self.windowHeight = $(window).height();
        self.windowWidth = $(window).width();
        $(window).on('resize.shuffle', function () {
            var height = $(window).height(),
                width = $(window).width();

            if (width !== self.windowWidth || height !== self.windowHeight) {
                self.resized();
                self.windowHeight = height;
                self.windowWidth = width;
            }
        });

        self._setColumns();
        self._resetCols();
        self.shuffle( self.group );
    };

    Shuffle.prototype = {

        constructor: Shuffle,

        /**
         * The magic. This is what makes the plugin 'shuffle'
         */
        shuffle : function(category) {
            var self = this;

            if (!category) {
                category = 'all';
            }

            // Default is to show all items
            self.$items.removeClass('concealed filtered');

            // Loop through each item and use provided function to determine
            // whether to hide it or not.
            if ($.isFunction(category)) {
                self.$items.each(function() {
                    var $item = $(this),
                    passes = category.call($item[0], $item, self);
                    $item.addClass(passes ? 'filtered' : 'concealed');
                });
            }

            // Otherwise we've been passed a category to filter by
            else {
                self.group = category;
                if (category !== 'all') {
                    self.$items.each(function() {
                        var $this = $(this),
                        groups = $this.data('groups'),
                        keys = self.delimeter && !$.isArray( groups ) ? groups.split( self.delimeter ) : groups,
                        theClass = $.inArray(category, keys) === -1 ? 'concealed' : 'filtered';

                        $this.addClass( theClass );
                    });
                }

                // category === 'all', add filtered class to everything
                else {
                    self.$items.addClass('filtered');
                }
            }
            
            // How many filtered elements?
            // self.visibleItems = self.$items.filter('.filtered').length;

            self._resetCols();

            // Shrink each concealed item
            self.fire('shrink');
            self.shrink();

            // Update transforms on .filtered elements so they will animate to their new positions
            self.fire('filter');
            self._reLayout();
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

            self.colWidth += gutter;

            self.cols = Math.floor( ( containerWidth + gutter ) / self.colWidth );
            self.cols = Math.max( self.cols, 1 );

            // This can happen when .shuffle is called on something hidden (e.g. display:none for tabs)
            if ( !self.colWidth || isNaN( self.cols ) || !containerWidth ) {
                self.needsUpdate = true;
            } else {
                self.needsUpdate = false;
            }
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
         */
        layout: function( items, fn ) {
            var self = this;

            // Abort if no items
            if ( items.length === 0 ) {
                return;
            }
            
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

                    self._placeItem( $this, groupY, fn );
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

        _reLayout : function( callback ) {
            var self = this;
            callback = callback || self.filterEnd;
            self._resetCols();

            // If we've already sorted the elements, keep them sorted
            if ( self.keepSorted && self.lastSort ) {
                self.sort( self.lastSort, true );
            } else {
                self.layout( self.$items.filter('.filtered').get(), self.filterEnd );
            }
        },

        // worker method that places brick in the columnSet with the the minY
        _placeItem : function( $item, setY, callback ) {
            // get the minimum Y value from the columns
            var self = this,
                minimumY = Math.min.apply( Math, setY ),
                shortCol = 0;

            // Find index of short column, the first from the left where this item will go
            for (var i = 0, len = setY.length; i < len; i++) {
                if ( setY[i] === minimumY ) {
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

            self.transition({
                from: 'layout',
                $this: $item,
                x: x,
                y: y,
                scale : 1,
                opacity: 1,
                callback: callback
            });

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

            self.shrinkTransitionEnded = false;
            $concealed.each(function() {
                var $this = $(this),
                    data = $this.data(),
                    x = parseInt( data.x, 10 ),
                    y = parseInt( data.y, 10 );

                if (!x) x = 0;
                if (!y) y = 0;

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

        /**
         * Gets the .filtered elements, sorts them, and passes them to layout
         *
         * @param {object} opts the options object for the sorted plugin
         * @param {bool} [fromFilter] was called from Shuffle.filter method.
         */
        sort: function(opts, fromFilter) {
            var self = this,
                items = self.$items.filter('.filtered').sorted(opts);
            self._resetCols();
            self.layout(items, function() {
                if (fromFilter) {
                    self.filterEnd();
                }
                self.sortEnd();
            });
            self.lastSort = opts;
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
         * Returns things like -webkit-transition or -moz-box-sizing
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
                    opts.callback.call(self);
                    self.layoutTransitionEnded = true;
                } else if (!self.shrinkTransitionEnded && opts.from === 'shrink') {
                    opts.callback.call(self);
                    self.shrinkTransitionEnded = true;
                }
            };

            // Use CSS Transforms if we have them
            if (self.supported) {
                if (self.threeD) {
                    transform = 'translate3d(' + opts.x + 'px, ' + opts.y + 'px, 0) scale3d(' + opts.scale + ', ' + opts.scale + ', 1)';
                } else {
                    transform = 'translate(' + opts.x + 'px, ' + opts.y + 'px) scale(' + opts.scale + ', ' + opts.scale + ')';
                }

                // Update css to trigger CSS Animation
                opts.$this.css('opacity' , opts.opacity);
                self.setPrefixedCss(opts.$this, 'transform', transform);
                opts.$this.one(self.transitionEndName, complete);
            } else {
                // Use jQuery to animate left/top
                opts.$this.stop().animate({
                    left: opts.x,
                    top: opts.y,
                    opacity: opts.opacity
                }, self.speed, 'swing', complete);
            }
        },

        /**
         * Relayout everthing
         */
        resized: function() {
            // get updated colCount
            this._setColumns();
            this._reLayout();
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

        destroy: function() {
            var self = this;

            self.$container.removeAttr('style').removeData('shuffle');
            $(window).off('.shuffle');
            self.$items.removeAttr('style').removeClass('concealed filtered shuffle-item');
        },

        update: function() {
            var self = this;
            self.$items = self._getItems();
            self.resized();
        }

    };

            
    // Plugin definition
    $.fn.shuffle = function(opts, sortObj) {
        return this.each(function() {
            var $this = $(this),
                shuffle = $this.data('shuffle');

            // If we don't have a stored shuffle, make a new one and save it
            if (!shuffle) {
                shuffle = new Shuffle($this, opts);
                $this.data('shuffle', shuffle);
            }

            // If passed a string, lets decide what to do with it. Or they've provided a function to filter by
            if ($.isFunction(opts)) {
                shuffle.shuffle(opts);
                
            // Key should be an object with propreties reversed and by.
            } else if (typeof opts === 'string') {
                if (opts === 'sort') {
                    shuffle.sort(sortObj);
                } else if (opts === 'destroy') {
                    shuffle.destroy();
                } else if (opts === 'update') {
                    shuffle.update();
                } else if (opts === 'layout') {
                    shuffle._reLayout();
                } else {
                    shuffle.shuffle(opts);
                }
            }
        });
    };

    // Overrideable options
    $.fn.shuffle.options = {
        group : 'all',
        speed : 600,
        easing : 'ease-out',
        itemSelector: '',
        gutterWidth : 0,
        columnWidth : 0,
        delimeter : null,
        keepSorted : true
    };

    // Not overrideable
    $.fn.shuffle.settings = {
        supported: Modernizr.csstransforms && Modernizr.csstransitions,
        prefixed: Modernizr.prefixed,
        threeD: Modernizr.csstransforms3d
    };

})(jQuery, Modernizr);