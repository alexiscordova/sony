/*global jQuery, Modernizr, iQ, IScroll, SONY*/

// ------------ Sony Gallery ------------
// Module: Gallery
// Version: 1.0
// Modified: 02/22/2013
// Dependencies: jQuery 1.7+, Modernizr
// Author: Glen Cheney
// --------------------------------------

(function($, Modernizr, window, undefined) {
  'use strict';

  var Gallery = function( $container, options ) {
    var self = this;

    $.extend(self, $.fn.gallery.options, options, $.fn.gallery.settings);

    // jQuery objects
    self.$container = $container;
    self.$window = SONY.$window;
    self.id = self.$container[0].id;
    self.$grid = self.$container.find('.products');
    self.$filterOpts = self.$container.find('.filter-options');
    self.$filterColumns = self.$filterOpts.find('.grid').children();
    self.$sortSelect = self.$container.find('.sort-options select');
    self.$sortBtns = self.$container.find('.sort-options .dropdown-menu a');
    self.$dropdownToggleText = self.$container.find('.sort-options .js-toggle-text');
    self.$productCount = self.$container.find('.product-count');
    self.$activeFilters = self.$container.find('.active-filters');
    self.$filterArrow = self.$container.find('.slide-arrow-under, .slide-arrow-over');
    self.$favorites = self.$grid.find('.js-favorite');
    self.$gridProductNames = self.$grid.find('.product-name-wrap');
    self.$carousels = self.$grid.find('.js-item-carousel');

    // Compare modal
    self.$compareBtn = self.$container.find('.js-compare-toggle');
    self.$compareTool = $('#compare-tool');

    // What do we have here?
    self.hasCompareModal = self.$compareBtn.length > 0;
    self.hasInfiniteScroll = self.$container.find('div.navigation a').length > 0;
    self.hasFilters = self.$filterOpts.length > 0;
    self.hasSorting = self.$sortBtns.length > 0;
    self.hasCarousels = self.$carousels.length > 0;

    // Other vars
    self.windowWidth = SONY.Settings.windowWidth;
    self.windowHeight = SONY.Settings.windowHeight;

    self.$container.addClass('gallery-' + self.mode);

    self.setColumnMode();

    self.initShuffle();

    self.$window.on('onorientationchange', $.debounce( 325, $.proxy( self.onResize, self ) ) );
    self.$window.on('resize.gallery', $.debounce( 325, $.proxy( self.onResize, self ) ) );

    // Infinite scroll?
    if ( self.hasInfiniteScroll ) {
      self.initInfscr();
    }

    // Initialize filter dictionaries to keep track of everything
    if ( self.hasFilters ) {
      self.initFilters();
    }

    if ( self.hasSorting ) {
      self.initSorting();
    }

    self.initSwatches();
    self.initTooltips();

    self.onResize( true );

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

    enable : function() {
      var self = this;


      // Trigger the resize event. Maybe they changed tabs, resized, then changed back.
      self.onResize();

      // Already enabled
      if ( self.enabled ) {
        return;
      }

      // Enable shuffle, which triggers a layout update
      self.shuffle.enable();

      // Resume infinite scroll if it's there yo
      if ( self.hasInfiniteScroll ) {
        self.$grid.infinitescroll('updateNavLocation');
        self.$grid.infinitescroll('resume');
      }

      self.$container.removeClass('disabled');

      self.enabled = true;

      if ( self.hasCarousels ) {
        self.$carousels.scrollerModule('refresh');
      }
    },

    disable : function() {
      var self = this;

      // Already disabled
      if ( !self.enabled ) {
        return;
      }

      // Disable shuffle
      self.shuffle.disable();

      // Pause infinite scroll
      if ( self && self.hasInfiniteScroll ) {
        self.$grid.infinitescroll('pause');
      }

      self.$container.addClass('disabled');

      self.enabled = false;
    },

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
            filters.min = {
              key: 'price',
              label: 'Min price: $' + self.price.min,
              name: 'min'
            };
          }
          if ( self.price.max !== self.MAX_PRICE) {
            filters.max = {
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
          'class' : 'label label-close fonticon-10-circle-x--after',
          'data-filter' : key,
          'data-filter-name' : obj.key || obj.name,
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

    removeActiveFilters : function() {
      var self = this,
          filterType = '',
          filterName = '',
          filterValue = '';

      for ( filterType in self.filters ) {
        for ( filterName in self.filters[ filterType ] ) {

          if ( filterType === 'range' ) {
            for ( filterValue in self.filters[ filterType ][ filterName ] ) {

              // Remove from internal data
              self.undoFilter( filterValue, filterName, filterType );

              // Remove active/checked state
              self.removeFilter( filterValue, filterName, filterType );
            }
          } else {
            for ( var i = 0; i < self.filters[ filterType ][ filterName ].length; i++ ) {
              filterValue = self.filters[ filterType ][ filterName ][ i ];

              // Remove from internal data
              self.undoFilter( filterValue, filterName, filterType );

              // Remove active/checked state
              self.removeFilter( filterValue, filterName, filterType );
            }
          }
        }
      }

      self.filter();

      // Slide up the collapsable if it's visible
      if ( self.$container.find('.collapse').hasClass('in') ) {
        self.$container.find('.collapse').collapse('hide');
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

    initShuffle : function() {
      var self = this;

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
        hideLayoutWithFade: true,
        sequentialFadeDelay: 60,
        buffer: 5
      });

      self.shuffle = self.$grid.data('shuffle');

      var debouncedShuffleLayout = $.debounce( 200, $.proxy( self.shuffle.layout, self.shuffle ) );
      self.$grid.find('.iq-img').on('imageLoaded', debouncedShuffleLayout );


      // Displays active filters on `filter`
      self.$grid.on('filter.shuffle', $.proxy( self.displayActiveFilters, self ));

      // Filtered should already be throttled because whatever calls `.filter()` should be throttled.
      self.$grid.on('layout.shuffle', function() {
        // Things moved around and could possibly be in the viewport
        iQ.update();

        // The position of the nav has changed, update it in infinitescroll
        if ( self.hasInfiniteScroll ) {
          self.$grid.infinitescroll('updateNavLocation');
        }
      });

      // Sort elements by data-priority attribute
      self.sortByPriority();
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

      // The filter type is sometimes changed because they have
      // the same look and functionality as another filter type
      // Here is where we keep the origial type
      self.realFilterTypes = {};

      self.$filterOpts.find('[data-filter]').each(function() {
        var $this = $(this),
            data = $this.data(),
            type = data.filterType,
            realType = type,
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
        self.realFilterTypes[ name ] = realType;
      });

      // Init popovers
      self.$filterOpts.find('.js-popover-trigger').each(function() {
        var $trigger = $(this);

        $trigger.popover({
          placement: 'in offsetright',
          trigger: 'click',
          getArrowOffset : function() {
            var containerWidth = self.$filterOpts.find('.filter-container').first().parent().width(),
                columnWidth = self.$filterOpts.find('.filter-container').first().width();

            return containerWidth - columnWidth;
          },
          getWidth: function() {
            // get the width of the filter-container's parent
            return self.$filterOpts.find('.filter-container').first().parent().width();
          },
          content: function() {
            return $(this).find('.js-popover-content').html();
          }
        });
      });

      // Slide toggle. Reset range control if it was hidden on initialization
      self.$container.find('.collapse')
        .on('shown', $.proxy( self.onFiltersShown, self ))
        .on('show', $.proxy( self.onFiltersShow, self ))
        .on('hide', $.proxy( self.onFiltersHide, self ));

    },

    initSorting : function() {
      var self = this;

      // Show first dropdown as active
      self.$sortBtns.first().parent().addClass('active');
      self.currentSort = 0;

      // Set up sorting ---- dropdowm
      self.$sortBtns.on('click',  $.proxy( self.sort, self ));

      // Set up sorting ---- select menu
      self.$sortSelect.on('change', $.proxy( self.sort, self ));

      if ( !self.hasFilters ) {
        self.$productCount.text( self.shuffle.$items.length );
      }

      // Firefox's and IE's <select> menu is hard to style...
      var ua = navigator.userAgent.toLowerCase();
      if ( ua.indexOf('firefox') > -1 || ua.indexOf('msie') > -1 ) {
        self.$sortSelect.parent().addClass('moz-ie');
      }
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
          msgText: '<em>Loading the next set of products...</em>',
          finishedMsg: '<em>Finished loading products.</em>',
          img: self.loadingGif
        }
      },
      // call shuffle as a callback
      function( newElements ) {
        var $newElements = $( newElements ).addClass('via-ajax');

        // Bump up the delay so it's more noticeable.
        self.shuffle.sequentialFadeDelay = 250;

        // Get shuffle to append and show the items for us
        self.$grid.shuffle( 'appended', $newElements );

        // Now put it back
        self.shuffle.sequentialFadeDelay = 60;

        // Show new product count
        self.$productCount.text( self.$grid.data('shuffle').visibleItems );

        // Initialize swatches and tooltips for ajax content
        self.initSwatches( $newElements.find('.mini-swatch[data-color]') );
        self.initTooltips( $newElements.find('.js-favorite') );

        // Update iQ images
        iQ.update( true );
      });
    },

    initSwatches : function( $collection ) {
      var self = this;

      $collection = $collection || self.$grid.find('.mini-swatch[data-color]');
      $collection.each(function() {
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

    initTooltips : function( $favorites ) {
      var self = this;

      $favorites = $favorites || self.$favorites;

      // Favorite Heart
      $favorites.on('click', $.proxy( self.onFavorite, self ));

      $favorites.tooltip({
        placement: 'offsettop',
        title: function() {
          var $jsFavorite = $(this);
          return self.getFavoriteContent( $jsFavorite, $jsFavorite.hasClass('active') );
        },
        template: '<div class="tooltip gallery-tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
      });
    },

    initCarousels : function( isFirstCall ) {
      var self = this;

      function initializeScroller( $carousel ) {
        // setTimeout onResize
        $carousel.scrollerModule({
          mode: 'carousel',
          contentSelector: '.js-carousel-container',
          itemElementSelector: '.slide'
        });

        self.hasEnabledCarousels = true;
      }

      // Go through each possible carousel
      self.$carousels.each(function() {
        var $carousel = $(this),
            $firstImage;

        // If this call is from the initial setup, we have to wait for the first image to load
        // to get its height.
        if ( isFirstCall ) {
          $firstImage = $carousel.find(':first-child img');
          $firstImage.on('imageLoaded', function() {
            initializeScroller( $carousel );
          });

        // Otherwise, just initialize the carousel right away
        } else {
          initializeScroller( $carousel );
        }

      });
    },

    destroyCarousels : function() {
      this.$carousels.scrollerModule('destroy');
      this.hasEnabledCarousels = false;
    },

    setFilterStatuses : function() {
      var self = this,
          $visible = self.shuffle.$items.filter('.filtered'),
          filterName, filterValue, method, realType;


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
        realType = self.realFilterTypes[ filterName ];

        for ( filterValue in self.filterValues[ filterName ] ) {
          method = self.filterValues[ filterName ][ filterValue ] ? 'enable' : 'disable';

          // Hacky as shit. This makes the `button` type always enabled
          if ( realType === 'button' ) {
            method = 'enable';
          }

          self[ method + 'Filter' ]( filterValue, filterName, self.filterTypes[ filterName ] );
        }
      }

      self.$productCount.text( $visible.length );

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

    range : function( $rangeControl, filterName, min, max ) {
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
        prevMax = self.price.max,
        delay;

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
          delay = self.isTouch ? 2500 : 250;
          $.debounce( delay, function() {
            self.filter();
          })();
        }
      },

      // Show what's happening with the range control
      displayValues = function( min, max, percents ) {
        var minWidth,
            maxWidth;

        // Set the new html, then get it's width, then set it's margin-left to negative half that
        minWidth = $minOutput.html('<sup>$</sup>' + min).width();
        $minOutput.css({
          left: percents.min + '%',
          marginLeft: -minWidth / 2
        });

        // Do it all over for the max handle
        maxWidth = $maxOutput.html('<sup>$</sup>' + max).width();
        $maxOutput.css({
          left: percents.max + '%',
          marginLeft: -maxWidth / 2
        });
      };

      // Store jQuery object for later access
      self.$rangeControl = $rangeControl;

      // On handle slid, update. Register before initialized so it's called during initialization
      self.$rangeControl.on('slid.rangecontrol', update);

      self.$rangeControl.rangeControl({
        initialMin: '0%',
        initialMax: '100%',
        range: true,
        rangeThreshold: 0.25
      });
    },

    // If there is a range control in this element and it's in need of an update
    maybeResetRange : function() {
      var self = this,
          $rangeControl = self.$container.find('.range-control');
      if ( $rangeControl.length > 0 && $rangeControl.data('rangeControl').isHidden ) {
        $rangeControl.rangeControl('reset');
        return true;
      }
      return false;
    },

    getSortObject : function( evt, $btnText ) {
      var $target = $(evt.target),
          isSelect = $target.is('select'),
          data,
          filterName,
          reverse,
          sortObj = {},
          index;

      // Get variables based on what kind of component we're working with
      if ( isSelect ) {
        filterName = $target.val();
        index = evt.target.selectedIndex;
        reverse = evt.target[ index ].getAttribute('data-reverse');
        reverse = reverse === 'true' ? true : false;
      } else {
        data = $target.data();
        filterName = data.value;
        reverse = data.reverse ? true : false;
        index = $target.closest('li').index();
        evt.preventDefault();
        $btnText.text( $target.text() );
      }

      if ( filterName !== 'default' ) {
        sortObj = {
          sortIndex: index,
          reverse: reverse,
          by: function($el) {
            // e.g. filterSet.price
            return $el.data('filterSet')[ filterName ];
          }
        };
      } else {
        sortObj.sortIndex = index;
      }

      return sortObj;

    },

    updateSortDisplay : function( $container ) {
      var self = this,
          currentSortValue = '';

      if ( Modernizr.mq('(max-width: 47.9375em)') ) {
        // Dealing with the select option menu
        currentSortValue = $container.find('select').children().eq( self.currentSort ).val();
        $container
          .find('select')
          .val( currentSortValue )
          .trigger('change');
      } else {
        // The dropdown component
        $container
          .find('.dropdown-menu')
          .children()
          .eq( self.currentSort )
          .find('a')
          .trigger('click');
      }

      return self;
    },

    sort : function( evt ) {
      var self = this,
          sortObj = self.getSortObject( evt, self.$dropdownToggleText );

      self.currentSort = sortObj.sortIndex;
      self.$grid.shuffle('sort', sortObj);

      return self;
    },

    sortByPriority : function() {
      var self = this,
          isTablet = Modernizr.mq('(max-width: 47.9375em)');

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
          sortObj = self.getSortObject( evt, self.$compareTool.find('.js-toggle-text') ),
          sortedItems,
          frag = document.createDocumentFragment();

      // Sort elements
      sortedItems = self.$compareItems.sorted( sortObj );

      // Remove old elements from DOM
      self.$compareItems.detach();

      // Not default order
      if ( sortObj.by ) {
        // Append sorted elements to a document fragment
        $.each(sortedItems, function(i, element) {
          frag.appendChild( element );
        });

        // Append document fragment to the compare-item container
        self.$compareTool.find('.compare-items-container').append( frag );

        // Save our new compare items
        self.$compareItems = $( sortedItems );

      // Default order is saved in the state variable
      } else {
        self.$compareItems = self.compareState.$items;
        self.$compareTool.find('.compare-items-container').append( self.$compareItems );
      }

      // Make sure we can press reset (if it wasn't manually triggered)
      if ( !evt.isTrigger ) {
        self.$compareReset.removeClass('disabled');
      }

      return self;
    },

    fixCarousels : function( isInit ) {
      var self = this;

      if ( self.hasCarousels ) {
        if ( self.hasEnabledCarousels ) {
          self.destroyCarousels();
        }

        // 980+
        if ( Modernizr.mq('(min-width: 61.25em)') ) {
          self.initCarousels( isInit );
        }
      }
    },

    onResize : function( isInit ) {
      var self = this,
          windowWidth = self.$window.width(),
          windowHeight = self.$window.height(),
          hasWindowChanged = windowWidth !== self.windowWidth || windowHeight !== self.windowHeight;

      // Make sure isInit is not an event object
      isInit = isInit === true;

      // Return if the window hasn't changed sizes or the gallery is disabled
      if ( !isInit && (!self.enabled || !hasWindowChanged) ) {
        return;
      }

      self.windowWidth = windowWidth;
      self.windowHeight = windowHeight;

      // Don't change columns for detail galleries
      // Change the filters column layout
      if ( self.mode === 'detailed' ) {

        // Remove heights in case they've aready been set
        if ( Modernizr.mq('(max-width: 47.9375em)') ) {
          self.$gridProductNames.css('height', '');

        // Make all product name heights even
        } else {
          self.$gridProductNames.evenHeights();
        }

        // 768-979
        // Make filters a 2up with a span12 below
        if ( Modernizr.mq('(min-width: 48em) and (max-width: 61.1875em)') ) {
          if ( self.$filterColumns.eq(0).hasClass('span4') ) {
            self.$filterColumns
              .removeClass('span4')
              .slice(0, 2)
                .addClass('span6')
                .end()
              .last()
                .addClass('span12')
                .find('.media-list')
                  .addClass('inline');

            self.$rangeControl.rangeControl('reset');
          }

        // Reset filters to 3 columns
        } else {
          if ( self.$filterColumns.eq(0).hasClass('span6') ) {
            self.$filterColumns
              .removeClass('span6 span12')
              .addClass('span4')
              .find('.media-list')
                .removeClass('inline');

            self.$rangeControl.rangeControl('reset');
          }
        }

        // Tell infinite scroll to update where it thinks it's target it
        if ( self.hasInfiniteScroll ) {
          setTimeout(function() {
            self.$grid.infinitescroll('updateNavLocation');
          }, 25);
        }

        return;
      }


      // Make all product name heights even
      self.$gridProductNames.evenHeights();

      self.fixCarousels(isInit);

      self.sortByPriority();

      SONY.Utilities.forceWebkitRedrawHack();
    },

    getFavoriteContent : function( $jsFavorite, isActive ) {
      return isActive ?
            $jsFavorite.data('activeTitle') + '<i class="fonticon-10-sm-bold-check"></i>' :
            $jsFavorite.data('defaultTitle');
    },

    onFavorite : function( evt ) {
      var self = this,
          $jsFavorite = $(evt.delegateTarget),
          isAdding = !$jsFavorite.hasClass('active'),
          content = self.getFavoriteContent( $jsFavorite, isAdding );
      $jsFavorite.toggleClass('active');

      $('.gallery-tooltip .tooltip-inner')
        .html( content )
        .tooltip('show');

      // Stop event from bubbling to <a> tag
      evt.preventDefault();
      evt.stopPropagation();
    },

    onFiltersHide : function( evt ) {
      evt.stopPropagation(); // stop this event from bubbling up to .gallery
      // var $toggle = this.$container.find('.slide-toggle');
      this.$filterArrow.removeClass('in');
      // if ( !Modernizr.csstransforms ) {
      //   $toggle.find('.down').addClass('hide');
      //   $toggle.find('.up').removeClass('hide');
      // }
    },

    onFiltersShow : function( evt ) {
      evt.stopPropagation(); // stop this event from bubbling up to .gallery
      // var $toggle = this.$container.find('.slide-toggle');
      this.$filterArrow.addClass('in');

      // If we don't have transforms, show and hide different arrows.
      // if ( !Modernizr.csstransforms ) {
      //   $toggle.find('.down').removeClass('hide');
      //   $toggle.find('.up').addClass('hide');
      // }

    },

    onFiltersShown : function( evt ) {
      var self = this,
          didReset = self.maybeResetRange(evt);

      evt.stopPropagation(); // stop this event from bubbling up to .gallery

      if ( !didReset ) {
        self.filter();
      }

      // Scroll the window so we can see what's happening with the filtered items
      $.simplescroll({
        offset: 24, // margin-top of the gallery is 1.5em (24px)
        target: self.$container
      });
    },

    onShuffleLoading : function() {
      var $div = $('<div>', { 'class' : 'gallery-loader text-center' }),
          $img = $('<img>', { src: this.loadingGif });
      $div.append($img);
      $div.insertBefore( this.$grid );
    },

    onShuffleDone : function() {
      var self = this;
      self.$container.find('.gallery-loader').remove();

      // Fade in the gallery if it isn't already
      if ( !self.$container.hasClass('in') ) {
        setTimeout(function() {
            self.$container.addClass('in');
        }, 250);
      }
    },

    onCompareLaunch : function() {
      var self = this,

          // Clone all visible
          $currentItems = self.shuffle.$items.filter('.filtered').clone(),
          $compareItemsContainer = $('<div class="compare-items-container grab">'),
          $compareItemsWrapper = $('<div class="compare-items-wrap">'),

          // Get product count
          productCount = $currentItems.length,

          $container = $('<div class="container js-compare-wrap">'),
          $content = $('<div class="compare-container clearfix">'),
          $header = self.$compareTool.find('.modal-header'),
          $modalBody = self.$compareTool.find('.modal-body'),

          $label = self.$compareTool.find('#compare-tool-label'),
          originalLabel = $label.text(),

          $labelColumnWrap = $('<div class="span2 detail-labels-wrap hidden-phone">'),
          $labelColumn = $('<div class="detail-labels-wrapping">'),
          $labelGroup = $('<div class="detail-label-group">'),

          // Clone sort button
          $sortOpts = self.$container.find('.sort-options').clone();

      // Disable the main gallery (from executing resize events, etc.)
      self.disable();

      self.compareTitle = originalLabel + ' ' + self.$container.find('.compare-name').text();

      // Clone the product count
      self.$compareCountWrap = self.$container.find('.product-count-wrap').clone().removeClass('ib');

      // Create reset button
      self.$compareReset = $('<button/>', {
          'class' : 'btn btn-small btn-alt-special btn-reset disabled js-compare-reset',
          'text' : $header.data('resetLabel')
      });
      self.$compareReset.append('<i class="fonticon-10-circlearrow">');
      self.$compareReset.on('click', $.proxy( self.onCompareReset, self ));

      self.isFixedHeader = false;

      self.$detailLabelsWrap = $labelColumnWrap;
      self.$compareItemsWrap = $compareItemsWrapper;

      // Convert cloned gallery items to compare items
      self.$compareItems = self.getCompareItems( $currentItems );

      // Create sticky header for count
      $labelColumnWrap
        .append('<div class="span2 compare-sticky-header sticky-count">')
        .find('.compare-sticky-header')
        .append( self.$compareCountWrap.clone() );

      // Create labels column
      self.$container.find('.comparables [data-label]').each(function() {
          var $label = $(this).clone(),
              $strong = $('<strong/>');

          $strong.text( $label.attr('data-label') );
          $label.append( $strong );
          $labelGroup.append($label);
      });

      // Remove compare items on click
      self.$compareItems.find('.compare-item-remove').on('click', $.proxy( self.onCompareItemRemove, self ));

      // Set up sort events
      $sortOpts.find('.dropdown a').on('click', $.proxy( self.sortComparedItems, self ));
      $sortOpts.find('.native-dropdown').on('change', $.proxy( self.sortComparedItems, self ));

      // Set the right heading. e.g. Compare Cyber-shot®
      $label.text( self.compareTitle );


      self.isUsingOuterScroller = !self.isAndroid;
      if ( !self.isUsingOuterScroller ) {
        self.$compareTool.addClass('native-scrolling');
      }

      // Save state for reset
      self.compareState = {
          count: productCount,
          sort: self.currentSort,
          $items : self.$compareItems,
          label: originalLabel,
          snap: true
      };

      // Append count and labels
      $labelColumn.append( self.$compareCountWrap );

      // On window resize
      self.$window.on('resize.comparetool', $.debounce(250, function() {
        self.onCompareResize( $header, $sortOpts );
      }));
      self.onCompareResize( $header, $sortOpts, true );

      self.$compareReset.addClass('pull-right');
      $labelColumn.append( $labelGroup );

      // Set current sort. After saving state so we get the correct DOM order for compareItems
      self.updateSortDisplay( $sortOpts );

      $labelColumnWrap.append( $labelColumn );
      $content.append( $labelColumnWrap );
      $compareItemsContainer.append( self.$compareItems );
      $compareItemsWrapper.append( $compareItemsContainer );
      $content.append( $compareItemsWrapper );
      $container.append( $content );
      $modalBody.append( $container );

      // Could probably be deferred
      self.addCompareNav( $compareItemsWrapper );

      // Cloned images need to be updated
      iQ.update( true );

      // Save a reference to the count
      self.$compareCount = self.$compareTool.find('.product-count');
      // Set item count
      self.$compareCount.text( productCount );

      // Save refs
      self.$stickyHeaders = self.$compareTool.find('.compare-sticky-header');
      self.$compareProductNameWraps = self.$compareTool.find('.gallery-item-inner .product-name-wrap');
      self.$compareItemsContainer = self.$compareTool.find('.compare-items-container');

      // Trigger modal
      self.$compareTool
        .data('galleryId', self.id) // Set some data on the modal so we know which gallery it belongs to
        .modal({
          backdrop: false
        }); // Show the modal

    },

    onCompareShown : function() {
      var self = this;

      self.stickyTriggerPoint = self.getCompareStickyTriggerPoint();

      // Set a margin-left on the compare items wrap
      if ( !self.isFixedHeader ) {
        self.$compareItemsWrap.css('marginLeft', self.$detailLabelsWrap.width());
      }

      self
        .setCompareRowHeights()
        .setCompareDimensions();

      // Nested iscroll isn't working on android 4.1.1
      if ( self.isUsingOuterScroller ) {

        // Initialize outer scroller (vertical scrolling of the fixed position modal)
        self.outerScroller = new IScroll( self.$compareTool[0], {
          bounce: false,
          hScrollbar: false,
          vScrollbar: false,
          onBeforeScrollStart : function(e) {
            var target = e.target;
            while ( target.nodeType !== 1 ) {
              target = target.parentNode;
            }

            if ( target.tagName !== 'SELECT' && target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' ) {
              e.preventDefault();
            }

            // Add `grabbing` class
            if ( !self.isTouch && !self.$compareItemsContainer.hasClass('grabbing') ) {
              self.$compareItemsContainer.addClass('grabbing');
            }
          },
          onBeforeScrollEnd : function() {
            // Remove `grabbing` class
            if ( !self.isTouch && self.$compareItemsContainer.hasClass('grabbing') ) {
              self.$compareItemsContainer.removeClass('grabbing');
            }
          },
          onScrollMove : function() {
            self.onCompareScroll( self.stickyTriggerPoint, this );
          },
          onAnimate : function() {
            self.onCompareScroll( self.stickyTriggerPoint, this );
          },
          onAnimationEnd : function() {
            iQ.update();
            self.onCompareScroll( self.stickyTriggerPoint, this );
          }
        });

      } else {
        self.$compareTool.on('scroll', function() {
          self.onCompareScroll( self.stickyTriggerPoint );
          iQ.update();
        });
      }


      // Initialize inner scroller (for the comparable product items)
      self.innerScroller = new IScroll( self.$compareTool.find('.compare-items-wrap')[0], {
        vScroll: false,
        hScrollbar: self.isTouch,
        // snap: '.compare-item',
        snap: self.compareState.snap, // this is required for iscroll.scrollToPage
        onBeforeScrollStart : function() {

          // Add `grabbing` class
          if ( !self.isTouch && !self.$compareItemsContainer.hasClass('grabbing') ) {
            self.$compareItemsContainer.addClass('grabbing');
          }
        },
        onBeforeScrollEnd : function() {
          // Remove `grabbing` class
          if ( !self.isTouch && self.$compareItemsContainer.hasClass('grabbing') ) {
            self.$compareItemsContainer.removeClass('grabbing');
          }
        },
        onScrollMove : function() {
          self.onCompareScroll( 'inner', this );
        },
        onAnimate : function() {
          self.onCompareScroll( 'inner', this );
        },
        onAnimationEnd : function() {
          iQ.update();
          self.onCompareScroll( 'inner', this );
          self.afterCompareScrolled( this );
        }
      });

      // Set the height, jQuery object, and text of the takeover sticky nav
      self.setTakeoverStickyHeader( self.compareTitle );

      // Position sticky headers
      self.setStickyHeaderPos();

      // Fade in the labels to hide the fact that it took so long to compute heights.
      self.$compareTool.find('.detail-labels-wrapping').addClass('complete');

      // These can be deferred
      setTimeout(function() {
        iQ.update();

        // Hide the previous nav paddle because we're on the first page
        self.afterCompareScrolled( self.innerScroller );

        // Bind events to the paddles
        self.addCompareNavEvents();

      }, 100);

      return self;
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
      self.$takeoverStickyHeader.removeClass('open').removeAttr('style');

      // Destroy iscrolls
      if ( self.isUsingOuterScroller ) {
        self.outerScroller.destroy();
      } else {
        self.$compareTool.off('scroll');
        self.$compareTool.removeClass('native-scrolling');
      }
      self.innerScroller.destroy();

      // Remove listeners for nav button clicks
      self.removeCompareNavEvents();

      // Empty out html
      // Remove scroll event
      self.$compareTool
        .find('.js-compare-wrap')
        .remove()
        .end()
        .find('.modal-subheader')
        .remove()
        .end()
        .find('#compare-tool-label')
        .text( self.compareState.label )
        .end()
        .off('.comparetool');

      // Set count to zero
      self.$compareCount.text(0);

      self.$compareReset.remove();
      self.$compareReset = null;
      self.$compareItems = null;
      self.$compareItemsContainer = null;
      self.$compareItemsWrap = null;
      self.$compareNav = null;
      self.$detailLabelsWrap = null;
      self.$takeoverStickyHeader = null;

      // Set state to null
      self.compareState = null;
      self.isFixedHeader = null;
      self.compareTitle = null;

      // Remove resize event
      self.$window.off('.comparetool');

      self.enable();

      return self;
    },

    onCompareReset : function() {
      var self = this,
          state = self.compareState;

      if ( self.$compareReset.hasClass('disabled') || self.$compareTool.data('galleryId') !== self.id ) {
        return;
      }

      self.$compareCount.text( state.count );
      state.$items
        .find('.compare-item-remove')
        .parent()
        .addBack()
        .removeClass('hide faded no-width');

      // Disable reset button
      self.$compareReset.addClass('disabled').removeClass('active');

      // Reset sort
      self.updateSortDisplay( self.$compareTool );

      // Set container width
      self.setCompareWidth();

      // Reset iscroll
      self.innerScroller.refresh();

      self.afterCompareScrolled( self.innerScroller );

      return self;
    },

    onCompareItemRemove : function( evt ) {
      var self = this,
          remaining,
          $compareItem = $(evt.target).closest('.compare-item');

      function afterHidden() {
        // console.log('Finished', $compareItem.index(), ':', evt.originalEvent.propertyName);
        // Hide the column
        $compareItem.addClass('hide');

        // Make sure we can press reset
        self.$compareReset.removeClass('disabled').addClass('active');

        // Get remaining
        remaining = self.$compareItems.not('.hide').length;

        // Set remaining text
        self.$compareCount.text( remaining );

        // Hide close button if there are only 2 left
        if ( remaining < 3 ) {
          self.$compareTool.find('.compare-item-remove').addClass('hide');
        }

        self.setCompareWidth();
        self.innerScroller.refresh();
        self.afterCompareScrolled( self.innerScroller );
      }

      function noWidth() {
        // console.log('Finished', $compareItem.index(), ':', evt.originalEvent.propertyName );
        $compareItem
          .one( $.support.transition.end, afterHidden )
          .addClass('no-width');
      }

      if ( Modernizr.csstransitions ) {
        // console.log('adding opacity:0');
        $compareItem
          .one( $.support.transition.end, noWidth )
          .addClass('faded');
      } else {
        afterHidden();
      }

      return self;
    },

    onCompareResize : function( $header, $sortOpts, isFirst ) {
      var self = this,
          $subheader,
          $resetBtn,
          $sorter,
          snap;

      // Phone = sticky header
      if ( Modernizr.mq('(max-width: 47.9375em)') ) {

        // Setup sticky header
        if ( isFirst || !self.isFixedHeader ) {
          self.isFixedHeader = true;

          $subheader = $('<div class="modal-subheader clearfix">');
          self.$compareCountWrap.addClass('hidden');

          // If this isn't the first call, the elements are already on the page and need to be detached
          $resetBtn = isFirst ? self.$compareReset : self.$compareReset.detach();
          $sorter = isFirst ? $sortOpts : $sortOpts.detach();

          // Put the dropdown menu on the left
          if ( !self.isTouch ) {
            $sorter.find('.dropdown-menu').removeClass('pull-right');
          }

          $subheader.append( $resetBtn, $sorter );

          // Insert subhead in the modal header
          $header.append( $subheader );

          self.$compareItemsWrap.css('marginLeft', '');

          snap = false;

          // Let the scroller flow freely on mobile
          if ( self.innerScroller ) {
            self.innerScroller.options.snap = snap;
          }
        }

      // Larger than phone
      } else {

        // Set a margin-left on the compare items wrap
        self.$compareItemsWrap.css('marginLeft', self.$detailLabelsWrap.width());

        if ( isFirst || self.isFixedHeader ) {
          self.isFixedHeader = false;

          self.$compareCountWrap.removeClass('hidden');

          // Append sort dropdown
          // If this isn't the first call, the elements are already on the page and need to be detached
          $resetBtn = isFirst ? self.$compareReset : self.$compareReset.detach();
          $sorter = isFirst ? $sortOpts : $sortOpts.detach();

          // Make dropdown menu on the right
          if ( !self.isTouch ) {
            $sorter.find('.dropdown-menu').addClass('pull-right');
          }

          $header.append( $resetBtn, $sorter );

          self.$compareTool.find('.modal-subheader').remove();


          snap = true;

          // Snap to pages on 'desktop'
          if ( self.innerScroller ) {
            self.innerScroller.options.snap = snap;
          }
        }
      }

      // This is where you get off, first guy
      if ( isFirst ) {
        self.compareState.snap = snap;
        return self;
      }

      self.stickyTriggerPoint = self.getCompareStickyTriggerPoint();

      self
        .setCompareRowHeights()
        .setCompareDimensions()
        .setStickyHeaderPos();


      self.innerScroller.refresh();

      return self;
    },

    onCompareScroll : function( offsetTop, iscroll ) {
      var self = this,
          scrollTop = self.isUsingOuterScroller ? iscroll.y * -1 : self.$compareTool.scrollTop();

      // Determine if this is the inner scroller
      if ( offsetTop === 'inner' ) {
        if ( iscroll.x < -3 && !self.$detailLabelsWrap.hasClass('overflowing') ) {
          self.$detailLabelsWrap.addClass('overflowing');
        } else if ( iscroll.x >= -3 && self.$detailLabelsWrap.hasClass('overflowing') ) {
          self.$detailLabelsWrap.removeClass('overflowing');
        }
        return;
      }

      if ( scrollTop >= offsetTop ) {
        if ( !self.$stickyHeaders.hasClass('open') ) {
          self.$compareNav.addClass('sticky-nav-open');
          self.$takeoverStickyHeader.addClass('open');
          self.$stickyHeaders.addClass('open');
        }
        self.setStickyHeaderPos( scrollTop );

      } else {
        if ( self.$stickyHeaders.hasClass('open') ) {
          self.$compareNav.removeClass('sticky-nav-open');
          self.$takeoverStickyHeader.removeClass('open');
          self.$stickyHeaders.removeClass('open');
        }
      }
    },

    getCompareStickyTriggerPoint : function() {
      var self = this,
          offsetTop = 0,
          extra = 0;

      offsetTop = self.$compareItems.not('.hide').offset().top;

      // see http://bugs.jquery.com/ticket/8362
      if ( offsetTop < 0 ) {
        var matrix = SONY.Utilities.parseMatrix( self.$compareTool.find('.modal-inner').css('transform') );
        offsetTop = -matrix.translateY + offsetTop;
      }

      extra = parseInt( self.$compareTool.find('.compare-item .product-img').last().css('height'), 10 );

      return offsetTop + extra;
    },

    getCompareItems : function( $items ) {
      var $newItems = $();

      // Build / manipulate compare items from the gallery items
      $items.each(function() {
        var $item = $(this),
            $swatches,
            $div = $('<div/>'),
            $stickyHeader;

        // Create remove button, show detail group, remove label, remove product-meta,
        // wrap name and model in a container (to set the height on), create fixed header clones
        $item
          .removeClass()
          .addClass('span4 compare-item')
          .removeAttr('style')
          .append('<span class="box-close box-close-small compare-item-remove"><i class="fonticon-10-x"></i></span>')
          .find('.detail-group')
            .removeClass('hidden')
            .end()
          .find('.label, .product-meta, .js-favorite')
            .remove()
            .end()
          .find('.product-name-wrap')
            .css('height', '')
            .end()
          .prepend('<div class="span4 compare-sticky-header">')
          .find('.compare-sticky-header')
            .append('<div class="media">');

        // Remove and reattach the swatches to after the price
        $swatches = $item.find('.product-img .color-swatches').detach();
        $item.find('.product-price').after($swatches);

        $stickyHeader = $item.find('.compare-sticky-header');
        // Needed to detach swatches before cloning!

        // Compare X
        $item
          .find('.compare-item-remove')
          .clone(true) // true for compare item remove's functionality
          .appendTo( $stickyHeader );

        // Product image to media object
        $item
          .find('.product-img .js-product-img-main')
          .clone()
          .addClass('media-object')
          .appendTo( $stickyHeader.find('.media') )
          .wrap('<div class="pull-left">');

        // Product name wrap to media object
        $item
          .find('.product-name-wrap')
          .clone()
          .addClass('media-body')
          .appendTo( $stickyHeader.find('.media') );

        // Swap .p2 for .p3
        $stickyHeader
          .find('.product-name')
          .addClass('p3')
          .removeClass('p2');


        // Create a new div with the same attributes as the anchor tag
        // We no longer want the entire thing to be clickable
        $div.attr({
            'class' : $item.attr('class'),
            'data-filter-set' : $item.attr('data-filter-set')
        });

        $div.append( $item.children().detach() );
        $newItems = $newItems.add( $div );
      });

      return $newItems;
    },

    addCompareNav : function( $parent ) {
      var $navContainer = $('<nav class="compare-nav">'),
          $prevPaddle = $('<button class="nav-paddle nav-prev"><i class="icon-ui2-chevron-18-white-left"></i></button>'),
          $nextPaddle = $('<button class="nav-paddle nav-next"><i class="icon-ui2-chevron-18-white-right"></i></button>');

      $navContainer.append( $prevPaddle, $nextPaddle );
      $parent.append( $navContainer );

      this.$compareNav = $navContainer;
    },

    addCompareNavEvents : function() {
      var self = this,
          iscroll = self.innerScroller,
          $prev = self.$compareTool.find('.nav-prev'),
          $next = self.$compareTool.find('.nav-next');

      $prev.on('click', function() {
        iscroll.scrollToPage('prev');
      });

      $next.on('click', function() {
        iscroll.scrollToPage('next');
      });
    },

    afterCompareScrolled : function( iscroll ) {
      var self = this,
          $prev = self.$compareTool.find('.nav-prev'),
          $next = self.$compareTool.find('.nav-next');

      // Hide show prev button depending on where we are
      if ( iscroll.currPageX === 0 ) {
        $prev.addClass('hide');
      } else {
        $prev.removeClass('hide');
      }

      // Hide show next button depending on where we are
      if ( iscroll.currPageX === iscroll.pagesX.length - 1 ) {
        $next.addClass('hide');
      } else {
        $next.removeClass('hide');
      }
    },

    removeCompareNavEvents : function() {
      this.$compareTool.find('.compare-nav').children().off('click');
    },

    setTakeoverStickyHeader : function( title ) {
      var self = this;
      self.$takeoverStickyHeader = self.$compareTool.find('.takeover-sticky-header');
      self.$takeoverStickyHeader.find('.sticky-nav-title').text( title );
      self.takeoverHeaderHeight = self.$takeoverStickyHeader.outerHeight();
    },

    getY : function( y ) {
      return [ this.valStart, y, this.valEnd, this.translateZ ].join('');
    },

    // Elements here cannot use `fixed` positioning because of a webkit bug.
    // Fixed positions don't work inside an element which has `transform` on it.
    // https://code.google.com/p/chromium/issues/detail?id=20574
    setStickyHeaderPos : function( scrollTop ) {
      var self = this,
          offset = self.$compareItems.not('.hide').first().offset().top * -1,
          compareOffset = offset + self.takeoverHeaderHeight,
          st = scrollTop || scrollTop === 0 ? scrollTop :
            self.isUsingOuterScroller ?
              self.outerScroller.y * -1 :
              self.$compareTool.scrollTop(),
          takeoverValue = self.getY( st ),
          compareValue = self.getY( compareOffset );

      // Position the sticky headers. These are relative to .compare-item
      self.$stickyHeaders.css( self.prop, compareValue );

      // Position takeover header. This is relative to .modal-inner,
      // so we can take the outer scroller's y offset
      self.$takeoverStickyHeader.css( self.prop, takeoverValue );


      return self;
    },

    setColumnMode : function() {
      var self = this;

      if ( self.mode !== 'detailed' ) {
        // Make this a 5 column grid. Added to parent because grid must be a descendant of grid5
        self.$grid.addClass('slimgrid5');


        self.shuffleColumns = function( containerWidth ) {
          var column;

          // Large desktop ( 6 columns )
          if ( Modernizr.mq('(min-width: 75em)') ) {
            column = SONY.Settings.COLUMN_WIDTH_SLIM * containerWidth;

          // Landscape tablet + desktop ( 5 columns )
          } else if ( !Modernizr.mediaqueries || Modernizr.mq('(min-width: 61.25em)') ) {
            column = SONY.Settings.COLUMN_WIDTH_SLIM_5 * containerWidth;

          // Portrait Tablet ( 4 columns )
          // } else if ( Modernizr.mq('(min-width: 48em)') ) {
          //   column = SONY.Settings.COLUMN_WIDTH_768 * containerWidth;

          // Between Portrait tablet and phone ( 3 columns )
          // 568px+
          } else if ( Modernizr.mq('(min-width: 35.5em)') ) {
            column = SONY.Settings.COLUMN_WIDTH_SLIM * containerWidth;

          // Phone ( 2 columns )
          // < 568px
          } else {
            column = SONY.Settings.COLUMN_WIDTH_320 * containerWidth;
          }


          return column;
        };

        self.shuffleGutters = function( containerWidth ) {
          var gutter,
              numColumns = 0;

          // Large desktop ( 6 columns )
          if ( Modernizr.mq('(min-width: 75em)') ) {
            gutter = SONY.Settings.GUTTER_WIDTH_SLIM * containerWidth;
            numColumns = 6;

          // Landscape tablet + desktop ( 5 columns )
          } else if ( !Modernizr.mediaqueries || Modernizr.mq('(min-width: 61.25em)') ) {
            gutter = SONY.Settings.GUTTER_WIDTH_SLIM_5 * containerWidth;
            numColumns = 5;

          // // Portrait Tablet ( 4 columns ) - masonry
          } else if ( Modernizr.mq('(min-width: 48em)') ) {
            numColumns = 4;
            gutter = SONY.Settings.GUTTER_WIDTH_SLIM * containerWidth;

          // Between Portrait tablet and phone ( 3 columns )
          } else if ( Modernizr.mq('(min-width: 35.5em)') ) {
            gutter = SONY.Settings.GUTTER_WIDTH_SLIM * containerWidth;
            numColumns = 3;


          // Phone ( 2 columns )
          } else {
            gutter = SONY.Settings.GUTTER_WIDTH_320 * containerWidth; // 2% of container width
            numColumns = 2;
          }

          self.setColumns(numColumns);

          return gutter;
        };


      // Use the default 12 column slim grid.
      } else {
        self.shuffleColumns = SONY.Utilities.masonryColumns;
        self.shuffleGutters = SONY.Utilities.masonryGutters;
      }

      return self;
    },

    setColumns : function( numColumns ) {
      var self = this,
          allSpans = 'span1 span2 span3 span4 span6 m-span3',
          shuffleDash = 'shuffle-',
          grid = 'slimgrid',
          grid5 = grid+5,
          gridClasses = [ shuffleDash+2, shuffleDash+3, shuffleDash+4, shuffleDash+5, shuffleDash+6, grid, grid5 ].join(' '),
          itemSelector = '.gallery-item',
          span = 'span',
          mspan = 'm-' + span,
          large = '.large',
          promo = '.promo',
          normal = '.normal';

      // Large desktop ( 6 columns )
      if ( numColumns === 6 ) {
        if ( !self.$grid.hasClass(shuffleDash+6) ) {

          // add .slimgrid5
          self.$grid
            .removeClass(gridClasses)
            .addClass(shuffleDash+6 + ' ' + grid)
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
            .filter(normal) // Select tiles not large nor promo
              .addClass(span+2); // Make them 2/12 width
        }

      // Landscape tablet + desktop ( 5 columns )
      } else if ( numColumns === 5 ) {
        if ( !self.$grid.hasClass(shuffleDash+5) ) {

          // add .slimgrid5
          self.$grid
            .removeClass(gridClasses)
            .addClass(shuffleDash+5 + ' ' + grid5);


          self.$grid.children(itemSelector)
            .removeClass(allSpans) // Remove current grid span
            .filter(large) // Select large tiles
              .addClass(span+3) // Make them 3/5 width
              .end() // Go back to all items
            .filter(promo) // Select promo tiles
              .addClass(span+2) // Make them 2/5 width
              .end() // Go back to all items
            .filter(normal) // Select tiles not large nor promo
              .addClass(span+1); // Make them 1/5 width
        }

      // Portrait Tablet ( 4 columns ) - masonry
      } else if ( numColumns === 4 ) {
        if ( !self.$grid.hasClass(shuffleDash+4) ) {

          // Remove .slimgrid5
          self.$grid
            .removeClass(gridClasses)
            .addClass(shuffleDash+4 + ' ' + grid);


          self.$grid.children(itemSelector)
            .removeClass(allSpans) // Remove current grid span
            .filter(promo) // Select promo tiles
              .addClass(span+6) // Make them half width
              .end() // Go back to all items
            .filter(large + ',' + normal) // Select tiles not promo
              .addClass(span+3); // Make them quarter width
        }

      // Between Portrait tablet and phone ( 3 columns )
      } else if ( numColumns === 3 ) {
        if ( !self.$grid.hasClass(shuffleDash+3) ) {

          // Remove .slimgrid5, add .grid-small
          self.$grid
            .removeClass(gridClasses)
            .addClass(shuffleDash+3 + ' ' + grid);

          // Remove current grid span
          self.$grid.children(itemSelector)
            .removeClass(allSpans)
            .addClass(span+4);
        }


      // Phone ( 2 columns )
      } else if ( numColumns === 2 ) {
        if ( !self.$grid.parent().hasClass(shuffleDash+2) ) {

          // remove .slimgrid5
          self.$grid
            .removeClass(gridClasses)
            .addClass(shuffleDash+2 + ' ' + grid);

          // Remove current grid span
          self.$grid.children(itemSelector)
            .removeClass(allSpans)
            .addClass(mspan+3);
        }
      }
      return self;
    },

    setCompareDimensions : function() {
      return this
        .setCompareHeight()
        .setCompareWidth();
    },

    setCompareHeight : function() {
      var self = this,
          windowHeight = SONY.Settings.isIPhone || SONY.Settings.isAndroid ? window.innerHeight : self.$window.height(); // document.documentElement.clientHeight also wrong

      console.log('window height', windowHeight);

      self.$compareTool.find('.compare-container').height( self.$compareItems.first().height() );
      self.$compareTool.height( windowHeight );

      return self;
    },

    setCompareWidth : function() {
      var self = this,
          contentWidth = 0;

      // Count it
      self.$compareItems.not('.hide').each(function() {
        contentWidth += $(this).outerWidth(true);
      });

      // Set it
      self.$compareTool.find('.compare-items-container').width( contentWidth );

      return self;
    },

    setCompareRowHeights : function() {
      var self = this,
          $detailGroup = self.$compareItems.not('.hide').find('.detail-group').first(),
          offset = 0;

      self.$stickyHeaders.evenHeights();

      // Set the height of the product name + model because the text can wrap and make it taller
      self.$compareProductNameWraps.evenHeights();

      // Set detail rows to even heights
      self.$compareTool.find('.detail-label').each(function(i) {
        var $detailLabel = $(this),
            $detail = self.$compareItems.find('.detail:nth-child(' + (i + 1) + ')');

        // Find all detail lines that have this "name"
        $detail.add($detailLabel).evenHeights();
      });

      // Set the top offset for the labels
      offset = $detailGroup.position().top;
      offset += parseFloat( $detailGroup.css('marginTop') );
      self.$compareTool.find('.detail-label-group').css('top', offset);

      // Refresh outer iScroll
      if ( self.outerScroller ) {
        self.outerScroller.refresh();
      }

      return self;
    }

  };

  // Plugin definition
  $.fn.gallery = function( options ) {
    var args = Array.prototype.slice.call( arguments, 1 );
    return this.each(function() {
      var self = $(this),
          gallery = self.data('gallery');

      // If we don't have a stored gallery, make a new one and save it
      if ( !gallery ) {
        gallery = new Gallery( self, options );
        self.data( 'gallery', gallery );
      }

      if ( typeof options === 'string' ) {
        gallery[ options ].apply( gallery, args );
      }
    });
  };


  // Overrideable options
  $.fn.gallery.options = {
    mode: 'editorial',
    shuffleSpeed: SONY.Settings.shuffleSpeed,
    shuffleEasing: SONY.Settings.shuffleEasing
  };

  // Not overrideable
  $.fn.gallery.settings = {
    enabled: true,
    MIN_PRICE: undefined,
    MAX_PRICE: undefined,
    price: {},
    isInitialized: false,
    hasEnabledCarousels: false,
    sorted: false,
    isTouch: SONY.Settings.hasTouchEvents,
    loadingGif: 'img/global/loader.gif',
    prop: Modernizr.csstransforms ? 'transform' : 'top',
    valStart : Modernizr.csstransforms ? 'translate(0,' : '',
    valEnd : Modernizr.csstransforms ? 'px)' : 'px',
    translateZ : Modernizr.csstransforms3d ? ' translateZ(0)' : ''
  };


  // Event triggered when this tab is about to be shown
  SONY.onGalleryTabShow = function( evt ) {
    var $prevPane = evt.prevPane ? evt.prevPane :
          evt.originalEvent.prevPane ? evt.originalEvent.prevPane :
          false;


    if ( $prevPane ) {
      // Loop through each gallery in the tab (there could be more than 1)
      // Disable the gallery (which disableds shuffle and pauses infinite scrolling) for galleries being hidden
      $prevPane.find('.gallery').each(function() {
        var gallery = $(this).data('gallery');

        // If there are active filters, remove them.
        if ( gallery.hasActiveFilters ) {
          gallery.removeActiveFilters();
        }

        gallery.disable();
      });
    }

  };

  // Event triggered when tab pane is finished being shown
  SONY.onGalleryTabShown = function( evt ) {

    // Only continue if this is a tab shown event.
    if ( !evt.pane ) {
      return;
    }

    // Enable all galleries in this tab
    evt.pane.find('.gallery').gallery('enable');

    SONY.Utilities.forceWebkitRedrawHack();

    var gallery = evt.pane.find('.gallery').data('gallery');

    if ( gallery ) {
      gallery.fixCarousels(false);
    }

  };

})(jQuery, Modernizr, window);


SONY.on('global:ready', function() {

  if ( $('.gallery').length > 0 ) {
    // console.profile();

    // Initialize galleries
    $('.gallery').each(function() {
      var $this = $(this);

      $this.gallery( $this.data() );
    });

    // Register for tab show(n) events here because not all tabs are galleries
    $('[data-tab]')
      .on('show', SONY.onGalleryTabShow )
      .on('shown', SONY.onGalleryTabShown );

    // Initialize sticky tabs
    $('.tab-strip').stickyTabs();

    // Hide other tabs
    $('.tab-pane:not(.active)').addClass('off-screen');

    // Should be called after everything is initialized
    $(window).trigger('hashchange');

    // Disable hidden galleries.
    // Using a timeout here because the tab shown event is triggered at the end of the transition,
    // which depends on how long the page takes to load (and if the browser has transitions)
    setTimeout(function() {
      $('.tab-pane:not(.active) .gallery').gallery('disable');
      // console.profileEnd();
    }, 500);
  }
});
