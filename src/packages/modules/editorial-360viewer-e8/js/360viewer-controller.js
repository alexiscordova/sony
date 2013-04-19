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

  var $ = require('jquery'),
      Modernizr = require('modernizr');

  var Editorial360Viewer = function($element, options) {
    var self = this;
    $.extend(self, {}, $.fn.editorial360Viewer.defaults, options, $.fn.editorial360Viewer.settings);
  };

  ModuleName.prototype = {
    constructor: ModuleName,

    method : function( param ) {
     // Method body
    }
  };

  // jQuery Plugin Definition
  // ------------------------

  $.fn.moduleName = function( options ) {
    var args = Array.prototype.slice.call( arguments, 1 );
    return this.each(function() {
      var self = $(this),
        moduleName = self.data('moduleName');

      // If we don't have a stored moduleName, make a new one and save it.
      if ( !moduleName ) {
          moduleName = new ModuleName( self, options );
          self.data( 'moduleName', moduleName );
      }

      if ( typeof options === 'string' ) {
        moduleName[ options ].apply( moduleName, args );
      }
    });
  };

  // Defaults
  // --------

  $.fn.moduleName.defaults = {
    sampleOption: 0
  };

  // Non override-able settings
  // --------------------------

  $.fn.moduleName.settings = {
    isTouch: !!( 'ontouchstart' in window ),
    isInitialized: false
  };
});