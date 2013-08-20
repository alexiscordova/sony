// SlideshowImageCaption Module
// --------------------------------------------
//
// * **Class:** RecentlyViewed
// * **Version:** 1.0
// * **Modified:** 08/16/2013
// * **Author:** Travis Nelson
// * **Dependencies:** jQuery 1.7+ , Modernizr
//
// *Notes:*
//
// *Example Usage:*
//
//      new SlideshowImageCaption( $('.slideshow-image-caption')[0] )
//
//


// Look through here for global variables first: `sony-global-settings.js`
// Some utilities functions that might save you time: `sony-global-utilities.js`


define(function(require) {

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      iQ = require('iQ'),
      enquire = require('enquire'),
      Environment = require('require/sony-global-environment'),
      sonyCarousel = require('secondary/index').sonyCarousel;

  var module = {
    init: function() {
      var $module = $('.slideshow-image-caption');

      if ( $module.length ) {
        new SlideshowImageCaption( $module[0] );
      }
    }
  };

  var SlideshowImageCaption = function( element, options ) {
    var self = this;

    $.extend( self, SlideshowImageCaption.options, options, SlideshowImageCaption.settings );

    self.$el = $( element );
    self.$slides = self.$el.find( '.sic-carousel-slide' );
    self.$slideContainer = self.$el.find( '.sony-carousel' );
    self.numSlides = self.$slides.length;
    self.init();

    log('SONY : SlideshowImageCaption : Initialized');
  };

  SlideshowImageCaption.prototype = {

    constructor: SlideshowImageCaption,

    init: function() {
      var self = this;

      // Probably set some variables here
      self.$wrapper = self.$el.find( '.sic-carousel-wrapper' );
      self.$carousel = self.$el.find( '.sony-carousel' );
      self
        .setupSlides()
        .onResize();


      self.setupCarousel();
      if ( Modernizr.mediaqueries ) {
        // These can be chained, like below
        // Use `em`s for your breakpoints ( px value / 16 )
        enquire
          .register('(min-width: 48em)', {
            match: function() {
              self.setupDesktop();
            }
          })
          .register('(max-width: 47.9375em)', {
            match: function() {
              self.setupMobile();
            }
          });

      } else {
        self.setupDesktop();
      }

      // Listen for global resize
      Environment.on('global:resizeDebounced', $.proxy( self.onResize, self ));
      self.fadeIn();

    },   

    fadeIn : function() {
      var self = this;
      setTimeout(function() {
        self.$el.addClass( 'in' );
      }, 0);
    }, 

    // Main setup method for the carousel
    setupCarousel: function() {
      var self = this;

      // Using Sony Carousel for this module
      self.$carousel.sonyCarousel({
        wrapper: '.sic-carousel-wrapper',
        slides: '.sic-carousel-slide',
        looped: true,
        jumping: true,
        axis: 'x',
        dragThreshold: 2,
        paddles: true,
        pagination: true
      });
      log('SONY : SlideshowImageCaption : setupCarousel');

      return self;
    },

    //Sets up slides to correct width based on how many there are.
    setupSlides: function() {
      var self = this,
          slidesWithClones = self.numSlides + 2,
          containerWidth = ( 100 * slidesWithClones ) + 0.5 + '%',
          slideWidth = ( 100 / slidesWithClones ) + '%';

      self.$slideContainer.css( 'width', containerWidth );
      self.$slides.css( 'width', slideWidth );

      return self;
    },

    // Stubbed method. You don't have to use this
    setupDesktop : function() {
      var self = this,
          wasMobile = self.isMobile;

      if ( wasMobile ) {
        log('SONY : SlideshowImageCaption : setupDesktop');
      }

      self.isDesktop = true;
      self.isMobile = false;
    },

    // Stubbed method. You don't have to use this
    setupMobile : function() {
      var self = this,
          wasDesktop = self.isDesktop;

      if ( wasDesktop ) {
        log('SONY : SlideshowImageCaption : setupMobile');
      }

      self.isDesktop = false;
      self.isMobile = true;
    },

    updateSlideBand: function (index) {
      var self = this,
          $band = self.$slides.find( '.band' ).eq( index ),
          $thumb = $band.find( '.thumb-holder' ),
          thumbWidth = self.isMobile || $thumb.length === 0 ? 0 : $thumb.outerWidth();
      $band.find( '.text-container' ).css( 'margin-left', thumbWidth + 'px' );
      self.$el.find( '.sony-carousel-edge-clone' ).remove(); //Carousel BUG: clone slides are copied when resetSlides is called
      self.$carousel
        .sonyCarousel( 'resetSlides' )
        .sonyCarousel( 'gotoNearestSlide' );
    },

    onResize : function() {
      var self = this;
      log('SONY : SlideshowImageCaption : onResize');
      self.$el.find( '.sony-carousel-edge-clone' ).remove(); //Carousel BUG: clone slides are copied when resetSlides is called
      self.$slides.find( '.thumb-holder' ).each( function( index, element ) {
          var $thumb = $( this ),
            updateSlideBandProxy = $.proxy(self.updateSlideBand, self, index );
          if ( self.isMobile || $thumb.data( 'hasLoaded' ) ) {
            self.updateSlideBand(index);
          } else {
            $thumb.on( 'imageLoaded', function() {
              self.updateSlideBand(index);
            });
          }
      });
      return self;
    }

  };

  // Options that could be customized per module instance
  SlideshowImageCaption.options = {};

  // These are not overridable when instantiating the module
  SlideshowImageCaption.settings = {
    isDesktop: false,
    isMobile: false
  };

  return module;
});
