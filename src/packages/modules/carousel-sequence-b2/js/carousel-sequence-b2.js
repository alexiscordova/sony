// Carousel Sequence
// ------------
//
// * **Module:** Carousel Sequence
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
      Timer = require('secondary/index').sonyTimer,
      Viewport = require('secondary/index').sonyViewport,
      Dial = require('secondary/index').sonyDial;

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
        loop: true
      });

      self.createDial();
      self.subscribeToEvents();
      self.onResize();
    },

    setVars : function() {
      var self = this,
          data;

      self.$dial = self.$el.find( '.dial' );
      self.$btnTrigger = self.$el.find( '.js-cta' );
      self.$stopNumber = self.$el.find( '.js-stop-number' );
      self.$reset = self.$el.find( '.js-reset' );
      self.$cover = self.$el.find( '.cs-cover' );
      self.$inner = self.$el.find( '.cs-inner' );
      self.$stopContent = self.$el.find( '.stop-content [data-stop]');
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

      self.$reset.on( 'click', $.proxy( self.onResetClick, self ) );

      // Place the cover behind the sequence when it has been hidden
      self.$cover.on( Settings.transEndEventName, $.proxy( self.onCoverTransitionEnd, self ) );
    },

    createDial : function() {
      var self = this;

      self.dial = new Dial({
        element: self.$dial,
        length: self.restLength
      });

      self.updateDisplayCount();
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
          if ( self.isSequenceVisible ) {
            self.resume();
          }
        },
        leave: function() {
          if ( self.isSequenceVisible ) {
            self.pause();
          }
        }
      });

      self.$inner.removeClass('invisible');
      self.$cover.removeClass('in');
    },

    onResetClick : function( evt ) {
      var self = this;

      evt.preventDefault();

      self.gotoStop( 0, true );
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

      // Autoplay. Kicks off dial timer animation and queues the sequence
      setTimeout(function() {
        self.startTimer();
      }, 0);
    },

    showReset : function() {
      var self = this;

      self.$el.addClass( 'is-last-stop' );
    },

    showStopContent : function() {
      var self = this;

      self.$stopContent
        .eq( self.currentStop )
        .removeClass( 'hidden' );
    },

    hideStopContent : function() {
      var self = this;
      self.$stopContent.each(function() {
        var $content = $( this );

        if ( !$content.hasClass( 'hidden' ) ) {
          $content.addClass( 'hidden' );
        }
      });
    },

    getStop : function( index ) {
      return index < 0 ?
        this.totalStops - 1 :
        index >= this.totalStops ?
          0 :
          index;
    },

    gotoStop : function( index, noAnimation ) {
      var self = this,
          stop = self.getStop( index ),
          stopIndex = self.stops[ stop ];

      self.currentStop = stop;
      console.log( 'goto:', stop, 'which is index:', stopIndex );

      // Update the counter inside the knob
      self.updateDisplayCount();
      self.hideStopContent();

      if ( noAnimation ) {
        self.sequence.sliderGotoFrame( stopIndex );
      } else {
        self.sequence.startAnimation( stopIndex );
      }
    },

    prev : function() {
      return this.gotoStop( this.currentStop - 1 );
    },

    next : function() {
      return this.gotoStop( this.currentStop + 1 );
    },

    startTimer : function() {
      var self = this;

      // Sets a timer to execute in `restLength` milliseconds
      self.timer = new Timer( $.proxy( self.loop, self ), self.restLength );

      // Immidiately starts the dial animation
      self.dial.start();

      self.showStopContent();
    },

    pause : function() {
      var self = this;

      if ( self.timer ) {
        self.timer.pause();
      }

      if ( self.dial.isRunning ) {
        self.dial.pause();
      }
    },

    resume : function() {
      var self = this;

      if ( self.timer && self.timer.isPaused ) {
        self.timer.resume();
      }

      if ( self.dial.isPaused ) {
        self.dial.resume();
      }
    },

    loop : function() {
      var self = this,
          isLastStop = self.currentStop === self.stops.length - 1;

      if ( self.timer ) {
        self.timer.clear();
      }
      // Make falsy checks for timer false
      self.timer = null;

      // Stop dial
      self.dial.stop();

      // At the last stop, show ending CTA
      if ( isLastStop ) {
        self.showReset();

      // Not the last stop, go to the next one
      } else {
        // Next sequence
        self.next();

        // When the next slide has faded in, start a new timer
        self.$el.one('SonySequence:stop-sequence', $.proxy( self.startTimer, self ));
      }
    },

    updateDisplayCount : function() {
      var self = this;

      self.$stopNumber.text( self.currentStop + 1 );
    }
  };

  CarouselSequence.settings = {
    animationspeed: 100,
    currentStop: 0,
    isSequenceVisible: false,
    restLength: 3000
  };

  return CarouselSequence;
 });
