/*global Exports*/

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
      if ( self.$tabs.length === 0 ) { return; }

      // Set variables
      self.$activeTab = self.$tabs.filter('.active');
      self.$window = $(window);
      self.windowWidth = self.$window.width();
      // self.windowHeight = self.$window.height();
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
      } else if ( self.isCarousel ) {// && Modernizr.mq( self.carouselMq ) ) {
        self.setupCarousel();
      }
    },

    _getBounded : function( value ) {
      return Exports.constrain( value, 0, this.windowWidth - this.tabWidth );
    },

    _onResize : function() {
      var self = this;

      self.windowWidth = self.$window.width();
      // self.windowHeight = self.$window.height();
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
      } else if ( self.isCarousel ) {// && Modernizr.mq( self.carouselMq ) ) {
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
          offset,
          containerOffset = self.scroller.x; // will be negative if on the left, + on the right

      self.$tabs.removeAttr('style');

      // Get offset from left side
      // jQuery's offset is unreliable because Webkit includes transforms and Gecko doesn't
      // in offset calculations http://bugs.jquery.com/ticket/8362
      // self.tabOffset = self.$activeTab.position().left;
      // Get the offset with transform, then subtract the transform
      offset = self.$activeTab[0].offsetLeft + containerOffset;

      // Constrain offset between 0 and window width
      offset = self._getBounded( offset );

      // Add back the container offset
      offset = offset - containerOffset;

      // Reset the overlap
      self.overlap = null;

      // Set initail css on active tab
      css[ self.prop ] = self._getX( offset );
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

      self.tabOffset = offset;

      self.animateTab();
    },

    // We know the offset we want within the container, but the container is translated too
    // This normalizes that value
    _getX : function( x ) {
      return [ this.valStart, x, this.valEnd ].join('');
    },

    animateTab : function() {
      console.group('animateTab: StickyTabs');
      var self = this,
          currentScrollerX = self.scroller.x * -1,

          // Get the distance we've moved between function calls
          distance = self.lastScrollerX ? self.lastScrollerX - currentScrollerX : 0,

          // If there is a previous overlap, we need to use that intead of the tab offset
          offset = self.overlap ? self.overlap : self.tabOffset,
          nonStickyOffset = offset + distance,

          // contrain the tab between 0 and the viewport width
          boundedX = self._getBounded( nonStickyOffset ),

          // Bounded X is between 0 and viewport width, but what actually looks like 0 has to add iscroll's offset
          boundedXWithContainerOffset = boundedX + currentScrollerX,

          // get the css value
          value = self._getX( boundedXWithContainerOffset );

      if ( self.scroller.moved && !self.isClickCanceled ) {
        // Prevent tab from being clicked. Passing false as a shorthand for function(){ return false; }
        self.$tabs.on('click.stickytabs', false);
        self.isClickCanceled = true;
      }

      // If the value has been constrained, save the overlap
      self.overlap = boundedX !== nonStickyOffset ? nonStickyOffset : null;
      // self.overlap = nonStickyOffset;

      console.log('iscroll:', self.scroller);
      console.log('currentScrollerX:', currentScrollerX);
      console.log('lastScrollerX:', self.lastScrollerX);
      console.log('distance:', distance);
      console.log('tabOffset:', self.tabOffset);
      console.log('overlap:', self.overlap);
      console.log('nonStickyOffset:', offset, '+', distance ,'=', nonStickyOffset);
      console.log('boundedX:', boundedX);
      console.log('boundedXWithContainerOffset:', boundedXWithContainerOffset);
      console.log( self.prop, value );

      self.lastScrollerX = currentScrollerX;
      self.tabOffset = boundedX;

      self.$activeTab.css( self.prop, value );

      console.groupEnd();
    },

    setup : function() {
      var self = this;

      self.isStickyTabs = true;
      self.$tabsWrap.addClass('sticky');

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
          onTouchEnd: function() {
            // self.animateTab();
          },
          onAnimate: function() {
            self.animateTab();
          },
          onAnimationEnd: function() {
            self.animateTab();
          }
        }
      });

      self.scroller = self.$tabsContainer.data('scrollerModule').scroller;

      self._onTabSelected();
    },

    // Removes sticky tabs, but still listens for window resize
    teardown : function() {
      var self = this;

      self.$tabsContainer.scrollerModule('destroy');
      self.scroller = null;
      self.$tabsWrap.removeClass('sticky');
      self.$tabs.off('.stickytabs');
      self.$tabs.removeAttr('style');
      self.isClickCanceled = false;
      self.overlap = null;
      self.lastScrollerX = null;
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
      // if ( self.$tabsContainer.data('scrollerModule').isPaginated ) {
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
    },

    update : function() {

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
    // carouselMq: '(min-width: 48em) and (max-width: 61.1875em)'
  };

  // Not overrideable
  $.fn.stickyTabs.settings = {
    tabOffset: 0,
    tabWidth: 0,
    windowWidth: 0,
    // windowHeight: 0,
    overlap: null,
    lastScrollerX: null,
    isStickyTabs: false,
    toOffset: 0,
    prop: Modernizr.csstransforms ? 'transform' : 'left',
    valStart : Modernizr.csstransforms ? 'translate(' : '',
    valEnd : Modernizr.csstransforms ? 'px,0)' : 'px'
  };

})(jQuery, Modernizr, window);

