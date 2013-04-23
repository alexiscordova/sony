// Module Title
// ------------
//
// * **Module:** Editorial 360 Viewer
// * **Version:** 0.1
// * **Modified:** 04/19/2013
// * **Author:** Brian Kenny
// * **Dependencies:** jQuery 1.7+, Modernizr
//
// *Example Usage:*
//
//      require('path/to/global/module') // self instantiation

define(function(require){

  'use strict';
  
  // provisions
  var $ = require( 'jquery' ),
      iQ = require( 'iQ' ),
      bootstrap = require( 'bootstrap' ),
      enquire = require('enquire'),
      Settings = require( 'require/sony-global-settings' ),
      Environment = require( 'require/sony-global-environment' ),
      Utilities = require( 'require/sony-global-utilities' );

  // outer scope holding 'self'
  var self = {
    'init': function() {

      // setup breakpoints
      var breakpoints = [ 360, 479, 567, 640, 767, 979, 1100 ];
      var breakpointReactor = function( e ) {
        iQ.update();
      };
      
      // bind IQ to update at every breakpoint
      for( var i=0; i < breakpoints.length; i++ ) {
        if( 0 === i ) {
          enquire.register( "(max-width: " + breakpoints[ i ] + "px)", breakpointReactor).listen();
        } else {
          enquire.register( "(min-width: " + ( breakpoints[ i-1 ] + 1 ) + "px) and (max-width: " + breakpoints[ i ] + "px)", breakpointReactor).listen();
        }
      }
      
      // detect if there are 360 viewer constructs on the DOM
      $( '.e360' ).each( function( index, el ) {
        
        // for each instance, initialize
        $( this ).editorial360Viewer({});
      });
    }
  };

  var Editorial360Viewer = function( element, options ) {
    
    var self = this;
    
    // defaults
    self.$container = $( element );
    
    $.extend(self, {}, $.fn.editorial360Viewer.defaults, options, $.fn.editorial360Viewer.settings);
    self.init();
    
  };

  Editorial360Viewer.prototype = {
    constructor: Editorial360Viewer,

    init : function( param ) {
      // Method body
      
      // bind scroll event to fire animation on the dragger
      // 1. movement on desktop and 2. viewport on mobile
      
      
      log('SONY : Editorial 360 Viewer : Initialized');
    },
    animateDragger: function( cycles ) {
      if( null === cycles ) {
        // animate once
      } else {
        // animate until a flag is reached 
      }
      
    },
    resetAnimation: function() {
      
    }
  };

  // jQuery Plugin Definition
  // ------------------------

  $.fn.editorial360Viewer = function( options ) {
    var args = Array.prototype.slice.call( arguments, 1 );
    return this.each(function() {
      var self = $(this),
          editorial360Viewer = self.data('editorial360Viewer');

      // If we don't have a stored moduleName, make a new one and save it.
      if ( !editorial360Viewer ) {
          editorial360Viewer = new Editorial360Viewer( self, options );
          self.data( 'editorial360Viewer', editorial360Viewer );
      }

      if ( typeof options === 'string' ) {
        editorial360Viewer[ options ].apply( editorial360Viewer, args );
      }
    });
  };

  // Defaults
  // --------

  $.fn.editorial360Viewer.defaults = {
    options: {}
  };

  // Non override-able settings
  // --------------------------

  $.fn.editorial360Viewer.settings = {
    isTouch: !!( 'ontouchstart' in window ),
    isInitialized: false
  };
  
  return self;
  
});