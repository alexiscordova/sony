// Your code goes here.// ------------ Primary Tout ------------
// Module: Primary Tout
// Version: 0.1
// Modified: 01/16/2013
// Dependencies: jQuery 1.7+
// -------------------------------------------------------------------------
(function($, window, undefined) {

    'use strict';

    // Start module
    var PrimaryTout = function(element, options){
      var self = this;
      $.extend(self, {}, $.fn.primaryTout.defaults, options, $.fn.primaryTout.settings);
      
      self._init();
    };


    // Sample module method
    PrimaryTout.prototype = {
      constructor: PrimaryTout,

      _resize: function(){
        $('.primary-tout.home-page').find('.fill').height($('.primary-tout.home-page').height() - $('.primary-tout.home-page').find('.box').outerHeight() - parseInt($('.primary-tout.home-page').find('.box').css('margin-bottom'), 10) );
      },

      _init: function(){
        //adds a resize listener to vertically re-center the h1
        $.guid= 0;
        this._resize();
        $(window).resize($.throttle(250, this._resize) );
      }
      

    };

    // Plugin definition
    $.fn.primaryTout = function( options ) {
      var args = Array.prototype.slice.call( arguments, 1 );
      return this.each(function() {
        var self = $(this),
          primaryTout = self.data('primaryTout');
    
        // If we don't have a stored moduleName, make a new one and save it
        if ( !primaryTout ) {
            primaryTout = new PrimaryTout( self, options );
            self.data( 'primaryTout', primaryTout );
        }
    
        if ( typeof options === 'string' ) {
          primaryTout[ options ].apply( primaryTout, args );
        }
      });
    };


 })(jQuery, window, undefined);
 
$(document).ready(function() {

  if ( $('.primary-tout').length > 0 ) {
    $('.primary-tout').primaryTout();
  }

});
