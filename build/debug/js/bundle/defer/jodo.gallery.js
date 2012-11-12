
(function($, window, undefined) {

    var Gallery = function( $container, options ) {
        var self = this;

        $.extend(self, $.fn.gallery.options, options, $.fn.gallery.settings);
        
        self.features = [];
        self.megapixels = [];
        self.price = {
            min: self.MIN_PRICE,
            max: self.MAX_PRICE
        };

        self.$container = $container;
        self.$grid = self.$container.find('.products');
        self.$features = self.$container.find('.filter-options .features');
        self.$megapixels = self.$container.find('.filter-options .megapixels');
        self.$rangeControl = self.$container.find('.price-range-control'),
        self.$output = self.$container.find('.price-range-output'),

        // instantiate the plugin
        // easeOutQuart
        self.canInitialize = true;
        self.$grid.shuffle({
            group : 'all',
            speed : 400,
            easing : 'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
            columnWidth: function( containerWidth ) {
                var column = 0;
                switch ( containerWidth ) {
                case 1470:
                    column = 70;
                    break;
                case 1170:
                    column = 70;
                    break;
                case 940:
                    column = 60;
                    break;
                case 724:
                    column = 42;
                    break;
                default:
                    column = 60;
                }
                return column;
            },
            gutterWidth: function( containerWidth ) {
                var gutter = 0;
                switch ( containerWidth ) {
                case 1470:
                    gutter = 30;
                    break;
                case 1170:
                    gutter = 30;
                    break;
                case 940: // Falls through
                case 724:
                    gutter = 20;
                    break;
                default:
                    gutter = 0;
                }
                return gutter;
            }
        });


        // Features
        self.$features.find('input').on('change', function() {
            var $checked = self.$features.find('input:checked'),
            groups = [];

            // At least one checkbox is checked, clear the array and loop through the checked checkboxes
            // to build an array of strings
            if ( $checked.length !== 0 ) {
                $checked.each(function() {
                    groups.push(this.value);
                });
            }
            self.features = groups;

            self.filter();
        });

        // Megapixels
        self.$megapixels.children().on('click', function() {
            $(this).button('toggle');

            var $checked = self.$megapixels.find('.active'),
            groups = [];

            // Get all megapixel filters
            if ( $checked.length !== 0 ) {
                $checked.each(function() {
                    groups.push(this.getAttribute('data-megapixels'));
                });
            }
            self.megapixels = groups;

            self.filter();
        });


        // Slide toggle
        self.$container.find('.js-filter-toggle').on('click', function() {
            $(this).siblings('.product-filter').stop().slideToggle(function() {
                // If there is a range control in this element and it's in need of an update
                var $rangeControl = $(this).find('.range-control');
                if ( $rangeControl.length > 0 && $rangeControl.data('rangeControl').isHidden ) {
                    $rangeControl.rangeControl('reset');
                }
            });
        });

        // Set up range controller
        self.range();

        self.$container.find('.product-filter').slideUp();
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

        itemPassesFilters : function( data ) {
            var self = this;

            // If a features filter is active
            if ( self.features.length > 0 && !self.arrayContainsArray( data.groups, self.features ) ) {
                return false;
            }

            // If a megapixels filter is active
            if ( self.megapixels.length > 0 && !self.valueInArray(data.megapixels, self.megapixels) ) {
                return false;
            }

            // Price range controller
            if ( data.price < self.price.min || ( data.price > self.price.max && self.price.max !== self.MAX_PRICE ) ) {
                return false;
            }

            return true;
          },

        hasActiveFilters : function() {
            var self = this;
            return self.megapixels.length > 0 || self.features.length > 0 || self.price.min !== self.IN_PRICE || self.price.max !== self.MAX_PRICE;
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

        range : function() {
            var self = this,
            diff = self.MAX_PRICE - self.MIN_PRICE,

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
                self.$output.html('$' + minPrice + ' - $' + maxPriceStr);

                // Save values
                self.price.min = minPrice;
                self.price.max = maxPrice;

                // Filter results
                if ( (prevMin !== self.price.min || prevMax !== self.price.max) && self.canInitialize ) {
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

            self.$rangeControl.rangeControl({
                orientation: 'h',
                initialMin: '0%',
                initialMax: '100%',
                range: true,
                callback: update
            });
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
        MAX_PRICE: 2000
    };

    // Not overrideable
    $.fn.gallery.settings = {

    };

}(jQuery, window));