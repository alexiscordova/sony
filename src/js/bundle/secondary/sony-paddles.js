
// Sony Paddles (SonyPaddles) Module
// --------------------------------------------
//
// * **Class:** SonyPaddles
// * **Version:** 0.1
// * **Modified:** 02/20/2013
// * **Author:** George Pantazis
// * **Dependencies:** jQuery 1.7+

(function($) {

  'use strict';

  var SonyPaddles = function($element, options){

    var self = this;

    $.extend(self, {}, $.fn.sonyPaddles.defaults, options);

    self.init();
  };

  SonyPaddles.prototype = {

    'constructor': SonyPaddles,

    'init': function() {

      var self = this;

    }
  };

  $.fn.sonyPaddles = function( options ) {
    var args = Array.prototype.slice.call( arguments, 1 );
    return this.each(function() {
      var self = $(this),
        sonyPaddles = self.data('sonyPaddles');

      if ( !sonyPaddles ) {
          sonyPaddles = new SonyPaddles( self, options );
          self.data( 'sonyPaddles', sonyPaddles );
      }

      if ( typeof options === 'string' ) {
        sonyPaddles[ options ].apply( sonyPaddles, args );
      }
    });
  };

  // Defaults
  // --------

  $.fn.sonyPaddles.defaults = {
  };

})(jQuery);
