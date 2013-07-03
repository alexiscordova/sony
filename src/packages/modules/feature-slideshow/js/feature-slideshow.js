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
      // Modernizr = require('modernizr'),
      // iQ = require('iQ'),
      // Settings = require('require/sony-global-settings'),
      // Environment = require('require/sony-global-environment'),
      // sonyCarousel = require('secondary/index').sonyCarousel,
      Fade = require('secondary/sony-fade'),
      Viewport = require('secondary/index').sonyViewport;

  var FeatureSlideshow = function( element ) {
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

    init : function() {
      var self = this;

      self.setVars();

      self.setupCarousel();
      self.subscribeToEvents();

      Viewport.add({
        element: self.element,
        threshold: '50%',
        callback: function() {
          self.$el.addClass('in');
          self.fadeInCarouselContent();
        }
      });

      // Fake adding another one for testing
      setTimeout(function() {
        Viewport.add({
          element: $('article').get(3),
          threshold: 100,
          callback: function() {
            $('article').eq(3).addClass('in');
          }
        });
      }, 1000);

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

      self.fade = new Fade( self.$slideContainer, {
        slides: '.fs-slide',
        $dotNavWrapper: self.$wrapper
      });

      return self;
    },

    fadeInSlideContent : function( slideIndex ) {
      return this.$slides.eq( slideIndex ).find('.caption').addClass('in');
    },

    // Image sequence finished
    fadeInCarouselContent : function() {
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
        self.fadeInSlideContent( self.currentSlide );
        self.visitedSlides[ self.currentSlide ] = true;
      }
    }
  };

  return FeatureSlideshow;
 });
