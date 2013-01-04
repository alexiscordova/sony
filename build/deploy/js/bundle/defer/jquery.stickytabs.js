/*global jQuery, Modernizr, Exports*/

// ------------ Sony Sticky Tabs --------
// Module: Sticky Tabs
// Version: 1.0
// Modified: 01/01/2013
// Dependencies: jQuery 1.7+, Modernizr
// Author: Glen Cheney
// --------------------------------------

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
      self.windowHeight = self.$window.height();
      self.tabWidth = self.$tabs.outerWidth();
      self.tabletMode = self.$container.data('tabletMode');
      self.isCarousel = self.tabletMode === 'carousel';

      if ( self.isCarousel ) {
        self.$navNext = self.$container.find('.tab-nav-next');
        self.$navPrev = self.$container.find('.tab-nav-prev');
        self.$navNext.on('click', function() {
          self.$tabsContainer.scrollerModule('next');
        });
        self.$navPrev.on('click', function() {
          self.$tabsContainer.scrollerModule('prev');
        });
      }

      // New tab shown event
      self.$tabs.on('shown', $.proxy( self._onTabShown, self ));

      // Window resize
      self.$window.on('resize.stickytabs', $.proxy( self._onResize, self ));

      // Decide which tabs to make
      if ( Modernizr.mq('(max-width: 767px)') ) {
        self.setup();
      } else if ( self.isCarousel && Modernizr.mq('(min-width: 768px) and (max-width: 979px)') ) {
        self.setupCarousel();
      }
    },

    _getBounded : function( value ) {
      return Exports.constrain( value, 0, this.windowWidth - this.tabWidth );
    },

    _onResize : function() {
      var self = this;

      self.windowWidth = self.$window.width();
      self.windowHeight = self.$window.height();

      // Phone
      if ( Modernizr.mq('(max-width: 767px)') ) {
        if ( self.isTabCarousel ) {
          self.teardownCarousel();
        }

        if ( !self.isStickyTabs ) {
          self.setup();
        }

        self.animateTab();

      // Tablet
      } else if ( self.isCarousel && Modernizr.mq('(min-width: 768px) and (max-width: 979px)') ) {
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
        console.log('tab shown, removing style attribute of all tabs');
        self._onTabSelected();
      }
    },

    _onTabSelected : function() {
      var self = this;

      console.log('onTabSelected: StickyTabs');
      self.$tabs.removeAttr('style');
      self.lastSL = self.$tabsWrap.scrollLeft();
      self.data = null;

      // Get offset from left side
      self.tabOffset = self.$activeTab.offset().left;

      // Set initail css on active tab
      self.$activeTab.css({
        position: 'absolute',
        left: self._getBounded( self.tabOffset )
      });

      console.log('new sticky tab set', self._getBounded( self.tabOffset ), self.tabOffset );

      // Add a margin to the next (or previous if it's the last tab) tab because
      // the active one is positioned absolutely, taking up no space
      if ( !self.$activeTab.is(':last-child') ) {
        self.$activeTab.next().css('marginLeft', self.tabWidth);
      } else {
        self.$activeTab.prev().css('marginRight', self.tabWidth);
      }
    },

    animateTab : function() {
      console.log('animateTab: StickyTabs');
      var self = this,
          sl = self.$tabsWrap.scrollLeft(),
          distance = self.lastSL - sl, // last scroll left - current scoll left = distance since last _animateTab call
          tmpX = self.data ? self.data.overlap + distance : self.tabOffset + distance,
          newX = self._getBounded( tmpX ); // contrain the tab to 0 and the scrollwidth

      // If the value has been constrained, save the overlap
      if ( newX !== tmpX ) {
        self.data = {
          overlap: tmpX
        };
      } else {
        self.data = null;
      }

      self.lastSL = sl;
      self.tabOffset = newX;

      self.$activeTab.css('left', self.tabOffset);
    },

    setup : function() {
      var self = this;

      // Problems with scrollerModule + stickyTabs
        // Is there a callback every frame?
        // Clicking and dragging results in changing tabs

      console.log('setup: StickyTabs');
      self.isStickyTabs = true;
      self.$tabsWrap
        .on('scroll', $.proxy( self.animateTab, self ))
        .addClass('sticky');
      // self.$tabsContainer.scrollerModule({
      //   contentSelector: '.tabs',
      //   itemElementSelector: '.tab',
      //   mode: 'free',
      //   lastPageCenter: false,
      //   extraSpacing: 0,

      //   //iscroll props get mixed in
      //   iscrollProps: {
      //     snap: false,
      //     hScroll: true,
      //     vScroll: false,
      //     hScrollbar: false,
      //     vScrollbar: false,
      //     momentum: true,
      //     bounce: true,
      //     onScrollEnd: null
      //   }
      // });
      self._onTabSelected();
    },

    teardown : function() {
      var self = this;

      console.log('teardown: StickyTabs');
      self.$tabsWrap.off('scroll').removeClass('sticky');
      self.$tabs.removeAttr('style');
      self.isStickyTabs = false;
    },

    setupCarousel : function() {
      var self = this;

      self.$navPrev.hide();
      self.$navNext.hide();

      self.$tabsContainer.scrollerModule({
        contentSelector: '.tabs',
        itemElementSelector: '.tab',
        mode: 'paginate',
        lastPageCenter: false,
        extraSpacing: 0,

        iscrollProps: {
          snap: true,
          hScroll: true,
          vScroll: false,
          hScrollbar: false,
          vScrollbar: false,
          momentum: true,
          bounce: true,
          onScrollEnd: null,
          onAnimationEnd: function() {
            var iscroll = this;
            // Hide show prev button depending on where we are
            if ( iscroll.currPageX === 0 ) {
              self.$navPrev.hide();
            } else {
              self.$navPrev.show();
            }

            // Hide show next button depending on where we are
            if ( iscroll.currPageX === iscroll.pagesX.length - 1 ) {
              self.$navNext.hide();
            } else {
              self.$navNext.show();
            }
          }
        }
      });

      // Check to make sure we actually have paginated tabs
      if ( self.$tabsContainer.data('scrollerModule').isPaginated ) {
        // self.$navPrev.show();
        self.$navNext.show();
        self.$tabsWrap.addClass('tab-carousel');
      }

      self.isTabCarousel = true;
    },

    teardownCarousel : function() {
      var self = this;

      console.log('teardown: Carousel tabs');
      self.$navPrev.hide();
      self.$navNext.hide();
      self.$tabsWrap.removeClass('tab-carousel');
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
    tabOffset: 0,
    initialTabWidth: 0,
    tabWidth: 0,
    tabsWidth: 0,
    windowWidth: 0,
    windowHeight: 0,
    data: null,
    lastSL: null,
    isStickyTabs: false,
    toOffset: 0
  };

  // Not overrideable
  $.fn.stickyTabs.settings = {
  };

}(jQuery, Modernizr, window));

