// Editorial SlideShow - E4
// ------------
//
// * **Module:** Editorial Slideshow - E4
// * **Version:** 1.0
// * **Modified:** 05/09/2013
// * **Author:** Tyler Madison, George Pantazis, Glen Cheney
// * **Dependencies:** jQuery 1.9.1+, Modernizr
//
// *Example Usage:*
//
//      new EditorialSlideshow( $('.editorial-slideshow')[0] );

define(function(require) {

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      iQ = require('iQ'),
      Settings = require('require/sony-global-settings'),
      Environment = require('require/sony-global-environment'),
      sonyCarousel = require('secondary/index').sonyCarousel;

  var module = {
    init: function() {
      $('.editorial-slideshow-container').each(function() {
        new EditorialSlideshow( this );
      });
    }
  };

  var EditorialSlideshow = function(element) {
    var self = this;

    // Set base element
    self.$el = $( element );

    self.$slides = self.$el.find( '.editorial-carousel-slide' );
    self.$slideContainer = self.$el.find( '.editorial-carousel' );
    self.numSlides = self.$slides.length;

    // If the $slideContainer is in a span6, consider it "small" for styling purposes.
    self.isSmall = ( self.$slideContainer.closest('.media-element').length > 0 );

    self.$document = Settings.$document;
    self.$window = Settings.$window;
    self.$html = Settings.$html;

    // Inits the module
    self.init();

    self.$el.data( 'editorialSlideshow', self );

    log('SONY : EditorialSlideshow : Initialized');
  };

  EditorialSlideshow.prototype = {

    constructor: EditorialSlideshow,

    init : function() {

      var self = this,
          $firstImage = self.$el.find('.iq-img').first();

      self.setupSlides();

      if ( $firstImage.data('hasLoaded') ) {
        self.setupCarousel();
      } else {
        $firstImage.on('imageLoaded', function(){
          self.setupCarousel();
        });
      }

      self.$slideContainer.css( 'opacity', 1 );
    },


    // Main setup method for the carousel
    setupCarousel: function() {
      var self = this;

      // Using Sony Carousel for this module
      self.$slideContainer.sonyCarousel({
        wrapper: '.editorial-carousel-wrapper',
        slides: '.editorial-carousel-slide',
        looped: true,
        jumping: true,
        axis: 'x',
        dragThreshold: 2,
        paddles: true,
        useSmallPaddles: self.isSmall,
        pagination: true
      });

      return self;
    },

    // Sets up slides to correct width based on how many there are.
    setupSlides: function() {
      var self = this,
          slidesWithClones = self.numSlides + 2,
          containerWidth = (100 * slidesWithClones) + '%',
          slideWidth = (100 / slidesWithClones) + '%';

      self.$slideContainer.css( 'width', containerWidth );
      self.$slides.css( 'width', slideWidth );

      return self;
    }
  };

  return module;
 });
