/*global define, Modernizr, log*/

// ------------ Sony Editorial Hotspots ------------
// Module: Editorial
// Version: 0.1
// Modified: 03/19/2013
// Dependencies: jQuery 1.7+, Modernizr
// Author: Brian Kenny
// --------------------------------------

define(function(require) {
  
  'use strict';
  
  var $ = require('jquery'),
      iQ = require('iQ'),
      bootstrap = require('bootstrap'),
      Settings = require('require/sony-global-settings'),
      Environment = require('require/sony-global-environment'),
      Utilities = require('require/sony-global-utilities');

  var self = {
    'init': function() {
      log('init editorial');
      // detect if there are any hotspot containers present
      $('.hotspot-instance').each(function(el) {
        // for each container, initialize an instance
        log('hotspot container present');
        $(this).hotspotsController({});
      });
    }
  };
  
  var HotspotsController = function(element, options){

    var self = this;
    // SETUP DEFAULTS
    // ...
        
    // SELECTORS
    
    // container element holding the hotspots
    self.$container                     = $( element );
    // collection of hotspots we must initialize
    self.$els                           = self.$container.find(".hspot-outer");
    
    // COORDINATES AND HOTSPOT STATUS COLLECTION
    self.$hotspotData                    = [];
    
    // EXTEND THIS OBJECT TO BE A JQUERY PLUGIN
    $.extend(self, {}, $.fn.hotspotsController.defaults, options, $.fn.hotspotsController.settings);
    self.init();
  };

  HotspotsController.prototype = {
    constructor: HotspotsController,

    init : function() {
      var self = this;
      
      // initialize hotspot(s)
      $(self.$els).each(function(index, el) {
        // bind the click, place it based on the data-x and -y coordinates, and fade em in
        self.bind(el);
        self.place(el);
        self.show(el);
      });

      log('SONY : Editorial Hotspots : Initialized');
    },
    
    bind: function(el) {
      var self = this;
      $(el).bind('click', self.click);
    },
    place: function(el) {
      var self = this;
      // this places the hotspot absolutely, but we need to track each of these locations so on resize
      var xAnchor = $(el).data("x");
      var yAnchor = $(el).data("y");
      $(el).css("left",xAnchor);
      $(el).css("top",yAnchor);
      self.$hotspotData.push({
        el: el,
        xAnchor: xAnchor,
        yAnchor: yAnchor,
        open: false
      });
    },
    show: function(el) {
      
    },
    find: function(currentTarget) {
      var self = this;
      self.$els.each(function(index, el) {
        log('searching');
        if($(el).is(currentTarget)) {
          return el;
        } else {
          log('no match');
        }
      });
    },
    click: function(event) {
      var self  = this,
          me    = $(event.currentTarget).find('.hspot-core, .hspot-core-on');
      if(me.data('state')=='open') {
        me.data('state','closed');
        me.removeClass('hspot-core-on').addClass('hspot-core');
      } else {
        me.data('state','open');        
        me.removeClass('hspot-core').addClass('hspot-core-on');
      }
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