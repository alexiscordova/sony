// Sticky Nav Helper
// ------------
//
// * **Module:** Sticky Nav Helper
// * **Version:** 0.1
// * **Modified:** 03/07/2013
// * **Author:** Glen Cheney
// * **Dependencies:** jQuery 1.7+, Modernizr, Bootstrap's scrollspy
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

      self._setTriggerPoint( true );

      // Bind to window scroll and resize
      self.$window.on('scroll', $.proxy( self._onScroll, self ));
      Environment.on('global:resizeDebounced', $.proxy( self._onResize, self ));

      // Setup links that scroll within the page
      if ( self.hasJumpLinks ) {
        self._initJumpLinks();
      }

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

      setTimeout(function() {
        self._setOffset();

        // Make sure there's something to “spy” on
        if ( self.hasJumpLinks ) {
          // Set up twitter bootstrap scroll spy
          $body.scrollspy({
            target: '.sticky-nav',
            offset: self.targetOffset + 1
          });
        }

        self._onScroll();
      }, 100);
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

      // IE8 still has sticky open sometimes at the top
      function update() {
        self._updateStickyNav();
      }

      if ( !self.isTicking ) {
        self.isTicking = true;
        self.lastScrollY = self.$window.scrollTop();
        if ( !Modernizr.raf ) {
          update();
        } else {
          window.requestAnimationFrame( update );
        }
      }

    },

    _updateStickyNav : function() {
      var self = this,
          st = self.lastScrollY;

      // Open the stick nav if it's past the trigger
      if ( st >= self.stickyTriggerOffset ) {
        if ( !self.$el.hasClass('open') ) {
          self.$el.addClass('open');
        }

      // Close the sticky nav if it's past the trigger
      } else {
        if ( self.$el.hasClass('open') ) {
          self.$el.removeClass('open');
        }
      }

      self.isTicking = false;
    },

    _onResize : function() {
      this
        ._setTriggerPoint()
        ._setOffset();

      // Update the positions for the scroll spy
      if ( this.hasJumpLinks ) {
        Settings.$body
          .scrollspy('refresh')
          .scrollspy('process');
      }
    },

    _setTriggerPoint : function( isInit ) {
      var self = this,
      $offsetTarget, triggerPoint;

      $offsetTarget = self.offsetTarget.jquery ? self.offsetTarget : $( self.offsetTarget );
      triggerPoint = $.isNumeric( self.offsetTarget ) ? self.offsetTarget : $offsetTarget.offset().top;


      // Get the trigger point for when the nav should `open`
      if ( triggerPoint < 100 ) {
        setTimeout(function() {
          var triggerPoint = $offsetTarget[0].offsetTop;
          // If we still don't have a high enough value, use the default
          if ( triggerPoint < 100 ) {
            triggerPoint = $.fn.stickyNav.defaults.offsetTarget;
          }
          self.updateTriggerOffset( triggerPoint );


        }, 50);
      }

      self.updateTriggerOffset( triggerPoint );

      return self;
    },

    _setOffset : function() {
      var self = this,
          navHeight = self.$el.outerHeight(),
          offset = self.offset + navHeight;


      self.updateOffset( offset );

      return self;
    },

    updateTriggerOffset : function( newOffset ) {
      this.stickyTriggerOffset = newOffset;
    },

    updateOffset : function( newOffset ) {
      var scrollspy = Settings.$body.data('scrollspy');
      this.targetOffset = newOffset;
      if ( scrollspy ) {
        scrollspy.options.offset = newOffset;
      }
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
    isTicking: false,
    targetOffset: 10,
    lastScrollY: 0
  };

});