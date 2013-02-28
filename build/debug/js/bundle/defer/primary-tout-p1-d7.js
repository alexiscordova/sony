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

    PrimaryTout.prototype = {
      constructor: PrimaryTout,

      _resize: function(){
        var w = $(window).outerWidth(); 
        if(w > 980){
          $('.primary-tout.homepage .hero-image').css('height', Math.round(Math.min(770, 490 + ((w - 980) / 5))));
          $('.primary-tout.default .hero-image').css('height', Math.round(Math.min(660, 560 + ((w - 980) / 5))));
        }else if (w > 768){
          $('.primary-tout.homepage .hero-image, .primary-tout.default .hero-image').css('height', "");
        }
        
        // this each and find inner for layouts page
        $.each ($('.primary-tout.homepage .inner .table-center-wrap'), function(i,e){
          var self = $(e);
          var outer = self.closest('.primary-tout.homepage');
          self.height(outer.height() - outer.find('.secondary').outerHeight()); 
        });
      },

      _init: function(){
        this._resize();
        SONY.on('global:resizeDebounced', this._resize);
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

SONY.on('global:ready', function(){
  if ( $('.primary-tout').length > 0 ) {
    $('.primary-tout').primaryTout();
  }
});

