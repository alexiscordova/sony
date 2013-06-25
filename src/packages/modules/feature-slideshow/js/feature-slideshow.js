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
//      new FeatureSlideshow( $('.feature-slideshow')[0] );

define(function(require) {

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      iQ = require('iQ'),
      Settings = require('require/sony-global-settings'),
      Environment = require('require/sony-global-environment'),
      sonyCarousel = require('secondary/index').sonyCarousel,
      Viewport = require('secondary/index').sonyViewport;

  var FeatureSlideshow = function(element) {
    var self = this;

    // Set base element
    self.element = element;
    self.$el = $( element );

    // Inits the module
    self.init();

    self.$el.data( 'featureSlideshow', self );

    log('SONY : FeatureSlideshow : Initialized');
  };

  FeatureSlideshow.prototype = {

    constructor: FeatureSlideshow,

    init : function() {
      var self = this;

      self.setVars();

      self.setupCarousel();
      self.subscribeToEvents();

      Viewport.add( self.element, function() {
        console.log('scrolled into view');
      });

      // Fake adding another one for testing
      setTimeout(function() {
        Viewport.add({
          element: $('article').get(3),
          offset: 100,
          callback: function() {
            console.log('scrolled into view, 100px already in view');
          }
        });
      }, 1000);

      // Fake animation playing
      setTimeout(function() {
        self.onAnimationComplete();
      }, 1500);
    },

    setVars : function() {
      var self = this;

      self.$wrapper = self.$el.find( '.fs-carousel-wrapper' );
      self.$slideContainer = self.$wrapper.find( '.fs-carousel' );
      self.$slides = self.$slideContainer.find( '.fs-slide' );
      self.numSlides = self.$slides.length;
      self.currentSlide = 0;

      // A dictionary of visited slides so the captions don't fade in every time
      self.visitedSlides = {
        '0' : true
      };

      return self;
    },

    subscribeToEvents : function() {
      var self = this;

      self.$slideContainer.on( 'SonyCarousel:gotoSlide', $.proxy( self.onGoToSlide, self ) );
      self.$slideContainer.on( 'SonyCarousel:AnimationComplete', $.proxy( self.onSlideAnimationComplete, self ) );
    },


    // Main setup method for the carousel
    setupCarousel: function() {
      var self = this;

      // Using Sony Carousel for this module
      self.$slideContainer.sonyCarousel({
        wrapper: '.fs-carousel-wrapper',
        slides: '.fs-slide',
        looped: false, // going to have issues with which index to fade things in if this is true
        jumping: false,
        paddles: true,
        pagination: true,
        $dotNavWrapper: self.$wrapper
      });

      return self;
    },

    fadeInContent : function( slideIndex ) {
      return this.$slides.eq( slideIndex ).find('.caption').addClass('in');
    },

    // Image sequence finished
    onAnimationComplete : function() {
      var self = this;

      self.$el.removeClass('animation-pending').addClass('animation-complete');

      // Fade in the first caption
      self.$slides.eq(0).find('.caption').addClass('in');

      // Fade in copy
      self.$el.find('.js-copy').addClass('in');
    },

    onGoToSlide : function( evt, currentSlide ) {
      var self = this;
      self.currentSlide = currentSlide;
    },

    onSlideAnimationComplete : function() {
      var self = this;

      // If the slide actually changed, fade in the next slides caption
      if ( !self.visitedSlides[ self.currentSlide ] ) {
        self.fadeInContent( self.currentSlide );
        self.visitedSlides[ self.currentSlide ] = true;
      }
    }
  };

  return FeatureSlideshow;
 });
