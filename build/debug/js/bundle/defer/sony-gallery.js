/*global jQuery, Modernizr, Exports, IScroll*/

// ------------ Sony Gallery ------------
// Module: Gallery
// Version: 1.0
// Modified: 01/01/2013
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

    self.$container.addClass('gallery-' + self.mode);

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
    self.initTooltips();

    $(window).on('resize.gallery', $.proxy( self.onResize, self ) );
    self.onResize();

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
          'class' : 'label label-close',
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
      // self.currentSort = self.$sortBtns.closest('.dropdown-menu').find('.active a').data('value');
      self.currentSort = 0;



      // Slide toggle. Reset range control if it was hidden on initialization
      self.$container.find('.collapse')
        .on('shown', $.proxy( self.onFiltersShown, self ))
        .on('show', $.proxy( self.onFiltersShow, self ))
        .on('hide', $.proxy( self.onFiltersHide, self ));

      // Set up sorting ---- dropdowm
      self.$sortBtns.on('click',  $.proxy( self.sort, self ));

      // Set up sorting ---- select menu
      self.$sortSelect.on('change', $.proxy( self.sort, self ));
    },

    initInfscr : function() {
      var self = this;

      self.$grid.infinitescroll({
        local: true,
        debug: true,
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
        self.$grid.shuffle( 'appended', $( newElements ).addClass('via-ajax') );
        // Show new product count
        self.$productCount.text( self.$grid.data('shuffle').visibleItems );
        // Update iQ images
        window.iQ.update(true);
      });

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

    initTooltips : function() {
      var self = this;

      // Favorite Heart
      self.$favorites.on('click', $.proxy( self.onFavorite, self ));

      self.$container.find('.js-favorite').tooltip({
        template: '<div class="tooltip gallery-tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
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

    onResize : function() {
      var self = this;

      // Make all product name heights even
      self.setNameHeights( self.$grid );

      // Don't change columns for detail galleries
      if ( self.mode === 'detailed' ) {
        return;
      }

      self.sortByPriority();
    },

    onFavorite : function( evt ) {
      $(evt.delegateTarget).toggleClass('active');

      // Stop event from bubbling to <a> tag
      evt.preventDefault();
      evt.stopPropagation();
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
      var $toggle = this.$container.find('.slide-toggle');
      this.$filterArrow.removeClass('in');
      $toggle.find('.up').addClass('hide');
      $toggle.find('.down').removeClass('hide');
    },

    onFiltersShow : function( evt ) {
      evt.stopPropagation(); // stop this event from bubbling up to .gallery
      var $toggle = this.$container.find('.slide-toggle');
      this.$filterArrow.addClass('in');
      $toggle.find('.up').removeClass('hide');
      $toggle.find('.down').addClass('hide');

    },

    onFiltersShown : function( evt ) {
      evt.stopPropagation(); // stop this event from bubbling up to .gallery
      var didReset = this.maybeResetRange(evt);
      if ( !didReset ) {
        this.filter();
      }
    },

    onShuffleLoading : function() {
      var $div = $('<div>', { 'class' : 'gallery-loader text-center' }),
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
          $compareItemsContainer = $('<div class="compare-items-container">'),
          $compareItemsWrapper = $('<div class="compare-items-wrap">'),

          // contentWidth = 0,
          // Get product count
          productCount = $currentItems.length,

          $container = $('<div class="container js-compare-wrap">'),
          $content = $('<div class="compare-container clearfix">'),
          $header = self.$compareTool.find('.modal-header'),
          $modalBody = self.$compareTool.find('.modal-body'),

          $label = self.$compareTool.find('#compare-tool-label'),
          originalLabel = $label.text(),
          newLabel = originalLabel + ' ' + self.$container.find('.compare-name').text(),

          $labelColumnWrap = $('<div class="span2 detail-labels-wrap hidden-phone">'),
          $labelColumn = $('<div class="detail-labels-wrapping">'),
          $labelGroup = $('<div class="detail-label-group">'),

          // Clone sort button
          $sortOpts = self.$container.find('.sort-options').clone();

      // Clone the product count
      self.$compareCountWrap = self.$container.find('.product-count-wrap').clone().removeClass('ib');

      // Create reset button
      self.$compareReset = $('<button/>', {
          'class' : 'btn btn-small disabled js-compare-reset',
          'text' : $header.data('resetLabel')
      });
      self.$compareReset.on('click', $.proxy( self.onCompareReset, self ));

      self.isFixedHeader = false;

      self.$detailLabelsWrap = $labelColumnWrap;

      // Convert cloned gallery items to compare items
      self.$compareItems = self.getCompareItems( $currentItems );

      // Create sticky header for count
      $labelColumnWrap
        .append('<div class="span2 compare-sticky-header sticky-count">')
        .find('.compare-sticky-header')
        .append( self.$compareCountWrap.clone() );

      // Create labels column
      self.$container.find('.comparables [data-label]').each(function() {
          var $label = $(this).clone();
          $label.text( $label.attr('data-label') );
          $labelGroup.append($label);
      });

      // Remove compare items on click
      self.$compareItems.find('.compare-item-remove').on('click', $.proxy( self.onCompareItemRemove, self ));

      // Set up sort events
      $sortOpts.find('.dropdown a').on('click', $.proxy( self.sortComparedItems, self ));
      $sortOpts.find('.native-dropdown').on('change', $.proxy( self.sortComparedItems, self ));

      // Set the right heading. e.g. Compare Cyber-shot®
      $label.text( newLabel );

      // Append the count, reset, and sort in the right spots
      // Phone = sticky header
      if ( Modernizr.mq('(max-width: 47.9375em)') ) {
        console.log('fixing header');
        self.isFixedHeader = true;

        var $subheader = $('<div class="modal-subheader container">');
        $subheader.append( self.$compareCountWrap, self.$compareReset, $sortOpts );

        // Insert subhead in the modal-body
        $modalBody.prepend( $subheader );

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

      if ( Modernizr.mq('(max-width: 29.9375em)') ) {
        self.$compareReset.addClass('btn-block').removeClass('pull-left');
        self.$compareTool.find('.sort-options').css({
          'display': 'block',
          'float': 'none',
          'marginTop' : '0.5em'
        });
      } else {
        self.$compareReset.removeClass('btn-block').addClass('pull-left');
        self.$compareTool.find('.sort-options').css({
          'display': '',
          'float': '',
          'marginTop' : ''
        });
      }


      // On window resize
      $(window).on('resize.comparetool', $.throttle(250, function() {
        self.onCompareResize( $header, $sortOpts, $labelColumn );
      }));

      // Save state for reset
      self.compareState = {
          count: productCount,
          sort: self.currentSort,
          $items : self.$compareItems,
          label: originalLabel
      };

      // Set current sort. After saving state so we get the correct DOM order for compareItems
      self.updateSortDisplay( $sortOpts );

      $labelColumnWrap.append( $labelColumn );
      $content.append( $labelColumnWrap );
      $compareItemsContainer.append( self.$compareItems );
      $compareItemsWrapper.append( $compareItemsContainer );
      $content.append( $compareItemsWrapper );
      $container.append( $content );
      $modalBody.append( $container );

      // Trigger modal
      self.$compareTool
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

      self.$stickyHeaders = self.$compareTool.find('.compare-sticky-header');

    },

    onCompareShown : function() {
      var self = this,
          offsetTop = 0,
          extra = 0;

      offsetTop = self.$compareItems.first().offset().top;
      extra = parseInt( self.$compareTool.find('.compare-item .product-img').last().css('height'), 10 );
      offsetTop += extra;

      self
        .setCompareRowHeights( true )
        .setCompareHeight();

      self.outerScroller = new IScroll( self.$compareTool[0], {
        onBeforeScrollStart : function(e) {
          var target = e.target;
          while ( target.nodeType !== 1 ) {
            target = target.parentNode;
          }

          if ( target.tagName !== 'SELECT' && target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' ) {
            e.preventDefault();
          }
        },
        onScrollMove : function() {
          self.onCompareScroll( offsetTop, this );
        },
        onAnimate : function() {
          self.onCompareScroll( offsetTop, this );
        },
        onAnimationEnd : function() {
          self.onCompareScroll( offsetTop, this );
        }
      });

      // Don't let this scroll vertically
      self.innerScroller = new IScroll( self.$compareTool.find('.compare-items-wrap')[0], {
        vScroll: false,
        onScrollMove : function() {
          self.onCompareScroll( 'inner', this );
        },
        onAnimate : function() {
          self.onCompareScroll( 'inner', this );
        },
        onAnimationEnd : function() {
          self.onCompareScroll( 'inner', this );
        }
      });

      // Position sticky headers
      self.setStickyHeaderPos();

      // Fade in the labels to hide the fact that it took so long to compute heights.
      self.$compareTool.find('.detail-labels-wrapping').addClass('complete');

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

      // Destroy iscrolls
      self.outerScroller.destroy();
      self.innerScroller.destroy();


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
      self.$detailLabelsWrap = null;

      // Set state to null
      self.compareState = null;
      self.isFixedHeader = null;


      // Remove resize event
      $(window).off('.comparetool');

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
        .removeClass('hide');

      // Disable reset button
      self.$compareReset.addClass('disabled');

      // Reset sort
      self.updateSortDisplay( self.$compareTool );

      // Set container width
      self.setCompareWidth();

      // Reset iscroll
      self.innerScroller.refresh();

      return self;
    },

    onCompareItemRemove : function( evt ) {
      var self = this,
          remaining;

      // Hidet the column
      $(evt.target).closest('.compare-item').addClass('hide');

      // Make sure we can press reset
      self.$compareReset.removeClass('disabled');

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

      return self;
    },

    onCompareResize : function( $header, $sortOpts, $labelColumn ) {
      var self = this;

      // Phone = sticky header
      if ( Modernizr.mq('(max-width: 47.9375em)') ) {

        // Setup sticky header
        if ( !self.isFixedHeader ) {
          self.isFixedHeader = true;
          var $subheader = $('<div class="modal-subheader container">');
          $subheader.append( self.$compareCountWrap.detach(), self.$compareReset.detach(), $sortOpts.detach() );

          // Insert subhead in the modal body
          self.$compareTool.find('.modal-body').prepend( $subheader );

          // Put the reset button the left
          self.$compareReset.removeClass('pull-right').addClass('pull-left');
        }

      // Larger than phone
      } else {

        if ( self.isFixedHeader ) {
          self.isFixedHeader = false;
          // Append sort dropdown
          $header.append( self.$compareReset.detach(), $sortOpts.detach() );

          // Append count and labels
          $labelColumn.prepend( self.$compareCountWrap.detach() );

          self.$compareTool.find('.modal-subheader').remove();

          self.$compareReset.removeClass('pull-left').addClass('pull-right');
        }
      }

      if ( Modernizr.mq('(max-width: 29.9375em)') ) {
        self.$compareReset.addClass('btn-block').removeClass('pull-left');
        self.$compareTool.find('.sort-options').css({
          'display': 'block',
          'float': 'none',
          'marginTop' : '0.5em'
        });
      } else {
        self.$compareReset.removeClass('btn-block').addClass('pull-left');
        self.$compareTool.find('.sort-options').css({
          'display': '',
          'float': '',
          'marginTop' : ''
        });
      }

      self.$compareTool
        .find('.detail')
        .add(self.$compareTool.find('.product-name-wrap'))
        .css('height', '');

      self
        .setCompareRowHeights()
        .setCompareHeight()
        .setStickyHeaderPos();
    },

    onCompareScroll : function( offsetTop, iscroll ) {
      var self = this,
          scrollTop = iscroll.y * -1;

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
          self.$stickyHeaders.addClass('open');
        }
        self.setStickyHeaderPos();

      } else {
        if ( self.$stickyHeaders.hasClass('open') ) {
          self.$stickyHeaders.removeClass('open');
        }
      }
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
          .append('<span class="box-close box-close-small compare-item-remove"><i class="icon-ui-x-tiny"></i></span>')
          .find('.detail-group')
          .removeClass('hidden')
          .end()
          .find('.label')
          .remove()
          .end()
          .find('.product-meta')
          .remove()
          .end()
          .prepend('<div class="span4 compare-sticky-header">')
          .find('.compare-sticky-header')
          .append('<div class="media">');

        // Remove and reattach the swatches to after the price
        $swatches = $item.find('.product-img .color-swatches').detach();
        $item.find('.product-price').after($swatches);

        $stickyHeader = $item.find('.compare-sticky-header');
        // Needed to detach swatches before cloning!
        $item
          .find('.compare-item-remove')
          .clone(true) // true for compare item remove's functionality
          .appendTo( $stickyHeader );
        $item
          .find('.product-img .js-product-img-main')
          .clone()
          .addClass('media-object')
          .appendTo( $stickyHeader.find('.media') )
          .wrap('<div class="pull-left">');
        $item
          .find('.product-name-wrap')
          .clone()
          .addClass('media-body')
          .appendTo( $stickyHeader.find('.media') );

        // Remove class that makes product name smaller (after it has been cloned)
        $item
          .find('.product-content .product-name')
          .removeClass('p3');


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

    setStickyHeaderPos : function() {
      var self = this,
          translateZ = Modernizr.csstransforms3d ? ' translateZ(0)' : '';

      // IE9 error: unable to get value of property 'each': object is null or undefined
      self.$stickyHeaders.each(function(i, el) {
        var $el = $(el),
            offsetTop = $el.parent().offset().top * -1;

        if ( Modernizr.csstransforms ) {
          // Get jQuery to prefix the transform for us.
          $el.css('transform', 'translate(0,' + offsetTop + 'px)' + translateZ);
        } else {
          el.style.top = offsetTop + 'px';
        }
      });

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
            column = Exports.COLUMN_WIDTH_SLIM * containerWidth;

          // Landscape tablet + desktop ( 5 columns )
          } else if ( !Modernizr.mediaqueries || Modernizr.mq('(min-width: 61.25em)') ) {
            column = Exports.COLUMN_WIDTH_SLIM_5 * containerWidth;

          // Portrait Tablet ( 4 columns )
          // } else if ( Modernizr.mq('(min-width: 48em)') ) {
          //   column = Exports.COLUMN_WIDTH_768 * containerWidth;

          // Between Portrait tablet and phone ( 3 columns )
          // 568px+
          } else if ( Modernizr.mq('(min-width: 35.5em)') ) {
            column = Exports.COLUMN_WIDTH_SLIM * containerWidth;

          // Phone ( 2 columns )
          // < 568px
          } else {
            column = Exports.COLUMN_WIDTH_320 * containerWidth;
          }


          return column;
        };

        self.shuffleGutters = function( containerWidth ) {
          var gutter,
              numColumns = 0;

          // Large desktop ( 6 columns )
          if ( Modernizr.mq('(min-width: 75em)') ) {
            gutter = Exports.GUTTER_WIDTH_SLIM * containerWidth;
            numColumns = 6;

          // Landscape tablet + desktop ( 5 columns )
          } else if ( !Modernizr.mediaqueries || Modernizr.mq('(min-width: 61.25em)') ) {
            gutter = Exports.GUTTER_WIDTH_SLIM_5 * containerWidth;
            numColumns = 5;

          // // Portrait Tablet ( 4 columns ) - masonry
          } else if ( Modernizr.mq('(min-width: 48em)') ) {
            numColumns = 4;
            gutter = Exports.GUTTER_WIDTH_SLIM * containerWidth;

          // Between Portrait tablet and phone ( 3 columns )
          } else if ( Modernizr.mq('(min-width: 35.5em)') ) {
            gutter = Exports.GUTTER_WIDTH_SLIM * containerWidth;
            numColumns = 3;


          // Phone ( 2 columns )
          } else {
            gutter = Exports.GUTTER_WIDTH_320 * containerWidth; // 2% of container width
            numColumns = 2;
          }

          self.setColumns(numColumns);

          return gutter;
        };


      // Use the default 12 column slim grid.
      } else {
        self.shuffleColumns = Exports.masonryColumns;
        self.shuffleGutters = Exports.masonryGutters;
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
        console.log('four');
        if ( !self.$grid.hasClass(shuffleDash+4) ) {
          console.log('fourin');

          // Remove .slimgrid5
          self.$grid
            .removeClass(gridClasses)
            .addClass(shuffleDash+4 + ' ' + grid);


          self.$grid.children(itemSelector)
            .removeClass(allSpans) // Remove current grid span
            .filter(large + ',' + promo) // Select large and promo tiles
              .addClass(span+6) // Make them half width
              .end() // Go back to all items
            .filter(normal) // Select tiles not large nor promo
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

    setCompareHeight : function() {
      var self = this,
          windowHeight = self.isIphone ? window.innerHeight : $(window).height(); // document.documentElement.clientHeight also wrong

      console.log('window height', windowHeight);

      self.setCompareWidth();

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

      // Add the count column
      contentWidth += self.$compareTool.find('.detail-labels-wrap').outerWidth(true);

      // Set it
      self.$compareTool.find('.compare-items-container').width( contentWidth );
    },

    setCompareRowHeights : function( isFirst ) {
      var self = this,
          $detailGroup = self.$compareItems.not('.hide').find('.detail-group').first(),
          offset = 0,
          stickyMaxHeight = 0;

      // Calling this multiple times is resulting in an ever-growing height...
      if ( isFirst ) {
        self.$compareTool.find('.compare-sticky-header').each(function() {
          var $this = $(this),
              height = parseFloat( $this.css('height') ) + parseFloat( $this.css('paddingTop') );

          if ( height > stickyMaxHeight ) {
            stickyMaxHeight = height;
          }
        }).css('height', stickyMaxHeight);
      }

      // Set the height of the product name + model because the text can wrap and make it taller
      self.setNameHeights( self.$compareTool );

      // Set detail rows to even heights
      self.$compareTool.find('.detail-label').each(function(i) {
        var $detailLabel = $(this),
            maxHeight = parseFloat( $detailLabel.css('height') ) + parseFloat( $detailLabel.css('paddingTop') ),
            $detail = self.$compareItems.find('.detail:nth-child(' + (i + 1) + ')');

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

      // Refresh outer iScroll
      if ( self.outerScroller ) {
        self.outerScroller.refresh();
      }

      return self;
    },

    setNameHeights : function( $container ) {
      var nameMaxHeight = 0;

      // Set the height of the product name + model because the text can wrap and make it taller
      $container
        .find('.product-name-wrap')
        .css('height', '') // remove heights in case they've been set before
        .each(function() {
          var $this = $(this),
              height = parseFloat( $this.css('height') );

          if ( height > nameMaxHeight ) {
            nameMaxHeight = height;
          }
        })
        .css('height', nameMaxHeight);

      return this;
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
    isiPhone: (/iphone|ipad|ipod/gi).test(navigator.appVersion),
    loadingGif: 'img/loader.gif'
  };

}(jQuery, Modernizr, window));



$(document).ready(function() {

  if ( $('.gallery').length > 0 ) {

    // Initialize galleries
    $('.gallery').each(function() {
      var $this = $(this),
      data = $this.data(),
      options = { mode : data.mode };

      $this.gallery(options);
    });

    // Initialize sticky tabs
    $('.tab-strip').stickyTabs();

    // Hide other tabs
    $('.tab-pane:not(.active)').addClass('off-screen');

    // // Should be called after everything is initialized
    $(window).trigger('hashchange');
  }
});
