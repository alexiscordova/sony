/*global Exports*/

/*


{
    "label": "TVs",
    "slug": "tvs",
    "icon": "tv"
},
{
    "label": "Tablets",
    "slug": "tablets",
    "icon": "tablet"
},
{
    "label": "Waterproof",
    "slug": "waterproof",
    "icon": "water-drop"
},
{
    "label": "Mics",
    "slug": "mics",
    "icon": "mic"
},
{
    "label": "Projectors",
    "slug": "projectors",
    "icon": "projector"
},
 */

(function($, Modernizr, window, undefined) {

    var Gallery = function( $container, options ) {
        var self = this;

        $.extend(self, $.fn.gallery.options, options, $.fn.gallery.settings);

        // jQuery objects
        self.$container = $container;
        self.id = self.$container[0].id;
        self.$filterContainer = self.$container.find('.product-filter');
        self.$grid = self.$container.find('.products');
        self.$filterOpts = self.$container.find('.filter-options');
        self.$sortSelect = self.$container.find('.sort-options select');
        self.$sortBtns = self.$container.find('.sort-options .dropdown-menu a');
        self.$dropdownToggleText = self.$container.find('.sort-options .js-toggle-text');
        self.$productCount = self.$container.find('.product-count');
        self.$activeFilters = self.$container.find('.active-filters');
        self.$filterArrow = self.$container.find('.slide-arrow-under, .slide-arrow-over');
        self.$favorites = self.$grid.find('.js-favorite');

        // Compare modal
        self.$compareBtn = self.$container.find('.js-compare-toggle');
        self.hasCompareModal = self.$compareBtn.length > 0;
        self.$compareTool = $('#compare-tool');

        // Other vars
        self.hasInfiniteScroll = self.$container.find('div.navigation a').length > 0;
        self.hasFilters = self.$filterOpts.length > 0;
        self.windowSize = $(window).width();

        self.setColumnMode();

        self.$grid.on('loading.shuffle', $.proxy( self.onShuffleLoading, self ));
        self.$grid.on('done.shuffle', $.proxy( self.onShuffleDone, self ));

        // instantiate shuffle
        self.$grid.shuffle({
            itemSelector: '.gallery-item',
            speed: self.shuffleSpeed,
            easing: self.shuffleEasing,
            columnWidth: self.shuffleColumns,
            gutterWidth: self.shuffleGutters,
            showInitialTransition: false,
            buffer: 5
        });

        // Sort elements by data-priority attribute
        self.sortByPriority();

        // Infinite scroll?
        if ( self.hasInfiniteScroll ) {
            self.initInfscr();
        }

        // Initialize filter dictionaries to keep track of everything
        if ( self.hasFilters ) {
            self.initFilters();
        }

        self.initSwatches();

        // Slide toggle. Reset range control if it was hidden on initialization
        self.$container.find('.collapse')
            .on('shown', $.proxy( self.onFiltersShown, self ))
            .on('show', $.proxy( self.onFiltersShow, self ))
            .on('hide', $.proxy( self.onFiltersHide, self ));

        // Set up sorting ---- dropdowm
        self.$sortBtns.on('click',  $.proxy( self.sort, self ));

        // Set up sorting ---- select menu
        self.$sortSelect.on('change', $.proxy( self.sort, self ));

        // Displays active filters on `filter`
        self.$grid.on('filter.shuffle', function(evt, shuffle) {
            self.$productCount.text( shuffle.visibleItems );
            self.displayActiveFilters();
        });

        // Things moved around and could possibly be in the viewport
        // Filtered should already be throttled because whatever calls .filter() should be throttled.
        self.$grid.on('layout.shuffle', function() {
            window.iQ.update();
        });

        $(window).on('resize.gallery', $.proxy( self.onResize, self ) );
        self.onResize();

        // Favorite Heart
        // self.$favorites.on('click', $.proxy( self.onFavorite, self ));

        // This container is about to be shown because it's a tab
        self.$container.closest('[data-tab]').on('show', $.proxy( self.onShow, self ));

        // This container has just been shown because it's a tab
        self.$container.closest('[data-tab]').on('shown', $.proxy( self.onShown, self ));

        // Launch compare tool on click
        if ( self.hasCompareModal ) {
            self.$compareBtn.on('click', $.proxy( self.onCompareLaunch, self ));
            self.$compareTool.on('hidden', $.proxy( self.onCompareClosed, self ));
            self.$compareTool.on('shown', $.proxy( self.onCompareShown, self ));
        }

        // We're done.
        self.isInitialized = true;

        // Run once
        if ( self.hasFilters ) {
            self.filter();
        }
    };

    Gallery.prototype = {

        constructor: Gallery,

        filter : function() {
            var self = this;

            if ( self.hasActiveFilters() ) {
                self.$grid.shuffle(function($el) {
                    return self.itemPassesFilters( $el.data() );
                });
            } else {
                self.$grid.shuffle('all');
            }

            self.setFilterStatuses();
        },

        // From the element's data-* attributes, test to see if it passes
        itemPassesFilters : function( data ) {
            var self = this,
                filterName = '';

            // Loop through each filter in the elements filter set
            for ( filterName in data.filterSet ) {
                if ( !data.filterSet.hasOwnProperty(filterName) || !self.filterTypes[ filterName ] ) {
                    continue;
                }

                // filterName e.g. 'price'
                var filter = data.filterSet[ filterName ], // e.g. 399.99
                    filterType = self.filterTypes[ filterName ], // e.g. 'range'
                    activeFilters = self.filters[ filterType ][ filterName ]; // e.g. ["lcd"]

                if ( filterType === 'button' || filterType === 'checkbox' ) {
                    var method = $.isArray( filter ) ? 'arrayContainsArray' : 'valueInArray';
                    if ( activeFilters.length > 0 && !self[ method ]( filter, activeFilters ) ) {
                        return false;
                    }
                } else if ( filterType === 'range' ) {
                    if ( filter < self.price.min || ( filter > self.price.max && self.price.max !== self.MAX_PRICE ) ) {
                        return false;
                    }
                }
            }

            return true;
        },

        hasActiveFilters : function() {
            var self = this,
                hasActive = false,
                filterType = '',
                filterName = '';

            for ( filterType in self.filters ) {
                if ( !self.filters.hasOwnProperty(filterType) ) {
                    continue;
                }


                if ( filterType === 'button' || filterType === 'checkbox' ) {
                    for ( filterName in self.filters[ filterType ] ) {
                        var activeFilters = self.filters[ filterType ][ filterName ];
                        hasActive = activeFilters.length > 0;

                        // There is an active filter, break out of the loop and return
                        if ( hasActive ) {
                            break;
                        }
                    }
                } else if ( filterType === 'range' ) {
                    hasActive = self.price.min !== self.MIN_PRICE || self.price.max !== self.MAX_PRICE;
                }

                if ( hasActive ) {
                    return hasActive;
                }
            }
            return hasActive;
        },

        displayActiveFilters : function() {
            var self = this,
                filterType = '',
                filterName = '',
                filters = {},
                frag = document.createDocumentFragment();

            // self.filters ~= self.filters.button.megapixels["14-16", "16-18"]
            for ( filterType in self.filters ) {
                if ( !self.filters.hasOwnProperty(filterType) ) {
                    continue;
                }

                // Loop through filter types because there could be more than one 'button' or 'checkbox'
                if ( filterType === 'button' || filterType === 'checkbox' ) {
                    for ( filterName in self.filters[ filterType ] ) {
                        var activeFilters = self.filters[ filterType ][ filterName ];

                        // This filterType.filterName has some active filters, build an object of its labels and filter names
                        if ( activeFilters.length ) {
                            for ( var j = 0; j < activeFilters.length; j++ ) {
                                var label = self.filterLabels[ filterName ][ activeFilters[ j ] ];
                                filters[ activeFilters[ j ] ] = {
                                    label: label,
                                    name: filterName
                                };
                            }
                        }
                    }

                // Handle range control a bit differently
                } else if ( filterType === 'range' ) {
                    if ( self.price.min !== self.MIN_PRICE ) {
                        filters['min'] = {
                            key: 'price',
                            label: 'Min price: $' + self.price.min,
                            name: 'min'
                        };
                    }
                    if ( self.price.max !== self.MAX_PRICE) {
                        filters['max'] = {
                            key: 'price',
                            label: 'Max price: $' + self.price.max,
                            name: 'max'
                        };
                    }
                }
            }


            // Create labels showing current filters
            $.each(filters, function(key, obj) {
                var $label = $('<span>', {
                    "class" : "label label-close",
                    "data-filter" : key,
                    "data-filter-name" : obj.key || obj.name,
                    text : obj.label,
                    click : $.proxy( self.onRemoveFilter, self )
                });

                frag.appendChild( $label[0] );
            });


            self.$activeFilters.empty().append(frag);
        },

        // Removes a single filter from stored data. Does NOT change UI.
        undoFilter : function( filterValue, filterName, filterType ) {
            var self = this,
                pos;

            if ( filterType === 'button' || filterType === 'checkbox' ) {
                pos = $.inArray( filterValue, self.filters[ filterType ][ filterName ] );
                self.filters[ filterType ][ filterName ].splice( pos, 1 );
            } else if ( filterType === 'range' ) {
                delete self.filters[ filterType ][ filterName ][ filterValue ];
            }
        },

        // Removes the active state of a filter. Changes UI.
        removeFilter : function( filterValue, filterName, filterType ) {
            var self = this,
                selector = '',
                rangeControl,
                method;

            // There's probably a better way to do this... (store jQuery objects for each filter?)
            if ( filterType === 'button' ) {
                // [data-filter="megapixels"] [data-megapixels="14-16"]
                selector = '[data-filter="' + filterName + '"] [data-' + filterName + '="' + filterValue + '"]';
                self.$container.find( selector ).button('toggle');

                // Handle media groups
                self.$container.find( selector + ' .active' ).button('toggle');

            } else if ( filterType === 'checkbox' ) {
                selector = '[data-filter="' + filterName + '"] [value="' + filterValue + '"]';
                self.$container.find( selector ).prop('checked', false);

            } else if ( filterType === 'range' ) {
                // Slide appropriate handle to the intial value
                rangeControl = self.$rangeControl.data('rangeControl');
                method = filterValue === 'min' ? 'slideToInitialMin' : 'slideToInitialMax';
                rangeControl[ method ]();
            }
        },

        disableFilter : function( filterValue, filterName, filterType ) {
            var self = this,
                selector = '';

            // There's probably a better way to do this... (store jQuery objects for each filter?)
            if ( filterType === 'button' ) {
                // [data-filter="megapixels"] [data-megapixels="14-16"]
                selector = '[data-filter="' + filterName + '"] [data-' + filterName + '="' + filterValue + '"]';
                self.$container.find( selector ).attr('disabled', 'disabled');

                // Handle media groups
                self.$container.find( selector + ' .btn' ).attr('disabled', 'disabled');
            } else if ( filterType === 'checkbox' ) {
                selector = '[data-filter="' + filterName + '"] [value="' + filterValue + '"]';
                self.$container.find( selector ).prop('disabled', true);
            }

        },

        enableFilter : function( filterValue, filterName, filterType ) {
            var self = this,
                selector = '';

            // There's probably a better way to do this... (store jQuery objects for each filter?)
            if ( filterType === 'button' ) {
                // [data-filter="megapixels"] [data-megapixels="14-16"]
                selector = '[data-filter="' + filterName + '"] [data-' + filterName + '="' + filterValue + '"]';
                self.$container.find( selector ).removeAttr('disabled');

                // Handle media groups
                self.$container.find( selector + ' .btn' ).removeAttr('disabled');
            } else if ( filterType === 'checkbox' ) {
                selector = '[data-filter="' + filterName + '"] [value="' + filterValue + '"]';
                self.$container.find( selector ).prop('disabled', false);
            }
        },

        onRemoveFilter : function( evt ) {
            var self = this,
                data = $(evt.target).data(),
                filterType = self.filterTypes[ data.filterName ];

            // Remove from internal data
            self.undoFilter( data.filter, data.filterName, filterType );

            // Remove active/checked state
            self.removeFilter( data.filter, data.filterName, filterType );

            // Remove this label
            $(evt.target).remove();

            // Trigger shuffle
            self.filter();
        },

        initFilters : function() {
            var self = this;

            self.filters = {
                range: {},
                button: {},
                checkbox: {}
            };
            self.filterTypes = {};
            self.filterLabels = {};
            self.filterValues = {};

            self.$filterOpts.find('[data-filter]').each(function() {
                var $this = $(this),
                    data = $this.data(),
                    type = data.filterType,
                    name = data.filter,
                    init = [];


                // Initialize it based on type
                switch ( type ) {
                    case 'range':
                        init = {};
                        self.range( $this, name, data.min, data.max );
                        break;
                    case 'button':
                        self.button( $this, name );
                        break;
                    case 'group':
                    case 'color':
                        // Treat groups and colors the same as buttons
                        type = 'button';
                        self.button( $this, name );
                        break;
                    case 'checkbox':
                        self.checkbox ( $this, name );
                        break;
                }

                // Save the active filters in this filter to an empty array or object
                self.filters[ type ][ name ] = init;
                self.filterTypes[ name ] = type;
            });

            // Show first dropdown as active
            self.$sortBtns.first().parent().addClass('active');
            self.currentSort = self.$sortBtns.closest('.dropdown-menu').find('.active a').data('value');
        },

        initInfscr : function() {
            var self = this;

            self.$grid.infinitescroll({
                local: true,
                // debug: true,
                bufferPx: -100, // Load 100px after the navSelector has entered the viewport
                navSelector: 'div.navigation', // selector for the paged navigation
                nextSelector: 'div.navigation a', // selector for the NEXT link (to page 2)
                itemSelector: '.gallery-item', // selector for all items you'll retrieve
                loading: {
                    selector: '.infscr-holder',
                    msgText: "<em>Loading the next set of products...</em>",
                    finishedMsg: "<em>Finished loading products.</em>",
                    img: self.loadingGif,
                  }
            },
            // call shuffle as a callback
            function( newElements ) {
                self.$grid.shuffle( 'appended', $( newElements ).addClass('via-ajax') );
                // Show new product count
                self.$productCount.text( self.$grid.data('shuffle').visibleItems );
                // Update iQ images
                window.iQ.update(true);
            }
            );

            // Pause infinite scrolls that are in hidden tabs
            if ( !self.$container.hasClass('active') ) {
                self.$grid.infinitescroll('pause');
            }
        },

        initSwatches : function() {
            var self = this;

            self.$grid.find('.mini-swatch[data-color]').each(function() {
                var $swatch = $(this),
                    color = $swatch.data('color'),
                    $productImg = $swatch.closest('.product-img').find('.js-product-imgs .js-product-img-main'),
                    $swatchImg = $swatch.closest('.product-img').find('.js-product-imgs [data-color="' + color + '"]');

                $swatch.hover(function() {
                    $productImg.addClass('hidden');
                    $swatchImg.removeClass('hidden');
                }, function() {
                    $productImg.removeClass('hidden');
                    $swatchImg.addClass('hidden');
                });
            });
        },

        setFilterStatuses : function() {
            var self = this,
                $visible = self.$grid.data('shuffle').$items.filter('.filtered'),
                filterName, filterValue, method;


            // Reset stored data by setting all filterValue values to null
            for ( filterName in self.filterValues ) {
                if ( !self.filterValues.hasOwnProperty(filterName) ) {
                    continue;
                }

                for ( filterValue in self.filterValues[ filterName ] ) {
                    self.filterValues[ filterName ][ filterValue ] = null;
                }
            }

            // Build up the dictionary of the filters that should be shown/hidden
            $visible.each(function() {
                var $item = $(this),
                    filterSet = $item.data('filterSet'),
                    filterValue,
                    filterName;

                for ( filterName in self.filterValues ) {
                    if ( !self.filterValues.hasOwnProperty(filterName) ) {
                        continue;
                    }


                    for ( filterValue in self.filterValues[ filterName ] ) {
                        // If we've already set this to false, we don't need to check again on another element
                        if ( self.filterValues[ filterName ][ filterValue ] === true ) {
                            continue;
                        }

                        var isArray = $.isArray( filterSet[ filterName ] ),
                            shouldEnable;

                        shouldEnable = isArray ?
                            self.valueInArray( filterValue, filterSet[ filterName ] ) :
                            filterValue === filterSet[ filterName ];

                        self.filterValues[ filterName ][ filterValue ] = shouldEnable;
                    }
                }
            });

            // Loop through all filters again to disable/enable them
            for ( filterName in self.filterValues ) {
                if ( !self.filterValues.hasOwnProperty(filterName) ) {
                    continue;
                }

                for ( filterValue in self.filterValues[ filterName ] ) {
                    method = self.filterValues[ filterName ][ filterValue ] ? 'enable' : 'disable';
                    self[ method + 'Filter' ]( filterValue, filterName, self.filterTypes[ filterName ] );
                }
            }

        },
        valueInArray : function( value, arr ) {
            return $.inArray(value, arr) !== -1;
        },

        arrayContainsArray : function( arrToTest, requiredArr ) {
            var i = 0,
                dictionary = {},
                j;

            // Convert groups into object which we can test the keys
            for (j = 0; j < arrToTest.length; j++) {
                dictionary[ arrToTest[j] ] = true;
            }

            // Loop through selected features, if that feature is not in this elements groups, return false
            for (; i < requiredArr.length; i++) {
                if ( dictionary[ requiredArr[i] ] === undefined ) {
                    return false;
                }
            }
            return true;
        },

        button : function( $parent, filterName ) {
            var self = this,
                labels = {},
                values = {},
                $btns = $parent.children();

            $btns.on('click', function() {
                var $this = $(this),
                    isMediaGroup = $this.hasClass('media'),
                    $checked,
                    checked = [];

                // Abort if this button is disabled
                if ( $this.is('[disabled]') ) {
                    return;
                }

                if ( isMediaGroup ) {
                    $this.find('.btn').button('toggle');
                    $this.toggleClass('active');
                } else {
                    $this.button('toggle');
                }

                $checked = $parent.find('> .active');

                // Get all data-* filters
                if ( $checked.length !== 0 ) {
                    $checked.each(function() {
                        var filter = $(this).data( filterName );
                        checked.push( filter );
                    });
                }
                self.filters.button[ filterName ] = checked;

                self.filter();
            })

            // Save each label to the labels object
            .each(function() {
                var data = $(this).data();
                labels[ data[ filterName ] ] = data.label;
                values[ data[ filterName ] ] = data[ filterName ];
            });

            self.filterLabels[ filterName ] = labels;
            self.filterValues[ filterName ] = values;
        },

        checkbox : function( $parent, filterName ) {
            var self = this,
                labels = {},
                values = {},
                $inputs = $parent.find('input');

            $inputs.on('change', function() {
                var $checked = $parent.find('input:checked'),
                checked = [];

                // At least one checkbox is checked, clear the array and loop through the checked checkboxes
                // to build an array of strings
                if ( $checked.length !== 0 ) {
                    $checked.each(function() {
                        checked.push(this.value);
                    });
                }
                self.filters.checkbox[ filterName ] = checked;

                self.filter();
            })

            // Save each label to the labels object
            .each(function() {
                var data = $(this).data();
                labels[ this.value ] = data.label;
                values[ this.value ] = this.value;
            });

            self.filterLabels[ filterName ] = labels;
            self.filterValues[ filterName ] = values;
        },

        range : function( $rangeControl, filterName , min, max ) {
            this.MAX_PRICE = max;
            this.MIN_PRICE = min;
            this.price = {
                min: this.MIN_PRICE,
                max: this.MAX_PRICE
            };

            var self = this,
            diff = self.MAX_PRICE - self.MIN_PRICE,
            $output = $rangeControl.closest('.filter-container').find('.range-output-container'),
            $minOutput = $output.find('.range-output-min'),
            $maxOutput = $output.find('.range-output-max'),

            getPrice = function(percent) {
                return Math.round( diff * (percent / 100) ) + self.MIN_PRICE;
            },

            // Range control update callback
            update = function(evt, positions, percents) {
                var minPrice = getPrice(percents.min),
                maxPrice = getPrice(percents.max),
                maxPriceStr = maxPrice === self.MAX_PRICE ? maxPrice + '+' : maxPrice,
                prevMin = self.price.min,
                prevMax = self.price.max;

                // Display values
                displayValues(minPrice, maxPriceStr, percents);

                // Save values
                self.price.min = minPrice;
                self.price.max = maxPrice;

                // Filter results only if values have changed
                if ( (prevMin !== self.price.min || prevMax !== self.price.max) && self.isInitialized ) {

                    // Save current filters
                    self.filters.range[ filterName ].min = self.price.min;
                    self.filters.range[ filterName ].max = self.price.max;

                    // Throttle filtering (especially on touch)
                    if ( $.throttle ) {
                        var delay, method;
                        if ( self.isTouch ) {
                            delay = 2500;
                            method = 'debounce';
                        } else {
                            delay = 250;
                            method = 'throttle';
                        }
                        $[ method ]( delay, function() {
                            self.filter();
                        })();
                    } else {
                        self.filter();
                    }
                }
            },

            // Show what's happening with the range control
            displayValues = function( min, max, percents ) {
                // $output.html('$' + min + ' - $' + max);
                $minOutput.css('left', percents.min + '%').html('<sup>$</sup>' + min);
                $maxOutput.css('left', percents.max + '%').html('<sup>$</sup>' + max);
            };

            // Store jQuery object for later access
            self.$rangeControl = $rangeControl;

            // On handle slid, update. Register before initialized so it's called during initialization
            self.$rangeControl.on('slid.rangecontrol', update);

            self.$rangeControl.rangeControl({
                initialMin: '0%',
                initialMax: '100%',
                range: true
            });
        },

        // If there is a range control in this element and it's in need of an update
        maybeResetRange : function() {
            var th = this,
                $rangeControl = th.$container.find('.range-control');
            if ( $rangeControl.length > 0 && $rangeControl.data('rangeControl').isHidden ) {
                $rangeControl.rangeControl('reset');
                return true;
            }
            return false;
        },

        sort : function( evt ) {
            var self = this,
                $target = $(evt.target),
                isSelect = $target.is('select'),
                data,
                filterName,
                reverse,
                sortObj = {};

            // Get variables based on what kind of component we're working with
            if ( isSelect ) {
                filterName = $target.val();
                reverse = evt.target[ evt.target.selectedIndex ].getAttribute('data-reverse');
                reverse = reverse === 'true' ? true : false;
            } else {
                data = $target.data();
                filterName = data.value;
                reverse = data.reverse ? true : false;

                evt.preventDefault();
                self.$dropdownToggleText.text( $target.text() );
            }

            if ( filterName !== 'default' ) {
                sortObj = {
                    reverse: reverse,
                    by: function($el) {
                        // e.g. filterSet.price
                        return $el.data('filterSet')[ filterName ];
                    }
                };
            }

            self.currentSort = filterName;
            self.$grid.shuffle('sort', sortObj);
        },

        sortByPriority : function() {
            var self = this,
                isTablet = Modernizr.mq('(max-width: 767px)');

            if ( isTablet && !self.sorted ) {
                self.$grid.shuffle('sort', {
                    by: function($el) {
                        var priority = $el.data('priority');

                        // Returning undefined to the sort plugin will cause it to revert to the original array
                        return priority ? priority : undefined;
                    }
                });
                self.sorted = true;
            } else if ( !isTablet && self.sorted ) {
                self.$grid.shuffle('sort', {});
                self.sorted = false;
            }
        },

        sortComparedItems : function( evt ) {
            var self = this,
                $target = $(evt.target),
                data = $target.data(),
                reverse = data.reverse ? true : false,
                sortObj = {},
                sortedItems;

            evt.preventDefault();

            self.$compareTool.find('.js-toggle-text').text( $target.text() );

            if ( data.value !== 'default' ) {
                sortObj = {
                    reverse: reverse,
                    by: function($el) {
                        // e.g. filterSet.price
                        return $el.data('filterSet')[ data.value ];
                    }
                };
            }

            sortedItems = self.$compareTool.find('.gallery-item').sorted( sortObj );

            $.each(sortedItems, function(i, element) {
                console.log(i, element);
            });

        },

        onResize : function() {
            var self = this;

            // Don't change columns for detail galleries
            if ( self.mode === 'detailed' ) {
                return;
            }

            self.sortByPriority();
        },

        onFavorite : function( evt ) {
            // <i class="icon-ui-favorite{{#if this.isFavorited}} state3{{/if}} js-favorite"></i>
            $(evt.target).toggleClass('state3');
        },

        // Event triggered when this tab is about to be shown
        onShow : function( evt ) {
            var that;

            if ( evt.prevPane ) {
                that = evt.prevPane.find('.gallery').data('gallery');
            }

            if ( that && that.hasInfiniteScroll ) {
                that.$grid.infinitescroll('pause');
            }
        },

        // Event triggered when tab pane is finished being shown
        onShown : function( evt ) {
            var self = this,
                windowWidth = $(window).width(),
                windowHasResized = self.windowSize !== windowWidth;

            // Only continue if this is a tab shown event.
            if ( !evt.prevPane ) {
                return;
            }

            // Respond to tab shown event.Update the columns if we're in need of an update
            if ( self.$grid.data('shuffle').needsUpdate || windowHasResized ) {
                self.$grid.shuffle('update');
            }

            // Save new window size
            if ( windowHasResized ) {
                self.windowSize = windowWidth;
            }

            // Resume infinite scroll if it's there yo
            if ( self.hasInfiniteScroll ) {
                self.$grid.infinitescroll('updateNavLocation');
                self.$grid.infinitescroll('resume');
            }
        },

        onFiltersHide : function( evt ) {
            evt.stopPropagation(); // stop this event from bubbling up to .gallery
            this.$filterArrow.removeClass('in');
        },

        onFiltersShow : function( evt ) {
            evt.stopPropagation(); // stop this event from bubbling up to .gallery
            this.$filterArrow.addClass('in');
        },

        onFiltersShown : function( evt ) {
            evt.stopPropagation(); // stop this event from bubbling up to .gallery
            var didReset = this.maybeResetRange(evt);
            if ( !didReset ) {
                this.filter();
            }
        },

        onShuffleLoading : function() {
            var $div = $('<div>', { "class" : "gallery-loader text-center" }),
                $img = $('<img>', { src: this.loadingGif });
            $div.append($img);
            $div.insertBefore(this.$grid);
        },

        onShuffleDone : function() {
            var self = this;
            setTimeout(function() {
                self.$container.find('.gallery-loader').remove();
                self.$container.addClass('in');
            }, 250);
        },

        onCompareLaunch : function() {
            var self = this,
                shuffle = self.$grid.data('shuffle'),

                // Clone all visible
                $currentItems = shuffle.$items.filter('.filtered').clone(),
                $newItems = $(),

                contentWidth = 0,
                // Get product count
                productCount = $currentItems.length,

                $container = $('<div class="container">'),
                $content = $('<div class="compare-container clearfix">'),
                $header = self.$compareTool.find('.modal-header'),

                $label = self.$compareTool.find('#compare-tool-label'),
                originalLabel = $label.text(),
                newLabel = originalLabel + ' ' + self.$container.find('.compare-name').text(),

                $labelColumn = $('<div class="span2 detail-labels-wrap hidden-phone">'),
                $labelGroup = $('<div class="detail-label-group">'),

                // Clone sort button
                $sortOpts = self.$container.find('.sort-options').clone(),
                isStickyHeader = false;

            // Clone the product count
            self.$compareCountWrap = self.$container.find('.product-count-wrap').clone();

            // Create reset button
            self.$compareReset = $('<button/>', {
                'class' : 'btn btn-small disabled js-compare-reset',
                'text' : $header.data('resetLabel')
            });
            self.$compareReset.on('click', $.proxy( self.onCompareReset, self ));

            // Build / manipulate compare items from the gallery items
            $currentItems.each(function() {
                var $item = $(this),
                    $swatches,
                    $div = $('<div/>');

                $item
                    .removeClass()
                    .addClass('span4 compare-item')
                    .removeAttr('style')
                    .append('<span class="box-close box-close-small compare-item-remove"><i class="icon-ui-x-tiny"></i></span>')
                    .find('.detail-group')
                    .removeClass('hidden')
                    .end()
                    .find('.label')
                    .remove()
                    .end()
                    .find('.product-meta')
                    .remove();

                $swatches = $item.find('.product-img .color-swatches').detach();
                $item.find('.product-price').after($swatches);

                // Create a new div with the same attributes as the anchor tag
                // We no longer want the entire thing to be clickable
                $div.attr({
                    "class" : $item.attr('class'),
                    "data-filter-set" : $item.attr('data-filter-set')
                });

                $div.append( $item.children().detach() );
                $newItems = $newItems.add( $div );
            });

            // Create labels column
            self.$container.find('.comparables [data-label]').each(function() {
                var $label = $(this).clone();
                $label.text( $label.attr('data-label') );
                $labelGroup.append($label);
            });

            // Remove compare items on click
            $newItems.find('.compare-item-remove').on('click', function() {
                $(this).parent().addClass('hide');
                self.$compareReset.removeClass('disabled');
                var remaining = self.$compareTool.find('.compare-item:not(.hide)').length;
                self.$compareCount.text( remaining );

                if ( remaining < 3 ) {
                    $newItems.find('.compare-item-remove').addClass('hide');
                }
            });

            // Set up sort events
            $sortOpts.find('.dropdown a').on('click', $.proxy( self.sortComparedItems, self ));

            // Set current sort
            // TODO

            // Set the right heading. e.g. Compare Cyber-shot®
            $label.text( newLabel );

            // Intialize carousel
            // TODO

            // Phone = sticky header
            if ( Modernizr.mq('(max-width: 480px)') ) {
                isStickyHeader = true;

                var $subheader = $('<div class="modal-subheader clearfix">');
                $subheader.append( self.$compareCountWrap, self.$compareReset, $sortOpts );

                // Insert subhead after the header
                $header.after( $subheader );

                // Put the reset button the left
                self.$compareReset.addClass('pull-left');

            // Larger than phone
            } else {
                // Append sort dropdown
                $header.append( self.$compareReset, $sortOpts );

                // Append count and labels
                $labelColumn.append( self.$compareCountWrap );

                self.$compareReset.addClass('pull-right');
            }
            $labelColumn.append( $labelGroup );

            // On window resize
            $(window).on('resize.comparetool', function() {
                // Phone = sticky header
                if ( Modernizr.mq('(max-width: 480px)') ) {

                    // Setup sticky header
                    if ( !isStickyHeader ) {
                        isStickyHeader = true;
                        var $subheader = $('<div class="modal-subheader clearfix">');
                        $subheader.append( self.$compareCountWrap.detach(), self.$compareReset.detach(), $sortOpts.detach() );

                        // Insert subhead after the header
                        $header.after( $subheader );

                        // Put the reset button the left
                        self.$compareReset.removeClass('pull-right').addClass('pull-left');
                    }

                // Larger than phone
                } else {

                    if ( isStickyHeader ) {
                        isStickyHeader = false;
                        // Append sort dropdown
                        $header.append( self.$compareReset.detach(), $sortOpts.detach() );

                        // Append count and labels
                        $labelColumn.prepend( self.$compareCountWrap.detach() );

                        self.$compareTool.find('.modal-subheader').remove();

                        self.$compareReset.removeClass('pull-left').addClass('pull-right');
                    }
                }

                self.$compareTool.find('.detail').css('height', '');
                self.setCompareRowHeights();
            });

            // Save state for reset
            self.compareState = {
                count: productCount,
                sort: self.currentSort,
                $items : $newItems,
                label: originalLabel
            };

            $content.append( $labelColumn );
            $content.append( $newItems );
            $container.append( $content );

            // Trigger modal
            self.$compareTool
                .find('.modal-body')
                .append($container)
                .end()
                .data('galleryId', self.id) // Set some data on the modal so we know which gallery it belongs to
                .modal('show'); // Show the modal

            // Cloned images need to be updated
            window.iQ.update();


            // WORK TO DO AFTER ITEMS HAVE BEEN PUT INTO THE DOM
            // -----------------------

            // Save a reference to the count
            self.$compareCount = self.$compareTool.find('.product-count');
            // Set item count
            self.$compareCount.text( productCount );

            // HOLD ONTA YA BUTTS. How do I set a width on something that will use percentages?
            $content.children().each(function() {
                contentWidth += $(this).outerWidth(true);
            });
            $content.width( contentWidth );
            // $content.width( $newItems.length * itemWidth );


        },

        onCompareShown : function() {
            var self = this;

            var now = new Date().getTime();
            self.setCompareRowHeights();
            console.log( (new Date().getTime() - now) / 1000, 'seconds passed calculating heights');
        },

        onCompareClosed : function() {
            var self = this;

            if ( self.$compareTool.data('galleryId') !== self.id ) {
                return;
            }

            // Delete the id from memory
            self.$compareTool.removeData('galleryId');

            // Clean up
            self.$compareTool.find('.sort-options').remove();

            // Destroy carousel
            // TODO

            // Empty out html
            self.$compareTool
              .find('.modal-body')
              .empty()
              .end()
              .find('.modal-subheader')
              .remove()
              .end()
              .find('#compare-tool-label')
              .text( self.compareState.label );

            // Set count to zero
            self.$compareCount.text(0);

            self.$compareReset.remove();
            self.$compareReset = null;

            // Set state to null
            self.compareState = null;

            // Remove resize event
            $(window).off('.comparetool');
        },

        onCompareReset : function() {
            var self = this,
                state = self.compareState;

            if ( self.$compareTool.data('galleryId') !== self.id ) {
                return;
            }

            self.$compareCount.text( state.count );
            state.$items.find('.compare-item-remove').parent().andSelf().removeClass('hide');

            // Disable reset button
            self.$compareReset.addClass('disabled');

            // Reset sort

            // Reset carousel
        },

        setColumnMode : function() {
            var self = this;

            if ( self.mode !== 'detailed' ) {
                // Make this a 5 column grid. Added to parent because grid must be a descendant of grid5
                self.$grid.parent().addClass('grid5');

                // 5 columns that break down to 2 on smaller screens
                self.shuffleColumns = function( containerWidth ) {
                    var column;

                    // Large desktop ( 6 columns )
                    if ( Modernizr.mq('(min-width: 1200px)') ) {
                        column = Exports.COLUMN_WIDTH_1200 * containerWidth;

                    // Landscape tablet + desktop ( 5 columns )
                    } else if ( Modernizr.mq('(min-width: 980px)') ) {
                        column = Exports.COLUMN_WIDTH * containerWidth; // ~18% of container width

                    // Portrait Tablet ( 4 columns )
                    // } else if ( Modernizr.mq('(min-width: 768px)') ) {
                    //     column = Exports.COLUMN_WIDTH_768 * containerWidth;

                    // Between Portrait tablet and phone ( 3 columns )
                    } else if ( Modernizr.mq('(min-width: 481px)') ) {
                        column = Exports.COLUMN_WIDTH_768 * containerWidth;

                    // Phone ( 2 columns )
                    } else {
                        column = 0.48 * containerWidth; // 48% of container width
                    }


                    return column;
                };

                self.shuffleGutters = function( containerWidth ) {
                    var gutter,
                        numColumns = 0;

                    // Large desktop ( 6 columns )
                    if ( Modernizr.mq('(min-width: 1200px)') ) {
                        gutter = Exports.GUTTER_WIDTH_1200 * containerWidth;
                        numColumns = 6;

                    // Landscape tablet + desktop ( 5 columns )
                    } else if ( Modernizr.mq('(min-width: 980px)') ) {
                        gutter = Exports.GUTTER_WIDTH * containerWidth;
                        numColumns = 5;

                    // // Portrait Tablet ( 4 columns ) - masonry
                    } else if ( Modernizr.mq('(min-width: 768px)') ) {
                        numColumns = 4;
                        gutter = Exports.GUTTER_WIDTH_768 * containerWidth;

                    // Between Portrait tablet and phone ( 3 columns )
                    } else if ( Modernizr.mq('(min-width: 481px)') ) {
                        gutter = Exports.GUTTER_WIDTH_768 * containerWidth;
                        numColumns = 3;


                    // Phone ( 2 columns )
                    } else {
                        gutter = 0.02 * containerWidth; // 2% of container width
                        numColumns = 2;
                    }

                    self.setColumns(numColumns);

                    return gutter;

                };
            } else {
                // Use the default 12 column grid.
                // Have to do more work here to get the right percentages for each breakpoint

                self.shuffleColumns = function( containerWidth ) {
                    var column;

                    if ( Modernizr.mq('(min-width: 768px) and (max-width:979px)') ) {
                        column = Exports.COLUMN_WIDTH_768 * containerWidth;

                    } else if ( Modernizr.mq('(min-width: 1200px)') ) {
                        column = Exports.COLUMN_WIDTH_1200 * containerWidth;

                    } else if ( Modernizr.mq('(min-width: 980px)') ) {
                        column = Exports.COLUMN_WIDTH_980 * containerWidth;

                    } else {
                        column = containerWidth;
                    }

                    return column;
                };

                self.shuffleGutters = function( containerWidth ) {
                    var gutter;

                    if ( Modernizr.mq('(min-width: 768px) and (max-width:979px)') ) {
                        gutter = Exports.GUTTER_WIDTH_768 * containerWidth;

                    } else if ( Modernizr.mq('(min-width: 1200px)') ) {
                        gutter = Exports.GUTTER_WIDTH_1200 * containerWidth;

                    } else if ( Modernizr.mq('(min-width: 980px)') ) {
                        gutter = Exports.GUTTER_WIDTH_980 * containerWidth;

                    } else {
                        gutter = 0;
                    }

                    return gutter;

                };
            }
        },

        setColumns : function( numColumns ) {
            var self = this,
                allSpans = 'span1 span2 span3 span4 span6',
                shuffleDash = 'shuffle-',
                gridClasses = [ shuffleDash+3, shuffleDash+4, shuffleDash+5, shuffleDash+6, 'grid-small' ].join(' '),
                itemSelector = '.gallery-item',
                grid5 = 'grid5',
                span = 'span',
                large = '.large',
                promo = '.promo',
                largeAndPromo = large + ',' + promo;

            // Large desktop ( 6 columns )
            if ( numColumns === 6 ) {
                if ( !self.$grid.hasClass(shuffleDash+6) ) {

                    // add .grid5
                    self.$grid
                        .removeClass(gridClasses)
                        .addClass(shuffleDash+6)
                        .parent()
                        .removeClass(grid5);


                    self.$grid.children(itemSelector)
                        .removeClass(allSpans) // Remove current grid span
                        .filter(large) // Select large tiles
                        .addClass(span+6) // Make them 6/12 width
                        .end() // Go back to all items
                        .filter(promo) // Select promo tiles
                        .addClass(span+4) // Make them 4/12 width
                        .end() // Go back to all items
                        .not(largeAndPromo) // Select tiles not large nor promo
                        .addClass(span+2); // Make them 2/12 width
                }

            // Landscape tablet + desktop ( 5 columns )
            } else if ( numColumns === 5 ) {
                if ( !self.$grid.hasClass(shuffleDash+5) ) {

                    // add .grid5
                    self.$grid
                        .removeClass(gridClasses)
                        .addClass(shuffleDash+5)
                        .parent()
                        .addClass(grid5);


                    self.$grid.children(itemSelector)
                        .removeClass(allSpans) // Remove current grid span
                        .filter(large) // Select large tiles
                        .addClass(span+3) // Make them 3/5 width
                        .end() // Go back to all items
                        .filter(promo) // Select promo tiles
                        .addClass(span+2) // Make them 2/5 width
                        .end() // Go back to all items
                        .not(largeAndPromo) // Select tiles not large nor promo
                        .addClass(span+1); // Make them 1/5 width
                }

            // Portrait Tablet ( 4 columns ) - masonry
            } else if ( numColumns === 4 ) {
                if ( !self.$grid.hasClass(shuffleDash+4) ) {

                    // Remove .grid5
                    self.$grid
                        .removeClass(gridClasses)
                        .addClass(shuffleDash+4)
                        .parent()
                        .removeClass(grid5);


                    self.$grid.children(itemSelector)
                        .removeClass(allSpans) // Remove current grid span
                        .filter(largeAndPromo) // Select large and promo tiles
                        .addClass(span+6) // Make them half width
                        .end() // Go back to all items
                        .not(largeAndPromo) // Select tiles not large nor promo
                        .addClass(span+3); // Make them quarter width
                }

            // Between Portrait tablet and phone ( 3 columns )
            } else if ( numColumns === 3 ) {
                if ( !self.$grid.hasClass(shuffleDash+3) ) {

                    // Remove .grid5, add .grid-small
                    self.$grid
                        .removeClass(gridClasses)
                        .addClass(shuffleDash+3 + ' grid-small')
                        .parent()
                        .removeClass(grid5);

                    // Remove current grid span
                    self.$grid.children(itemSelector)
                        .removeClass(allSpans)
                        .addClass(span+4);
                }


            // Phone ( 2 columns )
            } else if ( numColumns === 2 ) {
                if ( !self.$grid.parent().hasClass(grid5) ) {

                    // add .grid5
                    self.$grid
                        .removeClass(gridClasses)
                        .parent()
                        .addClass(grid5);
                }
            }
        },

        setCompareRowHeights : function() {
            var self = this,
                $items = self.$compareTool.find('.compare-item'),
                $detailGroup = $items.find('.detail-group').first(),
                offset = 0;

            // Set detail rows to even heights
            self.$compareTool.find('.detail-label').each(function(i) {
                var $detailLabel = $(this),
                    maxHeight = parseFloat( $detailLabel.css('height') ) + parseFloat( $detailLabel.css('paddingTop') ),
                    $detail = $items.find('.detail:nth-child(' + (i + 1) + ')');

                // Find all detail lines that have this "name"
                $detail.each(function() {
                    var $this = $(this),
                        height = parseFloat( $this.css('height') ) + parseFloat( $this.css('paddingTop') );

                    if ( height > maxHeight ) {
                        maxHeight = height;
                    }
                });

                $detail.add($detailLabel).css('height', maxHeight);
            });

            // Set the top offset for the labels
            offset = $detailGroup.position().top;
            offset += parseFloat( $detailGroup.css('marginTop') );
            self.$compareTool.find('.detail-label-group').css('top', offset);
        }

    };

    // Plugin definition
    $.fn.gallery = function( opts ) {
        var args = Array.prototype.slice.call( arguments, 1 );
        return this.each(function() {
            var $this = $(this),
                gallery = $this.data('gallery');

            // If we don't have a stored gallery, make a new one and save it
            if ( !gallery ) {
                gallery = new Gallery( $this, opts );
                $this.data( 'gallery', gallery );
            }

            if ( typeof opts === 'string' ) {
                gallery[ opts ].apply( gallery, args );
            }
        });
    };


    // Overrideable options
    $.fn.gallery.options = {
        mode: 'editorial',
        shuffleSpeed: 250,
        shuffleEasing: 'ease-out'
    };

    // Not overrideable
    $.fn.gallery.settings = {
        MIN_PRICE: undefined,
        MAX_PRICE: undefined,
        isInitialized: false,
        sorted: false,
        isTouch: !!( 'ontouchstart' in window ),
        loadingGif: 'img/spinner.gif'
    };

}(jQuery, Modernizr, window));
