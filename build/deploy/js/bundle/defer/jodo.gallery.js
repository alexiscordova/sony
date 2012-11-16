
(function($, window, undefined) {

    var Gallery = function( $container, options ) {
        var self = this;

        $.extend(self, $.fn.gallery.options, options, $.fn.gallery.settings);

        self.$container = $container;
        self.$grid = self.$container.find('.products');
        self.$filterOpts = self.$container.find('.filter-options');

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
                case 'checkbox':
                    self.checkbox ( $this, name );
                    break;
            }

            // Save the active filters in this filter to an empty array or object
            self.filters[ type ][ name ] = init;
            self.filterNames[ name ] = type;
        });


        // Slide toggle. Reset range control if it was hidden on initialization
        self.$container.find('.js-filter-toggle').on('click', function() {
            $(this).siblings('.product-filter').stop().slideToggle( $.proxy( self.maybeResetRange, self ) );
        });

        // Hide filters
        self.$container.find('.product-filter').slideUp();

        // If this isn't a simple gallery, let's sort the items on window resize by priority
        if ( self.sort ) {
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
        }

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
            var self = this;

            $parent.children().on('click', function() {
                $(this).button('toggle');

                var $checked = $parent.find('.active'),
                checked = [];

                // Get all data-* filters
                if ( $checked.length !== 0 ) {
                    $checked.each(function() {
                        var data = $checked.data();
                        checked.push( data[ filterName ] );
                    });
                }
                self.filters.button[ filterName ] = checked;

                self.filter();
            });
        },

        checkbox : function( $parent, filterName ) {
            var self = this;
            $parent.find('input').on('change', function() {
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

                // Filter results
                if ( (prevMin !== self.price.min || prevMax !== self.price.max) && self.isInitialized ) {
                    if ( $.throttle ) {
                        var delay, method;
                        if ( !!( 'ontouchstart' in window ) ) {
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

            $rangeControl.rangeControl({
                orientation: 'h',
                initialMin: '0%',
                initialMax: '100%',
                range: true,
                callback: update
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

        sortByPriority : function( shouldReset ) {
            var self = this;
            if ( shouldReset ) {
                self.$grid.shuffle('sort', {});
            } else {
                self.$grid.shuffle('sort', {
                    by: function($el) {
                        return $el.data('priority') || 100;
                    }
                });
            }
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
        sort: false,
        filters: true,
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
        isInitialized: false
    };

}(jQuery, window));