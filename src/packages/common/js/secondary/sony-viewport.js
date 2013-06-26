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
      var self = this,
          secondsAfterLastTriggerToUnbind = Settings.isModern ? 4 : 15;

      // The list of viewports to watch
      self.list = [];
      self.lastScrollY = 0;
      self.windowHeight = Settings.$window.height();
      self.windowWidth = Settings.$window.width();
      self.timer = 0;
      self.timerLength = secondsAfterLastTriggerToUnbind * 1000;

      self.onResize();
      self.bindEvents();

      // What's nice here is that rAF won't execute until the user is on this tab,
      // so if they open the page in a new tab which they aren't looking at,
      // this will execute when they come back to that tab
      requestAnimationFrame(function() {
        self.process();
      });
    },

    bindEvents : function() {
      var self = this;

      // Listen for global resize
      Environment.on('global:resizeDebounced.viewport', $.proxy( self.onResize, self ));

      // Throttle scrolling because it doesn't need to be super accurate
      Settings.$window.on('scroll.viewport', $.throttle( 500, $.proxy( self.onScroll, self ) ));
    },

    unbindEvents : function() {
      Environment.off('.viewport');
      Settings.$window.off('.viewport');
    },

    maybeUnbindEvents : function() {
      var self = this;

      // Not currently watching anything, but there could be another
      // module that will ask Viewport to watch it.
      if ( !self.list.length ) {

        // There is a timeout here because this module does not know how many things
        // are going to bind to it. To save resources, the resize and scroll event listeners
        // should be removed, but since all the modules are loaded asynchronously,
        // there isn't an event for when all modules have added to this module
        self.timer = setTimeout(function() {
          self.unbindEvents();
        }, self.timerLength);
      }
    },

    add : function( options ) {
      var self = this;

      // The whole point is to have a callback function.
      // Don't do anything if it's not given
      if ( !$.isFunction( options.callback ) ) {
        throw 'Viewport.add :: No callback function provided to Viewport';
      }

      options.triggered = false;
      options.$element = $( options.element );
      options.offset = options.$element.offset();
      options.height = options.$element.height();
      options.width = options.$element.width();

      self.list.push( options );

      // Remove the timer which unbinds from scroll and resize events
      if ( self.timer ) {
        clearTimeout( self.timer );
      }

      self.process();
    },

    saveDimensions : function() {
      var self = this;

      $.each(self.list, function( i, listItem ) {
        listItem.offset = listItem.$element.offset();
        listItem.height = listItem.$element.height();
        listItem.width = listItem.$element.width();
      });

      // self.documentHeight
      self.windowHeight = Settings.$window.height();
      self.windowWidth = Settings.$window.width();
    },

    // Throttled scroll event
    onScroll : function() {
      var self = this;

      // No point in doing anything if there aren't any viewports to watch
      if ( !self.list.length ) {
        return;
      }

      // Save the new scroll top
      self.lastScrollY = Settings.$window.scrollTop();

      self.process();
    },

    // Debounced resize event
    onResize : function() {
      var self = this;

      // No point in doing anything if there aren't any viewports to watch
      if ( !self.list.length ) {
        return;
      }

      // Save the new scroll top
      self.lastScrollY = Settings.$window.scrollTop();

      // Update offsets and width/height for each viewport item
      self.saveDimensions();
    },

    isInViewport : function( viewport ) {
      var self = this,
          offset = viewport.offset,
          threshold = viewport.threshold,
          st = self.lastScrollY,
          isTopInView;

      // Other checks could be added here in the future
      isTopInView = self.isTopInView( st, self.windowHeight, offset.top, viewport.height, threshold );

      return isTopInView;
    },

    // If  the top of the element (plus the threshold) is past the viewport's top
    // and the top of the element (plus the threshold) is not past the viewport's bottom.
    // Then the top is in view.
    isTopInView : function( viewportTop, viewportHeight, elementTop, elementHeight, threshold ) {
      var viewportBottom = viewportTop + viewportHeight;
      return (elementTop + threshold) >= viewportTop && (elementTop + threshold) < viewportBottom;
    },

    triggerCallback : function( index, listItem ) {
      var self = this;

      listItem.callback();
      listItem.triggered = true;

      self.list.splice( index, 1 );

      // If there are no more
      self.maybeUnbindEvents();
    },

    process : function() {
      var self = this,

          // The list can possibly be modified mid loop,
          // so the loop needs a copy of the variable which won't be modified
          list = $.extend( [], self.list );

      $.each(list, function( i, listItem ) {
        var isInViewport = self.isInViewport( listItem );

        if ( isInViewport ) {
          self.triggerCallback( i, listItem );
        }
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
    threshold: 200
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
