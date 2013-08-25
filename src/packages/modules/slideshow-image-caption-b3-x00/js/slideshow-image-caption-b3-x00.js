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
      SonyCarousel = require('secondary/index').sonyCarousel;

  var module = {
    init: function() {
      var $module = $( '.slideshow-image-caption' );

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
        .setupCarousel()
        .setupSlideBands()
        .onResize();
      iQ.update();


      if ( Modernizr.mediaqueries ) {
        // Use `em`s for your breakpoints ( px value / 16 )
        enquire
          .register('(min-width: 48em)', {
            match: function() {              
              self.isMobile = false;
            }
          })
          .register('(max-width: 47.9375em)', {
            match: function() {
              self.isMobile = true;
            }
          });

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

    setupSlideBands: function() {
      var self = this;      
      self.$el.find( '.band' ).has( '.thumb-holder' ).addClass( 'with-thumb') ;
      return self;
    },

    updateSlideBand: function (index) {
      var self = this,
          textPadding = 20,
          $band = self.$el.find( '.band' ).has( '.thumb-holder' ).eq( index ),
          $thumb = $band.find( '.thumb-holder' ),
          $textContainer = $band.find( '.text-container' ),
          thumbWidth;          
      $thumb.css( 'height', $band.outerHeight() - textPadding * 2 + 'px' );
     
      thumbWidth = self.isMobile || $thumb.length === 0 ? 0 : $thumb.outerWidth();
      $textContainer.css( 'margin-left', thumbWidth + 'px' );

    },

    onResize : function() {
      var self = this;
      log('SONY : SlideshowImageCaption : onResize');
      self.$el.find( '.thumb-holder' ).each( function( index, element ) {
          var $thumb = $( this );
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

  // These are not overridable when instantiating the module
  SlideshowImageCaption.settings = {
    isMobile: false
  };

  return module;
});
