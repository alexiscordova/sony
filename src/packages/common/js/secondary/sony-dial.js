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
// methods to animate the dial. At the moment, It _requires_ the `&lt;input&gt;` to be
// on the page already with the data-* attributes for the knob.
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

  var Dial = function( options ) {
    var self = this;

    $.extend( self, Dial.options, options, Dial.settings );

    self.init();
  };

  Dial.prototype = {

    init : function() {
      var self = this,
          canvas = document.createElement( 'canvas' ),
          hasCanvas = canvas.getContext && canvas.getContext('2d');

      self.$el = $( self.element );

      if ( hasCanvas ) {
        self.$el.simpleKnob();

        // So dumb that knob doesn't add any hooks to its element >:(
        self.$el.parent().addClass('simpleknob');
      }
    },

    set : function( value ) {
      this.$el.val( value ).trigger('change');
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