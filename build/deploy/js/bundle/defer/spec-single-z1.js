/*global jQuery, Modernizr, Exports*/

// -------- Sony Full Specs Single -------
// Module: Full Specs Single
// Version: 1.0
// Author: Glen Cheney
// Date: 01/24/13
// Dependencies: jQuery 1.7+, Modernizr
// --------------------------------------

(function($, Modernizr, window, undefined) {
  'use strict';

  var Spec = function( $container, options ) {
    var self = this;

    $.extend(self, $.fn.specSingle.options, options, $.fn.specSingle.settings);

    // jQuery objects
    self.$container = $container;
    self.$window = $(window);
    self._init();
  };

  Spec.prototype = {

    constructor: Spec,

    _init : function() {
      var self = this;

      self.$specProduct = self.$container.find('.spec-product');
      self.$specTiles = self.$container.find('.spec-tiles');

      // self._onResize();

      // Init shuffle on the features section
      self._initFeatures();

      // self.$window.on('resize', $.throttle(250, $.proxy( self._onResize, self )));
    },

    _initFeatures : function() {
      var self = this;

      self.$specTiles.shuffle({
        itemSelector: '.spec-tile',
        easing: 'ease-out',
        speed: 250,
        columnWidth: Exports.masonryColumns,
        gutterWidth: Exports.masonryGutters,
        showInitialTransition: false
      });
      self.shuffle = self.$specTiles.data('shuffle');

      return self;
    },

    _onResize : function() {
      /*
      var self = this;
      if ( Modernizr.mq( self.mobileBreakpoint ) ) {

        // If we have a scroller, destroy it
        if ( self.isScroller ) {
          self._teardownScroller();
        }

        // If we don't have sticky tabs, init them
        if ( !self.isStickyTabs ) {
          self._initStickyTabs();
        }

        if ( self.$modal ) {
          self._closeEnlarge();
        }

      } else {

        // If we have sticky tabs, destroy them
        if ( self.isStickyTabs ) {
          self._teardownStickyTabs();
        }

        // If we don't have a scroller, create it
        if ( !self.isScroller ) {
          self._initScroller();
        }

        // Re-compute heights for each cell and total height
        self
          ._setRowHeights()
          ._setItemContainerHeight();
      }

      self.stickyOffset = self._getStickyHeaderOffset();
      */
    }



  };

  // Plugin definition
  $.fn.specSingle = function( options ) {
    var args = Array.prototype.slice.call( arguments, 1 );
    return this.each(function() {
      var self = $(this),
          spec = self.data('spec');

      // If we don't have a stored spec, make a new one and save it
      if ( !spec ) {
        spec = new Spec( self, options );
        self.data( 'spec', spec );
      }

      if ( typeof options === 'string' ) {
        spec[ options ].apply( spec, args );
      }
    });
  };


  // Overrideable options
  $.fn.specSingle.options = {
    mobileBreakpoint : '(max-width: 35.4375em)'
  };

  // Not overrideable
  $.fn.specSingle.settings = {
    isStickyTabs: false,
    isScroller: false
  };


}(jQuery, Modernizr, window));







$(document).ready(function() {

  if ( $('.spec-single').length > 0 ) {

    $('.spec-single').specSingle();

  }
});
