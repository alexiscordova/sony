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
      self.throttleTime = 250;

      self.onResize();
      self.bindEvents();

      // What's nice here is that rAF won't execute until the user is on this tab,
      // so if they open the page in a new tab which they aren't looking at,
      // this will execute when they come back to that tab
      requestAnimationFrame(function() {
        self.setScrollTop();
        self.process();
      });
    },

    bindEvents : function() {
      var self = this;

      // Listen for global resize
      Environment.on('global:resizeDebounced.viewport', $.proxy( self.onResize, self ));

      // Throttle scrolling because it doesn't need to be super accurate
      Settings.$window.on('scroll.viewport', $.throttle( self.throttleTime, $.proxy( self.onScroll, self ) ));

      // When the universal nav is opened or closed, the trigger point needs adjustment along with scrollspy
      Settings.$document.on('universal-nav-open-finished.viewport universal-nav-close-finished.viewport', function uNavChanged() {
        setTimeout(function refreshWithDelay() {
          self.onResize();
        }, 0);
      });

      self.hasActiveHandlers = true;
    },

    unbindEvents : function() {
      Environment.off('.viewport');
      Settings.$window.off('.viewport');
      Settings.$document.off('.viewport');

      this.hasActiveHandlers = false;
    },

    maybeUnbindEvents : function() {
      var self = this;

      // Not currently watching anything, unbind events
      if ( !self.list.length ) {
        self.unbindEvents();
      }
    },

    add : function( options ) {
      var self = this,
          isThresholdPercentage = false;

      // The whole point is to have a callback function.
      // Don't do anything if it's not given
      if ( !$.isFunction( options.callback ) ) {
        throw 'Viewport.add :: No callback function provided to Viewport';
      }

      // Threshold can be a percentage. Parse it.
      if ( (typeof options.threshold === 'string' && options.threshold.indexOf('%') > -1 ) ) {
        isThresholdPercentage = true;
        options.threshold = parseFloat( options.threshold ) / 100;

      } else if ( options.threshold < 1 && options.threshold > 0 ) {
        isThresholdPercentage = true;
      }

      options.isThresholdPercentage = isThresholdPercentage;
      options.$element = $( options.element );

      // Cache element's offsets and dimensions
      options.offset = options.$element.offset();
      options.height = options.$element.height();
      options.width = options.$element.width();

      self.list.push( options );

      // Event handlers are removed if a callback is triggered and the
      // watch list is empty. Because modules are instantiated asynchronously,
      // another module could potentially add itself to the watch list when the events
      // have been unbound.
      // Check here if events have been unbound and bind them again if they have
      if ( !self.hasActiveHandlers ) {
        self.bindEvents();
      }

      requestAnimationFrame(function() {
        self.process();
      });
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
      self.setScrollTop();

      self.process();
    },

    // Debounced resize event
    onResize : function() {
      var self = this;

      // No point in doing anything if there aren't any viewports to watch
      if ( !self.list.length ) {
        return;
      }

      // Update offsets and width/height for each viewport item
      self.saveDimensions();
    },

    isInViewport : function( viewport ) {
      var self = this,
          offset = viewport.offset,
          threshold = viewport.threshold,
          percentage = threshold,
          st = self.lastScrollY,
          isTopInView;


      if ( viewport.isThresholdPercentage ) {
        threshold = 0;
      }

      // Other checks could be added here in the future
      isTopInView = self.isTopInView( st, self.windowHeight, offset.top, viewport.height, threshold );

      // If the top isn't in view with zero threshold,
      // don't bother checking if it's at a percent of the window
      if ( isTopInView && viewport.isThresholdPercentage ) {
        isTopInView = self.isTopPastPercent( st, self.windowHeight, offset.top, viewport.height, percentage );
      }

      return isTopInView;
    },

    // If  the top of the element (plus the threshold) is past the viewport's top
    // and the top of the element (plus the threshold) is not past the viewport's bottom.
    // Then the top is in view.
    isTopInView : function( viewportTop, viewportHeight, elementTop, elementHeight, threshold ) {
      var viewportBottom = viewportTop + viewportHeight;
      return (elementTop + threshold) >= viewportTop && (elementTop + threshold) < viewportBottom;
    },

    isTopPastPercent : function( viewportTop, viewportHeight, elementTop, elementHeight, percentage ) {
      var viewportBottom = viewportTop + viewportHeight,
          distFromViewportBottomToElementTop = viewportBottom - elementTop,
          percentFromBottom = distFromViewportBottomToElementTop / viewportHeight;
      return percentFromBottom >= percentage;
    },

    triggerCallback : function( index, listItem ) {
      var self = this;

      listItem.callback.call( listItem.element, listItem );

      // No longer need to watch it, so remove from list
      self.list.splice( index, 1 );

      // If there are no more, unbind from scroll and resize events
      self.maybeUnbindEvents();
    },

    setScrollTop : function() {
      // Save the new scroll top
      this.lastScrollY = Settings.$window.scrollTop();
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
    options = $.extend( {}, Viewport.options, options, Viewport.settings );

    return instance.add( options );
  };

  Viewport.options = {
    threshold: 200
  };

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
