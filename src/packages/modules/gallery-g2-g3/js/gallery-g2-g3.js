// ------------ Sony Gallery ------------
// Module: Gallery
// Version: 1.0
// Modified: 04/15/2013
// Dependencies: jQuery, bootstrap, Sony (Settings|Environment|Utilities), shuffle, scroller, evenheights, tabs, stickytabs, stickynav, simplescroll, rangecontrol
// Author: Glen Cheney
// --------------------------------------

define(function(require){

  'use strict';

  var $ = require('jquery'),
      iQ = require('iQ'),
      bootstrap = require('bootstrap'),
      Settings = require('require/sony-global-settings'),
      Environment = require('require/sony-global-environment'),
      Utilities = require('require/sony-global-utilities'),
      jqueryShuffle = require('secondary/index').jqueryShuffle,
      scroller = require('secondary/index').sonyScroller,
      sonyEvenHeights = require('secondary/index').sonyEvenHeights,
      sonyTab = require('secondary/index').sonyTab,
      sonyStickyTabs = require('secondary/index').sonyStickyTabs,
      sonyStickyNav = require('secondary/index').sonyStickyNav,
      jquerySimpleScroll = require('secondary/index').jquerySimpleScroll,
      Favorites = require('secondary/index').sonyFavorites,
      rangeControl = require('secondary/jodo.rangecontrol.1.4');

  var module = {

    init: function() {
      if ( $('.gallery').length > 0 || $('.af-module').length > 0 ) {

        // Register for tab show(n) events here because not all tabs are galleries
        $('[data-tab]')
          .on( 'show', module.onGalleryTabShow )
          .on( 'shown', module.onGalleryTabShown )
          .on( 'alreadyshown', module.onGalleryTabAlreadyShown );

        // Initialize sticky tabs
        requestAnimationFrame(function() {
          $('.tab-strip').stickyTabs();
        });

        // The galleries are in timeouts, so this has to be too
        setTimeout(function() {
          // Hide other tabs
          $('.tab-pane:not(.active)').addClass('off-screen');

          // Should be called after everything is initialized
          $(window).trigger('hashchange');

          // No tabs on the page, initialize the gallery manually
          if ( !$('.tab-strip').length ) {
            module.onGalleryTabAlreadyShown.call( $('#main')[0] );
          }
        }, 16);

      }
    }
  };

  var Gallery = function( $container, options ) {
    var self = this,
        debouncedResize;

    $.extend(self, $.fn.gallery.options, options, $.fn.gallery.settings);

    // Set all the variables that will be used
    self.setVars( $container );

    self.setColumnMode();

    self.$container.addClass('gallery-' + self.mode);
    // Adding a class causes a style recalculation, let's throw in the column rearranging here too
    if ( self.isEditorialMode ) {
      self.shuffleGutters();
    }

    // Compare mode doesn't utilize shuffle
    if ( self.isEditorialMode || self.isDetailedMode ) {
      self.initShuffle();
    } else {
      self.onGalleryLoading();
      self.initCompareGallery();
    }

    // Listen for window events (debounced)
    debouncedResize = $.debounce( 325, $.proxy( self.debouncedResize, self ) );
    self.$window.on('orientationchange', debouncedResize );
    self.$window.on('resize.gallery', debouncedResize );
    // Stop the active/current <a> button in the filter display bar from doing anything
    self.$container.find('.compare-btn.active').on( 'click', false );

    // Initialize filter dictionaries to keep track of everything
    if ( self.hasFilters ) {
      self.initFilters();
    }

    if ( self.hasSorting ) {
      self.initSorting();
    }

    // Swatches and tooltips are triggered on hover, so they don't need to be
    // initialized immediately
    setTimeout(function() {
      if ( !self.hasTouch ) {
        self.initSwatches();
      }
      self.initFavorites();

      // Infinite scroll has to come after initFavorites
      if ( self.hasInfiniteScroll ) {
        self.initInfscr();
      }
    }, 200);

    self.debouncedResize( true );

    // Compare mode doesn't have a shuffle plugin to execute the event
    if ( self.isCompareMode ) {
      self.onGalleryDoneLoading();
    }

    // We're done.
    self.isInitialized = true;

    // Run once
    if ( self.hasFilters ) {
      // Defer it, then wait until a good time for the browser
      setTimeout(function() {
        requestAnimationFrame(function() {
          self.filter();
          self.isFilteringInitialized = true;
        });
      }, 400);
    }

    // Initialize favorites gallery extras
    if ( self.hasRecommendedTile ) {
      setTimeout( $.proxy( self.initFavoritesGallery, self ), 200 );
    }

    // Add the .iq-img class to hidden swatch images, then tell iQ to update itself
    setTimeout( $.proxy( self.loadSwatchImages, self ) , 2000);

    log('SONY : Gallery : Initialized');
  };

  Gallery.prototype = {

    constructor: Gallery,

    enable : function() {
      var self = this;

      // Trigger the resize event. Maybe they changed tabs, resized, then changed back.
      self.debouncedResize( undefined, true );

      // Already enabled
      if ( self.enabled ) {
        return;
      }

      self.enabled = true;

      // Enable shuffle, which triggers a layout update
      if ( !self.isCompareMode ) {
        self.shuffle.enable();
      }

      // Resume infinite scroll if it's there yo
      if ( self.hasInfiniteScroll ) {
        self.$grid.infinitescroll('updateNavLocation');
        self.$grid.infinitescroll('resume');
      }

      // Will create, update, or destroy carousels depending
      // on the window size and their current state
      self.fixCarousels();

      // Removes visibility:hidden
      self.$container.removeClass('disabled');
    },

    disable : function() {
      var self = this;

      // Already disabled
      if ( !self.enabled ) {
        return;
      }

      // Disable shuffle
      if ( !self.isCompareMode ) {
        self.shuffle.disable();
      }

      // Disable carousels
      if ( self.hasEnabledCarousels ) {
        self.$carousels.scrollerModule('disable');
      }

      // Pause infinite scroll
      if ( self && self.hasInfiniteScroll ) {
        self.$grid.infinitescroll('pause');
      }

      self.$container.addClass('disabled');

      self.enabled = false;
    },

    setVars : function( $container ) {
      var self = this;

      // jQuery objects
      self.$container = $container;
      self.$window = Settings.$window;
      self.id = self.$container[0].id;
      self.$grid = self.$container.find('.products');
      self.$filterOpts = self.$container.find('.filter-options');
      self.$sortOpts = self.$container.find('.sort-options');
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
      self.$zeroMessage = self.$container.find('.zero-products-message');
      self.$recommendedTile = self.$grid.find('.recommended-tile');

      // Modes
      self.isEditorialMode = self.mode === 'editorial';
      self.isDetailedMode = self.mode === 'detailed';
      self.isCompareMode = self.mode === 'compare';
      self.isFavoritesGallery = self.$container.hasClass('gallery-favorites');

      self.itemSelector = '.' + ( self.isCompareMode ? 'compare' : 'gallery' ) + '-item';
      self.$items = self.$grid.find( self.itemSelector );

      // What do we have here?
      self.hasInfiniteScroll = self.$container.find('div.navigation a').length > 0;
      self.hasFilters = self.$filterOpts.length > 0;
      self.hasSorting = self.$sortBtns.length > 0;
      self.hasCarousels = self.$carousels.length > 0;
      self.hasRecommendedTile = self.$recommendedTile.length > 0;

      // Other vars
      self.windowWidth = Settings.windowWidth;
      self.windowHeight = Settings.windowHeight;
      if ( Modernizr.csstransforms ) {
        self.prop = 'transform';
        var translate = 'translate';

        // 3d transforms will create a new layer for each of the sticky headers
        if ( Modernizr.csstransforms3d ) {
          self.yPrefix = translate + '3d(0,';
          self.ySuffix = 'px,0)';
          self.xPrefix = translate + '3d(';
          self.xSuffix = 'px,0,0)';
        } else {
          self.yPrefix = translate + '(0,';
          self.ySuffix = 'px)';
          self.xPrefix = translate + '(';
          self.xSuffix = ',0)';
        }
      } else {
        self.prop = 'top';
        self.yPrefix = '';
        self.ySuffix = 'px';
        self.xPrefix = '';
        self.xSuffix = 'px';
      }
    },

    filter : function() {
      var self = this,
          context,
          filterFunction = !self.isCompareMode ? self.$grid.shuffle : self.manualFilter,
          returnFilteredItem;

      if ( self.isCompareMode ) {
        context = self;
        filterFunction = self.manualFilter;

      } else {
        context = self.shuffle;
        filterFunction = self.shuffle.shuffle;
      }

      // If there are active filters, we need to check each item to see if it passes
      if ( self.hasActiveFilters() ) {
        returnFilteredItem = function( $el ) {
          return self.itemPassesFilters( $el.data() );
        };

      // Otherwise, we just want to show them all
      } else {
        returnFilteredItem = 'all';
      }

      // Run the filtering function
      filterFunction.call( context, returnFilteredItem );

      self
        .setFilterStatuses()
        .toggleZeroMessage();
    },

    // Used by the compare tool, this function replicates the `filter` function from shuffle
    manualFilter : function( fn ) {
      var self = this,
          deferreds = [],
          $items = self.$items,
          $filtered = $(),
          $concealed = $(),
          showAll = fn === 'all',
          concealed = 'concealed',
          filtered = 'filtered';

      if ( !showAll ) {
        $items.each(function() {
          var $item = $(this),
              passes = fn.call($item[0], $item, self);

          if ( passes ) {
            $filtered = $filtered.add( $item );
          }
        });

        $concealed = $items.not( $filtered );

      } else {
        $filtered = $items;
      }

      // Individually add/remove concealed/filtered classes
      $filtered.each(function() {
          var $filteredItem = $(this);

          // Remove concealed if it's there
          if ( $filteredItem.hasClass( concealed ) ) {
            $filteredItem.removeClass( concealed );
            deferreds.push( self.showCompareItem( $filteredItem ) );
          }
          // Add filtered class if it's not there
          if ( !$filteredItem.hasClass( filtered ) ) {
            $filteredItem.addClass( filtered );
          }
      });
      $concealed.each(function() {
          var $filteredItem = $(this);
          // Add concealed if it's not there
          if ( !$filteredItem.hasClass( concealed ) ) {
            $filteredItem.addClass( concealed );
            deferreds.push( self.hideCompareItem( $filteredItem ) );
          }
          // Remove filtered class if it's there
          if ( $filteredItem.hasClass( filtered ) ) {
            $filteredItem.removeClass( filtered );
          }
      });

      // When everything is done animating
      $.when.apply( $, deferreds ).always( $.proxy( self.onCompareFiltered, self ) );

      setTimeout(function() {
        self
          .displayActiveFilters()
          .setTriggerPoint()
          .setToneBarOffset();
      }, 0);


      // Kill it with fire!
      $items = $filtered = $concealed = null;
    },

    // Used by the favorites gallery dropdown/select menus
    // It filters by type of product, either `data-value` for the dropdown links,
    // or the `value` attribute from `<option>` in the `<select>`
    filterByType : function( evt ) {
      var self = this,
          $target = $(evt.target),
          isSelect = $target.is('select'),
          filterName,
          method;

      // Get variables based on what kind of component we're working with
      if ( isSelect ) {
        filterName = $target.val();
      } else {
        // Prevent anchor tags from default actions
        evt.preventDefault();

        // Value is stored in a data attribute
        filterName = $target.data( 'value' );

        // Set the button text (`select` does this for us, but not dropdowns)
        self.$dropdownToggleText.text( $target.text() );
      }

      // Returns either `all` or a function which can filter the elements
      method = (function( type ) {
        if ( type === 'default' ) {
          return 'all';
        }

        return function( $el ) {
          var data = $el.data();

          // Make sure the recommended tile is always there
          if ( data.recommended || data.type === type ) {
            return true;
          }

          return false;
        };
      }( filterName ));

      // Call shuffle
      self.shuffle.shuffle( method );

      self.updateProductCount();

      self.toggleCompareButton( typeof method === 'string', filterName );
    },

    toggleCompareButton : function( toAll, filterName ) {
      var self = this,
          $compareBtn = self.$container.find( '.filter-display-bar .btn.fade' );

      // method is `all`, hide the compare button
      if ( toAll || filterName === self.accessoryFilterName ) {
        self.hideCompareButton( $compareBtn );

      // method is a function, meaning the items are filtered,
      // show the compare button
      } else {

        // Has to be > than 2 because one of the items is the recommended tile
        if ( self.shuffle.visibleItems > 2 ) {
          self.showCompareButton( $compareBtn, filterName );

        // Less than 2 comparable items in the gallery, hide the button
        } else {
          self.hideCompareButton( $compareBtn );
        }

      }
    },

    showCompareButton : function( $btn, filterName ) {
      if ( !$btn.hasClass( 'in' ) ) {
        $btn.addClass( 'in' );
        $btn.attr('tabindex', '');

        // Save the type that was filtered
        $btn.data( 'type', filterName );
      }
    },

    hideCompareButton : function( $btn ) {
      if ( $btn.hasClass( 'in' ) ) {
        $btn.removeClass( 'in' );
        $btn.attr('tabindex', '-1');

        // Remove the saved type
        $btn.removeData( 'type' );
      }
    },

    // Updates the count displayed at the top left, above the products.
    // It does NOT account for 2 products -> 1 product
    updateProductCount : function() {
      var self = this,
          count = self.shuffle ? self.shuffle.visibleItems : self.$items.length;

      // The recommended gallery tile is actually a gallery item
      if ( self.hasRecommendedTile ) {
        count -= 1;
      }

      self.$productCount.text( count );
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

    // Tests the data to see if there are any active filters. Returns a boolean
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
          frag = document.createDocumentFragment(),
          $clearAll;

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

      if ( !$.isEmptyObject( filters ) ) {
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

          $label = null;
        });

        // Using em here so I can use :last-of-type to get the spans
        $clearAll = $('<em/>', {
          'class' : 'clear-all-filters lt3 js-clear-filters',
          text: self.$activeFilters.data('clearLabel')
        });

        frag.appendChild( $clearAll[0] );

        // Manipulate DOM at the same time to prevent multiple layouts
        self.$activeFilters
          .empty()
          .append( frag );

        if ( !self.$activeFilters.hasClass('has-active-filters') ) {
          self.$activeFilters.addClass('has-active-filters');
        }

      } else {

        self.$activeFilters.empty();
        if ( self.$activeFilters.hasClass('has-active-filters') ) {
          self.$activeFilters.removeClass('has-active-filters');
        }
      }

      filters = null;
      $clearAll = null;
      frag = null;

      return self;
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

      return self;
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
        // [data-filter="features"] [value="lcd"]
        selector = '[data-filter="' + filterName + '"] [value="' + filterValue + '"]';
        self.$container.find( selector )
          .prop('checked', false)
          .removeClass('active');

      } else if ( filterType === 'range' ) {
        // Slide appropriate handle to the intial value
        rangeControl = self.$rangeControl.data('rangeControl');
        method = filterValue === 'min' ? 'slideToInitialMin' : 'slideToInitialMax';
        rangeControl[ method ]();
      }

      return self;
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

    deleteFilter : function( filterValue, filterName, filterType ) {
      this
      // Remove from internal data
      .undoFilter( filterValue, filterName, filterType )
      // Remove active/checked state
      .removeFilter( filterValue, filterName, filterType );

      return this;
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

    getFilterStatus : function( filterValue, filterName, filterType ) {
      var self = this,
          selector = '';

      // There's probably a better way to do this... (store jQuery objects for each filter?)
      if ( filterType === 'button' ) {
        // [data-filter="megapixels"] [data-megapixels="14-16"]
        selector = '[data-filter="' + filterName + '"] [data-' + filterName + '="' + filterValue + '"]';
        return !self.$container.find( selector ).is(':disabled');

      } else if ( filterType === 'checkbox' ) {
        // [data-filter="features"] [value="lcd"]
        selector = '[data-filter="' + filterName + '"] [value="' + filterValue + '"]';
        return !self.$container.find( selector ).is(':disabled');

      } else if ( filterType === 'range' ) {
        // range is never disabled
        return true;
      }

      return null;
    },

    removeActiveFilters : function() {
      var self = this,
          filterType = '',
          filterName = '',
          filterValues = [],
          filterValue = '',
          i = 0;

      self.lastFilterGroup = null;
      self.secondLastFilterGroup = null;
      self.lastFilterStatuses = null;
      self.secondLastFilterStatuses = null;
      self.currentFilterColor = null;
      self.hideFilteredSwatchImages();

      for ( filterType in self.filters ) {
        for ( filterName in self.filters[ filterType ] ) {

          if ( filterType === 'range' ) {
            for ( filterValue in self.filters[ filterType ][ filterName ] ) {
              // Abusing the isInitialized prop so we don't call filter again from the range control until we're ready
              self.isInitialized = false;
              // Remove from internal data and UI
              self.deleteFilter( filterValue, filterName, filterType );
              // Set it back to true so filtering by `range` works again
              self.isInitialized = true;
            }

          } else {
            // Get the filter values without a reference because we want to delete parts of the array
            // as its looped through
            filterValues = $.extend([], self.filters[ filterType ][ filterName ]);
            for ( ; i < filterValues.length; i++ ) {
              filterValue = filterValues[ i ];
              // Remove from internal data and UI
              self.deleteFilter( filterValue, filterName, filterType );
            }
          }
        }
      }

      self.filter();
    },

    toggleZeroMessage : function() {
      var self = this,
          visibleItems = self.shuffle ? self.shuffle.visibleItems : self.$items.filter('.filtered').length;

      if ( visibleItems ) {
        if ( !self.$zeroMessage.hasClass('hide') ) {
          self.$zeroMessage.addClass('hide');

          if ( self.isCompareMode ) {
            self.$grid.removeClass('hidden');
          }
        }
      } else {
        if ( self.$zeroMessage.hasClass('hide') ) {
          self.$zeroMessage.removeClass('hide');

          if ( self.isCompareMode ) {
            self.$grid.addClass('hidden');
          }
        }
      }

      return self;
    },

    onRemoveFilter : function( evt ) {
      var self = this,
          data = $(evt.target).data(),
          filterType = self.filterTypes[ data.filterName ],
          realType = self.filterData[ data.filterName ].realType;

      // Remove from internal data and UI
      self.deleteFilter( data.filter, data.filterName, filterType );

      if ( realType === 'color' ) {
        self.currentFilterColor = null;
        self.hideFilteredSwatchImages();
      }

      // Remove this label
      $(evt.target).remove();

      // Trigger shuffle
      self.filter();
    },

    initCompareGallery : function() {
      var self = this;

      // Set variables that only apply to the compare mode
      self.$stickyNav = self.$container.find('.sticky-nav');
      self.$compareReset = self.$container.find('.js-compare-reset');
      self.$toneBar = self.$container.find('.tone-bar');
      self.$compareItemsWrap = self.$grid.find('.compare-items-wrap');

      // Navs
      self.$navContainer = self.$container.find('.compare-nav-container');
      self.$navNext = self.$navContainer.find('.compare-nav-next');
      self.$navPrev = self.$navContainer.find('.compare-nav-prev');
      self.$detailLabelsWrap = self.$grid.find('.detail-labels-wrap');
      self.$stickyHeaders = self.$grid.find('.compare-sticky-header');
      self.$stickyRightBar = self.$stickyHeaders.find('.right-bar');

      // Adding events can be deferred
      setTimeout(function() {

        function removeButtonClick( evt ) {
          $.when( self.hideCompareItem( evt ) ).always(function() {
            self.onCompareFiltered();
          });
        }

        // Add events to close buttons
        self.$items.find('.js-remove-item')
          .on('click', removeButtonClick)
          // Don't let the transition end event from the button bubble up to the compare-item
          .on( Settings.transEndEventName, false );

        // Reset button
        self.$compareReset.on('click', $.proxy( self.onCompareReset, self ));

        // Keep the original index of the compare items so when we sort by default, we can use it
        self.$items.each(function() {
          var $this = $(this);
          $this.data('index', $this.index());
        });

        // Listen for the scroll event
        self.$window.on('scroll', $.proxy( self.onScroll, self ));

        self.stickyHeaderHeight = self.$stickyHeaders.first().height();
        self.stickyNavHeight = self.$stickyNav.outerHeight();
        self.setToneBarOffset();

        if ( !self.showStickyHeaders ) {
          self.$container.addClass('no-sticky-headers');
        }

        self.initScroller();

        // Almost everything with the compare tool expects items have a class of `filtered`
        if ( !self.hasFilters ) {
          self.manualFilter( 'all' );
        }

        // We're done
        setTimeout(function() {
          self.initStickyNav();
        }, 150);
      }, 0);
    },

    initStickyNav : function() {
      this.$stickyNav.stickyNav({
        offsetTarget: this.$grid
      });
      this.setTriggerPoint( true );
      this.onScroll();
    },

    initScroller : function() {
      var self = this,
          data;

      self.$compareItemsWrap.scrollerModule({
        contentSelector: '.compare-items-container',
        itemElementSelector: '.compare-item',
        mode: 'free',
        nextSelector: self.$navNext,
        prevSelector: self.$navPrev,
        centerItems: false,

        // Need custom function to account for hidden items
        getContentWidth: function() {
          var contentWidth = 0;

          // Count it
          self.$items.not('.hidden').each(function() {
            contentWidth += $(this).outerWidth();
          });

          return contentWidth;
        },

        // iscroll props get mixed in
        iscrollProps: {
          snap: !self.hasTouch,
          hScroll: true,
          vScroll: false,
          hScrollbar: false,
          vScrollbar: false,
          momentum: self.useMomentum,
          bounce: false,
          onScrollMove : function() {
            self.updateStickyNav( this );
          },
          onAnimate : function() {
            self.updateStickyNav( this );
          },
          onAnimationEnd : function() {
            self.updateStickyNav( this );
            iQ.update();
          }
        }
      });

      // Save the iScroll instance
      data = self.$compareItemsWrap.data('scrollerModule');
      self.scroller = data;
      self.iscroll = data.scroller;
      self.updateStickyNav( self.iscroll );
    },

    initShuffle : function() {
      var self = this;

      self.$grid.on('loading.shuffle', $.proxy( self.onGalleryLoading, self ));
      self.$grid.on('done.shuffle', $.proxy( self.onGalleryDoneLoading, self ));

      // instantiate shuffle
      self.$grid.shuffle({
        itemSelector: self.itemSelector,
        speed: self.shuffleSpeed,
        easing: self.shuffleEasing,
        columnWidth: self.shuffleColumns,
        gutterWidth: self.shuffleGutters,
        showInitialTransition: false,
        hideLayoutWithFade: true,
        sequentialFadeDelay: 60,
        buffer: 8,
        supported: Settings.shuffleSupport,
        useTransition: !( Settings.isPS3 )
      });

      self.shuffle = self.$grid.data('shuffle');

      self.$grid.find('.iq-img').on('imageLoaded', $.debounce( 200, $.proxy( self.shuffle.layout, self.shuffle ) ) );

      // Displays active filters on `filter`
      self.$grid.on('filter.shuffle', $.proxy( self.displayActiveFilters, self ) );

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
      self.filterData = {};

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
            self.button( $this, name, realType );
            break;
          case 'group':
            // Treat groups and colors the same as buttons
            type = 'button';
            self.button( $this, name, realType );
            break;
          case 'color':
            // Treat groups and colors the same as buttons
            type = 'button';
            self.button( $this, name, realType );
            break;
          case 'checkbox':
            self.checkbox ( $this, name );
            break;
        }

        // Save the active filters in this filter to an empty array or object
        self.filters[ type ][ name ] = init;
        self.filterTypes[ name ] = type;
        self.filterData[ name ] = {
          name: name,
          type: type,
          realType: realType
        };
      });

      // Init popovers
      self.initPopovers();

      // Slide toggle. Reset range control if it was hidden on initialization
      self.$container.find('.collapse')
        .on('shown', $.proxy( self.onFiltersShown, self ))
        .on('show', $.proxy( self.onFiltersShow, self ))
        .on('hidden', $.proxy( self.onFiltersHidden, self ))
        .on('hide', $.proxy( self.onFiltersHide, self ));

      // Bind clearing filters to any class that has `.js-clear-filters` on it
      self.$container.on('click', '.js-clear-filters', function() {
        self.removeActiveFilters();
        // Tell jQuery to preventDefault() and stopPropagation()
        return false;
      });
    },

    initPopovers : function() {
      var self = this,
          $triggers = self.$filterOpts.find('.js-popover-trigger');

      $triggers.each(function() {
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

      // Hide other popovers when another is clicked
      $triggers.on('tipshow', function() {
        var $trigger = $(this);
        $triggers.not( $trigger ).popover('hide');
      });
    },

    initSorting : function() {
      var self = this,
          method;

      // Show first dropdown as active
      self.$sortBtns.first().parent().addClass('active');
      self.currentSort = 0;

      // Sort by default
      if ( !self.hasRecommendedTile ) {
        method = $.proxy( self.sort, self );

      // The sorting is actually filtering by product type
      } else {
        method = $.proxy( self.filterByType, self );
      }

      // Set up sorting ---- dropdowm
      self.$sortBtns.on( 'click', method );

      // Set up sorting ---- select menu
      self.$sortSelect.on( 'change', method );

      if ( !self.hasFilters ) {
        self.updateProductCount();
      }

      // Firefox's and IE's <select> menu is hard to style...
      var ua = navigator.userAgent.toLowerCase();
      if ( ua.indexOf('firefox') > -1 || ua.indexOf('msie') > -1 ) {
        self.$sortSelect.parent().addClass('moz-ie');
      }

      return self;
    },

    initInfscr : function() {
      var self = this;

      function galleryItemsAdded( newElements ) {
          var $newElements = $( newElements ).addClass('via-ajax');

          // Bump up the delay so it's more noticeable.
          self.shuffle.sequentialFadeDelay = 250;

          // Get shuffle to append and show the items for us
          self.$grid.shuffle( 'appended', $newElements );

          // Now put it back
          self.shuffle.sequentialFadeDelay = 60;

          // Show new product count
          self.updateProductCount();

          // Initialize swatches and tooltips for ajax content
          self.initSwatches( $newElements.find('.mini-swatch[data-color]') );
          self.favorites.initTooltips( $newElements.find('.js-favorite') );

          // Update our favorites
          self.$favorites = self.$grid.find('.js-favorite');

          // Add the .iq-img class to hidden swatch images, then tell iQ to update itself
          setTimeout(function() {

            // This also calls iQ.update( true )
            self.loadSwatchImages();

            if ( self.currentFilterColor ) {
              self.displayFilteredSwatchImages();
            }

            // This is silly. Maybe a new method for iQ. iQ.refresh()
            setTimeout(function() {
              iQ.update( true );
            }, 300);
          }, 15);
      }

      self.$grid.infinitescroll({
        local: true,
        // debug: true,
        bufferPx: -100, // Load 100px after the navSelector has entered the viewport
        navSelector: 'div.navigation', // selector for the paged navigation
        nextSelector: 'div.navigation a', // selector for the NEXT link (to page 2)
        itemSelector: self.itemSelector, // selector for all items you'll retrieve
        loading: {
          selector: '.infscr-holder',
          msgText: '<em>Loading the next set of products...</em>',
          finishedMsg: '<em>Finished loading products.</em>',
          img: self.loadingGif
        }
      }, galleryItemsAdded );
    },

    initSwatches : function( $collection ) {
      var self = this;

      $collection = $collection || self.$grid.find('.mini-swatch[data-color]');
      $collection.each(function() {
          var $swatch = $(this),
              hidden = 'hidden',
              color = $swatch.data('color'),
              $productImg = $swatch.closest('.product-img').find('.js-product-imgs .js-product-img-main'),
              $swatchImg = $swatch.closest('.product-img').find('.js-product-imgs [data-color="' + color + '"]');

          $swatch.on('click', false);

          $swatch.hover(function() {
            // Mouse over, hide the main image, show the swatch image
            if ( self.currentFilterColor ) {
              $swatchImg.siblings(':not(.hidden)').addClass( hidden );
            } else {
              $productImg.addClass( hidden );
            }
            $swatchImg.removeClass( hidden );
          }, function() {
            // Mouse out, hide the swatch image, show the main image
            if ( self.currentFilterColor !== color ) {
              $swatchImg.addClass( hidden );
            }
            if ( self.currentFilterColor ) {
              $swatchImg.siblings('[data-color="' + self.currentFilterColor + '"]').removeClass( hidden );
            } else {
              $productImg.removeClass( hidden );
            }
          });

          $swatch = null;
      });

      $collection = null;

      return self;
    },

    loadSwatchImages : function() {
      // Don't load them on touch
      if ( this.hasTouch ) {
        return;
      }

      var $newIQImgs = this.$grid.find('.js-product-imgs img:not(.iq-img)').addClass('iq-img');

      if ( $newIQImgs.length ) {
        iQ.update( true );
      }

      return this;
    },

    displayFilteredSwatchImages : function() {
      var self = this,
          hidden = 'hidden',
          $productImgs = self.$grid.find('.js-product-imgs:not(.no-swatches)'),
          $mainImgs = $productImgs.find('.js-product-img-main, [data-color]:not(.hidden)'),
          $swatchImgs = $productImgs.find('[data-color="' + self.currentFilterColor + '"]');

      $mainImgs.addClass( hidden );
      $swatchImgs.removeClass( hidden );

      return self;
    },

    hideFilteredSwatchImages : function() {
      var self = this,
          hidden = 'hidden',
          $productImgs = self.$grid.find('.js-product-imgs:not(.no-swatches)'),
          $mainImgs = $productImgs.find('.js-product-img-main'),
          $swatchImgs = $productImgs.find('[data-color]:not(.hidden)');

      $mainImgs.removeClass( hidden );
      $swatchImgs.addClass( hidden );

      return self;
    },

    initFavorites : function() {
      this.favorites = new Favorites( this.$grid, {
        itemSelector: this.itemSelector
      });
    },

    initFavoritesGallery : function() {
      var self = this,
          $compareBtn = self.$container.find( '.filter-display-bar .btn.fade' );

      self.initRecommendedTile();

      // Show alert if the user is not logged in
      if ( !Settings.isLoggedIn ) {
        setTimeout(function() {
          $('.alert').removeClass('collapsed');
        }, 200);

      // Otherwise we don't need this. This could also be done serverside...
      } else {
        $('.alert').remove();
      }

      // Automatically select the share input on click
      Utilities.autoSelectInputOnFocus( self.$container.parent().find( '.share-options input' ) );

      // Direct the user to the right compare page
      $compareBtn.on('click', function( evt ) {
        var $btn = $( this ),
            destination = this.href,
            type = $btn.data( 'type' ) || '';

        evt.preventDefault();

        if ( type && destination ) {
          destination += '?type=' + type;
          window.location = destination;
        }
      });

      $compareBtn = null;

      // Respond to favorite events

      // Favorite added
      // self.$grid.on( 'favoriteadded', function() {
      // });

      // Favorite removed
      self.$grid.on( 'favoriteremoved', function( evt, $item ) {
        // Remove the gallery item from the page if it's being removed and this is a favorites gallery
        // Also make sure this gallery item isn't the recommended tile
        if ( self.isFavoritesGallery && !$item.hasClass( 'recommended-tile' ) ) {
          $('.tooltip')
            // Try to remove them
            .tooltip('hide')
            // Forcefully remove them
            .remove();
          self.shuffle.remove( $item );
          self.updateProductCount();
        }
      });
    },

    initRecommendedTile : function() {
      var self = this,
      debouncedHeights = $.debounce( 190, function() {
        if ( Modernizr.mq('(min-width: 48em)') ) {
          var groups = [ self.$gridProductNames ];
          groups = groups.concat(  self.getRecommendedTileGroups() );
          $.evenHeights( groups );
        }
      });

      // Update the heights when images load in
      self.$recommendedTile.find('.iq-img').on( 'imageLoaded', debouncedHeights );

      // Save this
      self.$recommendedTitleBar = self.$recommendedTile.find( '.recommended-title' );
    },

    initCarousels : function() {
      var self = this;

      function initializeScroller( $carousel ) {

        // Carousels inside gallery items can be delayed
        setTimeout(function() {
          // The gallery could have been disabled within the time we
          // tried to execute this function and when the browser actually
          // gets around to running the code.
          if ( !self.enabled ) {
            return;
          }

          $carousel.scrollerModule({
            mode: 'carousel',
            contentSelector: '.js-carousel-container',
            itemElementSelector: '.slide'
          });

          self.hasEnabledCarousels = true;

          $carousel = null;
        }, 0);
      }

      // Go through each possible carousel
      if ( !self.hasEnabledCarousels ) {
        self.$carousels.each(function( i, e ) {
          var $carousel = $( e ),
              $firstImage;

          // If this call is from the initial setup, we have to wait for the first image to load
          // to get its height.
          $firstImage = $carousel.find('img').first();

          if ( $firstImage.data('hasLoaded') ) {
            initializeScroller( $carousel );
          } else {
             $firstImage.on('imageLoaded', function() {
              initializeScroller( $carousel );
            });
          }

        });
      }
    },

    destroyCarousels : function() {
      if ( this.hasEnabledCarousels ) {
        this.$carousels.scrollerModule('destroy');
        this.hasEnabledCarousels = false;
      }
    },

    fixCarousels : function() {
      var self = this;

      if ( !self.hasCarousels ) {
        return;
      }

      // 980+
      if ( !Modernizr.mediaqueries || Modernizr.mq('(min-width: 61.25em)') ) {

        // Carousels are already enabled, we need to refresh them
        if ( self.hasEnabledCarousels ) {
          setTimeout(function() {
            self.$carousels.scrollerModule('enable');
            self.$carousels.scrollerModule('refresh');
          }, 0);

        // Carousels need to be created
        } else {
          self.initCarousels();
        }

      // < 980
      } else {
        self.destroyCarousels();
      }
    },

    setFilterStatuses : function() {
      var self = this,
          $visible = self.$items.filter('.filtered'),
          statuses = {},
          lastFilterGroup = self.lastFilterGroup,
          isRange = lastFilterGroup === 'price',
          isRangeActive = self.filters.range.price.max !== undefined && (self.filters.range.price.max !== self.MAX_PRICE || self.filters.range.price.min !== self.MIN_PRICE);

      function testGalleryItems( filterName, filterValue ) {
        var shouldEnable = false;

        if ( filterName === 'price' ) {
          statuses[ filterName ][ filterValue ] = true;
          return true;
        }

        $visible.each(function() {
          var $item = $(this),
              filterSet = $item.data('filterSet'),
              filterGroupValue = filterSet[ filterName ],
              isArray = $.isArray( filterGroupValue );

          shouldEnable = isArray ?
            self.valueInArray( filterValue, filterGroupValue ) :
            filterValue === filterGroupValue;

          statuses[ filterName ][ filterValue ] = shouldEnable;

          // If we've found a match, we don't need to go through the rest of the items
          if ( shouldEnable ) {
            return false;
          }
        });

        return shouldEnable;
      }

      function setFilterStatusesObject() {
        var filterName,
            filterValue,
            hasActiveFilter;

        for ( filterName in self.filterValues ) {
          hasActiveFilter = filterName === lastFilterGroup;
          statuses[ filterName ] = {};

          for ( filterValue in self.filterValues[ filterName ] ) {

            if ( hasActiveFilter ) {
              statuses[ filterName ][ filterValue ] = 'skip';
            } else {
              testGalleryItems( filterName, filterValue );
            }
          }
        }
      }

      function setFilters() {
        var filterGroup,
            filterValue,
            filterType,
            status,
            realStatus,
            method;

        for ( filterGroup in statuses ) {
          for ( filterValue in statuses[ filterGroup ] ) {
            status = statuses[ filterGroup ][ filterValue ];
            filterType = self.filterTypes[ filterGroup ];
            if ( status !== 'skip' ) {
              method = status ? 'enable' : 'disable';
              self[ method + 'Filter' ]( filterValue, filterGroup, filterType );

            // We know we want to skip it, but we need to save the current status so we can come back to it
            } else {
              realStatus = self.getFilterStatus( filterValue, filterGroup, filterType );
              statuses[ filterGroup ][ filterValue ] = realStatus;
            }
          }
        }
      }


      // Use the last filter status that wasn't from this filter group, if appropriate
      if ( (lastFilterGroup === null || isRange) && self.lastFilterStatuses !== null && self.secondLastFilterStatuses !== null && !(isRange && isRangeActive) && self.hasActiveFilters() ) {
        statuses = self.secondLastFilterStatuses;
      } else {
        setFilterStatusesObject();
      }

      // Enable or disable them
      setFilters();

      // If we're filtering again (for example, by "colors"), don't add this statuses object as the
      // second to last one, it should refer to the last one that is not in the current filter group
      if ( lastFilterGroup !== self.secondLastFilterGroup ) {
        self.secondLastFilterStatuses = self.lastFilterStatuses;
      }
      self.lastFilterStatuses = statuses;

      self.secondLastFilterGroup = lastFilterGroup;

      // Update product count
      self.updateProductCount();

      // Release for IE
      $visible = null;

      return self;
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

    button : function( $filterGroup, filterName, realType ) {
      var self = this,
          labels = {},
          values = {},
          $btns = $filterGroup.children();

      $btns.on('click', function() {
        var $this = $(this),
            isMediaGroup = $this.hasClass('media'),
            $alreadyChecked,
            checked = [],
            active = 'active',
            isActive;

        // Abort if this button is disabled
        if ( $this.is('[disabled]') ) {
          return;
        }

        // Already checked buttons which are not this one
        $alreadyChecked = $this.siblings('.' + active);

        if ( isMediaGroup ) {
          $this.find('.btn').button('toggle');
          $this.toggleClass(active);

          if ( $alreadyChecked.length ) {
            $alreadyChecked.removeClass(active);
            $alreadyChecked.find('.btn').button('toggle');
          }
        } else {
          $this.button('toggle');

          // Remove active on already checked buttons to act like radio buttons
          if ( $alreadyChecked.length ) {
            $alreadyChecked.button('toggle');
          }
        }

        isActive = $this.hasClass( active );

        if ( isActive ) {
          checked.push( $this.data( filterName ) );
          self.lastFilterGroup = filterName;
        } else {
          self.lastFilterGroup = null;
        }

        if ( realType === 'color' ) {
          self.currentFilterColor = isActive ? $this.data( filterName ) : null;
          if ( isActive ) {
            self.displayFilteredSwatchImages();
          } else {
            self.hideFilteredSwatchImages();
          }
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

      $btns = null;
      labels = null;
      values = null;
    },

    checkbox : function( $filterGroup, filterName ) {
      var self = this,
          labels = {},
          values = {},
          $inputs = $filterGroup.find('input');

      $inputs.on('change', function() {
        var $input = $(this),
            $checked = $filterGroup.find('input:checked'),
            checked = [],
            isActive;

        // At least one checkbox is checked, clear the array and loop through the checked checkboxes
        // to build an array of strings
        if ( $checked.length !== 0 ) {
          $checked.each(function() {
            checked.push(this.value);
          });
          isActive = true;
        } else {
          isActive = false;
        }
        self.filters.checkbox[ filterName ] = checked;

        // Less than IE9 doesn't support the :checked pseudo class
        if ( Settings.isLTIE9 ) {
          $input.toggleClass('active');
        }

        if ( isActive ) {
          self.lastFilterGroup = filterName;
        } else {
          self.lastFilterGroup = null;
        }

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

      $inputs = null;
      labels = null;
      values = null;
    },

    range : function( $rangeControl, filterName, MIN_PRICE, MAX_PRICE ) {
      this.MAX_PRICE = MAX_PRICE;
      this.MIN_PRICE = MIN_PRICE;
      this.price = {
        MIN_PRICE: this.MIN_PRICE,
        MAX_PRICE: this.MAX_PRICE
      };

      var self = this,

      diff = MAX_PRICE - MIN_PRICE,
      $output = $rangeControl.closest('.filter-container').find('.range-output-container'),
      $minOutputWrap = $output.find('.range-output-min'),
      $maxOutputWrap = $output.find('.range-output-max'),
      $minOutput = $output.find('.range-output-min .val'),
      $maxOutput = $output.find('.range-output-max .val'),

      delay = self.hasTouch ? 1000 : 750,
      method = self.hasTouch ? 'debounce' : 'throttle',
      debouncedFilter = $[ method ]( delay, function() {
        self.filter();
      });

      function getPrice( percent ) {
        return Math.round( diff * (percent / 100) ) + MIN_PRICE;
      }

      // Range control update callback
      function update( evt, positions, percents ) {
        var minPrice = getPrice(percents.min),
        maxPrice = getPrice(percents.max),
        maxPriceStr = maxPrice === MAX_PRICE ? maxPrice + '+' : maxPrice,
        prevMin = self.price.min,
        prevMax = self.price.max;

        self.lastFilterGroup = filterName;

        // Display values
        displayValues(minPrice, maxPriceStr, percents);

        // Save values
        self.price.min = minPrice;
        self.price.max = maxPrice;

        // Filter results only if values have changed
        if ( (prevMin !== minPrice || prevMax !== maxPrice) && self.isInitialized ) {

          // Save current filters
          self.filters.range[ filterName ].min = minPrice;
          self.filters.range[ filterName ].max = maxPrice;

          // Throttle filtering (especially on touch)
          debouncedFilter();
        }
      }

      // Show what's happening with the range control
      function displayValues( min, max, percents ) {
        var minWidth,
            maxWidth;

        // Set the new html, then get it's width, then set it's margin-left to negative half that
        $minOutput.text( min );
        $maxOutput.text( max );
        minWidth = $minOutputWrap.width();
        maxWidth = $maxOutputWrap.width();

        $minOutputWrap.css({
          left: percents.min + '%',
          marginLeft: -minWidth / 2
        });

        // Do it all over for the max handle
        $maxOutputWrap.css({
          left: percents.max + '%',
          marginLeft: -maxWidth / 2
        });
      }

      // Store jQuery object for later access
      self.$rangeControl = $rangeControl;

      // Do a fake update to position the display values. We do this here instead of registering
      // the slid event because that will be triggered twice on init (once for both handles)
      update( undefined, undefined, {min: 0, max: 100} );

      self.$rangeControl.rangeControl({
        initialMin: '0%',
        initialMax: '100%',
        range: true,
        rangeThreshold: 0.25
      });

      // On handle slid, update. Register after initialized so it's not called during initialization
      self.$rangeControl.on('slid.rangecontrol', update);

      self.filterValues[ filterName ] = { min: true, max: true };

      $rangeControl = null;
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

    // setRangeValue : function( min, max ) {
    //   var self = this,
    //       rangeControl = self.$rangeControl.data('rangeControl'),
    //       minPos = 0,
    //       maxPos = 0,
    //       diff = self.MAX_PRICE - self.MIN_PRICE,
    //       railSize = rangeControl.railSize,

    //   priceToRangePosition = function( price ) {
    //     return ( ( price - self.MIN_PRICE ) / diff ) * railSize;
    //   };

    //   if ( min && min <= self.MAX_PRICE && min >= self.MIN_PRICE ) {
    //     minPos = priceToRangePosition( min );
    //     rangeControl.slideToPos( minPos, rangeControl.$minHandle );
    //   }

    //   if ( max && max <= self.MAX_PRICE && max >= self.MIN_PRICE ) {
    //     // console.assert( max > min, 'uh oh. Max higher than min.' );
    //     maxPos = priceToRangePosition( max );
    //     rangeControl.slideToPos( maxPos );
    //   }
    // },


    getSortObject : function( evt, $btnText, byIndex ) {
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
        // Default reverse to false
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
          by: function( $el ) {
            // e.g. filterSet.price
            var filterSet = $el.data( 'filterSet' );
            return filterSet ?
              filterSet[ filterName ] :
              reverse ?
                'sortFirst' :
                'sortLast';
          }
        };

      } else {
        sortObj.sortIndex = index;

        // byIndex will be DOM order
        // this is useful if the elements are detached and reattached
        // each time they are sorted
        if ( byIndex ) {
          sortObj.by = function( $el ) {
            return $el.data('index');
          };
        }
      }

      return sortObj;
    },

    // Get the function and context for how we want to sort items
    // in the gallery.
    getSorter : function() {
      var self = this,
          context, fn;

      if ( !self.isCompareMode ) {
        context = self.shuffle;
        fn = self.shuffle.sort;

      } else {
        context = self;
        fn = self.sortComparedItems;
      }

      return {
        context: context,
        fn: fn
      };
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
          sortObj = self.getSortObject( evt, self.$dropdownToggleText, self.isCompareMode ),
          sorter = self.getSorter(),
          context = sorter.context,
          fn = sorter.fn;

      self.currentSort = sortObj.sortIndex;

      fn.call( context, sortObj );

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

    sortComparedItems : function( sortObj ) {
      var self = this,
          sortedItems,
          frag = document.createDocumentFragment();

      // Sort elements
      sortedItems = self.$items.sorted( sortObj );

      // Remove old elements from DOM
      self.$items.detach();

      // Append sorted elements to a document fragment
      $.each(sortedItems, function(i, element) {
        frag.appendChild( element );
      });

      // Append document fragment to the compare-item container
      self.$compareItemsWrap.find('.compare-items-container').append( frag );

      // Save our new compare items
      self.$items = self.$grid.find( self.itemSelector );

      // Tell iQ that images have moved around
      iQ.update();

      frag = null;

      return self;
    },

    debouncedSetRowHeights : $.debounce( 600, function( isFromResize, isInit ) {
      var self = this,
          itemHeight,
          gridWidth,
          $notHiddenItems,
          numVisibleColumns,
          stickyRightBarOffset;

      isFromResize = isFromResize === true;

      // If this is not triggered from a window resize, we still need to update the offsets
      // because the heights have changed.
      if ( (isFromResize && !isInit) || !isFromResize ) {
        // Gets css
        self.setTriggerPoint();
      }

      // Gets and sets css
      self.setRowHeights( isFromResize );

      // Get new dimensions after the rows have been resized
      $notHiddenItems = self.$items.not('.hidden');
      numVisibleColumns = $notHiddenItems.length;
      itemHeight = $notHiddenItems.first().height();
      gridWidth = self.$grid.width();
      stickyRightBarOffset = gridWidth;

      if ( numVisibleColumns <= 5 ) {
        // Use the smaller of the two
        stickyRightBarOffset = Math.min( gridWidth, self.getStickyRightBarOffset() );
      }

      // Sets css
      self.setItemContainerHeight( itemHeight, gridWidth );

      // Sets css
      self.updateStickyNav();

      // Sets css
      self.setStickyRightBarOffset( stickyRightBarOffset );
    }),

    setRowHeights : function() {
      var self = this,
          $visibleItems = self.$items.filter('.filtered'),
          $detailGroup = $visibleItems.find('.detail-group').first(),
          groups = [];

      // If there aren't any visible items left, exit
      if ( !$visibleItems.length ) {
        return this;
      } else if ( !self.scroller.enabled ) {
        self.scroller.enable();
      }

      // Set detail rows to even heights
      self.$container.find('.detail-label').each(function(i) {
        var $detailLabel = $(this),

            // plus 1 because i is a zero based index and nth-child is one based.
            $cells = self.$items.find('.detail-group .detail:nth-child(' + (i + 1) + ')');

        // Loop through the cells (`.spec-item-cell`'s in the same 'row')
        $cells = $cells.add($detailLabel);
        groups.push( $cells );
      });

      $.evenHeights( groups );

      // Gets the offset of the first detail group to align the labels properly (gets and sets css)
      self.setDetailLabelOffset();

      // Refresh iScroll
      if ( self.iscroll ) {
        setTimeout(function() {
          self.iscroll.refresh();
        }, 0);
      }

      $visibleItems = $detailGroup = null;

      return self;
    },

    // Set the top offset for the labels so they align with the details
    setDetailLabelOffset : function() {
      var self = this,
          $item = self.$items.not('.hidden').first(),
          $detailGroup = $item.find('.detail-group'),
          $firstImage = $item.find('.product-img .iq-img'),
          $wrapping = self.$detailLabelsWrap.find('.detail-labels-wrapping'),
          isAlreadyComplete = $wrapping.hasClass('complete'),
          offset = 0;

      function doit() {
        offset = $detailGroup.position().top;
        offset += parseFloat( $detailGroup.css('marginTop') );
        self.$grid.find('.detail-label-group').css('top', offset);

        // Add the complete class to the labels to transition them in
        if ( !isAlreadyComplete ) {
          $wrapping.addClass('complete');
        }
      }

      if ( $firstImage.data('hasLoaded') ) {
        doit();
      } else {
        $firstImage.on('imageLoaded', doit);
      }

      $item = $firstImage = null;

      return self;
    },

    setStickyHeaderPos : function( scrollTop ) {
      this.$stickyHeaders.css( this.prop, this.getY( scrollTop ) );
      return this;
    },

    getStickyHeaderOffset : function() {
      var self = this,
          isReliable = !self.$grid.hasClass('hidden'),
          top = isReliable ? self.$grid.offset().top : this.toneBarOffset + self.$toneBar.height(),
          bottom = isReliable ? self.$grid.height() + top : top;

      // Factor in the height of the sticky nav and sticky headers
      bottom = bottom - self.stickyHeaderHeight - self.stickyNavHeight;

      return {
        top: top,
        bottom: bottom
      };
    },

    getStickyRightBarOffset : function() {
      return this.$detailLabelsWrap.width() + this.$compareItemsWrap.find('.compare-items-container').width();
    },

    setStickyRightBarOffset : function( offset ) {
      this.$stickyRightBar.css( 'left', offset );
    },

    setTriggerPoint : function( dontUpdateStickyNav ) {
      var self = this;

      self.stickyNavHeight = self.$stickyNav.outerHeight();
      self.stickyOffset = self.getStickyHeaderOffset();
      if ( !dontUpdateStickyNav ) {
        self.$stickyNav.stickyNav('setTriggerOffset', self.stickyOffset.top);
      }

      return self;
    },

    setItemContainerHeight : function( itemHeight, gridWidth ) {
      var self = this,
          height = itemHeight || self.$items.not('.hidden').first().height(),
          width, labelsWidth, scrollerWidth;

      // Get all dimensions before changing any - avoid reflows
      if ( !Modernizr.csstransforms ) {
        width = gridWidth || self.$grid.width();
        labelsWidth = self.$detailLabelsWrap.width();
        scrollerWidth = width - labelsWidth - 2;
      }

      // The detail labels don't get a height because they're positioned absolutely
      self
        .$compareItemsWrap
        .find('.compare-items-container')
        .add( self.$detailLabelsWrap )
        .css( 'height', height + 'px' );

      // Without transforms, iScroll uses absolute positioning and the container
      // gets a width/height of 0 with overflow:hidden
      if ( !Modernizr.csstransforms ) {
        self.$compareItemsWrap
          .css( 'width', scrollerWidth + 'px' )
          .css( 'height', height + 'px' );
        self.$grid.css( 'height', height + 'px' );
      }

      return self;
    },

    updateStickyNav : function( iscroll ) {
      var self = this,
          st = self.lastScrollY,
          isIScroll = iscroll !== undefined && iscroll.y !== undefined,
          scrollTop = isIScroll ? iscroll.y * -1 : st,
          overflowing = 'overflowing', // make minifying better
          open = 'open',
          stickyTop,
          x, maxScrollX;

      // Add/remove a class to show the items have been scrolled horizontally
      if ( isIScroll ) {
        x = iscroll.x;
        maxScrollX = iscroll.maxScrollX + 3;

        // Overflow left
        if ( x < -3 && !self.$detailLabelsWrap.hasClass( overflowing ) ) {
          self.$detailLabelsWrap.addClass( overflowing );
        } else if ( x >= -3 && self.$detailLabelsWrap.hasClass( overflowing ) ) {
          self.$detailLabelsWrap.removeClass( overflowing );
        }

        // Overflow right
        if ( x > maxScrollX && !self.$grid.hasClass( overflowing ) ) {
          self.$grid.addClass( overflowing );
        } else if ( x <= maxScrollX && self.$grid.hasClass( overflowing ) ) {
          self.$grid.removeClass( overflowing );
        }

        // We haven't scrolled vertically, exit the function
        return;
      }

      // Open/close sticky headers
      if ( self.showStickyHeaders && scrollTop >= self.stickyOffset.top && scrollTop <= self.stickyOffset.bottom ) {
        if ( !self.$stickyHeaders.hasClass( open ) ) {
          self.$stickyHeaders.addClass( open );
          self.$container.addClass('sticky-header-open');
        }
        stickyTop = scrollTop - self.stickyOffset.top + self.stickyNavHeight;
        self.setStickyHeaderPos( stickyTop );

      } else {
        if ( self.showStickyHeaders && self.$stickyHeaders.hasClass( open ) ) {
          self.$container.removeClass('sticky-header-open');
          self.$stickyHeaders.removeClass( open );
        }
      }
    },

    onScroll : function() {
      var self = this;

      if ( !self.enabled ) {
        return;
      }

      self.lastScrollY = self.$window.scrollTop();
      self.updateStickyNav();
    },

    debouncedResize : function( isInit, force ) {
      var self = this,
          windowWidth = !Settings.isLTIE9 ? null : self.$window.width(),
          windowHeight = !Settings.isLTIE9 ? null : self.$window.height(),
          hasWindowChanged = !Settings.isLTIE9 || windowWidth !== self.windowWidth || windowHeight !== self.windowHeight;

      // Make sure isInit is not an event object
      isInit = isInit === true;

      // Return if the window hasn't changed sizes or the gallery is disabled
      if ( !force && !isInit && (!self.enabled || !hasWindowChanged) ) {
        return;
      }

      if ( self.isCompareMode ) {
        windowHeight = self.$window.height();
      }

      self.windowWidth = windowWidth;
      self.windowHeight = windowHeight;

      self.onResize( isInit );
    },

    onResize : function( isInit ) {
      var self = this,
          isSmallerThanTablet = Modernizr.mq('(max-width: 47.9375em)');

      // Don't change columns for detail galleries
      // Change the filters column layout
      if ( self.isDetailedMode || self.isCompareMode ) {

        // Remove heights in case they've aready been set
        if ( isSmallerThanTablet ) {
          self.$gridProductNames.css('height', '');

          self.onRecommendedTileResize();

        // Make all product name heights even
        } else {
          // Let the browser choose the best time to do this becaues it causes a layout
          if ( !self.scroller || (self.scroller && self.scroller.enabled) ) {
            self.evenTheHeights();
          }

          // If there currently is a scroller instance, destroy it
          if ( self.hasRecommendedTile && self.scroller ) {
            self.scroller.destroy();
            self.scroller = null;
          }
        }

        // Move filters around
        self.moveFilters( isSmallerThanTablet );

        // Move sort options around
        self.moveSorter( isSmallerThanTablet );

        // Tell infinite scroll to update where it thinks it's target it
        self.updateInfiniteScrollPosition();

        // Reset the range control, but don't trigger any events
        if ( self.$rangeControl ) {
          self.$rangeControl.rangeControl('reset', undefined, false);
        }

        // Setting the tone bar variable is deferred. Calling it here on init results in an error
        if ( self.isCompareMode && !isInit ) {
          self.setToneBarOffset();
        }

        if ( self.isCompareMode ) {
          if ( self.isFilteringInitialized ) {
            self.debouncedSetRowHeights( true, isInit );
          } else {
            setTimeout(function() {
              self.debouncedSetRowHeights( true, isInit );
            }, 200);
          }
        }

        return;
      }

      // Make all product name heights even
      self.evenTheHeights();

      Utilities.forceWebkitRedraw();

      self.fixCarousels();

      if ( self.isEditorialMode ) {
        self.sortByPriority();
      }
    },

    onRecommendedTileResize : function() {
      var self = this;

      // Exit early if no recommended tile
      if ( !self.hasRecommendedTile ) {
        return self;
      }

      self.$recommendedTile.find('.media')
        .find('.js-even-cols')
          .css( 'height', '' )
          .end()
        .find('.media-heading')
          .evenHeights();

      // Update even if scroller has already been initialized
      self.maxRecommendedTitleBarOffset = Math.ceil((self.$container.width() - self.$grid.width()) / 2) * -1;

      // If there currently isn't a scroller instance, create one
      if ( !self.scroller ) {
        self.scroller = self.$recommendedTile.find('.wrap').scrollerModule({
          iscrollProps: {
            bounce: self.useBounce,
            momentum: self.useMomentum,
            isOverflowHidden: false,
            hideScrollbar: true,
            fadeScrollbar: true,
            onScrollStart: function() {
              self.recommendedTileScrolled( this );
            },
            onScrollMove: function() {
              self.recommendedTileScrolled( this );
            },
            onScrollEnd: function() {
              self.recommendedTileScrolled( this );
            },
            onAnimate: function() {
              self.recommendedTileScrolled( this );
            },
            onAnimationEnd: function( iscroll ) {
              self.recommendedTileScrolled( iscroll );
              iQ.update();
            }
          }
        }).data( 'scrollerModule' );
      }

      return self;
    },

    // Make all product name heights even
    evenTheHeights : function() {
      var self = this;
      // Only the product names need to be the same height
      // Let the browser choose the best time to do this becaues it causes a layout
      requestAnimationFrame(function() {
        if ( !self.hasRecommendedTile ) {
          self.$gridProductNames.evenHeights();

        // The
        } else {
          var groups = [ self.$gridProductNames ];
          groups = groups.concat( self.getRecommendedTileGroups() );
          self.$recommendedTile.find('.media-heading').css( 'height', '' );
          $.evenHeights( groups );
        }
      });
    },

    // Tell infinite scroll to update where it thinks it's target it
    updateInfiniteScrollPosition : function() {
      var self = this;

      if ( self.hasInfiniteScroll ) {
        setTimeout(function() {
          self.$grid.infinitescroll('updateNavLocation');
        }, 25);
      }
    },

    moveFilters : function() {
      var self = this;

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

        }

      // Reset filters to 3 columns
      } else {
        if ( self.$filterColumns.eq(0).hasClass('span6') ) {
          self.$filterColumns
            .removeClass('span6 span12')
            .addClass('span4')
            .find('.media-list')
              .removeClass('inline');
        }
      }
    },

    moveSorter : function( isSmallerThanTablet ) {
      var self = this,
          $sorter,
          $container,
          $grid,
          $shares;

      if ( isSmallerThanTablet ) {
        if ( !self.hasSorterMoved ) {
          $sorter = self.$sortOpts.detach();
          $container = $('<div/>', { 'class' : 'container', id: 'sort-options-holder' } );
          $grid = $('<div/>', { 'class' : 'grid' } );

          $grid.append( $sorter );
          $container.append( $grid );

          // Append it before the active filters and after the collapseable
          if ( self.hasFilters ) {
            $container.insertAfter( self.$container.find( '.slide-toggle-target' ) );

          // `.slide-toggle-target` doesn't exist, append it before the products
          } else {
            $container.insertBefore( self.$grid.parent() );
          }

          self.hasSorterMoved = true;
        }
      } else {
        if ( self.hasSorterMoved ) {
          $sorter = self.$sortOpts.detach();
          $shares = self.$container.find( '.share-options' );

          if ( $shares.length ) {
            $sorter.insertAfter( $shares );
          } else {
            $sorter.appendTo( self.$container.find('.slide-toggle-parent .grid .content-right') );
          }
          self.$container.find('#sort-options-holder').remove();
          self.hasSorterMoved = false;
        }
      }
    },

    onFiltersHide : function( evt ) {
      evt.stopPropagation(); // stop this event from bubbling up to .gallery
      this.$filterArrow.removeClass('in');
    },

    onFiltersHidden : function( evt ) {
      evt.stopPropagation(); // stop this event from bubbling up to .gallery

      if ( this.isCompareMode ) {
        this.setTriggerPoint();
      }
    },

    onFiltersShow : function( evt ) {
      evt.stopPropagation(); // stop this event from bubbling up to .gallery
      this.$filterArrow.addClass('in');
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

    onGalleryLoading : function() {
      module.showGalleryLoader();
    },

    onGalleryDoneLoading : function() {
      var self = this,
          isFadedIn = self.$container.hasClass('in');

      if ( isFadedIn ) {
        requestAnimationFrame( module.hideGalleryLoader );

      // Fade in the gallery if it isn't already
      } else {
        setTimeout(function() {
          module.hideGalleryLoader();
          self.$container.addClass('in');
        }, 0);
      }

      // Product names get zero height in IE8
      if ( Settings.isLTIE9 ) {
        setTimeout(function() {
          self.$gridProductNames.evenHeights();
        }, 1000);
      }
    },

    onCompareReset : function( evt ) {
      var self = this;

      evt.preventDefault();

      if ( self.$compareReset.hasClass('disabled') ) {
        // stop the clear all filters from happening
        evt.stopImmediatePropagation();
        return self;
      }

      return self;
    },

    showCompareItem : function( $item ) {
      var dfd = new $.Deferred(),
          hasTransitionEnded = false,
          hasFadeEnded = false,
          widthTimeout,
          fadeTimeout;

      // 1
      function showItem() {
        // Show the column
        $item.removeClass('hidden');
      }

      // 2
      function giveWidth() {
        $item
          .one( Settings.transEndEventName, fadeItemIn )
          .removeClass('no-width');

        // transition end event not being called for the width in firefox, but only sometimes and only the width
        widthTimeout = setTimeout(function() {
          if ( !hasTransitionEnded ) {
            $item.off( Settings.transEndEventName );
            fadeItemIn();
          }
        }, 250);
      }

      // 3
      function fadeItemIn() {
        // transition actually happened, clear fallback
        hasTransitionEnded = true;
        clearTimeout( widthTimeout );

        $item
          .one( Settings.transEndEventName, finish )
          .removeClass('fade');

        fadeTimeout = setTimeout(function() {
          if ( !hasFadeEnded ) {
            $item.off( Settings.transEndEventName );
            finish();
          }
        }, 250);
      }

      function finish() {
        hasFadeEnded = true;
        clearTimeout( fadeTimeout );
        dfd.resolve();
      }

      if ( Modernizr.csstransitions ) {
        showItem();
        setTimeout( giveWidth, 0 );

      } else {
        showItem();
        dfd.resolve();
      }

      return dfd.promise();
    },

    hideCompareItem : function( $item ) {
      var self = this,
          dfd = new $.Deferred(),
          isEvent = !!$item.type,
          evt,
          hasFadeEnded,
          hasWidthEnded,
          fadeTimeout,
          widthTimeout;

      evt = isEvent ? $item : undefined;
      $item = !isEvent ? $item : $($item.target).closest('.compare-item');

      // If this is coming from an event, we're going to assume that it's from clicking the
      // x button on a gallery item. We'll need to add the .concealed class

      // 3
      function hideItem() {
        hasWidthEnded = true;
        clearTimeout( widthTimeout );

        // Hide the column
        $item.addClass('hidden');
        if ( isEvent ) {
          $item.addClass('concealed').removeClass('filtered');
          // Putting this in a rAF because it can be deferred and also takes a while
          if ( self.hasFilters ) {
            requestAnimationFrame(function() {
              self.setFilterStatuses();
            });
          }
        }
        dfd.resolve();
      }

      // 2
      function noWidth() {
        hasFadeEnded = true;
        clearTimeout( fadeTimeout );

        $item.one( Settings.transEndEventName, hideItem );
        requestAnimationFrame(function() {
          $item.addClass('no-width');

          widthTimeout = setTimeout(function() {
            if ( !hasWidthEnded ) {
              $item.off( Settings.transEndEventName );
              hideItem();
            }
          }, 250);
        });
      }

      // 1
      function fadeItemOut() {
        $item.addClass('fade');
        fadeTimeout = setTimeout(function() {
          if ( !hasFadeEnded ) {
            $item.off( Settings.transEndEventName );
            noWidth();
          }
        }, 250);
      }

      if ( Modernizr.csstransitions ) {
        $item.one( Settings.transEndEventName, noWidth );
        requestAnimationFrame( fadeItemOut );

      } else {
        hideItem();
      }

      // Stop click from bubbling to iScroll
      if ( isEvent ) {
        evt.preventDefault();
        evt.stopPropagation();
      }

      return dfd.promise();
    },

    onCompareFiltered : function() {
      var self = this,
          total = self.$items.length,
          remaining = self.$items.filter('.filtered').length;

      self
        // Enable the reset button if the remaining items is not the same as the total
        .toggleCompareReset( total, remaining )
        // Hide close button if there are only 2 left
        .toggleRemoveButtons( remaining )
        // Enable or disable the scroller depending on how many items are left
        .toggleCompareScroller( remaining );
    },

    // Enable the reset button if the remaining items is not the same as the total
    toggleCompareReset : function( totalItems, totalRemainingItems ) {
      var self = this,
          isResetDisabled = self.$compareReset.hasClass('disabled');

      if ( totalItems !== totalRemainingItems ) {
        if ( isResetDisabled ) {
          self.$compareReset.removeClass('disabled');
        }

      } else {
        if ( !isResetDisabled ) {
          self.$compareReset.addClass('disabled');
        }
      }

      return self;
    },

    // Hide close button if there are only 2 left
    toggleRemoveButtons : function( totalRemainingItems ) {
      var self = this,
          $removeButtons = self.$grid.find('.js-remove-item'),
          $hiddenButtons;

      if ( totalRemainingItems < 3 ) {
        $removeButtons.addClass('hidden');

      } else {
        $hiddenButtons = $removeButtons.filter('.hidden');
        if ( $hiddenButtons.length ) {
          $hiddenButtons.removeClass('hidden');
        }
      }

      return self;
    },

    // Enable or disable the scroller depending on how many items are left
    toggleCompareScroller : function( totalRemainingItems ) {
      var self = this;

      if ( totalRemainingItems ) {
        // If it was disabled, enable it
        if ( !self.scroller.enabled ) {
          self.scroller.enable();
          // rows need to be updated
          requestAnimationFrame(function() {
            self.debouncedSetRowHeights();
          });
        }
        requestAnimationFrame(function() {
          var gridWidth, stickyRightBarOffset;

          // Refresh scroller so the grid gets a new width
          self.scroller.refresh();

          // Get the new width
          gridWidth = self.$grid.width();

          // Offset is the grid width by default
          stickyRightBarOffset = gridWidth;

          // If there are less than 5 items visible, there could
          // be leftover space that should be filled
          if ( totalRemainingItems <= 5 ) {
            stickyRightBarOffset = Math.min( gridWidth, self.getStickyRightBarOffset() );
          }

          // Set the sticky header bar to the grid width or the left offset of the grid,
          // which ever is smaller
          self.setStickyRightBarOffset( stickyRightBarOffset );

          // Maybe they haven't scrolled horizontally to see other images
          iQ.update();
        });
      } else {
        if ( self.scroller.enabled ) {
          self.scroller.disable();
        }
      }

      return this;
    },

    getY : function( y ) {
      return [ this.yPrefix, y, this.ySuffix ].join('');
    },

    getX : function( x ) {
      return [ this.xPrefix, x, this.xSuffix ].join('');
    },

    setToneBarOffset : function() {
      this.toneBarOffset = this.$toneBar.offset().top;
      return this;
    },

    setColumnMode : function() {
      var self = this;

      if ( self.isEditorialMode ) {
        // Make this a 5 column grid. Added to parent because grid must be a descendant of grid5
        if ( !self.$grid.hasClass('slimgrid5') ) {
          self.$grid.addClass('slimgrid5');
        }


        self.shuffleColumns = function( containerWidth ) {
          var column;

          // Large desktop ( 6 columns )
          if ( Modernizr.mq('(min-width: 75em)') ) {
            column = Settings.COLUMN_WIDTH_SLIM * containerWidth;

          // Landscape tablet + desktop ( 5 columns )
          } else if ( !Modernizr.mediaqueries || Modernizr.mq('(min-width: 61.25em)') ) {
            column = Settings.COLUMN_WIDTH_SLIM_5 * containerWidth;

          // Portrait Tablet ( 4 columns )
          // } else if ( Modernizr.mq('(min-width: 48em)') ) {
          //   column = Settings.COLUMN_WIDTH_768 * containerWidth;

          // Between Portrait tablet and phone ( 3 columns )
          // 568px+
          } else if ( Modernizr.mq('(min-width: 35.5em)') ) {
            column = Settings.COLUMN_WIDTH_SLIM * containerWidth;

          // Phone ( 2 columns )
          // < 568px
          } else {
            column = Settings.COLUMN_WIDTH_320 * containerWidth;
          }


          return column;
        };

        self.shuffleGutters = function( containerWidth ) {
          var gutter,
              numColumns = 0;

          // Large desktop ( 6 columns )
          if ( Modernizr.mq('(min-width: 75em)') ) {
            gutter = Settings.GUTTER_WIDTH_SLIM * containerWidth;
            numColumns = 6;

          // Landscape tablet + desktop ( 5 columns )
          } else if ( !Modernizr.mediaqueries || Modernizr.mq('(min-width: 61.25em)') ) {
            gutter = Settings.GUTTER_WIDTH_SLIM_5 * containerWidth;
            numColumns = 5;

          // Portrait Tablet ( 4 columns ) - masonry
          } else if ( Modernizr.mq('(min-width: 48em)') ) {
            numColumns = 4;
            gutter = Settings.GUTTER_WIDTH_SLIM * containerWidth;

          // Between Portrait tablet and phone ( 3 columns )
          } else if ( Modernizr.mq('(min-width: 35.5em)') ) {
            gutter = Settings.GUTTER_WIDTH_SLIM * containerWidth;
            numColumns = 3;


          // Phone ( 2 columns )
          } else {
            gutter = Settings.GUTTER_WIDTH_320 * containerWidth; // 2% of container width
            numColumns = 2;
          }

          self.setColumns(numColumns);

          return gutter;
        };


      // Use the default 12 column slim grid.
      } else if ( self.isDetailedMode ) {
        self.shuffleColumns = Utilities.masonryColumns;
        self.shuffleGutters = Utilities.masonryGutters;
      }

      return self;
    },

    setColumns : function( numColumns ) {
      var self = this,
          span = 'span',
          mspan = 'm-' + span,
          allSpans = [ span+1, span+2, span+3, span+4, span+6, mspan+3, mspan+6 ].join(' '),
          shuffleDash = 'shuffle-',
          grid = 'slimgrid',
          grid5 = grid+5,
          gridClasses = [ shuffleDash+2, shuffleDash+3, shuffleDash+4, shuffleDash+5, shuffleDash+6, grid, grid5 ].join(' '),
          itemSelector = self.itemSelector,
          large = '.large',
          promo = '.promo',
          social = '.social',
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
            .filter(promo + ',' + social) // Select promo tiles
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
            .filter(promo + ',' + social) // Select promo tiles
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
            .filter(promo + ',' + social) // Select promo tiles
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
            .filter( social )
              .addClass( span+8 )
              .end()
            .not( social )
              .addClass( span+4 );
        }


      // Phone ( 2 columns )
      } else if ( numColumns === 2 ) {
        if ( !self.$grid.hasClass(shuffleDash+2) ) {

          // remove .slimgrid5
          self.$grid
            .removeClass(gridClasses)
            .addClass(shuffleDash+2 + ' ' + grid);

          // Remove current grid span
          self.$grid.children( itemSelector )
            .removeClass( allSpans )
            .filter( promo + ',' + social )
              .addClass( mspan+6 )
              .end()
            .filter(large + ',' + normal)
              .addClass( mspan+3 );
        }
      }
      return self;
    },

    recommendedTileScrolled : function( iscroll ) {
      var self = this,
          $bar = self.$recommendedTitleBar,
          x = iscroll.x,
          max = self.maxRecommendedTitleBarOffset,
          offset = Math.max( x, 0 );

      offset = Math.max( x, max );

      $bar.css( self.prop, self.getX( offset ) );
    },

    getRecommendedTileGroups : function() {
      var self = this,
          groups = [],
          $medias = self.$recommendedTile.find('.media');

      $medias.each(function() {
        groups.push( $( this ).find( '.js-even-cols' ) );
      });

      return groups;
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
    shuffleSpeed: Settings.shuffleSpeed,
    shuffleEasing: Settings.shuffleEasing
  };

  // Not overrideable
  $.fn.gallery.settings = {
    MIN_PRICE: undefined,
    MAX_PRICE: undefined,
    price: {},
    enabled: true,
    hasEnabledCarousels: false,
    hasSorterMoved: false,
    isInitialized: false,
    isFilteringInitialized: false,
    isCompareToolOpen: false,
    hasTouch: Settings.hasTouchEvents,
    isTicking: false,
    useBounce: !( Settings.isVita || Settings.isLTIE9 ),
    useMomentum: !( Settings.isVita || Settings.isLTIE9 ),
    showStickyHeaders: !( Settings.hasTouchEvents || Settings.isLTIE10 || Settings.isPS3 ),
    lastScrollY: 0,
    sorted: false,
    currentFilterColor: null,
    lastFilterGroup: null,
    lastFilterStatuses: null,
    secondLastFilterGroup: null,
    secondLastFilterStatuses: null,
    maxRecommendedTitleBarOffset: 0,
    accessoryFilterName: 'accessory',
    loadingGif: Settings.loaderPath
  };


  var AccessoryFinder = function( element, options ) {
    var self = this;

    $.extend( self, AccessoryFinder.options, options, AccessoryFinder.settings );

    self.$container = $( element );

    // Defer initialization
    setTimeout(function() {
      self.init();
      self.$container.data( 'accessoryFinder', self );

      log('SONY : AccessoryFinder : Initialized');
    }, 0);
  };

  AccessoryFinder.prototype = {
    constructor: AccessoryFinder,

    init : function() {
      var self = this;

      // Modal pieces
      self.$modal = self.$container.find('#accessory-finder-modal');
      self.$modalHeader = self.$modal.find('.modal-header');
      self.$modalSubhead = self.$modal.find('.modal-subhead');
      self.$modalBody = self.$modal.find('.modal-body');

      // Components
      self.$grid = self.$container.find('.products');
      self.$items = self.$grid.find( self.itemSelector );
      self.$productCount = self.$container.find('.product-count');
      self.$popoverTriggers = self.$container.find('.js-popover-trigger');
      self.$dropdownToggleText = self.$container.find('.sort-options .js-toggle-text');
      self.$sortSelect = self.$container.find('.sort-options select');
      self.$sortBtns = self.$container.find('.sort-options .dropdown-menu a');
      self.$searchField = self.$container.find('#accessory-finder-input');

      self.useIScroll = self.hasTouch;

      // Initialize components
      self
        .onResize( true )
        .initPopover()
        .initModal()
        .initSorting()
        .initSearch();

      // Listen for global resize
      Environment.on('global:resizeDebounced', $.proxy( self.onResize, self ));
    },

    initPopover: function() {
      var self = this,
          $triggers = self.$popoverTriggers;

      $triggers.each(function() {
        var $trigger = $(this);

        $trigger.popover({
          placement: 'in bottom',
          trigger: 'click',
          content: function() {
            return $(this).find('.js-popover-content').html();
          }
        });
      });

      return self;
    },

    initModal : function() {
      var self = this;

      // Listen for modal events
      self.$modal.on( 'shown', $.proxy( self.onModalShown, self ) );
      self.$modal.on( 'hidden', $.proxy( self.onModalClosed, self ) );


      if ( Settings.isLTIE9 ) {
        self.$modalBody.removeClass( 'fade' );
      }

      return self;
    },

    initSearch : function() {
      var self = this,

      keyup = function() {
        // Value they've entered
        var val = this.value.toLowerCase();

        // Filter elements based on if their string exists in the product model
        self.shuffle.shuffle(function( $el ) {
          var $searchable = $el.find('.product-model'),
              text = $.trim( $searchable.text() ).toLowerCase();

          return text.indexOf(val) !== -1;
        });

        // Update the count
        self.updateProductCount();
      },

      debouncedKeyup = $.debounce( 50, keyup );

      self.$searchField.on( 'keyup change', debouncedKeyup );

      return self;
    },

    initShuffle : function() {
      var self = this;

      // self.$grid.on( 'loading.shuffle', $.proxy( self.onShuffleLoading, self ) );
      self.$grid.on( 'done.shuffle', $.proxy( self.onShuffleDoneLoading, self ) );

      // instantiate shuffle
      self.$grid.shuffle({
        itemSelector: self.itemSelector,
        speed: Settings.shuffleSpeed,
        easing: Settings.shuffleEasing,
        showInitialTransition: false,
        hideLayoutWithFade: true,
        sequentialFadeDelay: 60,
        buffer: 20,
        supported: Settings.shuffleSupport,
        useTransition: !( Settings.isPS3 ),
        columnWidth: function( containerWidth ) {
          var column = containerWidth;

          // 568px+
          if ( !Modernizr.mediaqueries || Modernizr.mq('(min-width: 30em)') ) {
            column = Settings.COLUMN_WIDTH_SLIM * containerWidth;
          }

          return column;
        },
        gutterWidth: function( containerWidth ) {
          var gutter = 0,
              is3Col = !Modernizr.mediaqueries || Modernizr.mq('(min-width: 61.1875em)'),
              is2Col = is3Col ? false : Modernizr.mq('(min-width: 35.5em)'),
              numCols = is3Col ? 3 : is2Col ? 2 : 1;

          if ( is3Col || is2Col ) {
            gutter = Settings.GUTTER_WIDTH_SLIM * containerWidth;
          }

          if ( self.currentFinderCols !== numCols && numCols !== 1) {
            self.swapShuffleItemClasses( numCols, this );
          }

          self.currentFinderCols = numCols;

          return gutter;
        }
      });

      // Save ref to shuffle
      self.shuffle = self.$grid.data('shuffle');

      // Relayout when images load
      self.$grid.find('.iq-img').on('imageLoaded', $.debounce( 200, $.proxy( self.shuffle.layout, self.shuffle ) ) );

      // Filtered should already be throttled because whatever calls `.filter()` should be throttled.
      self.$grid.on( 'layout.shuffle', iQ.update );

      return self;
    },

    initIScroll : function() {
      var self = this,
          innerHeight,

      // Let inputs be used, otherwise prevent default
      allowInputs = function( e ) {
        var target = e.target,
            nodeName;

        while ( target.nodeType !== 1 ) {
          target = target.parentNode;
        }

        nodeName = target.nodeName;

        if (nodeName !== 'SELECT' && nodeName !== 'INPUT' && nodeName !== 'TEXTAREA') {
          e.preventDefault();
        }
      };

      if ( self.innerHeight ) {
        self.$wrapperInner.css( 'height', innerHeight );
      }

      setTimeout(function letHeightRegister() {
        self.iscroll = new IScroll( self.$wrapper[0], {
          onBeforeScrollStart: allowInputs
        });
      }, 0);
    },

    swapShuffleItemClasses : function( numCols, shuffle ) {
      var newClass = 'span6',
          oldClass = 'span4';

      if ( numCols === 3 ) {
        newClass = 'span4';
        oldClass = 'span6';
      }

      shuffle.$items.each(function() {
        $(this)
          .removeClass( oldClass )
          .addClass( newClass );
      });
    },

    getMaxModalHeights : function() {
      var self = this,
          screenHeight,
          maxModalHeight,
          modalHeaderHeight,
          maxBodyHeight;

      screenHeight = self.$window.height();

      // 90% of the available height
      maxModalHeight = 0.9 * screenHeight;

      // Lock it at 90% or 900px
      maxModalHeight = Math.min( maxModalHeight, 900 );

      // Get the combined height of the header and subheader
      modalHeaderHeight = self.$modalHeader.outerHeight() + self.$modalSubhead.outerHeight();

      // Get the max height of the body
      maxBodyHeight = maxModalHeight - modalHeaderHeight;

      return {
        maxModalHeight: maxModalHeight,
        maxBodyHeight: maxBodyHeight
      };
    },

    getSorter : function() {
      return {
        context: this.shuffle,
        fn: this.shuffle.sort
      };
    },

    initSorting : Gallery.prototype.initSorting,
    getSortObject : Gallery.prototype.getSortObject,
    sort : Gallery.prototype.sort,

    onShuffleDoneLoading : function() {
      var self = this;

      function iScroll() {
        self.innerHeight = self.$wrapperInner.outerHeight();
        self.initIScroll();
      }

      function bodyFadedIn() {
        if ( self.useIScroll ) {
          // I honestly have no idea why I have to wait this long to get the right measurement
          setTimeout( iScroll, 250 );
        }
      }

      function fadeInBody() {
        self.$modalBody.addClass('in');
        self.isFadedIn = true;

        if ( Modernizr.csstransitions ) {
          self.$modalBody.one( Settings.transEndEventName, bodyFadedIn );
        } else {
          bodyFadedIn();
        }
      }

      if ( !self.isFadedIn && !self.isLTIE9 ) {
        setTimeout( fadeInBody, 0 );
      }
    },

    onResize : function( isInit, isFromModalShown ) {
      var self = this,
          screenHeight,
          maxBodyHeight,
          modalMaxes = {};

      self.isMobileSize = !( Modernizr.mediaqueries ? Modernizr.mq('(min-width: 35.5em)') : true );

      if ( self.useIScroll ) {
        self.$wrapper = self.isMobileSize ?
          self.$modal :
          self.$modalBody;
        self.$wrapperInner = self.$wrapper.children().first();
      }

      // False for event objects
      isInit = isInit === true;

      if ( !isInit && self.isModalOpen ) {

        if ( !self.isMobileSize ) {
          // Caculate how much room the modal body has
          modalMaxes = self.getMaxModalHeights();
          maxBodyHeight = modalMaxes.maxBodyHeight;

        } else {
          maxBodyHeight = 'none';
        }

        if ( self.hasTouch ) {
          screenHeight = Settings.isIPhone || Settings.isAndroid ? window.innerHeight : self.$window.height();
          // Stop the page from scrolling behind the modal
          $('#main').css({
            height: screenHeight,
            maxHeight: screenHeight,
            overflow: 'hidden'
          });
        }

        if ( self.useIScroll ) {
          self.$modalBody.css( 'height', maxBodyHeight );
        } else {
        // Set a maximum height on the modal body so that it will scroll
          self.$modalBody.css( 'maxHeight', maxBodyHeight );
        }

        // Set an explicit height on the modal body
        if ( !self.isMobileSize ) {
          self.$modal.css( 'height', modalMaxes.maxModalHeight );
        } else {
          if ( self.useIScroll ) {
            self.$wrapper.css( 'height', screenHeight );
          } else {
            self.$modal.css( 'height', '' );
          }
        }

        // Window resized while modal is open
        if ( !isFromModalShown ) {
          // Destroy iscroll and rebuild it because the container that scrolls
          // changes between mobile size and not mobile size.
          if ( self.iscroll ) {
            self.$wrapperInner.css( 'height', '' );
            if ( self.isMobileSize  ) {
              self.innerHeight = self.$wrapperInner.outerHeight();
            }
            self.iscroll.destroy();
            setTimeout(function() {
              self.initIScroll();
            }, 0);
          }
        }
      }

      return self;
    },

    onModalBodyScroll : function() {
      var self = this;

      if ( !self.isTicking ) {
        self.isTicking = true;
        self.lastScrollY = self.$modalBody.scrollTop();
        requestAnimationFrame(function() {
          self.updateStickyNav();
        });
      }
    },

    onModalShown : function( evt ) {
      var self = this;

      self.isModalOpen = true;

      // Stop event from bubbling up to the tabs
      evt.stopPropagation();

      self.initShuffle();

      iQ.update();

      // Update max height for modal body
      self.onResize( false, true );

      // Listen for scroll events on the modal body
      if ( self.useScrollListener ) {
        self.$modalBody.on( 'scroll', $.proxy( self.onModalBodyScroll, self ) );
      }
    },

    onModalClosed : function( evt ) {
      var self = this;

      // Stop event from bubbling up to the tabs
      evt.stopPropagation();

      self.shuffle.destroy();

      if ( self.iscroll ) {
        self.iscroll.destroy();
      }

      if ( self.useScrollListener ) {
        self.$modalBody.off('scroll');
      }

      if ( self.hasTouch ) {
        $('#main').css({
          height: '',
          maxHeight: '',
          overflow: ''
        });
      }

      // Remove scrolled class if it exists
      if ( self.$modalSubhead.hasClass('body-scrolled') ) {
        self.$modalSubhead.removeClass('body-scrolled');
      }

      self.$modal.css( 'height', '' );
      self.$modal.find('.container').css( 'height', '' );

      self.$modalBody.css({
        height: '',
        maxHeight: ''
      });

      self.$modalBody.removeClass('in');

      self.innerHeight = null;

      // Clear out the search field
      self.$searchField.val( '' );
      self.isModalOpen = false;
      self.isFadedIn = false;
    },

    updateProductCount : Gallery.prototype.updateProductCount,

    updateStickyNav : function() {
      var self = this,
          scrollY = self.lastScrollY,
          theClass = 'body-scrolled';

      // Scrolled at least two pixels on the modal body
      if ( scrollY > 1 ) {
        if ( !self.$modalSubhead.hasClass( theClass ) ) {
          self.$modalSubhead.addClass( theClass );
        }

      } else {
        if ( self.$modalSubhead.hasClass( theClass ) ) {
          self.$modalSubhead.removeClass( theClass );
        }

      }

      self.isTicking = false;
    }
  };

  AccessoryFinder.options = {};

  AccessoryFinder.settings = {
    isTicking: false,
    isFadedIn: false,
    isModalOpen: false,
    hasTouch: Settings.hasTouchEvents,
    useScrollListener: !( Settings.isSonyTabletS || Settings.isLTIE9 || Settings.isPS3 ),
    itemSelector: '.compat-item',
    $wrapper: null,
    $wrapperInner: null,
    $window: Settings.$window
  };

  module.initializer = function( $pane ) {

    // Initialize galleries
    $pane.find('.gallery').each(function() {
      var $this = $(this);

      // Stagger gallery initialization
      setTimeout(function() {
        $this.gallery( $this.data() );
      }, 0);
    });

    // Instantiate accessory finders
    $pane.find('.af-module').each(function( i, el ) {
      setTimeout(function() {
        new AccessoryFinder( el );
      }, 0);
    });
  };

  module.onGalleryTabAlreadyShown = function( evt ) {
    module.initializer( $( this ) );
    setTimeout( iQ.update, 0 );
  };

  // Event triggered when the previous tab/pane is about to be hidden
  module.onGalleryTabShow = function( evt ) {
    var $prevPane;

    // Get the previous pane jQuery object from the evt object
    if ( evt ) {
      $prevPane = evt.prevPane;
      if ( evt.prevPane ) {
        $prevPane = evt.prevPane;
      } else if ( evt.originalEvent && evt.originalEvent.prevPane ) {
        $prevPane = evt.originalEvent.prevPane;
      } else {
        $prevPane = false;
      }
    }

    if ( !evt || !$prevPane ) {
      return;
    }


    // Loop through each gallery in the tab (there could be more than 1)
    // Disable the gallery (which disableds shuffle and pauses infinite scrolling) for galleries being hidden
    $prevPane.find('.gallery').each(function() {
      var gallery = $(this).data('gallery');

      // If there are active filters, remove them.
      if ( gallery && gallery.isInitialized ) {

        if ( gallery.hasActiveFilters() ) {
          gallery.removeActiveFilters();
        }

        gallery.disable();
      }

    });

    $prevPane = null;

  };

  // Event triggered when the next tab/pane is finished being shown
  module.onGalleryTabShown = function( evt ) {
    // Only continue if this is a tab shown event.
    var $pane = $( this ),
        $galleries,
        needsInit = false;

    // Get all galleries in this tab pane
    $galleries = $pane.find('.gallery');

    // Force redraw before fixing galleries
    Utilities.forceWebkitRedraw();

    // Loop through each gallery in this tab pane to enable it and update the carousels
    $galleries.each(function() {
      var $gallery = $( this ),
          gallery = $gallery.data('gallery'),
          $collapse;

      // Enable all galleries in this tab
      if ( gallery && gallery.isInitialized ) {
        $collapse = gallery.$container.find('[data-toggle="collapse"]');

        requestAnimationFrame(function() {
          gallery.enable();
        });

      // Gallery isn't initialized, lets create a new one
      } else {
        needsInit = true;
      }

      // Slide up the collapsable if it's visible. This CANNOT be done in the `show` event
      if ( $collapse && $collapse.length && !$collapse.hasClass('collapsed') ) {
        $collapse.trigger('click');
      }
    });

    if ( !needsInit && $pane.find('.af-module').length ) {
      needsInit = true;
    }

    // Create galleries or accessory finders for this pane
    if ( needsInit ) {
      module.initializer( $pane );
    }

    // Galleries hide the loader themselves. Otherwise it needs to be hidden manually.
    if ( !$galleries.length ) {
      module.hideGalleryLoader();
    }

    $galleries = null;
    $pane = null;
  };

  // Hides the loading gif
  module.hideGalleryLoader = function() {
    if ( !module.galleryLoaderHidden ) {
      $('.gallery-loader').addClass('hidden');
    }
    module.galleryLoaderHidden = true;
  };

  // Shows the loading gif
  module.showGalleryLoader = function() {
    if ( module.galleryLoaderHidden ) {
      $('.gallery-loader').removeClass('hidden');
    }
    module.galleryLoaderHidden = false;
  };

  return module;
});
