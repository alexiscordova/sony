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
//      new SlideshowImageCaption( $('.demo-module')[0] )
//
//


// Look through here for global variables first: `sony-global-settings.js`
// Some utilities functions that might save you time: `sony-global-utilities.js`


define(function(require) {

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      enquire = require('enquire'),
      Environment = require('require/sony-global-environment');

  var module = {
    init: function() {
      var $module = $('.demo-module');

      if ( $module.length ) {
        new SlideshowImageCaption( $module[0] );
      }
    }
  };

  var SlideshowImageCaption = function( element, options ) {
    var self = this;

    $.extend( self, SlideshowImageCaption.options, options, SlideshowImageCaption.settings );

    self.$el = $( element );
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
        useSmallPaddles: self.isSmall,
        pagination: true
      });
      log('SONY : SlideshowImageCaption : setupCarousel');

      return self;
    },

    // Stubbed method. You don't have to use this
    setupDesktop : function() {
      var self = this,
          wasMobile = self.isMobile;

      if ( wasMobile ) {

      }
      self.setupCarousel();

      self.isDesktop = true;
      self.isMobile = false;
    },

    // Stubbed method. You don't have to use this
    setupMobile : function() {
      var self = this,
          wasDesktop = self.isDesktop;

      if ( wasDesktop ) {

      }

      self.isDesktop = false;
      self.isMobile = true;
    },

    // Stubbed method. You don't have to use this
    onResize : function() {
      var self = this;
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
