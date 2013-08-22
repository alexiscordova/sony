// Story Sequence
// ------------
//
// * **Module:** Story Sequence
// * **Version:** 1.0
// * **Modified:** 06/24/2013
// * **Author:** Glen Cheney
// * **Dependencies:** jQuery 1.9.1+, Modernizr,
//    [SonySequence](../secondary/sony-img-sequence.html),
//    [Timer](../secondary/sony-timer.html),
//    [Viewport](../secondary/sony-viewport.html),
//    [Dial](../secondary/sony-dial.html)
//
// *Example Usage:*
//
//      new StorySequence( $('.story-sequence')[0] );

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

  var StorySequence = function( element ) {
    var self = this;

    // Set base element
    self.element = element;
    self.$el = $( element );

    $.extend( self, StorySequence.settings );

    // Inits the module
    self.init();

    self.$el.data( 'storySequence', self );

    log('SONY : StorySequence : Initialized');
  };

  StorySequence.prototype = {

    init : function() {
      var self = this;

      self.setVars();

      self.sequence = new SonySequence( self.$el, {
        loop: true,
        animationspeed: self.animationspeed
      });

      self.createDial();
      self.subscribeToEvents();
    },

    setVars : function() {
      var self = this,
          data;

      self.$dial = self.$el.find( '.dial' );
      self.$btnTrigger = self.$el.find( '.js-cta' );
      self.$stopNumber = self.$el.find( '.js-stop-number' );
      self.$reset = self.$el.find( '.js-reset' );
      self.$cover = self.$el.find( '.js-cover' );
      self.$inner = self.$el.find( '.js-sequence-inner' );
      self.$stopContent = self.$el.find( '[data-stop]');
      data = self.$inner.data();
      self.stops = data.stops;
      self.totalStops = self.stops.length;

      return self;
    },

    subscribeToEvents : function() {
      var self = this;

      // Listen for global resize
      // Environment.on('global:resizeDebounced', $.proxy( self.onResize, self ));

      // Show sequence when the CTA button is clicked
      self.$btnTrigger.on( 'click', $.proxy( self.onCTAClick, self ) );

      self.$reset.on( 'click', $.proxy( self.onResetClick, self ) );

      // Place the cover behind the sequence when it has been hidden
      self.$cover.on( Settings.transEndEventName, $.proxy( self.onCoverTransitionEnd, self ) );
    },

    createDial : function() {
      var self = this;

      self.dial = new Dial({
        knob: {
          width: 60,
          height: 60,
          thickness: 0.2,
          bgColor: '#d2d2db',
          fgColor: '#504d56',
        },
        element: self.$dial,
        length: self.restLength
      });

      self.updateDisplayCount();
    },

    // onResize : function() {

    // },

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

      // There is a transitionend event on the cover,
      // which triggers the `showSequence` function.
      // If the browser doesn't have transitions, the sequence should
      // be shown immediately
      if ( !Modernizr.csstransitions ) {
        self.showSequence();
      }
    },

    onResetClick : function( evt ) {
      var self = this;

      evt.preventDefault();

      // Go to first img
      self.gotoStop( 0, true );

      // Hide reset button
      self.$el.removeClass( 'is-last-stop' );

      // Start timers
      self.startTimer();
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

      self.showSequence();
    },

    showSequence : function() {
      var self = this;

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

    // Add active and visible classes to current stop content
    showStopContent : function() {
      var self = this;

      self.$stopContent
        .eq( self.currentStop )
        .addClass( self.activeContentClass );
    },

    // Remove active and visible classes from all content
    hideStopContent : function() {
      var self = this;
      self.$stopContent.each(function() {
        var $content = $( this );

        if ( $content.hasClass( self.activeContentClass ) ) {
          $content.removeClass( self.activeContentClass );
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

    gotoStop : function( index ) {
      var self = this,
          stop = self.getStop( index ),
          stopIndex = self.stops[ stop ];

      self.currentStop = stop;

      // Update the counter inside the knob
      self.updateDisplayCount();
      self.hideStopContent();

      self.sequence.startAnimation( stopIndex );
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

  StorySequence.settings = {
    activeContentClass: 'active in',
    animationspeed: 100,
    currentStop: 0,
    isSequenceVisible: false,
    restLength: 3000
  };

  return StorySequence;
 });
