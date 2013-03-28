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
    
    // LAST OPEN
    self.$lastOpen                       = null;
    
    // TRANSITION VARIABLES
    self.$transitionSpeed                = 500;
    self.$lastTimer                      = null;
    
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
      $($(el).find('.hspot-core')).bind('click',function(event) {
        self.click(event, self);
      });
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
    click: function(event, self) {
      var container = $(event.currentTarget).parent(),
          hotspot   = container.find('.hspot-core, .hspot-core-on'),
          info      = container.find('.overlay-base');
      
      if(container.data('state')=='open') {
        self.close(container, hotspot, info);
      } else {
        if(self.$lastOpen && !container.is(self.$lastOpen)) {
          log('resetting:::::');
          self.reset();
        }
        self.open(container, hotspot, info);
      }
      
    },
    reposition: function(el) {
      var self                = this,
          overlay             = el.find('.overlay-base'),
          overlayHeight       = overlay.height(),
          overlayPosition     = overlay.position(),
          overlayHeaderHeight = overlay.find('.top').height(),
          hotspotPosition     = overlay.parent().position();
      
      overlay.find('.arrow-left-top').removeClass('hidden');
      
      log('/****POSITION STUFFS****/');
/*
      log('overlay '+overlay);
      log('overlayHeight '+overlayHeight);
      log('overlayPosition ');
      log(overlayPosition);
      log('overlayHeaderHeight ');
      log(overlayHeaderHeight);
      log('hotspotPosition ');
      log(hotspotPosition);
*/
    },
    close: function(container, hotspot, info) {
        var self = this;
        // we are setting display:none when the trasition is complete, and managing the timer here
        self.cleanTimer();
        // save last close state
        container.data('state','closed').removeClass('info-jump-to-top');
        // perform CSS transitions
        hotspot.removeClass('hspot-core-on').addClass('hspot-core');
        // begin fade out
        info.removeClass('eh-visible').addClass('eh-transparent');
        // closure to allow script to set display:none when transition is complete
        var anon = function() {
          log('info: '+info);
          info.addClass('hidden');
        };
        log('anon '+anon);
        // fire a timer that will set the display to none when the element is closed. 
        self.$lastTimer = setTimeout(anon, self.$transitionSpeed);
    },
    open: function(container, hotspot, info) {
        var self = this;
        // we are setting display:none when the trasition is complete, and managing the timer here
        if(self.$lastOpen && container.is(self.$lastOpen[0])) {
          self.cleanTimer();
        }
        // save last open state
        self.$lastOpen = new Array(container, hotspot, info);
        // add data- info to this hotspot
        container.data('state','open').addClass('info-jump-to-top');
        // perform CSS transitions
        hotspot.removeClass('hspot-core').addClass('hspot-core-on');
        // we have to set display: block to allow DOM to calculate dimension
        info.removeClass('hidden');
        // reposition window per it's collision detection
        self.reposition(container);
        // fade in info window
        info.addClass('eh-visible');
    },
    reset: function(container) {
      var self = this;
      self.close(self.$lastOpen[0], self.$lastOpen[1], self.$lastOpen[2]);
    },
    cleanTimer: function() {
      /*
        BUG EXISTS WHEN YOU CLICK A DIFFERENT HOTSPOT. THE TIMEOUT FAILS TO SET 
        DISPLAY TO NONE ON THE LAST OPEN/CLOSING WINDOW.
      */
      var self = this;
      if(self.$lastTimer) {
        clearTimeout(self.$lastTimer);
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