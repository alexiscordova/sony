/*global define, Modernizr, log*/

// ------------ Sony Editorial Hotspots ------------
// Module: Editorial
// Version: 0.1
// Modified: 03/19/2013
// Dependencies: jQuery 1.7+, Modernizr
// Author: Brian Kenny
// --------------------------------------

define(function(require) {
  
  'use string';
  
  var $ = require('jquery'),
      iQ = require('iQ'),
      bootstrap = require('bootstrap'),
      Settings = require('require/sony-global-settings'),
      Environment = require('require/sony-global-environment'),
      Utilities = require('require/sony-global-utilities');

  var self = {
    'init': function() {
      log('init editorial');
      // detect if there are any hotspots per the given container
      $('.hspot-outer').each(function() {
        // read each hotspot's data property
        log('hotspot detected');
        $(this).hotspotsController({}).data('hotspotsController');
        
      });
    }
  };
  
  var HotspotsController = function(element, options){
    // closure pointer for scope
    var self = this;
    // make this a plugin
    $.extend(self, {}, $.fn.hotspotsController.defaults, options, $.fn.hotspotsController.settings);
    self.init();
  };

  HotspotsController.prototype = {
    constructor: HotspotsController,

    init : function() {
      var self = this;
      log('SONY : Editorial Hotspots : Initialized');
    }
    
  };
  
  // Plugin definition
  $.fn.hotspotsController = function( options ) {
    var args = Array.prototype.slice.call( arguments, 1 );
    return this.each(function() {
      var self = $(this),
        hotspotsController = self.data('hotspotsController');
        // If we don't have a stored tertiaryModule, make a new one and save it
        if ( !hotspotsController ) {
            hotspotsController = new HotspotsController( self, options );
            self.data( 'hotspotsController', hotspotsController );
        }

        if ( typeof options === 'string' ) {
          hotspotsController[ options ].apply( hotspotsController, args );
        }
      });
  };

  // Defaults options for the module
  $.fn.hotspotsController.defaults = {
    options : {

    }
  };
  
  return self;
  
});