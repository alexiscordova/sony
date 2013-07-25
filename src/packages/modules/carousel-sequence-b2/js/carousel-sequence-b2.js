// Feature Slideshow
// ------------
//
// * **Module:** Feature Slideshow
// * **Version:** 1.0
// * **Modified:** 06/24/2013
// * **Author:** Glen Cheney
// * **Dependencies:** jQuery 1.9.1+, Modernizr
//
// *Example Usage:*
//
//      new CarouselSequence( $('.carousel-sequence')[0] );

define(function(require) {

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      Environment = require('require/sony-global-environment'),
      Settings = require('require/sony-global-settings'),
      SonySequence = require('secondary/index').sonySequence,
      Timer = require('secondary/sony-timer'),
      Viewport = require('secondary/sony-viewport'),
      SimpleKnob = require('secondary/jquery.simpleknob'),
      sonyPaddles = require('secondary/index').sonyPaddles;

  var CarouselSequence = function( element ) {
    var self = this;

    // Set base element
    self.element = element;
    self.$el = $( element );

    $.extend( self, CarouselSequence.settings );

    // Inits the module
    self.init();

    self.$el.data( 'carouselSequence', self );

    log('SONY : CarouselSequence : Initialized');
  };

  CarouselSequence.prototype = {

    init : function() {
      var self = this;

      self.setVars();

      self.sequence = new SonySequence( self.$el, {
        animationspeed: self.animationspeed,
        loop: true,
        viewcontrols: true
      });

      self.createPaddles();
      self.createKnob();
      self.subscribeToEvents();
      self.onResize();
    },

    setVars : function() {
      var self = this,
          data;

      self.$dial = self.$el.find( '.dial' );
      self.$btnTrigger = self.$el.find( '.js-cta' );
      self.$cover = self.$el.find( '.cs-cover' );
      self.$inner = self.$el.find( '.cs-inner' );
      data = self.$inner.data();
      self.stops = data.stops;
      self.totalStops = self.stops.length;

      console.log('stops:', self.stops);

      return self;
    },

    subscribeToEvents : function() {
      var self = this;

      // Listen for global resize
      Environment.on('global:resizeDebounced', $.proxy( self.onResize, self ));

      // Show sequence when the CTA button is clicked
      self.$btnTrigger.on( 'click', $.proxy( self.onCTAClick, self ) );

      // Place the cover behind the sequence when it has been hidden
      self.$cover.on( Settings.transEndEventName, $.proxy( self.onCoverTransitionEnd, self ) );
    },

    createPaddles : function() {
      var self = this,
          $wrapper = self.$inner;

      $wrapper.sonyPaddles();

      // Show paddles by default
      $wrapper.sonyPaddles('showPaddle', 'both');

      $wrapper.on('sonyPaddles:clickLeft', function(e) {
        e.stopPropagation();
        self.prev();
      });

      $wrapper.on('sonyPaddles:clickRight', function(e) {
        e.stopPropagation();
        self.next();
        // self.$el.trigger('reststop.sequence');
      });
    },

    createKnob : function() {
      var self = this;

      self.$dial.simpleKnob();
    },

    onResize : function() {

    },

    onCTAClick : function() {
      var self = this;

      // Add a viewport item only when the user clicks the CTA to reveal the sequence
      // otherwise it's a waste of a scroll listener
      Viewport.add({
        element: self.element,
        threshold: '50%',
        enter: function() {
          if ( self.isSequenceVisible && !self.isPlaying ) {
            self.resume();
          }
        },
        leave: function() {
          if ( self.isSequenceVisible && self.isPlaying ) {
            self.pause();
          }
        }
      });

      self.$inner.removeClass('invisible');
      self.$cover.removeClass('in');
    },

    onCoverTransitionEnd : function( evt ) {
      var self = this,
          cover = self.$cover[ 0 ],
          target = evt.target;

      // A transition event has bubbled up to the cover
      // this is not the event the cover is looking for, so exit
      if ( cover !== target ) {
        return;
      }

      // Only want to listen for this event once
      self.$cover.off( Settings.transEndEventName );

      // Add state to module
      self.$el.addClass( 'is-sequence-visible' );
      self.isSequenceVisible = true;

      // Hide cover after it faded out (avoid browser painting it)
      self.$cover.addClass('invisible');

      // Autoplay
      self.play();
    },

    getStop : function( index ) {
      return index < 0 ?
        this.totalStops - 1 :
        index >= this.totalStops ?
          0 :
          index;
    },

    gotoStop : function( index ) {
      var self = this,
          stop = self.getStop( index );

      self.currentStop = stop;
      console.log( 'goto:', stop, 'which is index:', self.stops[ stop ] );
      self.sequence.startAnimation( self.stops[ stop ] );
    },

    prev : function() {
      return this.gotoStop( this.currentStop - 1 );
    },

    next : function() {
      return this.gotoStop( this.currentStop + 1 );
    },

    // Starts a continuous loop
    play : function() {
      var self = this;

      // If a current timer exists, resume it
      if ( self.timer && self.timer.isPaused ) {
        self.timer.resume();

      // Otherwise start a new timer
      } else if ( !self.isPlaying ) {
        self.startTimer();
      }

      self.isPlaying = true;
    },

    loop : function() {
      var self = this;

      if ( self.timer ) {
        self.timer.clear();
      }
      // Make falsy checks for timer false
      self.timer = null;
      self.isKnobRunning = false;

      // Next sequence
      self.next();

      // When the next slide has faded in, start a new timer
      self.$el.on('reststop.sequence', $.proxy( self.startTimer, self ));
    },

    pause : function() {
      var self = this;

      if ( self.timer ) {
        self.timer.pause();
      }

      self.isPlaying = false;
    },

    stop : function() {
      var self = this;

      if ( self.timer ) {
        self.timer.clear();
      }

      self.timer = null;

      self.isPlaying = false;
    },

    startTimer : function() {
      var self = this;

      self.timer = new Timer( $.proxy( self.loop, self ), self.restLength );

      self.timerStarted = $.now();

      self.isKnobRunning = true;
      self.dialLoop();
    },

    dialLoop : function() {
      var self = this,
          now = $.now(),
          elapsed = now - self.timerStarted,
          percentageElapsed = elapsed / self.restLength,
          integerElapsed = Math.round( percentageElapsed * 100 );

      // Cap at 100
      integerElapsed = Math.min( 100, integerElapsed );

      // As long as the last and current values are different, update the knob display
      if ( self.lastKnobValue !== integerElapsed ) {
        // Update input value and trigger the knob to update
        self.$dial.val( integerElapsed ).trigger('change');
      }

      // Save this value
      self.lastKnobValue = integerElapsed;

      // Loop again (if the timer hasn't expired)
      if ( self.isKnobRunning ) {
        requestAnimationFrame( $.proxy( self.dialLoop, self ) );
      }
    }
  };

  CarouselSequence.settings = {
    animationspeed: 300,
    currentStop: 0,
    isKnobRunning: true,
    isPlaying: false,
    isSequenceVisible: false,
    restLength: 3000
  };

  return CarouselSequence;
 });
