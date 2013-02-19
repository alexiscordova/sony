/*global SONY*/

// * Module: Sticky Tabs
// * Version: 1.0
// * Modified: 01/28/2013
// * Dependencies: jQuery 1.7+, Modernizr
// * Author: Glen Cheney

(function($, Modernizr, window, undefined) {
  'use strict';

  var StickyTabs = function( $container, options ) {
    var self = this;

    $.extend(self, $.fn.stickyTabs.options, options, $.fn.stickyTabs.settings);

    // jQuery objects
    self.$container = $container;
    self._init();
  };

  StickyTabs.prototype = {

    constructor: StickyTabs,

    _init : function() {
      var self = this;

      self.$tabsWrap = $(self.tabsWrapSelector);
      self.$tabsContainer = self.$tabsWrap.parent();
      self.$tabs = self.$tabsWrap.children('.tab');

      // No tabs on the page
      if ( !self.$tabs.length ) { return; }

      // Set variables
      self.$activeTab = self.$tabs.filter('.active');
      self.$window = SONY.$window || $(window);
      self.windowWidth = self.$window.width();
      self.tabWidth = self.$tabs.outerWidth();
      self.tabletMode = self.$container.data('tabletMode');
      self.isCarousel = self.tabletMode === 'carousel';

      if ( self.isCarousel ) {
        self.$navNext = self.$container.find('.tab-nav-next');
        self.$navPrev = self.$container.find('.tab-nav-prev');
      }

      // New tab shown event
      self.$tabs.on('shown', $.proxy( self._onTabShown, self ));

      // Window resize
      self.$window.on('resize.stickytabs', $.debounce( 275, $.proxy( self._onResize, self ) ) );

      // Decide which tabs to make
      if ( Modernizr.mq( self.mq ) ) {
        self.setup();
      } else if ( self.isCarousel ) {
        self.setupCarousel();
      }
    },

    _getConstrained : function( value ) {
      return SONY.Utilities.constrain( value, 0, this.windowWidth - this.tabWidth );
    },

    _onResize : function() {
      var self = this;

      self.windowWidth = self.$window.width();
      self.tabWidth = self.$tabs.outerWidth();

      // Phone
      if ( Modernizr.mq( self.mq ) ) {
        if ( self.isTabCarousel ) {
          self.teardownCarousel();
        }

        if ( !self.isStickyTabs ) {
          self.setup();
        }

        self.animateTab();

      // Tablet
      } else if ( self.isCarousel ) {
        if ( self.isStickyTabs ) {
          self.teardown();
        }

        if ( !self.isTabCarousel ) {
          self.setupCarousel();
        }


      // Desktop
      } else {
        if ( self.isStickyTabs ) {
          self.teardown();
        }
        if ( self.isTabCarousel ) {
          self.teardownCarousel();
        }
      }
    },

    _onTabShown : function( evt ) {
      var self = this,
          $tab = $(evt.target);

      // Update iQ images
      window.iQ.update();

      // Save tab
      self.$activeTab = $tab;

      // Initialize new tab for sticky tabs
      if ( self.isStickyTabs ) {
        self._onTabSelected();
      }
    },

    // This is working fine
    _onTabSelected : function() {
      var self = this,
          css = { position: 'absolute' },
          tabOffsetFromContainer,
          constrainedXWithContainerOffset;

      // Remove the margins and position absolute from all tabs
      self.$tabs.removeAttr('style');

      // jQuery's `offset()` is unreliable because WebKit includes transforms and Gecko doesn't
      // in offset calculations http://bugs.jquery.com/ticket/8362
      // Get the offset with transform, then subtract the transform
      tabOffsetFromContainer = self.$activeTab[0].offsetLeft + self.scroller.x;

      constrainedXWithContainerOffset = self._getTabOffsetObj( tabOffsetFromContainer );

      // Save the tab's initial offset from its container
      self.initialOffset = tabOffsetFromContainer;

      // Save iscroll's current offset
      self.initialContainerOffset = self.scroller.x;

      // Set initail css on active tab
      css[ self.prop ] = constrainedXWithContainerOffset.str;
      self.$activeTab.css(css);

      // Add a margin to the next (or previous if it's the last tab) tab because
      // the active one is positioned absolutely, taking up no space
      if ( !self.$activeTab.is(':last-child') ) {
        self.$activeTab.next().css('marginLeft', self.tabWidth);
      } else {
        self.$activeTab.prev().css('marginRight', self.tabWidth);
      }

      // We've manipulated the DOM, refresh iScroll
      if ( self.scroller ) {
        self.scroller.refresh();
      }
    },

    // We know the offset we want within the container, but the container is translated too
    // This normalizes that value
    _getX : function( x ) {
      return [ this.valStart, x, this.valEnd ].join('');
    },

    _getTabOffsetObj : function( tabOffsetFromContainer ) {
      var self = this,
          constrainedX,
          constrainedXWithContainerOffset,
          currentScrollerX = self.scroller.x; // will be negative if on the left, + on the right

      // Constrain offset between 0 and window width
      constrainedX = self._getConstrained( tabOffsetFromContainer );

      // Add back the container offset
      constrainedXWithContainerOffset = constrainedX - currentScrollerX;

      // Reset the overlap (difference between our original offset and the new constrained value)
      self.overlap = tabOffsetFromContainer - constrainedX;

      // Return the plain number and the css value ( like 0 and translate(0px, 0))
      return {
        val: constrainedXWithContainerOffset,
        str: self._getX( constrainedXWithContainerOffset )
      };
    },

    animateTab : function() {
      var self = this,
          currentScrollerX = self.scroller.x,

          // Distance from when the tab was selected to now
          distanceFromInitial = self.initialContainerOffset - currentScrollerX,

          // Get the offset of the tab from its initial position
          tabOffsetFromContainer = self.initialOffset - distanceFromInitial,

          // Get the css value
          value = self._getTabOffsetObj( tabOffsetFromContainer ).str;

      // Prevent tab from being clicked if the scroller has moved.
      if ( self.scroller.moved && !self.isClickCanceled ) {
        // Passing false is shorthand for function(){ return false; },
        // which is shorthand for event.preventDefault(); event.stopPropagation();
        self.$tabs.on('click.stickytabs', false);
        self.isClickCanceled = true;
      }

      self.$activeTab.css( self.prop, value );
    },

    setup : function() {
      var self = this;

      self.$tabsContainer.scrollerModule({
        contentSelector: '.tabs',
        itemElementSelector: '.tab',
        mode: 'free',
        centerItems: false,

        //iscroll props get mixed in
        iscrollProps: {
          snap: false,
          hScroll: true,
          vScroll: false,
          hScrollbar: false,
          vScrollbar: false,
          momentum: true,
          bounce: true,
          onScrollStart: function() {
            self.isClickCanceled = false;
            self.$tabs.off('.stickytabs');
            self.animateTab();
          },
          onScrollMove: function() {
            self.animateTab();
          },
          onScrollEnd: function() {
            self.animateTab();
          },
          onAnimate: function() {
            self.animateTab();
          },
          onAnimationEnd: function() {
            self.animateTab();
          }
        },

        getContentWidth: function( $elements ) {
          var contentWidth = 0;

          $elements.each(function() {
            var pos = this.style.position,
                isOutOfFlow = pos === 'absolute',
                width = isOutOfFlow ? 0 : $(this).outerWidth( true );

            if ( !isOutOfFlow ) {
              contentWidth += width;
            }
          });

          return contentWidth;
        }
      });

      self.scroller = self.$tabsContainer.data('scrollerModule').scroller;

      self.isStickyTabs = true;
      self.$container.addClass('sticky');

      self._onTabSelected();
    },

    // Removes sticky tabs, but still listens for window resize
    teardown : function() {
      var self = this;

      self.$tabsContainer.scrollerModule('destroy');
      self.scroller = null;
      self.$container.removeClass('sticky');
      self.$tabs.off('.stickytabs');
      self.$tabs.removeAttr('style');
      self.isClickCanceled = false;
      self.overlap = null;
      self.isStickyTabs = false;
    },

    // Completely removes sticky tabs.
    // You'll need to call `.stickyTabs()` again to get them back.
    destroy : function() {
      var self = this;

      // If we haven't called `teardown` already
      if ( self.isStickyTabs ) {
        self.teardown();
      }

      // New tab `shown` event
      self.$tabs.off('shown');

      // Window resize
      self.$window.off('.stickytabs');

      // Remove saved data
      self.$container.removeData('stickyTabs');
    },

    setupCarousel : function() {
      var self = this;

      self.$navPrev.addClass('hide');
      self.$navNext.addClass('hide');

      self.$tabsContainer.scrollerModule({
        contentSelector: '.tabs',
        itemElementSelector: '.tab',
        mode: 'free',
        nextSelector: self.$navNext,
        prevSelector: self.$navPrev,
        centerItems: false,

        iscrollProps: {
          snap: true,
          hScroll: true,
          vScroll: false,
          hScrollbar: false,
          vScrollbar: false,
          momentum: true,
          bounce: true,
          onAnimationEnd : function( iscroll ) {
            if ( !iscroll.pagesX.length ) {
              return;
            }

            var totalPages = iscroll.pagesX.length,
                currentPage = iscroll.currPageX + 1; // zero based

            self.$tabsContainer.removeClass('has-content-right has-content-left');
            if ( totalPages > currentPage ) {
              self.$tabsContainer.addClass('has-content-right');
            }
            if ( currentPage > 1 ) {
              self.$tabsContainer.addClass('has-content-left');
            }
          }
        }
      });

      // Check to make sure we actually have paginated tabs
      if ( self.$tabsContainer.data('scrollerModule').scroller.pagesX.length > 1 ) {
        self.$navNext.removeClass('hide');
        self.$container.addClass('tab-carousel');
        self.$tabsContainer.addClass('has-content-right');
      }

      self.isTabCarousel = true;
    },

    teardownCarousel : function() {
      var self = this;

      self.$navPrev.addClass('hide');
      self.$navNext.addClass('hide');
      self.$container.removeClass('tab-carousel');
      self.$tabsContainer.scrollerModule('destroy');

      self.isTabCarousel = false;
    }

  };

  // Plugin definition
  $.fn.stickyTabs = function( options ) {
    var args = Array.prototype.slice.call( arguments, 1 );
    return this.each(function() {
      var self = $(this),
          stickyTabs = self.data('stickyTabs');

      // If we don't have a stored stickyTabs, make a new one and save it
      if ( !stickyTabs ) {
        stickyTabs = new StickyTabs( self, options );
        self.data( 'stickyTabs', stickyTabs );
      }

      if ( typeof options === 'string' ) {
        stickyTabs[ options ].apply( stickyTabs, args );
      }
    });
  };


  // Overrideable options
  $.fn.stickyTabs.options = {
    tabsWrapSelector: '.tabs',
    mq: '(max-width: 47.9375em)'
  };

  // Not overrideable
  $.fn.stickyTabs.settings = {
    tabWidth: 0,
    windowWidth: 0,
    overlap: 0,
    isStickyTabs: false,
    prop: Modernizr.csstransforms ? 'transform' : 'left',
    valStart : Modernizr.csstransforms ? 'translate(' : '',
    valEnd : Modernizr.csstransforms ? 'px,0)' : 'px'
  };

})(jQuery, Modernizr, window);

