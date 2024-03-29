// StickyTabs plugin
// ---------------------------
//
// * **Class:** StickyTabs
// * **Version:** 1.0
// * **Modified:** 06/03/2013
// * **Author:** Glen Cheney
// * **Dependencies:** jQuery 1.7+, Modernizr, Sony Settings|Utilties, sony-scroller
//
// *Notes:*
//
// * Requires css to go with it. See `_sticky-tabs.scss`
// * The current tab will stick to the left or right side while the tab strip slides under it
//
// *Example Usage:*
//
//      $('.tab-strip').stickyTabs();
//
// *Modules currently using it:*
//
// * gallery-g2-g3
// * single-spec-z1
//
// *Refactor notes:*
//
// The desired funciontality between mobile and desktop is the same,
// but because this changed so much throughout the course of developement
// there are two separate implementations for mobile/desktop. Ideally they should be combined

define(function(require){

  'use strict';

  var $ = require('jquery'),
      iQ = require('iQ'),
      Modernizr = require('modernizr'),
      Settings = require('require/sony-global-settings'),
      Utilities = require('require/sony-global-utilities');

  var StickyTabs = function( $container, options ) {
    var self = this;

    $.extend(self, $.fn.stickyTabs.options, options, $.fn.stickyTabs.settings);

    self.$container = $container;
    self._init();
  };

  StickyTabs.prototype = {

    constructor: StickyTabs,

    _init : function() {
      var self = this;

      // jQuery objects
      self.$tabsWrap = $(self.tabsWrapSelector);
      self.$tabsContainer = self.$tabsWrap.parent();
      self.$tabs = self.$tabsWrap.children('.tab');

      // No tabs on the page
      if ( !self.$tabs.length ) { return; }

      // Set variables
      self.$activeTab = self.$tabs.filter('.active');
      self.$window = Settings.$window;
      self.tabWidth = self.$tabs.outerWidth();
      self.tabsContainerWidth = self.$tabsContainer.width();
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
      return Utilities.constrain( value, 0, this.tabsContainerWidth - this.tabWidth );
    },

    _onResize : function() {
      var self = this;

      self.tabWidth = self.$tabs.outerWidth();
      self.tabsContainerWidth = self.$tabsContainer.width();

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

        self._onTabSelected();


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
      iQ.update();

      // Save tab
      self.$activeTab = $tab;

      // Initialize new tab for sticky tabs
      if ( self.isStickyTabs || self.isTabCarousel ) {
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

      // iScroll doesn't need to be refreshed here because the content width is the same as it was before
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
          momentum: self.useMomentum,
          bounce: self.useBounce,
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

      self.$tabsContainer.scrollerModule({
        contentSelector: '.tabs',
        itemElementSelector: '.tab',
        mode: 'free',
        nextSelector: self.$navNext,
        prevSelector: self.$navPrev,
        centerItems: false,

        iscrollProps: {
          snap: !self.isTouch,
          hScroll: true,
          vScroll: false,
          hScrollbar: false,
          vScrollbar: false,
          momentum: self.useMomentum,
          bounce: self.useBounce,
          onScrollStart: function() {
            self.isClickCanceled = false;
            self.$tabs.off('.stickytabs');
            self.animateTab();
          },
          onScrollMove: function() {
            self.animateTab();
            self.setOverflowClasses( this.x, this.maxScrollX + 3 );
          },
          onScrollEnd: function() {
            self.animateTab();
            if ( self.isClickCanceled ) {
              self.$tabs.off('.stickytabs');
            }
          },
          onAnimate: function() {
            self.animateTab();
          },
          onAnimationEnd: function( iscroll ) {
            self.animateTab();
            self.setOverflowClasses( iscroll.x, iscroll.maxScrollX + 3 );
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


      self.isTabCarousel = true;
      self._onTabSelected();
      self.$container.addClass('tab-carousel');
      self.setOverflowClasses( self.scroller.x, self.scroller.maxScrollX + 3 );
    },

    teardownCarousel : function() {
      var self = this;

      self.$tabsContainer.scrollerModule('destroy');
      self.scroller = null;
      self.$container.removeClass('tab-carousel');
      self.$navPrev.addClass('hide');
      self.$navNext.addClass('hide');
      self.$container.find('.has-content-right').removeClass('has-content-right');
      self.$container.find('.has-content-left').removeClass('has-content-left');
      self.$tabs.off('.stickytabs');
      self.$tabs.removeAttr('style');
      self.isClickCanceled = false;
      self.overlap = null;
      self.isTabCarousel = false;
    },

    setOverflowClasses : function( currentX, maxX ) {
      var self = this,
          overflowLeftClass = 'has-content-left',
          overflowRightClass = 'has-content-right',
          hadContentLeft = self.$tabsContainer.hasClass( overflowLeftClass ),
          hadContentRight = self.$tabsContainer.hasClass( overflowRightClass );

      // Overflow left
      if ( currentX < -3 && !hadContentLeft ) {
        self.$tabsContainer.addClass( overflowLeftClass );
      } else if ( currentX >= -3 && hadContentLeft ) {
        self.$tabsContainer.removeClass( overflowLeftClass );
      }

      // Overflow right
      if ( currentX >= maxX && !hadContentRight ) {
        self.$tabsContainer.addClass( overflowRightClass );
      } else if ( currentX <= maxX && hadContentRight ) {
        self.$tabsContainer.removeClass( overflowRightClass );
      }
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
    overlap: 0,
    isStickyTabs: false,
    useBounce: !( Settings.isVita || Settings.isLTIE9 ),
    useMomentum: !( Settings.isVita || Settings.isLTIE9 ),
    isTouch: Settings.hasTouchEvents,
    prop: Modernizr.csstransforms ? 'transform' : 'left',
    valStart : Modernizr.csstransforms ? 'translate(' : '',
    valEnd : Modernizr.csstransforms ? 'px,0)' : 'px'
  };

});