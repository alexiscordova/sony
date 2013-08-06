// # Dial
//
// * **Class:** Dial
// * **Version:** 1.0
// * **Author:** Glen Cheney
// * **Created:** 2013-07-25
// * **Dependencies:** jQuery, [simpleknob](jquery.simpleknob.html)
//
// *Notes:*
//
// This dial module is intended to be used as an animated timer. It uses the SimpleKnob
// jQuery plugin as a base and extends that with `start`, `stop`, `pause`, and `resume`
// methods to animate the dial. Knob options can be either set via data-* attributes,
// or an object `knob` when the dial is initialized. Dial styles can also be
// updated via the `setStyles` function (for example, the dial might need to be smaller at mobile size).
//
// *Example Usage:*
//
//       var dial = new Dial({
//         element: self.$dial,
//         length: self.restLength
//       });
//
// *Options:*
//
// * `element` is a DOM element (or an element wrapped with jQuery)
// * `length` is the length of the timer
//


define(function( require ) {
  'use strict';

  var $ = require('jquery'),
      SimpleKnob = require('secondary/jquery.simpleknob');

  // Detect canvas support
  var isCanvasSupported = (function() {
    var canvas = document.createElement( 'canvas' );
    return canvas.getContext && canvas.getContext('2d');
  }());

  var Dial = function( options ) {
    var self = this;

    $.extend( self, Dial.options, options, Dial.settings );

    self.init();
  };

  Dial.prototype = {

    init : function() {
      var self = this,
          data,
          hasData;

      self.$el = $( self.element );
      data = self.$el.data();
      hasData = !!data.width;

      if ( isCanvasSupported ) {
        self.$el.simpleKnob();

        // If there is a data-width attribute on the `<input>` element
        // assume the knob is already styled with the wanted attributes,
        // otherwise it should use the options given on init
        if ( self.knob || !hasData ) {
          self.setStyles( self.knob );
        }

        // So dumb that knob doesn't add any hooks to its element >:(
        self.$el.parent().addClass('simpleknob');
      }
    },

    set : function( value ) {
      this.$el.val( value ).trigger('change');
    },

    setStyles : function( styles ) {
      var self = this;

      self.$el.trigger( 'configure', styles );
    },

    start : function() {
      var self = this;

      self.timerStarted = $.now();

      self.isRunning = true;
      self.loop();
    },

    pause : function() {
      var self = this;

      // Avoid pausing a dial which is already paused
      if ( self.isPaused ) {
        return false;
      }

      self.isRunning = false;
      self.isPaused = true;

      // Stop the next loop
      cancelAnimationFrame( self.requestID );

      self.timeSinceDialStarted = $.now() - self.timerStarted;
    },

    resume : function() {
      var self = this;

      // Can't resume something which isn't paused
      if ( !self.isPaused ) {
        return false;
      }

      self.isRunning = true;
      self.isPaused = false;

      // Prented to move the timer forward the amount of time it was paused
      self.timerStarted = $.now() - self.timeSinceDialStarted;

      self.loop();
    },

    loop : function() {
      var self = this,
          now = $.now(),
          elapsed = now - self.timerStarted,
          percentageElapsed = elapsed / self.length,
          integerElapsed = Math.ceil( percentageElapsed * 100 );

      // Don't need to continue if the knob has passed 100%
      if ( integerElapsed > 100 ) {
        return;
      }

      // As long as the last and current values are different, update the knob display
      if ( self.lastKnobValue !== integerElapsed ) {
        // Update input value and trigger the knob to update
        self.set( integerElapsed );
      }

      // Save this value
      self.lastKnobValue = integerElapsed;

      // Loop again (if the timer hasn't expired)
      self.requestID = requestAnimationFrame( $.proxy( self.loop, self ) );
    },

    stop : function() {
      var self = this;

      self.isRunning = false;
      cancelAnimationFrame( self.requestID );
    },

    destroy : function() {
      var self = this;

      self.stop();

      if ( isCanvasSupported ) {
        // Destroy simpleknob manually because it doesn't have a destroy method
        self.$el.parent().off('configure');
        self.$el.
          off('configure change').
          removeData('kontroled').
          removeAttr('style').
          siblings('canvas').
            remove().
            end().
          unwrap();
      }
    }
  };

  Dial.options = {
    length: 1000
  };

  Dial.settings = {
    requestID: 0,
    isRunning: false,
    isPaused: false
  };

  return Dial;
});