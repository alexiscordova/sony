
// Sony Carousel (SonyCarousel) Module
// --------------------------------------------
//
// * **Class:** SonyCarousel
// * **Version:** 0.1
// * **Modified:** 03/19/2013
// * **Author:** George Pantazis
// * **Dependencies:** jQuery 1.7+
//
// *Example Usage:*
//
//      $('#foo').sonyCarousel({
//
//      });

define(function(require){

  'use strict';

  var $ = require('jquery'),
      sonyDraggable = require('secondary/sony-draggable'),
      sonyPaddles = require('secondary/sony-paddles'),
      sonyNavigationDots = require('secondary/sony-draggable');

  var SonyCarousel = function($element, options){
    var self = this;

    $.extend(self, {}, $.fn.sonyCarousel.defaults, options, $.fn.sonyCarousel.settings);

    self.$el = $element;

    self.init();
  };

  SonyCarousel.prototype = {
    constructor: SonyCarousel,

    init : function() {

    }
  };

  // jQuery Plugin Definition
  // ------------------------

  $.fn.sonyCarousel = function( options ) {
    var args = Array.prototype.slice.call( arguments, 1 );
    return this.each(function() {
      var self = $(this),
        sonyCarousel = self.data('sonyCarousel');

      if ( !sonyCarousel ) {
          sonyCarousel = new SonyCarousel( self, options );
          self.data( 'sonyCarousel', sonyCarousel );
      }

      if ( typeof options === 'string' ) {
        sonyCarousel[ options ].apply( sonyCarousel, args );
      }
    });
  };

  // Defaults
  // --------

  $.fn.sonyCarousel.defaults = {
  };

  // Non override-able settings
  // --------------------------

  $.fn.sonyCarousel.settings = {
  };
});
