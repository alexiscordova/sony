// Sticky Nav Helper
// ------------
//
// * **Module:** Sticky Nav Helper
// * **Version:** 0.1
// * **Modified:** 03/07/2013
// * **Author:** Glen Cheney
// * **Dependencies:** jQuery 1.7+, Modernizr, Bootstrap's scrollspy
//
// *Notes:*
//
// * Use this for any sticky nav needs you have
// * You are responsible for generating the correct html for it.
// * There are already styles for sticky navs in `_all.scss`
// * For example usage, see the product summary, single spec, or gallery pages
// * There is also a global jade mixin for creating jump links in `jade-helpers.jade`
//
// *Example Usage:*
//
//      $('.sticky-nav').stickyNav({
//        offsetTarget: $('.bob')
//      });

define(function(require){

  'use strict';

  var $ = require('jquery'),
      bootstrap = require('bootstrap'),
      Modernizr = require('modernizr'),
      Settings = require('require/sony-global-settings'),
      Utilities = require('require/sony-global-utilities'),
      Environment = require('require/sony-global-environment');

  var StickyNav = function( $element, options ) {
    var self = this;

    $.extend(self, $.fn.stickyNav.defaults, options, $.fn.stickyNav.settings);

    self.$el = $element;
    self.$window = Settings.$window;
    self._init();
  };

  StickyNav.prototype = {
    constructor: StickyNav,

    _init : function() {
      var self = this,
          $body = Settings.$body;

      self.hasJumpLinks = self.$jumpLinks && self.$jumpLinks.length > 0;

      self.refreshTriggerPoint();

      self._subscribeToEvents();

      // Setup links that scroll within the page
      if ( self.hasJumpLinks ) {
        self._initJumpLinks();
      }

      setTimeout(function() {
        self.refreshOffset();

        // Make sure there's something to “spy” on
        if ( self.hasJumpLinks ) {
          // Set up twitter bootstrap scroll spy
          $body.scrollspy({
            target: '.sticky-nav',
            offset: self.targetOffset
          });
        }

        self._onScroll();
      }, 100);
    },

    _subscribeToEvents : function() {
      var self = this,
          debouncedRefresh = $.debounce( 100, $.proxy( self.refreshWithTimeout, self ) ),
          closeStickyNav = $.proxy( self._closeStickyNav, self );


      // Bind to window scroll and resize
      self.$window.on('scroll.stickynav', $.proxy( self._onScroll, self ));
      Environment.on('global:resizeDebounced.stickynav', $.proxy( self._onResize, self ));

      // When the universal nav is opened or closed, the trigger point needs adjustment along with scrollspy
      Settings.$document.on('universal-nav-open-finished universal-nav-close-finished', debouncedRefresh );

      // Immediately close the sticky nav when u-nav button is clicked
      Settings.$document.on('universal-nav-open universal-nav-close', closeStickyNav );


      // Images loading can create more space on the page and invalidate the scrollspy offsets
      $('.iq-img').on('imageLoaded.stickynav', debouncedRefresh );

      // Scroll to the top of the window on mouseup/touchend/pointerup
      if ( self.scrollToTopOnClick ) {
        self.$el.on( Settings.END_EV, function(e) {
          var nodeName = e.target.nodeName;
          if ( nodeName === 'A' || nodeName === 'BUTTON' ) {
            return;
          }
          Utilities.scrollToTop();
        });
      }
    },

    _unsubscribeFromEvents : function() {
      var self = this;

      // Remove window and environment events added by sticky nav
      self.$window.off('.stickynav');
      Environment.off('.stickynav');

      // Ignore universal nav
      Settings.$document.off('universal-nav-open-finished universal-nav-close-finished');
      Settings.$document.off('universal-nav-open universal-nav-close');

      // Unbind from all images
      $('.iq-img').off('.stickynav');

      // Remove scroll to top functionality
      if ( self.scrollToTopOnClick ) {
        self.$el.off( Settings.END_EV );
      }
    },

    _initJumpLinks : function() {
      var self = this;

      self.$jumpLinks.simplescroll({
        showHash: true,
        speed: 400,
        offset: function() { return self.targetOffset; }
      });
    },


    _onScroll : function() {
      var self = this;

      if ( !self.enabled ) {
        return;
      }

      // Save the new scroll top
      self.lastScrollY = self.$window.scrollTop();

      // Cancel the old request, and use the new one
      if ( self.requestID ) {
        cancelAnimationFrame( self.requestID );
      }

      // Kick off a new request for when the browser is ready
      self.requestID = requestAnimationFrame(function update() {
        self._updateStickyNav();
      });
    },

    _updateStickyNav : function() {
      var self = this,
          st = self.lastScrollY;

      // _updateStickyNav is asynchronus with rAF, so it has the chance of being called
      // after the sticky nav is supposed to be destroyed
      if ( self.destroyed ) {
        return;
      }

      // Open the stick nav if it's past the trigger
      if ( st >= self.stickyTriggerOffset ) {
        self._openStickyNav();

      // Close the sticky nav if it's past the trigger
      } else {
        self._closeStickyNav();
      }

      self.requestID = false;
    },

    _closeStickyNav : function() {
      if ( this.$el.hasClass('open') ) {
        this.$el.removeClass('open');
      }
    },

    _openStickyNav : function() {
      if ( !this.$el.hasClass('open') ) {
        this.$el.addClass('open');
      }
    },

    _onResize : function() {
      this.refresh();
    },

    refreshTriggerPoint : function() {
      var self = this,
      $offsetTarget, triggerPoint;

      if ( $.isFunction( self.offsetTarget ) ) {
        triggerPoint = self.offsetTarget();

      } else if ( $.isNumeric( self.offsetTarget ) ) {
        triggerPoint = self.offsetTarget;

      } else {
        $offsetTarget = self.offsetTarget.jquery ? self.offsetTarget : $( self.offsetTarget );
        triggerPoint = $offsetTarget.offset().top;
      }

      self.setTriggerOffset( triggerPoint );

      return self;
    },

    refreshOffset : function() {
      var self = this,
          navHeight = self.$el.outerHeight(),
          offset = self.offset + navHeight;


      self.setOffset( offset );

      return self;
    },

    refreshWithTimeout : function() {
      var self = this;
      setTimeout(function refreshTimeout() {
        self.refresh();
      }, 0);
    },

    refresh : function() {
      this
        .refreshTriggerPoint()
        .refreshOffset();

      // Update the positions for the scroll spy
      if ( this.hasJumpLinks ) {
        Settings.$body
          .scrollspy('refresh')
          .scrollspy('process');
      }

      return this;
    },

    setTriggerOffset : function( newOffset ) {
      this.stickyTriggerOffset = newOffset;
    },

    setOffset : function( newOffset ) {
      var scrollspy = Settings.$body.data('scrollspy');

      this.targetOffset = newOffset;
      if ( scrollspy ) {
        // Sony Google TV has problems
        if ( Settings.isGoogleTV || Settings.isPS3 ) {
          newOffset += 5;
        }
        scrollspy.options.offset = newOffset;
      }
    },

    enable : function() {
      var self = this;

      self.enabled = true;
      self._onScroll();
    },

    disable : function() {
      var self = this;

      self._closeStickyNav();
      self.enabled = false;
    },

    destroy : function() {
      var self = this;

      if ( self.hasJumpLinks ) {
        self.$jumpLinks.off('.simplescroll');
      }

      self._closeStickyNav();
      self._unsubscribeFromEvents();
      self.$el.removeData('stickyNav');

      // Bootstrap Scrollspy can't be destroyed...

      self.destroyed = true;
    }
  };

  // jQuery Plugin Definition
  // ------------------------

  $.fn.stickyNav = function( options ) {
    var args = Array.prototype.slice.call( arguments, 1 );
    return this.each(function() {
      var self = $(this),
        stickyNav = self.data('stickyNav');

      // If we don't have a stored stickyNav, make a new one and save it.
      if ( !stickyNav ) {
        stickyNav = new StickyNav( self, options );
        self.data( 'stickyNav', stickyNav );
      }

      if ( typeof options === 'string' ) {
        stickyNav[ options ].apply( stickyNav, args );
      }
    });
  };

  // Defaults
  // --------
  $.fn.stickyNav.defaults = {
    $jumpLinks: undefined,
    offsetTarget: 300, // Trigger offset which opens the sticky nav. Can be a number or jQuery element
    offset: 10, // Distance from the target when scrollspy should active the next link
    scrollToTopOnClick: false
  };

  // Non override-able settings
  // --------------------------
  $.fn.stickyNav.settings = {
    isInitialized: false,
    enabled: true,
    requestID: false,
    targetOffset: 10,
    lastScrollY: 0
  };

});
