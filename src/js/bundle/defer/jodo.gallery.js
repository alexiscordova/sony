
(function($, Modernizr, window, undefined) {

    var Gallery = function( $container, options ) {
        var self = this;

        $.extend(self, $.fn.gallery.options, options, $.fn.gallery.settings);

        self.$container = $container;
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
            showInitialTransition: false
        });

        // Infinite scroll?
        if ( self.hasInfiniteScroll ) {
            self.initInfscr();
        }

        // Initialize filter dictionaries to keep track of everything
        if ( self.hasFilters ) {
            self.initFilters();
        }

        self.initSwatches();

        // If this isn't a simple gallery, let's sort the items on window resize by priority
        var sorted = false;
        if ( self.windowSize <= 767 ) {
            self.sortByPriority();
            sorted = true;
        }

        $(window).on('resize.gallery', function() {
            var width = $(window).width();
            if ( width <= 767 && !sorted ) {
                self.sortByPriority();
                sorted = true;
            } else if ( width >= 768 && sorted ) {
                // Reset
                self.sortByPriority(true);
                sorted = false;
            }
        });


        // Slide toggle. Reset range control if it was hidden on initialization
        self.$container.find('.collapse')
            .on('shown', $.proxy( self.onFiltersShown, self ))
            .on('show', $.proxy( self.onFiltersShow, self ))
            .on('hide', $.proxy( self.onFiltersHide, self ));

        // Set up sorting ---- dropdowm
        self.$sortBtns.on('click',  $.proxy( self.sort, self ));

        // Set up sorting ---- select menu
        self.$sortSelect.on('change', $.proxy( self.sortItems, self ));

        // Displays active filters on `filter`
        self.$grid.on('filter.shuffle', function(evt, shuffle) {
            self.$productCount.text( shuffle.visibleItems );
            self.displayActiveFilters();
        });

        // Clear filters button
        // self.$clear.on('click', function(evt) {
        //     evt.preventDefault();
        //     self.resetActiveFilters();
        //     self.$container.trigger('reset.gallery', [self]);
        // });

        // Favorite Heart
        self.$favorites.on('click', $.proxy( self.onFavorite, self ));

        // This container is about to be shown because it's a tab
        self.$container.closest('[data-tab]').on('show', $.proxy( self.onShow, self ));

        // This container has just been shown because it's a tab
        self.$container.closest('[data-tab]').on('shown', $.proxy( self.onShown, self ));

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

        /*
        resetActiveFilters : function() {
            var self = this,
                filterType = '',
                filterName = '';

            // self.filters ~= self.filters.button.megapixels["14-16", "16-18"]
            for ( filterType in self.filters ) {
                if ( !self.filters.hasOwnProperty(filterType) ) {
                    continue;
                }

                // Loop through filter types because there could be more than one 'button' or 'checkbox'
                if ( filterType === 'button' || filterType === 'checkbox' ) {
                    for ( filterName in self.filters[ filterType ] ) {
                        self.filters[ filterType ][ filterName ].length = 0;
                    }
                }

                // Reseting the range control is triggered by the reset.gallery event. Take a look at this.range()
            }

            self.$grid.shuffle('all');
        },
        */

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
        },

        initInfscr : function() {
            var self = this;

            self.$grid.infinitescroll({
                local: true,
                debug: true,
                bufferPx: -200,
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
                self.$grid.shuffle( 'appended', $( newElements ) );
                // Show new product count
                self.$productCount.text( self.$grid.data('shuffle').visibleItems );
                // Update iQ images
                window.iQ.update();
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

            // Remove active classes when the gallery is reset
            // self.$container.on('reset.gallery', function() {
            //     $btns.removeClass('active');
            // });
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

            // Reset checkboxes when the gallery is reset
            // self.$container.on('reset.gallery', function() {
            //     $inputs.prop('checked', false);
            // });
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
            $output = $rangeControl.closest('.filter-container').find('.range-output'),

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
                displayValues(minPrice, maxPriceStr);

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
            displayValues = function( min, max ) {
                $output.html('$' + min + ' - $' + max);
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

            // Listen for reset event
            // self.$container.on('reset.gallery', function() {
            //     $rangeControl.rangeControl('reset', true);
            // });
        },

        // If there is a range control in this element and it's in need of an update
        maybeResetRange : function() {
            var th = this,
                $rangeControl = th.$container.find('.range-control');
            if ( $rangeControl.length > 0 && $rangeControl.data('rangeControl').isHidden ) {
                console.log('resetting range control');
                $rangeControl.rangeControl('reset');
                return true;
            }
            return false;
        },

        sort : function( evt ) {
            var self = this,
                $target = $(evt.target),
                data = $target.data(),
                reverse = data.reverse ? true : false,
                sortObj = {};

            evt.preventDefault();

            self.$dropdownToggleText.text( $target.text() );

            if ( data.value !== 'default' ) {
                sortObj = {
                    reverse: reverse,
                    by: function($el) {
                        // e.g. filterSet.price
                        return $el.data('filterSet')[ data.value ];
                    }
                };
            }

            self.$grid.shuffle('sort', sortObj);
        },

        sortItems : function( evt ) {
            var self = this,
                reverse = evt.target[ evt.target.selectedIndex ].getAttribute('data-reverse'),
                filterName = evt.target.value,
                sortObj = {};
            
            if ( evt.target.value !== 'default' ) {
                reverse = reverse === 'true' ? true : false;
                sortObj = {
                    reverse: reverse,
                    by: function($el) {
                        return $el.data('filterSet')[filterName];
                    }
                };
            }

            self.$grid.shuffle('sort', sortObj);
        },

        sortByPriority : function( shouldReset ) {
            var self = this;
            if ( shouldReset ) {
                self.$grid.shuffle('sort', {});
            } else {
                self.$grid.shuffle('sort', {
                    by: function($el) {
                        var priority = $el.data('priority');

                        // Returning undefined to the sort plugin will cause it to revert to the original array
                        return priority ? priority : undefined;
                    }
                });
            }
        },

        onFavorite : function( evt ) {
            // <i class="icon-ui-favorite{{#if this.isFavorited}} state3{{/if}} js-favorite"></i>
            $(evt.target).toggleClass('state3');
        },

        // Event triggered when this tab is about to be shown
        onShow : function( evt ) {
            var that = evt.prevPane.find('.gallery').data('gallery');

            if ( that && that.hasInfiniteScroll ) {
                that.$grid.infinitescroll('pause');
            }
        },

        // Event triggered when tab pane is finished being shown
        onShown : function() {
            var self = this,
                windowWidth = $(window).width(),
                windowHasResized = self.windowSize !== windowWidth;

            // Respond to tab shown event.Update the columns if we're in need of an update
            if ( self.$grid.data('shuffle').needsUpdate || windowHasResized ) {
                console.log('updating shuffle');
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

        setColumnMode : function() {
            var self = this,
                // Five columns
                fiveColumns = 5,
                twelveColumns = 12,

                fluidGridColumnWidth = 204,
                fluidGridGutterWidth = 23,
                fullWidth = (fiveColumns * fluidGridColumnWidth) + (fluidGridGutterWidth * (fiveColumns - 1)),
                COLUMN_WIDTH = fluidGridColumnWidth / fullWidth,
                GUTTER_WIDTH = fluidGridGutterWidth / fullWidth,

                // Twelve columns @ 768 TODO GLOBALIZE
                colWidth768 = 45,
                gutWidth768 = 20,
                fullWidth768 = (twelveColumns * colWidth768) + (gutWidth768 * (twelveColumns - 1)),
                COLUMN_WIDTH_768 = colWidth768 / fullWidth768,
                GUTTER_WIDTH_768 = gutWidth768 / fullWidth768,

                // Twelve columns @ 980 TODO GLOBALIZE
                colWidth980 = 54,
                gutWidth980 = 30,
                fullWidth980 = (twelveColumns * colWidth980) + (gutWidth980 * (twelveColumns - 1)),
                COLUMN_WIDTH_980 = colWidth980 / fullWidth980,
                GUTTER_WIDTH_980 = gutWidth980 / fullWidth980,

                // Twelve columns @ 1200 TODO GLOBALIZE
                colWidth1200 = 64,
                gutWidth1200 = 40,
                fullWidth1200 = (twelveColumns * colWidth1200) + (gutWidth1200 * (twelveColumns - 1)),
                COLUMN_WIDTH_1200 = colWidth1200 / fullWidth1200,
                GUTTER_WIDTH_1200 = gutWidth1200 / fullWidth1200;

            if ( self.mode !== 'detailed' ) {
                // Make this a 5 column grid. Added to parent because grid must be a descendant of grid5
                self.$grid.parent().addClass('grid5');

                // 5 columns that break down to 2 on smaller screens
                self.shuffleColumns = function( containerWidth ) {
                    var column;
                    if ( Modernizr.mq('(min-width: 768px)') ) {
                        column = COLUMN_WIDTH * containerWidth; // ~18% of container width
                    } else {
                        column = 0.48 * containerWidth; // 48% of container width
                    }


                    return column;
                };

                self.shuffleGutters = function( containerWidth ) {
                    var gutter;
                    if ( Modernizr.mq('(min-width: 768px)') ) {
                        gutter = GUTTER_WIDTH * containerWidth;
                    } else {
                        gutter = 0.02 * containerWidth; // 2% of container width
                    }

                    return gutter;

                };
            } else {
                // Use the default 12 column grid.
                // Have to do more work here to get the right percentages for each breakpoint

                self.shuffleColumns = function( containerWidth ) {
                    var column;

                    if ( Modernizr.mq('(min-width: 768px) and (max-width:979px)') ) {
                        column = COLUMN_WIDTH_768 * containerWidth;

                    } else if ( Modernizr.mq('(min-width: 1200px)') ) {
                        column = COLUMN_WIDTH_1200 * containerWidth;

                    } else if ( Modernizr.mq('(min-width: 980px)') ) {
                        column = COLUMN_WIDTH_980 * containerWidth;

                    } else {
                        column = containerWidth;
                    }

                    return column;
                };

                self.shuffleGutters = function( containerWidth ) {
                    var gutter;

                    if ( Modernizr.mq('(min-width: 768px) and (max-width:979px)') ) {
                        gutter = GUTTER_WIDTH_768 * containerWidth;

                    } else if ( Modernizr.mq('(min-width: 1200px)') ) {
                        gutter = GUTTER_WIDTH_1200 * containerWidth;
                        
                    } else if ( Modernizr.mq('(min-width: 980px)') ) {
                        gutter = GUTTER_WIDTH_980 * containerWidth;

                    } else {
                        gutter = 0;
                    }

                    return gutter;

                };
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
        isTouch: !!( 'ontouchstart' in window ),
        loadingGif: 'img/spinner.gif'
    };

}(jQuery, Modernizr, window));
