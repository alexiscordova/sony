// Viewport Helper
// --------------------------------------------
//
// * **Class:** Viewport
// * **Version:** 1.0
// * **Modified:** 06/25/2013
// * **Author:** Glen Cheney
// * **Dependencies:** jQuery 1.7+, SONY Settings, throttle/debounce
//
// *Notes:*
//
// *Example Usage:*
//
//      Viewport.add( element, callback )
//
//      Viewport.add( options )
//

define(function(require) {

  'use strict';

  var $ = require('jquery'),
      Environment = require('require/sony-global-environment'),
      Settings = require('require/sony-global-settings'),

      instance = null;

  var Viewport = function() {
    this.init();
  };

  Viewport.prototype = {

    init : function() {
      var self = this;

      // The list of viewports to watch
      self.list = [];
      self.windowHeight = 0;
      self.windowWidth = 0;


      self.onResize();
      self.listForEvents();
    },

    listForEvents : function() {
      var self = this;

      // Listen for global resize
      Environment.on('global:resizeDebounced', $.proxy( self.onResize, self ));

      // Throttle scrolling because it doesn't need to be super accurate
      Settings.$window.on('scroll', $.throttle( 500, $.proxy( self.onScroll, self ) ));
    },

    add : function( options ) {
      var self = this;

      options.triggered = false;
      options.$element = $( options.element );
      options.elementOffset = options.$element.offset();
      options.height = options.$element.height();
      options.width = options.$element.width();

      self.list.push( options );
    },

    saveDimensions : function() {
      var self = this;

      $.each(self.list, function( i, listItem ) {
        listItem.elementOffset = listItem.$element.offset();
        listItem.height = listItem.$element.height();
        listItem.width = listItem.$element.width();
      });

      self.windowHeight = Settings.$window.height();
      self.windowWidth = Settings.$window.width();
    },

    // Throttled scroll event
    onScroll : function() {
      var self = this;

      // Save the new scroll top
      self.lastScrollY = Settings.$window.scrollTop();

      self.processScroll();
    },

    // Debounced resize event
    onResize : function() {
      var self = this;

      // Update offsets and width/height for each viewport item
      self.saveDimensions();
    },

    processScroll : function() {
      var self = this,
          st = self.lastScrollY;

      $.each(self.list, function( i, listItem ) {

      });
    }

  };

  Viewport.add = function( element, callback ) {
    var instance = Viewport.getInstance(),
        options = {};

    // If the first arg is a plain object, it is an options object
    if ( $.isPlainObject( element ) ) {
      options = element;

    // Otherwise assume it is the element
    } else {
      options.element = element;
    }

    if ( callback ) {
      options.callback = callback;
    }

    // Get defaults
    $.extend( options, Viewport.options, options, Viewport.settings );

    return instance.add( options );
  };

  // Options that could be customized per module instance
  Viewport.options = {
    offset: 200
  };

  // These are not overridable when instantiating the module
  Viewport.settings = {
  };

  Viewport.getInstance = function() {
    if ( !instance ) {
      instance = new Viewport();
    }

    return instance;
  };

  return Viewport;
});
