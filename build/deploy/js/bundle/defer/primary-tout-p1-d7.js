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
        var w = $(window).width(); 
        // if wondow size > 1200 set height of container to math min 740 , 640 + ( (w -1200) / 10) 
        if(w > 1200){
          $('.primary-tout.homepage .hero-image').css('height', Math.min(740, 640 + ((w - 1200) / 10)));
        }else if (w > 768){
          $('.primary-tout.homepage .hero-image').css('height', 640);
        }
        
        // this each and find inner for layouts page
        $.each ($('.primary-tout.homepage .inner .table-center-wrap'), function(i,e){
          var self = $(e);
          var outer = self.closest('.primary-tout.homepage');
          self.height(outer.height() - outer.find('.secondary').outerHeight()); 
        });
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
