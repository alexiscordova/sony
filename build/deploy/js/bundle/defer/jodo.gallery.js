
(function($, window, undefined) {

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
        self.$clear = self.$container.find('.clear-active-filters');
        self.$loadMore = self.$container.find('.gallery-load-more');
        self.$favorites = self.$grid.find('.js-favorite');

        if ( self.mode !== 'detailed' ) {
            self.$grid.addClass('grid5');
        }

        // Use a function if one is specified for the column width
        var col = $.isFunction( self.shuffleColumns ) ?
            self.shuffleColumns :
            function( containerWidth ) {
                var column = self.shuffleColumns[ containerWidth ];
                if ( column === undefined ) {
                    column = 60;
                }
                return column;
            },
        
        // Use a function if one is defined for the gutter width
        gut = $.isFunction( self.shuffleGutters ) ?
            self.shuffleGutters :
            function( containerWidth ) {
                var gutter = self.shuffleGutters[ containerWidth ];
                if ( gutter === undefined ) {
                    gutter = 0;
                }
                return gutter;
            };

        // instantiate the plugin
        self.$grid.shuffle({
            delimeter: self.shuffleDelimeter,
            speed: self.shuffleSpeed,
            easing: self.shuffleEasing,
            columnWidth: col,
            gutterWidth: gut
        });


        // Initialize filters
        self.filters = {
            range: {},
            button: {},
            checkbox: {}
        };
        self.filterNames = {};
        self.filterLabels = {};
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
                    // Treat groups the same as buttons
                    type = 'button';
                    self.button( $this, name );
                    break;
                case 'checkbox':
                    self.checkbox ( $this, name );
                    break;
            }

            // Save the active filters in this filter to an empty array or object
            self.filters[ type ][ name ] = init;
            self.filterNames[ name ] = type;
        });


        // Slide toggle. Reset range control if it was hidden on initialization
        self.$container.find('.collapse').on('shown', $.proxy( self.maybeResetRange, self ));

        // If this isn't a simple gallery, let's sort the items on window resize by priority
        var sorted = false;
        if ( $(window).width() <= 767 ) {
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

        // Set up sorting ---- dropdowm
        self.$sortBtns.on('click',  $.proxy( self.sort, self ));

        // Set up sorting ---- select menu
        // self.$sortSelect.on('change', function(evt) {
        //     self.sortItems(this, evt);
        // });

        // Displays active filters on `filter`
        self.$grid.on('filter.shuffle', function(evt, shuffle) {
            self.$productCount.text( shuffle.visibleItems );
            self.displayActiveFilters();
        });

        // Clear filters button
        self.$clear.on('click', function(evt) {
            evt.preventDefault();
            self.resetActiveFilters();
            self.$container.trigger('reset.gallery', [self]);
        });

        // Load more button
        self.$loadMore.on('click', $.proxy( self.loadMore, self ));

        // Favorite Heart
        self.$favorites.on('click', $.proxy( self.onFavorite, self ));

        // Hide filters
        // self.$container.find('.product-filter').slideUp();

        self.isInitialized = true;
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
        },

        // From the element's data-* attributes, test to see if it passes
        itemPassesFilters : function( data ) {
            var self = this,
                filterName = '';

            // Loop through each filter in the elements filter set
            for ( filterName in data.filterSet ) {
                if ( !data.filterSet.hasOwnProperty(filterName) ) {
                    continue;
                }

                // filterName e.g. 'price'
                var filter = data.filterSet[ filterName ], // e.g. 399.99
                    filterType = self.filterNames[ filterName ], // e.g. 'range'
                    activeFilters = filterType ? self.filters[ filterType ][ filterName ] : null; // e.g. ["lcd"]

                if ( !filterType ) {
                    continue;
                }

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
                    "class" : "label label-close label-subtle",
                    "data-filter" : key,
                    "data-filter-name" : obj.key || obj.name,
                    text : obj.label,
                    click : $.proxy( self.onRemoveFilter, self )
                });

                frag.appendChild( $label[0] );
            });

            
            self.$activeFilters.empty().append(frag);

            if ( $.isEmptyObject( filters ) ) {
                self.$clear.addClass('hidden');
            } else {
                self.$clear.removeClass('hidden');
            }
        },

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

        onRemoveFilter : function( evt ) {
            var self = this,
                data = $(evt.target).data(),
                filterType = self.filterNames[ data.filterName ],
                selector = '',
                rangeControl,
                method;
            
            self.undoFilter( data.filter, data.filterName, filterType );

            // Remove active/checked state
            if ( filterType === 'button' ) {
                selector = '[data-filter="' + data.filterName + '"] [data-' + data.filterName + '="' + data.filter + '"]';
                self.$container.find( selector ).removeClass('active');
            } else if ( filterType === 'checkbox' ) {
                selector = '[data-filter="' + data.filterName + '"] [value="' + data.filter + '"]';
                self.$container.find( selector ).prop('checked', false);
            } else if ( filterType === 'range' ) {
                rangeControl = self.$rangeControl.data('rangeControl');
                method = data.filter === 'min' ? 'slideToInitialMin' : 'slideToInitialMax';
                rangeControl[ method ]();
            }

            // Remove this label
            $(evt.target).remove();

            // Trigger shuffle
            self.filter();
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
                $btns = $parent.children();

            $btns.on('click', function() {
                $(this).button('toggle');

                var $checked = $parent.find('.active'),
                checked = [];

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
            });

            self.filterLabels[ filterName ] = labels;

            // Remove active classes when the gallery is reset
            self.$container.on('reset.gallery', function() {
                $btns.removeClass('active');
            });
        },

        checkbox : function( $parent, filterName ) {
            var self = this,
                labels = {},
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
            });

            self.filterLabels[ filterName ] = labels;

            // Reset checkboxes when the gallery is reset
            self.$container.on('reset.gallery', function() {
                $inputs.prop('checked', false);
            });
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

            update = function(positions, percents) {
                var minPrice = getPrice(percents.min),
                maxPrice = getPrice(percents.max),
                maxPriceStr = maxPrice === self.MAX_PRICE ? maxPrice + '+' : maxPrice,
                prevMin = self.price.min,
                prevMax = self.price.max;

                // Display values
                $output.html('$' + minPrice + ' - $' + maxPriceStr);

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
            };

            self.$rangeControl = $rangeControl.rangeControl({
                orientation: 'h',
                initialMin: '0%',
                initialMax: '100%',
                range: true,
                callback: update
            });

            // Listen for reset event
            self.$container.on('reset.gallery', function() {
                $rangeControl.rangeControl('reset', true);
            });
        },

        // If there is a range control in this element and it's in need of an update
        maybeResetRange : function() {
            var th = this,
                $rangeControl = th.$container.find('.range-control');
            if ( $rangeControl.length > 0 && $rangeControl.data('rangeControl').isHidden ) {
                console.log('resetting range control');
                $rangeControl.rangeControl('reset');
            }
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

        /*
        sortItems : function( select ) {
            var self = this,
                reverse = select[ select.selectedIndex ].getAttribute('data-reverse'),
                filterName = select.value,
                sortObj = {};
            
            if ( select.value !== 'default' ) {
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
        */

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

        loadMore : function() {
            var self = this,
                i = 5;

            /**
             * Gets a random integer between a min and max
             * @param  {int} min minimum value
             * @param  {int} max maximum value
             * @return {int}     random int between min and max
             */
            function getRandomInt( min, max ) {
              return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            // Do it 4 times
            while (i--) {
                var random = getRandomInt(0, self.$grid.children().length);
                self.$grid.children().eq( random ).clone().appendTo(self.$grid);
            }

            // Update the masonry
            self.$grid.shuffle('update');
        },

        onFavorite : function( evt ) {
            $(evt.target).toggleClass('state3');
        }

    };

    // Plugin definition
    $.fn.gallery = function( opts ) {
        var args = Array.prototype.slice.apply( arguments );
        return this.each(function() {
            var $this = $(this),
                gallery = $this.data('gallery');

            // If we don't have a stored gallery, make a new one and save it
            if ( !gallery ) {
                gallery = new Gallery( $this, opts );
                $this.data( 'gallery', gallery );
            }

            if ( typeof opts === 'string' ) {
                gallery[ opts ].apply( gallery, args.slice(1) );
            }
        });
    };


    // Overrideable options
    $.fn.gallery.options = {
        MIN_PRICE: 100,
        MAX_PRICE: 2000,
        shuffleSpeed: 400,
        shuffleDelimeter: ',',
        shuffleEasing: 'cubic-bezier(0.165, 0.840, 0.440, 1.000)', // easeOutQuart
        shuffleColumns: {
            1470: 56,
            1112: 56,
            940: 60,
            724: 42
        },
        shuffleGutters: {
            1470: 40,
            1112: 40,
            940: 20,
            724: 20
        }
    };

    // Not overrideable
    $.fn.gallery.settings = {
        isInitialized: false,
        isTouch: !!( 'ontouchstart' in window )
    };

}(jQuery, window));