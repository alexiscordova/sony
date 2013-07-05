// # Timer
//
// * **Class:** Timer
// * **Version:** 1.1
// * **Author:** Glen Cheney
// * **Created:** 2012-09-07
// * **Modified:** 2013-07-05
// * **Dependencies:** None


define(function() {
  'use strict';

  var Timer = function( fn, delay ) {
    this.timerId = null;
    this.start = null;
    this.isPaused = false;
    this.delay = delay;
    this.remaining = delay;
    this.fn = fn;
    this.resume();
  };

  // Clears current timer and sets this.remaining
  Timer.prototype.pause = function() {
    this.clear();
    this.remaining -= new Date() - this.start;
    this.isPaused = true;
    return this.remaining;
  };

  // Sets start time and a timeout of this.remaining
  Timer.prototype.resume = function() {
    this.start = new Date();
    this.timerId = setTimeout( this.fn, this.remaining );
    this.isPaused = false;
    return this.remaining;
  };

  // Sets time remaining to initial delay and clears timer
  Timer.prototype.reset = function() {
    this.remaining = this.delay;
    this.clear();
  };

  // Resets the timer to the original delay, clears the current timer, and starts the timer again
  Timer.prototype.restart = function() {
    this.reset();
    this.resume();
  };

  // Clears timer
  Timer.prototype.clear = function() {
    clearTimeout( this.timerId );
    this.isPaused = false;
  };

  return Timer;
});