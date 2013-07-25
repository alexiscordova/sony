
// Sony Fade
// --------------------------------------------
//
// * **Class:** SonyFade
// * **Version:** 0.1
// * **Modified:** 07/02/2013
// * **Author:** Glen Cheney
// * **Dependencies:** jQuery 1.7+, sony settings, sony environment, hammerJS, sony-paddles, sony-navdots, sony-timer
//
// A carousel which fades the slides
//
//
// *Example Usage:*

define(function(require) {

  'use strict';

  var $ = require('jquery'),
      iQ = require('iQ'),
      Settings = require('require/sony-global-settings'),
      // Utilities = require('require/sony-global-utilities'),
      Environment = require('require/sony-global-environment'),
      hammer = require('plugins/index').hammer,
      sonyPaddles = require('secondary/sony-paddles'),
      Timer = require('secondary/sony-timer'),
      sonyNavigationDots = require('secondary/sony-navigationdots');

  var _id = 0;

  var Fade = function( $element, options ) {
    var self = this;

    $.extend( self, Fade.options, options, Fade.settings );

    self.currentSlide = 0;
    self.id = _id++;
    self.$el = $element;

    self.init();
  };

  Fade.prototype = {

    init: function() {
      var self = this;

      self.setVars();
      self.resetSlides( true );
      self.initSlides();

      if ( self.totalSlides <= 1 ) {
        self.destroy();
        return;
      }

      self.setupGestures();

      self.gotoSlide( 0, true );

      // Opacity has to be set to zero in old ie with filter
      if ( !self.hasTransitions ) {
        self.$slides
          .eq(0)
          .css('opacity', 1)
          .siblings()
          .css('opacity', 0);
      }

      self.$el.addClass('sony-fade-active');

      if ( self.autoplay ) {
        self.play();
      }
    },

    setVars : function() {
      var self = this;

      self.$wrapper = self.$el.parent();
      self.updateSlides();
      self.crossfadeTimeout = self.animationSpeed - (self.animationSpeed * self.crossfade);

      // If the slideDurations array is not full, append default values
      if ( self.slideDurations.length < self.totalSlides ) {
        for (var i = self.slideDurations.length; i < self.totalSlides; i++) {
          self.slideDurations.push( self.slideDuration );
        }
      }
    },

    updateSlides : function() {
      var self = this;
      self.$slides = self.getSlides();
      self.totalSlides = self.$slides.length;
      return self;
    },

    getSlides : function() {
      return this.slides ? this.$el.find( this.slides ) : this.$el.children();
    },

    getSlideIndex : function( index ) {
      return index < 0 ?
        this.totalSlides - 1 :
        index >= this.totalSlides ?
          0 :
          index;
    },

    initSlides: function() {
      var self = this;

      self.$slides.css( 'transitionDuration', self.animationSpeed + 'ms' );
    },

    resetSlides: function( isInit ) {
      var self = this;

      if ( !isInit ) {
        // Remove the event because we're going to subscribe to it again
        self.$slides.off('click.sonyfade');
        self.updateSlides();
      }

      if ( self.paddles ) {
        self.createPaddles();
      }

      if ( self.pagination ) {
        self.createPagination();
      }

      // I don't know what this does...
      self.$el.find('a').on('focus', function() {
        self.gotoSlide(self.$slides.index($(this).closest(self.$slides)));
      });
    },

    setupGestures: function() {
      var self = this;

      self.$el.hammer({
        drag: true,
        drag_block_horizontal: true,
        drag_lock_min_distance: 20,
        hold: false,
        release: true,
        swipe: false,
        tap: false,
        touch: true,
        transform: false
      });
      self.$el.on('dragstart.sonyfade', $.proxy( self.dragStart, self ));
      self.$el.on('dragend.sonyfade', $.proxy( self.dragEnd, self ));
      self.$el.on('release.sonyfade', $.proxy( self.release, self ));
    },

    // Stop animations that were ongoing when you started to drag.

    dragStart: function() {

      var self = this;

      self.isDragging = true;
    },

    // Depending on how fast you were dragging, either proceed to an adjacent slide or
    // reset position to the nearest one.

    dragEnd: function(e) {

      var self = this,
          gesture = e.gesture;

      self.isDragging = false;

      if ( gesture && gesture.velocityX > self.dragVelocity ) {
        if ( gesture.direction === 'right' ) {
          self.prev();
        } else if ( gesture.direction === 'left' ) {
          self.next();
        }
      }
    },

    // Simply broadcast that the carousel was released, irregardless of if it was dragged,
    // and transmit the carousel's current slide.

    release: function() {

      var self = this;

      self.$el.trigger('SonyFade:released', self.currentSlide);
    },

    next: function() {
      return this.gotoSlide( this.getSlideIndex( this.currentSlide + 1 ) );
    },

    prev: function() {
      return this.gotoSlide( this.getSlideIndex( this.currentSlide - 1 ) );
    },

    gotoSlide: function( which, noAnim ) {
      var self = this,
          speed = ( noAnim ? 0 : self.animationSpeed ),
          $prevSlide,
          $nextSlide,
          isNewSlide = which !== self.currentSlide;

      // Next slide faded in
      function complete() {
        iQ.update();

        // If there is a timer, this gotoSlide wasn't triggered
        // by the timer (either dot or nav click)
        if ( self.timer && self.isTimerReset ) {
          self.timer.resume();
          self.isTimerReset = false;
        }

        if ( $prevSlide ) {
          $prevSlide.removeClass('behind');

          if ( !self.hasTransitions ) {
            $prevSlide.animate( { opacity: 0 }, speed );
          }
        }

        self.$el.trigger('SonyFade:AnimationComplete');
      }

      // Called after the crossfade timeout length
      function fadeOutPrevious() {
        if ( $prevSlide ) {
          $prevSlide.removeClass('on');

          if ( !self.hasTransitions ) {
            $prevSlide.animate( { opacity: 0 }, speed );
          }
        }
      }


      // Get current slide
      $nextSlide = self.$slides.eq( which );

      // Show this slide
      $nextSlide.addClass('on');

      // Get a previous slide if there is one
      if ( isNewSlide ) {
        $prevSlide = self.$slides.eq( self.currentSlide );
        $prevSlide.addClass('behind');

        // Use transitions if available
        if ( self.hasTransitions ) {

          // Going to a new slide, wait for callback
          $nextSlide.one( Settings.transEndEventName, complete );

        // Fallback to jQuery animate
        } else {
          $nextSlide.animate( { opacity: 1 }, speed, complete );
        }

        // Delay the previous slide fading out by a little so
        // the background isn't visible for a split second
        setTimeout( fadeOutPrevious, self.crossfadeTimeout );
      }

      // Update current slide index
      self.currentSlide = which;

      // Reset the timer if it's ticking
      if ( self.timer && !self.timer.isPaused ) {
        self.timer.reset();
        self.isTimerReset = true;
      }

      // Trigger event
      self.$el.trigger('SonyFade:gotoSlide', self.currentSlide);

      // Staying on this same slide, immediately invoke callbacks
      if ( !isNewSlide ) {
        fadeOutPrevious();
        complete();
      }
    },

    createPagination: function () {
      var self = this;

      if ( self.totalSlides <= 1 ) {
        return;
      }

      if ( self.$dotnav ) {
        self.$dotnav.sonyNavDots('reset', {
          buttonCount: self.totalSlides
        });
        return;
      }

      var $dotnavWrapper = $('<div class="sony-dot-nav" />');

      if ( self.$dotNavWrapper ) {
        $dotnavWrapper.appendTo(self.$dotNavWrapper);
      } else {
        $dotnavWrapper.insertAfter(self.$wrapper);
      }

      self.$dotnav = $dotnavWrapper.sonyNavDots({
        buttonCount: self.totalSlides,
        theme: self.paginationTheme
      });

      self.$dotnav.on('SonyNavDots:clicked', function(e, which) {
        self.gotoSlide(which);
      });

      self.$el.on('SonyFade:gotoSlide', function(e, which) {
        self.$dotnav.sonyNavDots('reset', {
          activeButton: which
        });
      });
    },

    createPaddles: function() {
      var self = this,
          $wrapper = self.$paddleWrapper || self.$wrapper;

      if ( Settings.hasTouchEvents || self.paddlesInit ) {
        return;
      }

      self.paddlesInit = true;

      $wrapper.sonyPaddles({
        useSmallPaddles: self.useSmallPaddles,
        paddlePosition: self.paddlePosition
      });

      // Show paddles by default
      $wrapper.sonyPaddles('showPaddle', 'both');

      $wrapper.on('sonyPaddles:clickLeft', function(e) {
        e.stopPropagation();
        self.prev();
      });

      $wrapper.on('sonyPaddles:clickRight', function(e) {
        e.stopPropagation();
        self.next();
      });
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

      // Next slide
      self.next();

      // When the next slide has faded in, start a new timer
      self.$el.one('SonyFade:AnimationComplete', $.proxy( self.startTimer, self ));
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

      // Clear reference to timer
      self.timer = null;

      self.isPlaying = false;
    },

    startTimer : function() {
      var self = this;

      self.timer = new Timer( $.proxy( self.loop, self ), self.slideDurations[ self.currentSlide ] );
    },

    // Reset the style attribute for the properties we might have manipulated.
    // Destroy the plugins we've initialized as part of the fade.

    destroy: function() {
      var self = this,
          $paddleWrapper = self.$paddleWrapper || self.$wrapper,
          slideStyles;

      slideStyles.opacity = '';
      slideStyles.transitionDuration = '';

      // Reset styles.
      self.$slides.css( slideStyles );

      // Unbind
      self.$el.off('.sonyfade SonyFade:gotoSlide');
      self.$slides.off('click.sonyfade');

      if ( self.paddles ) {
        $paddleWrapper.sonyPaddles('destroy');
        $paddleWrapper.off('sonyPaddles:clickLeft');
        $paddleWrapper.off('sonyPaddles:clickRight');
      }

      if ( self.$dotnav ) {
        self.$dotnav.sonyNavDots('destroy');
        self.$dotnav.remove();
        self.$dotnav = null;
      }

      // Remove data from element, allowing for later reinit.
      self.$el.removeData('sonyFade');
      self.$el.removeClass('sony-fade-active');
    }
  };

  // Defaults
  // --------

  Fade.options = {

    // Selector for the individual slides within the fade. If undefined, it will be all the children
    slides: undefined,

    // Speed of slide animation, in ms.
    animationSpeed: 500,

    // Percentage to crossfade the two slides
    crossfade: 0.875,

    // Start playing on initialization
    autoplay: false,

    // Default slide duration in milliseconds. If the slideDurations array is not full,
    // it will be filled with this value
    slideDuration: 3000,

    // An array of durations correlating to each slide
    slideDurations: [],

    dragVelocity: 0.5,

    // Create paddles.
    paddles: true,

    // Set to `outset` to allow grid-based positioning of paddles above 1400px screen width.
    paddlePosition: 'inset',

    // Will use `.nav-paddle` instead of `.pagination-paddle` for the paddle class
    useSmallPaddles: false,

    // If element is specified, insert pagination into that element instead of using the default position.
    $dotNavWrapper: undefined,

    // If element is specified, insert paddles into that element instead of using the default position.
    $paddleWrapper: undefined,

    // Create dot pagination, which is inserted after self.$el.
    pagination: true,

    // Use `light` or `dark` bullets for pagination.
    paginationTheme: 'dark'
  };

  Fade.settings = {
    hasTransitions: Modernizr.csstransitions,
    isPlaying: false,
    paddlesInit: false
  };

  return Fade;
});