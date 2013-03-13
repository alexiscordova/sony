/*global define, Modernizr, log*/

// ------------ Sony Gallery ------------
// Module: Gallery
// Version: 1.0
// Modified: 03/02/2013
// Dependencies: jQuery 1.7+, Modernizr
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
      rangeControl = require('secondary/jodo.rangecontrol.1.4'),
      stickyTabs = require('secondary/sony-stickytabs'),
      sonyTab = require('secondary/sony-tab'),
      shuffle = require('secondary/jquery.shuffle'),
      simpleScroll = require('secondary/jquery.simplescroll'),
      scroller = require('secondary/sony-scroller');

  var module = {

    init: function() {

      if ( $('.gallery').length > 0 ) {
        // console.profile();
        // Initialize galleries
        $('.gallery').each(function() {
          var $this = $(this);

          // console.profile('gallery ' + this.id);
          // console.time('Initializing gallery ' + this.id + ' took:');
          $this.gallery( $this.data() );
          // console.timeEnd('Initializing gallery ' + this.id + ' took:');
          // console.profileEnd('gallery ' + this.id);
        });

        // Register for tab show(n) events here because not all tabs are galleries
        $('[data-tab]')
          .on('show', module.onGalleryTabShow )
          .on('shown', module.onGalleryTabShown );

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
          // console.timeStamp('Disabling hidden galleries');
          $('.tab-pane:not(.active) .gallery').gallery('disable');
          // console.profileEnd();
        }, 500);
      }
    }
  };

  var Gallery = function( $container, options ) {
    var self = this;

    $.extend(self, $.fn.gallery.options, options, $.fn.gallery.settings);

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

    // Compare modal
    self.$compareBtn = self.$container.find('.js-compare-toggle');
    self.$compareTool = $('#compare-tool');

    // What do we have here?
    self.hasCompareModal = self.$compareBtn.length > 0 && self.$compareTool.length > 0;
    self.hasInfiniteScroll = self.$container.find('div.navigation a').length > 0;
    self.hasFilters = self.$filterOpts.length > 0;
    self.hasSorting = self.$sortBtns.length > 0;
    self.hasCarousels = self.$carousels.length > 0;

    // Other vars
    self.windowWidth = Settings.windowWidth;
    self.windowHeight = Settings.windowHeight;

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

    // Add the .iq-img class to hidden swatch images, then tell iQ to update itself
    setTimeout( $.proxy( self.loadSwatchImages, self ) , 2000);

    log('SONY : Gallery : Initialized');

  };

  Gallery.prototype = {

    constructor: Gallery,

    enable : function() {
      var self = this;

      // Trigger the resize event. Maybe they changed tabs, resized, then changed back.
      self.onResize( undefined, true );

      // Already enabled
      if ( self.enabled ) {
        return;
      }

      self.enabled = true;

      // Enable shuffle, which triggers a layout update
      self.shuffle.enable();

      // Resume infinite scroll if it's there yo
      if ( self.hasInfiniteScroll ) {
        self.$grid.infinitescroll('updateNavLocation');
        self.$grid.infinitescroll('resume');
      }

      self.$container.removeClass('disabled');

      if ( self.hasEnabledCarousels ) {
        self.$carousels.scrollerModule('enable');
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

    filter : function() {
      var self = this;

      if ( self.hasActiveFilters() ) {
        self.$grid.shuffle(function($el) {
          return self.itemPassesFilters( $el.data() );
        });
      } else {
        self.$grid.shuffle('all');
      }

      self
        .setFilterStatuses()
        .toggleZeroMessage();
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
          filterValue = '';

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
              // Remove from internal data and UI
              self.deleteFilter( filterValue, filterName, filterType );
            }

          } else {
            // Get the filter values without a reference because we want to delete parts of the array
            // as its looped through
            filterValues = $.extend([], self.filters[ filterType ][ filterName ]);
            for ( var i = 0; i < filterValues.length; i++ ) {
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
          visibleItems = self.shuffle.visibleItems;

      if ( visibleItems ) {
        if ( !self.$zeroMessage.hasClass('hide') ) {
          self.$zeroMessage.addClass('hide');
        }
      } else {
        if ( self.$zeroMessage.hasClass('hide') ) {
          self.$zeroMessage.removeClass('hide');
        }
      }

      return self;
    },

    onRemoveFilter : function( evt ) {
      var self = this,
          data = $(evt.target).data(),
          filterType = self.filterTypes[ data.filterName ];

      // Remove from internal data and UI
      self.deleteFilter( data.filter, data.filterName, filterType );

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
        buffer: 8
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
        .on('hide', $.proxy( self.onFiltersHide, self ));

      // Bind clearing filters to any class that has `.js-clear-filters` on it
      // $.proxy( self.removeActiveFilters, self )
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

      function galleryItemsAdded( newElements ) {
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
        itemSelector: '.gallery-item', // selector for all items you'll retrieve
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
      this.$grid.find('.js-product-imgs img:not(.iq-img)').addClass('iq-img');
      iQ.update( true );

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

    initTooltips : function( $favorites ) {
      var self = this;

      $favorites = $favorites || self.$favorites;

      // Favorite the gallery item immediately on touch devices
      if ( self.isTouch ) {
        $favorites
          .on('touchend', $.proxy( self.onFavorite, self ))
          .on('click', false);

      // Show a tooltip on hover before favoriting on desktop devices
      } else {
        $favorites.on('click', $.proxy( self.onFavorite, self ));

        $favorites.tooltip({
          placement: 'offsettop',
          title: function() {
            var $jsFavorite = $(this);
            return self.getFavoriteContent( $jsFavorite, $jsFavorite.hasClass('active') );
          },
          template: '<div class="tooltip gallery-tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
        });
      }

      $favorites = null;

      // Update our favorites
      self.$favorites = self.$grid.find('.js-favorite');
    },

    initCarousels : function() {
      var self = this;

      function initializeScroller( $carousel ) {
        $carousel.scrollerModule({
          mode: 'carousel',
          contentSelector: '.js-carousel-container',
          itemElementSelector: '.slide'
        });

        self.hasEnabledCarousels = true;
      }

      // Go through each possible carousel
      if ( !self.hasEnabledCarousels ) {
        self.$carousels.each(function(i,e) {
          var $carousel = $(e),
              $firstImage;

          // If this call is from the initial setup, we have to wait for the first image to load
          // to get its height.
          $firstImage = $carousel.find('img').first();

          if ( $firstImage[0].naturalHeight > 0 ) {
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

      if ( self.hasCarousels ) {
        // 980+
        if ( Modernizr.mq('(min-width: 61.25em)') ) {
          self.initCarousels();
        } else {
          self.destroyCarousels();
        }
      }
    },

    setFilterStatuses : function() {
      var self = this,
          $visible = self.shuffle.$items.filter('.filtered'),
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
      self.$productCount.text( $visible.length );

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

      delay = self.isTouch ? 1000 : 750,
      method = self.isTouch ? 'debounce' : 'throttle',
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

      // On handle slid, update. Register before initialized so it's called during initialization
      self.$rangeControl.on('slid.rangecontrol', update);

      self.$rangeControl.rangeControl({
        initialMin: '0%',
        initialMax: '100%',
        range: true,
        rangeThreshold: 0.25
      });

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

    // sortComparedItems : function( evt ) {
    //   var self = this,
    //       sortObj = self.getSortObject( evt, self.$compareTool.find('.js-toggle-text') ),
    //       sortedItems,
    //       frag = document.createDocumentFragment();

    //   // Sort elements
    //   sortedItems = self.$compareItems.sorted( sortObj );

    //   // Remove old elements from DOM
    //   self.$compareItems.detach();

    //   // Not default order
    //   if ( sortObj.by ) {
    //     // Append sorted elements to a document fragment
    //     $.each(sortedItems, function(i, element) {
    //       frag.appendChild( element );
    //     });

    //     // Append document fragment to the compare-item container
    //     self.$compareTool.find('.compare-items-container').append( frag );

    //     // Save our new compare items
    //     self.$compareItems = $( sortedItems );

    //   // Default order is saved in the state variable
    //   } else {
    //     self.$compareItems = self.compareState.$items;
    //     self.$compareTool.find('.compare-items-container').append( self.$compareItems );
    //   }

    //   // Make sure we can press reset (if it wasn't manually triggered)
    //   if ( !evt.isTrigger ) {
    //     self.$compareReset.removeClass('disabled');
    //   }

    //   return self;
    // },

    onResize : function( isInit, force ) {
      var self = this,
          windowWidth = self.$window.width(),
          windowHeight = self.$window.height(),
          hasWindowChanged = windowWidth !== self.windowWidth || windowHeight !== self.windowHeight;

      // Make sure isInit is not an event object
      isInit = isInit === true;

      // Return if the window hasn't changed sizes or the gallery is disabled
      if ( !force && !isInit && (!self.enabled || !hasWindowChanged) ) {
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

        // Move sort options around
        if ( Modernizr.mq('(max-width: 47.9375em)') ) {
          if ( !self.hasSorterMoved ) {
            var $sorter = self.$sortOpts.detach();
            $sorter.insertAfter( self.$container.find('.slide-toggle-target') );
            $sorter.wrap('<div id="sort-options-holder" class="container"><div class="grid"></div></div>');
            self.hasSorterMoved = true;
          }
        } else {
          if ( self.hasSorterMoved ) {
            self.$sortOpts.detach().appendTo( self.$container.find('.slide-toggle-parent .grid') );
            self.$container.find('#sort-options-holder').remove();
            self.hasSorterMoved = false;
          }
        }


        // Tell infinite scroll to update where it thinks it's target it
        if ( self.hasInfiniteScroll ) {
          setTimeout(function() {
            self.$grid.infinitescroll('updateNavLocation');
          }, 25);
        }

        if ( self.$rangeControl ) {
          self.$rangeControl.rangeControl('reset');
        }

        return;
      }


      // Make all product name heights even
      self.$gridProductNames.evenHeights();

      Utilities.forceWebkitRedraw();

      self.fixCarousels();

      self.sortByPriority();
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
          content = self.isTouch ? '' : self.getFavoriteContent( $jsFavorite, isAdding );

      $jsFavorite.toggleClass('active');

      // Show the tooltip if it isn't a touch device
      if ( !self.isTouch ) {
        $('.gallery-tooltip .tooltip-inner')
          .html( content )
          .tooltip('show');
      }


      // Stop event from bubbling to <a> tag
      evt.preventDefault();
      evt.stopPropagation();
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

      // Product names get zero height in IE8
      if ( Settings.isLTIE9 ) {
        setTimeout(function() {
          self.$gridProductNames.evenHeights();
        }, 1000);
      }

      // Fade in the gallery if it isn't already
      if ( !self.$container.hasClass('in') ) {
        setTimeout(function() {
          module.removeGalleryLoader();
          self.$container.addClass('in');
        }, 0);
      }
    },

    // onCompareLaunch : function() {
    //   var self = this,

    //       // Clone all visible
    //       $currentItems = self.shuffle.$items.filter('.filtered').clone(),
    //       $compareItemsContainer = $('<div class="compare-items-container grab">'),
    //       $compareItemsWrapper = $('<div class="compare-items-wrap">'),

    //       // Get product count
    //       productCount = $currentItems.length,

    //       $container = $('<div class="container js-compare-wrap">'),
    //       $content = $('<div class="compare-container clearfix">'),
    //       $header = self.$compareTool.find('.modal-header'),
    //       $modalBody = self.$compareTool.find('.modal-body'),

    //       $label = self.$compareTool.find('#compare-tool-label'),
    //       originalLabel = $label.text(),

    //       $labelColumnWrap = $('<div class="span2 detail-labels-wrap hidden-phone">'),
    //       $labelColumn = $('<div class="detail-labels-wrapping">'),
    //       $labelGroup = $('<div class="detail-label-group">'),

    //       // Clone sort button
    //       $sortOpts = self.$container.find('.sort-options').clone();

    //   // Disable the main gallery (from executing resize events, etc.)
    //   self.disable();

    //   self.compareTitle = originalLabel + ' ' + self.$container.find('.compare-name').text();

    //   // Clone the product count
    //   self.$compareCountWrap = self.$container.find('.product-count-wrap').clone().removeClass('ib');

    //   // Create reset button
    //   self.$compareReset = $('<button/>', {
    //       'class' : 'btn btn-small btn-alt-special btn-reset disabled js-compare-reset',
    //       'text' : $header.data('resetLabel')
    //   });
    //   self.$compareReset.append('<i class="fonticon-10-circlearrow">');
    //   self.$compareReset.on('click', $.proxy( self.onCompareReset, self ));

    //   self.isFixedHeader = false;

    //   self.$detailLabelsWrap = $labelColumnWrap;
    //   self.$compareItemsWrap = $compareItemsWrapper;

    //   // Convert cloned gallery items to compare items
    //   self.$compareItems = self.getCompareItems( $currentItems );

    //   // Create sticky header for count
    //   $labelColumnWrap
    //     .append('<div class="span2 compare-sticky-header sticky-count">')
    //     .find('.compare-sticky-header')
    //     .append( self.$compareCountWrap.clone() );

    //   // Create labels column
    //   self.$container.find('.comparables [data-label]').each(function() {
    //       var $label = $(this).clone(),
    //           $strong = $('<strong/>');

    //       $strong.text( $label.attr('data-label') );
    //       $label.append( $strong );
    //       $labelGroup.append($label);
    //   });

    //   // Remove compare items on click
    //   self.$compareItems.find('.compare-item-remove').on('click', $.proxy( self.onCompareItemRemove, self ));

    //   // Set up sort events
    //   $sortOpts.find('.dropdown a').on('click', $.proxy( self.sortComparedItems, self ));
    //   $sortOpts.find('.native-dropdown').on('change', $.proxy( self.sortComparedItems, self ));

    //   // Set the right heading. e.g. Compare Cyber-shot®
    //   $label.text( self.compareTitle );

    //   if ( !self.isUsingOuterScroller ) {
    //     self.$compareTool.addClass('native-scrolling');
    //   }

    //   if ( !self.showCompareStickyHeaders ) {
    //     self.$compareTool.addClass('no-sticky-headers');
    //   }

    //   self.compareWindowWidth = self.windowWidth;
    //   self.compareWindowHeight = self.windowHeight;

    //   // Save state for reset
    //   self.compareState = {
    //       count: productCount,
    //       sort: self.currentSort,
    //       $items : self.$compareItems,
    //       label: originalLabel,
    //       snap: true
    //   };

    //   // Append count and labels
    //   $labelColumn.append( self.$compareCountWrap );

    //   // On window resize
    //   self.$window.on('resize.comparetool', $.debounce(350, function() {
    //     self.onCompareResize( $header, $sortOpts );
    //   }));
    //   self.onCompareResize( $header, $sortOpts, true );

    //   self.$compareReset.addClass('pull-right');
    //   $labelColumn.append( $labelGroup );

    //   // Set current sort. After saving state so we get the correct DOM order for compareItems
    //   self.updateSortDisplay( $sortOpts );

    //   $labelColumnWrap.append( $labelColumn );
    //   $content.append( $labelColumnWrap );
    //   $compareItemsContainer.append( self.$compareItems );
    //   $compareItemsWrapper.append( $compareItemsContainer );
    //   $content.append( $compareItemsWrapper );
    //   $container.append( $content );
    //   $modalBody.append( $container );

    //   // Could probably be deferred
    //   self.addCompareNav( $compareItemsWrapper );

    //   // Cloned images need to be updated
    //   iQ.update( true );

    //   // Save a reference to the count
    //   self.$compareCount = self.$compareTool.find('.product-count');
    //   // Set item count
    //   self.$compareCount.text( productCount );

    //   // Save refs
    //   self.$stickyHeaders = self.$compareTool.find('.compare-sticky-header');
    //   self.$compareProductNameWraps = self.$compareTool.find('.gallery-item-inner .product-name-wrap');
    //   self.$compareItemsContainer = self.$compareTool.find('.compare-items-container');

    //   // Trigger modal
    //   self.$compareTool
    //     .data('galleryId', self.id) // Set some data on the modal so we know which gallery it belongs to
    //     .modal({
    //       backdrop: false
    //     }); // Show the modal

    // },

    // onCompareShown : function() {
    //   var self = this;

    //   self.isCompareToolOpen = true;
    //   self.stickyTriggerPoint = self.getCompareStickyTriggerPoint();

    //   // Set a margin-left on the compare items wrap
    //   if ( !self.isFixedHeader ) {
    //     self.$compareItemsWrap.css('marginLeft', self.$detailLabelsWrap.width());
    //   }

    //   // Set the height, jQuery object, and text of the takeover sticky nav
    //   self.setTakeoverStickyHeader( self.compareTitle );

    //   self
    //     .setCompareRowHeights()
    //     .setCompareDimensions()
    //     .setCompareItemsOffset()
    //     .setStickyHeaderPos( 0 );

    //   // Nested iscroll isn't working on android 4.1.1
    //   if ( self.isUsingOuterScroller ) {

    //     // Initialize outer scroller (vertical scrolling of the fixed position modal)
    //     self.outerScroller = new IScroll( self.$compareTool[0], {
    //       bounce: false,
    //       hScrollbar: false,
    //       vScrollbar: false,
    //       onBeforeScrollStart : function(e) {
    //         var target = e.target;
    //         while ( target.nodeType !== 1 ) {
    //           target = target.parentNode;
    //         }

    //         if ( target.tagName !== 'SELECT' && target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' ) {
    //           e.preventDefault();
    //         }

    //         // Add `grabbing` class
    //         if ( !self.isTouch && !self.$compareItemsContainer.hasClass('grabbing') ) {
    //           self.$compareItemsContainer.addClass('grabbing');
    //         }
    //       },
    //       onBeforeScrollEnd : function() {
    //         // Remove `grabbing` class
    //         if ( !self.isTouch && self.$compareItemsContainer.hasClass('grabbing') ) {
    //           self.$compareItemsContainer.removeClass('grabbing');
    //         }
    //       },
    //       onScrollMove : function() {
    //         self.onCompareScroll( self.stickyTriggerPoint, this );
    //       },
    //       onAnimate : function() {
    //         self.onCompareScroll( self.stickyTriggerPoint, this );
    //       },
    //       onAnimationEnd : function() {
    //         iQ.update();
    //         self.onCompareScroll( self.stickyTriggerPoint, this );
    //       }
    //     });

    //   } else {
    //     self.$compareTool.on('scroll', function() {
    //       self.onCompareScroll( self.stickyTriggerPoint );
    //       iQ.update();
    //     });
    //     // self.$compareTool.on('touchmove', function(e) {
    //     //   e.stopPropagation();
    //     // });
    //   }


    //   // Initialize inner scroller (for the comparable product items)
    //   self.innerScroller = new IScroll( self.$compareTool.find('.compare-items-wrap')[0], {
    //     vScroll: false,
    //     // hScrollbar: self.isTouch,
    //     // snap: '.compare-item',
    //     snap: self.compareState.snap, // this is required for iscroll.scrollToPage
    //     bounce: false,
    //     onBeforeScrollStart : function() {

    //       // Add `grabbing` class
    //       if ( !self.isTouch && !self.$compareItemsContainer.hasClass('grabbing') ) {
    //         self.$compareItemsContainer.addClass('grabbing');
    //       }
    //     },
    //     onBeforeScrollEnd : function() {
    //       // Remove `grabbing` class
    //       if ( !self.isTouch && self.$compareItemsContainer.hasClass('grabbing') ) {
    //         self.$compareItemsContainer.removeClass('grabbing');
    //       }
    //     },
    //     onScrollMove : function() {
    //       self.onCompareScroll( 'inner', this );
    //     },
    //     onAnimate : function() {
    //       self.onCompareScroll( 'inner', this );
    //     },
    //     onAnimationEnd : function() {
    //       iQ.update();
    //       self.onCompareScroll( 'inner', this );
    //       self.afterCompareScrolled( this );
    //     }
    //   });

    //   // Fade in the labels to hide the fact that it took so long to compute heights.
    //   self.$compareTool.find('.detail-labels-wrapping').addClass('complete');

    //   // These can be deferred
    //   setTimeout(function() {
    //     iQ.update();

    //     // Hide the previous nav paddle because we're on the first page
    //     self.afterCompareScrolled( self.innerScroller );

    //     // Bind events to the paddles
    //     self.addCompareNavEvents();

    //     // Get an updated value for how much the compare sticky headers should be offset
    //     self.setCompareItemsOffset();

    //   }, 250);

    //   return self;
    // },

    // onCompareClosed : function() {
    //   var self = this;

    //   if ( self.$compareTool.data('galleryId') !== self.id ) {
    //     return;
    //   }

    //   self.isCompareToolOpen = false;

    //   // Delete the id from memory
    //   self.$compareTool.removeData('galleryId');

    //   // Clean up
    //   self.$compareTool.find('.sort-options').remove();
    //   self.$takeoverStickyHeader.removeClass('open').removeAttr('style');

    //   // Destroy iscrolls
    //   if ( self.isUsingOuterScroller ) {
    //     self.outerScroller.destroy();
    //   } else {
    //     self.$compareTool.off('scroll');
    //     self.$compareTool.removeClass('native-scrolling');
    //   }
    //   self.innerScroller.destroy();

    //   // Remove listeners for nav button clicks
    //   self.removeCompareNavEvents();

    //   // Empty out html
    //   // Remove scroll event
    //   self.$compareTool
    //     .find('.js-compare-wrap')
    //     .remove()
    //     .end()
    //     .find('.modal-subheader')
    //     .remove()
    //     .end()
    //     .find('#compare-tool-label')
    //     .text( self.compareState.label )
    //     .end()
    //     .off('.comparetool');

    //   // Set count to zero
    //   self.$compareCount.text(0);

    //   self.$compareReset.remove();
    //   self.$compareReset = null;
    //   self.$compareItems = null;
    //   self.$compareItemsContainer = null;
    //   self.$compareItemsWrap = null;
    //   self.$compareNav = null;
    //   self.$detailLabelsWrap = null;
    //   self.$takeoverStickyHeader = null;

    //   // Set state to null
    //   self.compareState = null;
    //   self.isFixedHeader = null;
    //   self.compareTitle = null;
    //   self.compareItemOffset = null;
    //   self.compareWindowWidth = null;
    //   self.compareWindowHeight = null;

    //   // Remove resize event
    //   self.$window.off('.comparetool');

    //   self.enable();

    //   return self;
    // },

    // onCompareReset : function() {
    //   var self = this,
    //       state = self.compareState;

    //   if ( self.$compareReset.hasClass('disabled') || self.$compareTool.data('galleryId') !== self.id ) {
    //     return;
    //   }

    //   self.$compareCount.text( state.count );
    //   state.$items
    //     .find('.compare-item-remove')
    //     .parent()
    //     .addBack()
    //     .removeClass('hide faded no-width');

    //   // Disable reset button
    //   self.$compareReset.addClass('disabled').removeClass('active');

    //   // Reset sort
    //   self.updateSortDisplay( self.$compareTool );

    //   // Set container width
    //   self.setCompareWidth();

    //   // Reset iscroll
    //   self.innerScroller.refresh();

    //   self.afterCompareScrolled( self.innerScroller );

    //   return self;
    // },

    // onCompareItemRemove : function( evt ) {
    //   var self = this,
    //       remaining,
    //       $compareItem = $(evt.target).closest('.compare-item');

    //   function afterHidden() {
    //     // console.log('Finished', $compareItem.index(), ':', evt.originalEvent.propertyName);
    //     // Hide the column
    //     $compareItem.addClass('hide');

    //     // Make sure we can press reset
    //     self.$compareReset.removeClass('disabled').addClass('active');

    //     // Get remaining
    //     remaining = self.$compareItems.not('.hide').length;

    //     // Set remaining text
    //     self.$compareCount.text( remaining );

    //     // Hide close button if there are only 2 left
    //     if ( remaining < 3 ) {
    //       self.$compareTool.find('.compare-item-remove').addClass('hide');
    //     }

    //     self.setCompareWidth();
    //     self.innerScroller.refresh();
    //     self.afterCompareScrolled( self.innerScroller );

    //     // Maybe they haven't scrolled horizontally to see other images
    //     iQ.update();
    //   }

    //   function noWidth() {
    //     // console.log('Finished', $compareItem.index(), ':', evt.originalEvent.propertyName );
    //     $compareItem
    //       .one( $.support.transition.end, afterHidden )
    //       .addClass('no-width');
    //   }

    //   if ( Modernizr.csstransitions ) {
    //     // console.log('adding opacity:0');
    //     $compareItem
    //       .one( $.support.transition.end, noWidth )
    //       .addClass('faded');
    //   } else {
    //     afterHidden();
    //   }

    //   return self;
    // },

    // onCompareResize : function( $header, $sortOpts, isFirst ) {
    //   var self = this,
    //       windowWidth = self.$window.width(),
    //       windowHeight = self.$window.height(),
    //       hasWindowChanged = windowWidth !== self.compareWindowWidth || windowHeight !== self.compareWindowHeight,
    //       $subheader,
    //       $resetBtn,
    //       $sorter,
    //       snap;

    //   // If we somehow got here and the compare tool is closed or the window hasn't actually resized, return
    //   if ( !isFirst && (!self.isCompareToolOpen || !hasWindowChanged) ) {
    //     return;
    //   }

    //   self.compareWindowWidth = windowWidth;
    //   self.compareWindowHeight = windowHeight;

    //   // Phone = sticky header
    //   if ( Modernizr.mq('(max-width: 47.9375em)') ) {

    //     // Setup sticky header
    //     if ( isFirst || !self.isFixedHeader ) {
    //       self.isFixedHeader = true;

    //       $subheader = $('<div class="modal-subheader clearfix">');
    //       self.$compareCountWrap.addClass('hidden');

    //       // If this isn't the first call, the elements are already on the page and need to be detached
    //       $resetBtn = isFirst ? self.$compareReset : self.$compareReset.detach();
    //       $sorter = isFirst ? $sortOpts : $sortOpts.detach();

    //       // Put the dropdown menu on the left
    //       if ( !self.isTouch ) {
    //         $sorter.find('.dropdown-menu').removeClass('pull-right');
    //       }

    //       $subheader.append( $resetBtn, $sorter );

    //       // Insert subhead in the modal header
    //       $header.append( $subheader );

    //       self.$compareItemsWrap.css('marginLeft', '');

    //       snap = false;

    //       // Let the scroller flow freely on mobile
    //       if ( self.innerScroller ) {
    //         self.innerScroller.options.snap = snap;
    //       }
    //     }

    //   // Larger than phone
    //   } else {

    //     // Set a margin-left on the compare items wrap
    //     self.$compareItemsWrap.css('marginLeft', self.$detailLabelsWrap.width());

    //     if ( isFirst || self.isFixedHeader ) {
    //       self.isFixedHeader = false;

    //       self.$compareCountWrap.removeClass('hidden');

    //       // Append sort dropdown
    //       // If this isn't the first call, the elements are already on the page and need to be detached
    //       $resetBtn = isFirst ? self.$compareReset : self.$compareReset.detach();
    //       $sorter = isFirst ? $sortOpts : $sortOpts.detach();

    //       // Make dropdown menu on the right
    //       if ( !self.isTouch ) {
    //         $sorter.find('.dropdown-menu').addClass('pull-right');
    //       }

    //       $header.append( $resetBtn, $sorter );

    //       self.$compareTool.find('.modal-subheader').remove();


    //       snap = true;

    //       // Snap to pages on 'desktop'
    //       if ( self.innerScroller ) {
    //         self.innerScroller.options.snap = snap;
    //       }
    //     }
    //   }

    //   // This is where you get off, first guy
    //   if ( isFirst ) {
    //     self.compareState.snap = snap;
    //     return self;
    //   }

    //   self.stickyTriggerPoint = self.getCompareStickyTriggerPoint();

    //   self
    //     .setCompareRowHeights()
    //     .setCompareDimensions()
    //     .setCompareItemsOffset()
    //     .setStickyHeaderPos();


    //   self.innerScroller.refresh();

    //   return self;
    // },

    // onCompareScroll : function( offsetTop, iscroll ) {
    //   var self = this,
    //       scrollTop = self.isUsingOuterScroller ? iscroll.y * -1 : self.$compareTool.scrollTop();

    //   // Determine if this is the inner scroller
    //   if ( offsetTop === 'inner' ) {
    //     if ( iscroll.x < -3 && !self.$detailLabelsWrap.hasClass('overflowing') ) {
    //       self.$detailLabelsWrap.addClass('overflowing');
    //     } else if ( iscroll.x >= -3 && self.$detailLabelsWrap.hasClass('overflowing') ) {
    //       self.$detailLabelsWrap.removeClass('overflowing');
    //     }
    //     return;
    //   }

    //   if ( scrollTop >= offsetTop ) {
    //     if ( !self.$stickyHeaders.hasClass('open') ) {
    //       self.$compareNav.addClass('sticky-nav-open');
    //       self.$takeoverStickyHeader.addClass('open');
    //       self.$stickyHeaders.addClass('open');
    //     }

    //     self.setStickyHeaderPos( scrollTop );

    //   } else {
    //     if ( self.$stickyHeaders.hasClass('open') ) {
    //       self.$compareNav.removeClass('sticky-nav-open');
    //       self.$takeoverStickyHeader.removeClass('open');
    //       self.$stickyHeaders.removeClass('open');
    //     }
    //   }
    // },

    // getCompareStickyTriggerPoint : function() {
    //   var self = this,
    //       offsetTop = 0,
    //       extra = 0;

    //   offsetTop = self.$compareItems.not('.hide').offset().top;

    //   // see http://bugs.jquery.com/ticket/8362
    //   if ( offsetTop < 0 && Modernizr.csstransforms ) {
    //     var matrix = Utilities.parseMatrix( self.$compareTool.find('.modal-inner').css('transform') );
    //     offsetTop = -matrix.translateY + offsetTop;
    //   }

    //   extra = parseInt( self.$compareTool.find('.compare-item .product-img').last().css('height'), 10 );

    //   return offsetTop + extra;
    // },

    // getCompareItems : function( $items ) {
    //   var $newItems = $();

    //   // Build / manipulate compare items from the gallery items
    //   $items.each(function() {
    //     var $item = $(this),
    //         $swatches,
    //         $div = $('<div/>'),
    //         $stickyHeader;

    //     // Create remove button, show detail group, remove label, remove product-meta,
    //     // wrap name and model in a container (to set the height on), create fixed header clones
    //     $item
    //       .removeClass()
    //       .addClass('span4 compare-item')
    //       .removeAttr('style')
    //       .append('<span class="box-close box-close-small compare-item-remove"><i class="fonticon-10-x"></i></span>')
    //       .find('.detail-group')
    //         .removeClass('hidden')
    //         .end()
    //       .find('.label, .product-meta, .js-favorite')
    //         .remove()
    //         .end()
    //       .find('.product-name-wrap')
    //         .css('height', '')
    //         .end()
    //       .prepend('<div class="span4 compare-sticky-header">')
    //       .find('.compare-sticky-header')
    //         .append('<div class="media">');

    //     // Remove and reattach the swatches to after the price
    //     $swatches = $item.find('.product-img .color-swatches').detach();
    //     $item.find('.product-price').after($swatches);

    //     $stickyHeader = $item.find('.compare-sticky-header');
    //     // Needed to detach swatches before cloning!

    //     // Compare X
    //     $item
    //       .find('.compare-item-remove')
    //       .clone(true) // true for compare item remove's functionality
    //       .appendTo( $stickyHeader );

    //     // Product image to media object
    //     $item
    //       .find('.product-img .js-product-img-main')
    //       .clone()
    //       .addClass('media-object')
    //       .appendTo( $stickyHeader.find('.media') )
    //       .wrap('<div class="pull-left">');

    //     // Product name wrap to media object
    //     $item
    //       .find('.product-name-wrap')
    //       .clone()
    //       .addClass('media-body')
    //       .appendTo( $stickyHeader.find('.media') );

    //     // Swap .p2 for .p3
    //     $stickyHeader
    //       .find('.product-name')
    //       .addClass('p3')
    //       .removeClass('p2');


    //     // Create a new div with the same attributes as the anchor tag
    //     // We no longer want the entire thing to be clickable
    //     $div.attr({
    //         'class' : $item.attr('class'),
    //         'data-filter-set' : $item.attr('data-filter-set')
    //     });

    //     $div.append( $item.children().detach() );
    //     $newItems = $newItems.add( $div );
    //   });

    //   return $newItems;
    // },

    // addCompareNav : function( $parent ) {
    //   var $navContainer = $('<nav class="compare-nav">'),
    //       $prevPaddle = $('<button class="nav-paddle nav-prev"><i class="fonticon-10-chevron-reverse"></i></button>'),
    //       $nextPaddle = $('<button class="nav-paddle nav-next"><i class="fonticon-10-chevron"></i></button>');

    //   $navContainer.append( $prevPaddle, $nextPaddle );
    //   $parent.append( $navContainer );

    //   this.$compareNav = $navContainer;
    // },

    // addCompareNavEvents : function() {
    //   var self = this,
    //       iscroll = self.innerScroller,
    //       $prev = self.$compareTool.find('.nav-prev'),
    //       $next = self.$compareTool.find('.nav-next');

    //   $prev.on('click', function() {
    //     iscroll.scrollToPage('prev');
    //   });

    //   $next.on('click', function() {
    //     iscroll.scrollToPage('next');
    //   });
    // },

    // afterCompareScrolled : function( iscroll ) {
    //   var self = this,
    //       $prev = self.$compareTool.find('.nav-prev'),
    //       $next = self.$compareTool.find('.nav-next');

    //   // Hide show prev button depending on where we are
    //   if ( iscroll.currPageX === 0 ) {
    //     $prev.addClass('hide');
    //   } else {
    //     $prev.removeClass('hide');
    //   }

    //   // Hide show next button depending on where we are
    //   if ( iscroll.currPageX === iscroll.pagesX.length - 1 ) {
    //     $next.addClass('hide');
    //   } else {
    //     $next.removeClass('hide');
    //   }
    // },

    // removeCompareNavEvents : function() {
    //   this.$compareTool.find('.compare-nav').children().off('click');
    // },

    // setTakeoverStickyHeader : function( title ) {
    //   var self = this;
    //   self.$takeoverStickyHeader = self.$compareTool.find('.takeover-sticky-header');
    //   self.$takeoverStickyHeader.find('.sticky-nav-title').text( title );
    //   self.takeoverHeaderHeight = self.$takeoverStickyHeader.outerHeight();
    // },

    getY : function( y ) {
      return [ this.valStart, y, this.valEnd, this.translateZ ].join('');
    },

    // setCompareItemsOffset : function() {
    //   var self = this;

    //   if ( self.isUsingOuterScroller ) {
    //     var $containerWithTransform = self.$compareTool.find('.modal-inner'),
    //         temp = $containerWithTransform.css('transform');

    //     if ( temp !== 'none' ) {
    //       $containerWithTransform.css('transform', '');
    //     }

    //     self.compareItemOffset = self.$compareItemsWrap.offset().top;

    //     if ( temp !== 'none' ) {
    //       $containerWithTransform.css('transform', temp);
    //     }

    //   } else {
    //     self.compareItemOffset = self.$compareItemsWrap.offset().top;
    //   }

    //   return self;
    // },

    // Elements here cannot use `fixed` positioning because of a webkit bug.
    // Fixed positions don't work inside an element which has `transform` on it.
    // https://code.google.com/p/chromium/issues/detail?id=20574
    // setStickyHeaderPos : function( scrollTop ) {
    //   var self = this,
    //       offset,
    //       compareOffset,
    //       takeoverValue,
    //       compareValue;

    //   if ( !self.showCompareStickyHeaders ) {
    //     return;
    //   }

    //   // If we're not given a scrollTop, figure it out
    //   if ( scrollTop || scrollTop === 0 ) {
    //     scrollTop = scrollTop;
    //   } else {
    //     scrollTop = self.isUsingOuterScroller ?
    //       self.outerScroller.y * -1 :
    //       self.$compareTool.scrollTop();
    //   }

    //   offset = scrollTop - self.compareItemOffset;

    //   compareOffset = offset + self.takeoverHeaderHeight;

    //   // We really shouldn't get to this point anyways... IE8
    //   if ( compareOffset < 0 ) {
    //     return;
    //   }

    //   compareValue = self.getY( compareOffset );

    //   // Position the sticky headers. These are relative to .compare-item
    //   self.$stickyHeaders.css( self.prop, compareValue );

    //   if ( self.isUsingOuterScroller ) {
    //     takeoverValue = self.getY( scrollTop );

    //     // Position takeover header. This is relative to .modal-inner,
    //     // so we can take the outer scroller's y offset
    //     self.$takeoverStickyHeader.css( self.prop, takeoverValue );
    //   }



    //   return self;
    // },

    setColumnMode : function() {
      var self = this;

      if ( self.mode !== 'detailed' ) {
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

          // // Portrait Tablet ( 4 columns ) - masonry
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
      } else {
        self.shuffleColumns = Utilities.masonryColumns;
        self.shuffleGutters = Utilities.masonryGutters;
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
    }

    // setCompareDimensions : function() {
    //   return this
    //     .setCompareHeight()
    //     .setCompareWidth();
    // },

    // setCompareHeight : function() {
    //   var self = this,
    //       windowHeight = Settings.isIPhone || Settings.isAndroid ? window.innerHeight : self.$window.height(); // document.documentElement.clientHeight also wrong

    //   self.$compareTool.find('.compare-container').height( self.$compareItems.first().height() );
    //   self.$compareTool.height( windowHeight );

    //   return self;
    // },

    // setCompareWidth : function() {
    //   var self = this,
    //       contentWidth = 0;

    //   // Count it
    //   self.$compareItems.not('.hide').each(function() {
    //     contentWidth += $(this).outerWidth(true);
    //   });

    //   // Set it
    //   self.$compareTool.find('.compare-items-container').width( contentWidth );

    //   return self;
    // },

    // setCompareRowHeights : function() {
    //   var self = this,
    //       $detailGroup = self.$compareItems.not('.hide').find('.detail-group').first(),
    //       offset = 0;

    //   self.$stickyHeaders.evenHeights();

    //   // Set the height of the product name + model because the text can wrap and make it taller
    //   self.$compareProductNameWraps.evenHeights();

    //   // Set detail rows to even heights
    //   self.$compareTool.find('.detail-label').each(function(i) {
    //     var $detailLabel = $(this),
    //         $detail = self.$compareItems.find('.detail:nth-child(' + (i + 1) + ')');

    //     // Find all detail lines that have this "name"
    //     $detail.add($detailLabel).evenHeights();
    //   });

    //   // Set the top offset for the labels
    //   offset = $detailGroup.position().top;
    //   offset += parseFloat( $detailGroup.css('marginTop') );
    //   self.$compareTool.find('.detail-label-group').css('top', offset);

    //   // Refresh outer iScroll
    //   if ( self.outerScroller ) {
    //     self.outerScroller.refresh();
    //   }

    //   return self;
    // }

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
    isCompareToolOpen: false,
    isTouch: Settings.hasTouchEvents,
    isiPhone: Settings.isIPhone,
    sorted: false,
    // isUsingOuterScroller: !( Settings.isLTIE9 || Settings.isPS3 ),
    // showCompareStickyHeaders: true,
    currentFilterColor: null,
    lastFilterGroup: null,
    lastFilterStatuses: null,
    secondLastFilterGroup: null,
    secondLastFilterStatuses: null,
    loadingGif: 'img/loader.gif',
    prop: Modernizr.csstransforms ? 'transform' : 'top',
    valStart : Modernizr.csstransforms ? 'translate(0,' : '',
    valEnd : Modernizr.csstransforms ? 'px)' : 'px',
    translateZ : Modernizr.csstransforms3d ? ' translateZ(0)' : ''
  };


  // Event triggered when this tab is about to be shown
  module.onGalleryTabShow = function( evt ) {
    var $prevPane;

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
      if ( gallery.hasActiveFilters() ) {
        gallery.removeActiveFilters();
      }

      gallery.disable();
    });

    $prevPane = null;

  };

  // Event triggered when tab pane is finished being shown
  module.onGalleryTabShown = function( evt ) {
    // Only continue if this is a tab shown event.
    var $pane,
        $galleries;

    if ( evt ) {
      $pane = evt.pane;
      if ( evt.pane ) {
        $pane = evt.pane;
      } else if ( evt.originalEvent && evt.originalEvent.pane ) {
        $pane = evt.originalEvent.pane;
      } else {
        $pane = false;
      }
    }

    if ( !evt || !$pane ) {
      return;
    }

    $galleries = $pane.find('.gallery');

    // Force redraw before fixing galleries
    Utilities.forceWebkitRedraw();

    $galleries.each(function() {
      var gallery = $(this).data('gallery'),
          $collapse = gallery.$container.find('[data-toggle="collapse"]');

      // Enable all galleries in this tab
      gallery.enable();

      // Slide up the collapsable if it's visible
      if ( $collapse.length && !$collapse.hasClass('collapsed') ) {
        $collapse.click();
      }

      if ( gallery ) {
        gallery.fixCarousels();
      }
    });

    $galleries = null;
    $pane = null;
  };

  module.removeGalleryLoader = function() {
    if ( !module.galleryLoaderRemoved ) {
      $('.gallery-loader').first().remove();
    }
    module.galleryLoaderRemoved = true;
  };

  return module;

});
