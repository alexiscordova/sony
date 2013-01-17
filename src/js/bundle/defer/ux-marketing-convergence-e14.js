
// ------ Sony UX Marketing Convergence (MarketingConvergence) Module ------
// Module: MarketingConvergence Module
// Version: 0.1
// Modified: 01/16/2013
// Dependencies: jQuery 1.7+, Modernizr
// -------------------------------------------------------------------------

(function($, Modernizr, window) {

    'use strict';

    // Start module
    var MarketingConvergenceModule = function(element, options){
      self.init(element);
    }

    MarketingConvergenceModule.prototype = {

      constructor: UXMarketingConvergenceModule,

      init : function( element ) {

      },

      setup : function(){

      },

      teardown : function(){

      }

    };

    // Plugin definition
    $.fn.marketingConvergenceModule = function( options ) {
      var args = Array.prototype.slice.call( arguments, 1 );
      return this.each(function() {
        var self = $(this),
          marketingConvergenceModule = self.data('marketingConvergenceModule');

        // If we don't have a stored marketingConvergenceModule, make a new one and save it
        if ( !marketingConvergenceModule ) {
            marketingConvergenceModule = new TertiaryModule( self, options );
            self.data( 'marketingConvergenceModule', marketingConvergenceModule );
        }

        if ( typeof options === 'string' ) {
          marketingConvergenceModule[ options ].apply( marketingConvergenceModule, args );
        }
      });
    };

    // Defaults options for your module
    $.fn.marketingConvergenceModule.defaults = {

    };

    // Non override-able settings
    $.fn.marketingConvergenceModule.settings = {

    };

    $( function(){

      // initialize

    } );

 })(jQuery, Modernizr, window);
