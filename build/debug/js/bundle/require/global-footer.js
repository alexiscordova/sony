// ------------ GlobalFooter ------------
// Module: GlobalFooter
// Version: 0.1
// Modified: 01/05/2013 by Christopher J Mischler
// Dependencies: jQuery 1.7+, Modernizr
// 
// -------------------------------------------------------------------------
 

(function($, Modernizr, window, undefined) {
  
  'use strict';

  // Start module
  var GlobalFooter = function(element, options){
    var self = this;
    $.extend(self, {}, $.fn.globalFooter.defaults, options, $.fn.globalFooter.settings);
  }


  // Sample module method
  GlobalFooter.prototype = {
    constructor: GlobalFooter,

    method : function( param ) {
     // Method body
    }
  };


  // Plugin definition
  $.fn.globalFooter = function( options ) {
    var args = Array.prototype.slice.call( arguments, 1 );
    return this.each(function() {
      var self = $(this),
        globalFooter = self.data('globalFooter');
  
      // If we don't have a stored globalFooter, make a new one and save it
      if ( !globalFooter ) {
          globalFooter = new GlobalFooter( self, options );
          self.data( 'globalFooter', globalFooter );
      }
  
      if ( typeof options === 'string' ) {
        globalFooter[ options ].apply( globalFooter, args );
      }
    });
  };


  // Defaults options for your module
  $.fn.globalFooter.defaults = { 
    sampleOption: 0
  };

  // Non override-able settings
  $.fn.globalFooter.settings = { 
    isTouch: !!( 'ontouchstart' in window ),
    isInitialized: false
  };

 })(jQuery, Modernizr, window, undefined);