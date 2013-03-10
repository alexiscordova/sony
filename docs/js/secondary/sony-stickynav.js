// Sticky Nav Helper
// ------------
//
// * **Module:** Sticky Nav Helper
// * **Version:** 0.1
// * **Modified:** 03/07/2013
// * **Author:** Glen Cheney
// * **Dependencies:** jQuery 1.7+, Modernizr
//
// *Example Usage:*
//
//      $('.sticky-nav').stickyNav({
//        offsetTarget: $('.bob')
//      });

(function($, Modernizr, window, undefined) {

  'use strict';

  var StickyNav = function( $element, options ) {
    var self = this;

    $.extend(self, $.fn.stickyNav.defaults, options, $.fn.stickyNav.settings);

    self.$el = $element;
    self.$window = SONY.$window;
    self._init();
  };

  StickyNav.prototype = {
    constructor: StickyNav,

    _init : function() {
      var self = this,
          $body = SONY.$body;

      self._setTriggerPoint( true );

      // Bind to window scroll and resize
      self.$window.on('scroll', $.proxy( self._onScroll, self ));
      SONY.on('global:resizeDebounced', $.proxy( self._onResize, self ));

      // Set up twitter bootstrap scroll spy
      $body.scrollspy({
        target: '.spec-sticky-nav'
      });

      // Setup links that scroll within the page
      if ( self.$jumpLinks ) {
        self._initJumpLinks();
      }

      // Scroll to the top of the window on mouseup/touchend/pointerup
      if ( self.scrollToTopOnClick ) {
        self.$el.on( SONY.Settings.END_EV, function(e) {
          if ( e.target.tagName === 'A' ) {
            return;
          }
          SONY.Utilities.scrollToTop();
        });
      }

      setTimeout(function() {
        self._onScroll();
        $body.scrollspy('refresh');

      }, 100);
    },

    _initJumpLinks : function() {
      var self = this,
          scrollspyOffset = 10,
          navHeight = parseFloat( self.$el.css('height') ),
          offset = scrollspyOffset + navHeight;

      self.$jumpLinks.simplescroll({
        showHash: true,
        speed: 400,
        offset: offset
      });
    },


    _onScroll : function() {
      var self = this,
          st = self.$window.scrollTop();

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

    },

    _onResize : function() {
      this._setTriggerPoint();

      // Update the positions for the scroll spy
      SONY.$body
        .scrollspy('refresh')
        .scrollspy('process');
    },

    _setTriggerPoint : function( isInit ) {
      var self = this,
      $offsetTarget, triggerPoint;

      $offsetTarget = self.offsetTarget.jquery ? self.offsetTarget : $( self.offsetTarget );
      triggerPoint = $.isNumeric( self.offsetTarget ) ? self.offsetTarget : $offsetTarget[0].offsetTop;


      // jQuery offset().top is returning negative numbers...
      // Get the trigger point for when the nav should `open`
      if ( isInit && triggerPoint < 100 ) {
        setTimeout(function() {
          self.updateTriggerOffset( $offsetTarget[0].offsetTop ); //$offsetTarget.offset().top;
        }, 50);
      }

      self.updateTriggerOffset( triggerPoint );
    },

    updateTriggerOffset : function( newOffset ) {
      this.stickyTriggerOffset = newOffset;
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
    offsetTarget: 300,
    scrollToTopOnClick: true
  };

  // Non override-able settings
  // --------------------------
  $.fn.stickyNav.settings = {
    isInitialized: false
  };

})(jQuery, Modernizr, window);