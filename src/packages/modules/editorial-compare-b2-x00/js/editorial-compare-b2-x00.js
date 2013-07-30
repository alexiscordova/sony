// EditorialCompare Module
// --------------------------------------------
//
// * **Class:** EditorialCompare
// * **Version:** 1.0
// * **Modified:** 07/25/2013
// * **Author:** Adam Van Ornum
// * **Dependencies:** jQuery 1.7+ , Modernizr
//
// *Notes:*
//
// *Example Usage:*
//
//      new EditorialCompare( $('.editorial-compare')[0] )
//
//


// Look through here for global variables first: `sony-global-settings.js`
// Some utilities functions that might save you time: `sony-global-utilities.js`


define(function(require) {

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      enquire = require('enquire'),
      Environment = require('require/sony-global-environment'),
      sonyCarousel = require('secondary/index').sonyCarousel;

  var module = {
    init: function() {
      var $module = $('.editorial-compare');

      if ( $module.length ) {
        new EditorialCompare( $module[0] );
      }
    }
  };

  var EditorialCompare = function( element, options ) {
    var self = this;

    $.extend( self, EditorialCompare.options, options, EditorialCompare.settings );

    self.$el = $( element );
    self.init();

    log('SONY : EditorialCompare : Initialized');
  };

  EditorialCompare.prototype = {

    constructor: EditorialCompare,

    init: function() {
      var self = this;

      self.initialized = false;
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

      self.initialized = true;

    },

    initCarousel : function() {
      var self = this;

      // Initialize a new sony carousel.
      self.$carousel.sonyCarousel({
        wrapper: '.sony-carousel-wrapper',
        slides: '.sony-carousel-slide',
        pagination: true,
        paddles: true,
        paddlePosition: 'outset'
      });
    },

    updateCarousel : function() {
      var self = this;

      log('TODO: update carousel');
    },

    // Make sure that initCarousel is only called when the class hasn't finished initializing.
    fixCarousel : function() {
      if( !this.initialized ) {
        this.initCarousel();
      }
      else {
        this.updateCarousel();
      }
    },

    // Stubbed method. You don't have to use this
    setupDesktop : function() {
      var self = this,
          wasMobile = self.isMobile;

      log('SONY : EditorialCompare : Setup Desktop');

      if ( wasMobile ) {

      }

      self.fixCarousel();

      self.isDesktop = true;
      self.isMobile = false;
    },

    // Stubbed method. You don't have to use this
    setupMobile : function() {
      var self = this,
          wasDesktop = self.isDesktop;

      log('SONY : EditorialCompare : Setup Mobile');

      if ( wasDesktop ) {

      }

      self.fixCarousel();

      self.isDesktop = false;
      self.isMobile = true;
    },

    // Stubbed method. You don't have to use this
    onResize : function() {
      var self = this;
    }
  };

  // Options that could be customized per module instance
  EditorialCompare.options = {};

  // These are not overridable when instantiating the module
  EditorialCompare.settings = {
    isDesktop: false,
    isMobile: false
  };

  return module;
});
