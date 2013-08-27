// Hear It / Feel It Module
// --------------------------------------------
//
// * **Class:** HearItFeelIt
// * **Version:** 1.0
// * **Modified:** 08/19/2013
// * **Author:** Ryan Mauer, Travis Nelson
// * **Dependencies:** jQuery 1.7+ , Modernizr
//
// *Notes:*
//
// *Example Usage:*
//
//      new HearItFeelIt( $('.hear-it-feel-it')[0] )
//
//

define(function(require) {

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      enquire = require('enquire'),
      Environment = require('require/sony-global-environment'),
      sonyCarousel = require('secondary/index').sonyCarousel;

  var module = {
    init: function() {
      var $module = $( '.hear-it-feel-it' );

      if ( $module.length ) {
        $module.each( function() {
          new HearItFeelIt( this );
        });
      }
    }
  };

  var HearItFeelIt = function( element, options ) {
    var self = this;

    $.extend( self, HearItFeelIt.options, options, HearItFeelIt.settings );

    self.$el = $( element );
    self.$carousel = null;
    self.init();

    log('SONY : HearItFeelIt : Initialized');
  };

  HearItFeelIt.prototype = {

    constructor: HearItFeelIt,

    init: function() {
      var self = this;

      self.setVars(); 

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

      var $backgroundImage = self.$el.find('.background .iq-img');
      if ( $backgroundImage.data('hasLoaded') ) {
        self.fadeIn();
      }
      else {
        $backgroundImage.on( 'iQ:imageLoaded', $.proxy( self.fadeIn, self ) );
      }

      // Listen for global resize
      Environment.on('global:resizeDebounced', $.proxy( self.onResize, self ));

    },

    fadeIn : function() {
      var self = this;

      setTimeout( function() {
        self.$el.find( '.container' ).addClass( 'in' );
      }, 0);
    },

    setVars : function() {

    },

    setupDesktop : function() {
      var self = this,
          wasMobile = self.isMobile;

      if ( self.$carousel !== null ) {
        self.disposeCarousel();
      }

      self.isDesktop = true;
      self.isMobile = false;
    },

    setupMobile : function() {
      var self = this,
          wasDesktop = self.isDesktop;

      if ( self.$carousel === null ) {
        self.setupCarousel();
      }

      self.isDesktop = false;
      self.isMobile = true;
    },

    onResize : function() {
      var self = this;
      return self;
    },


    // Main setup method for the carousel
    setupCarousel: function() {
      var self = this;

      log('SONY : HearItFeelIt : setupCarousel');
      // Using Sony Carousel for this module
      self.$carousel = self.$el.find( '.hear-it-carousel' ).sonyCarousel({
        wrapper: '.hear-it-carousel-wrapper',
        slides: '.hear-it-carousel-slide',
        looped: true,
        jumping: true,
        axis: 'x',
        dragThreshold: 2,
        paddles: false,
        pagination: true
      }); 
      if ( self.$el.find( '.hear-it-carousel-wrapper' ).parent().hasClass ( 'light-text-dark-box' ) ) {
        self.$el.find( '.sony-dot-nav' ).addClass( 'pagination-light' );
      }
      return self;
    },

    disposeCarousel: function() {
      var self = this;
      self.$el.find('.sony-carousel-edge-clone').remove();
      self.$carousel.sonyCarousel('destroy');
      self.$carousel = null;
      return self;
    }
  };

  // Options that could be customized per module instance
  HearItFeelIt.options = {};

  // These are not overridable when instantiating the module
  HearItFeelIt.settings = {
    isDesktop: false,
    isMobile: false
  };

  return module;
});
