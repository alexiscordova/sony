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

      self.fadeIn();

      self.initialized = true;

    },

    fadeIn : function() {
      var self = this;

      setTimeout( function() {
        self.$el.find('.carousel-container').addClass( 'in' );
      }, 0 );
    },

    initCarousel : function() {
      var self = this;

      log('SONY : EditorialCompare : Init Carousel');

      // Initialize a new sony carousel.
      self.$carousel.sonyCarousel({
        wrapper: '.sony-carousel-wrapper',
        slides: '.sony-carousel-slide',
        pagination: true,
        paddles: false
      });

    },

    destroyCarousel : function() {
      var self = this;

      log('SONY : EditorialCompare : Destroy Carousel');

      // Destroy the sony carousel.
      self.$carousel.sonyCarousel( 'destroy' );

    },

    setupDesktop : function() {
      var self = this,
          wasMobile = self.isMobile;

      log('SONY : EditorialCompare : Setup Desktop');

      self.arrangeItemsInSlides( 3 );

      if ( wasMobile ) {
        self.destroyCarousel();
      }

      self.isDesktop = true;
      self.isMobile = false;
    },

    setupMobile : function() {
      var self = this,
          wasDesktop = self.isDesktop;

      log('SONY : EditorialCompare : Setup Mobile');

      self.arrangeItemsInSlides( 1 );

      if ( wasDesktop ) {

      }

      self.initCarousel();

      self.isDesktop = false;
      self.isMobile = true;
    },

    arrangeItemsInSlides : function( numPerSlide ) {
      var self = this,
          doc = document,
          frag = document.createDocumentFragment(),
          $items = self.$carousel.find('.sony-carousel-slide-children'),
          numItems = $items.length,
          numSlides = Math.ceil( numItems / numPerSlide ),
          i = 0,
          j,
          itemIndex, slide, container, slimgrid;

      $items
        .detach()
        .removeClass( 'span2 span3 span4 span6 span12' )
        .addClass( 'span' + 12 / numPerSlide );

      for( ; i < numSlides; i++ ) {
        slide = doc.createElement( 'div' );
        slide.className = 'sony-carousel-slide slide-' + i;
        container = doc.createElement( 'div' );
        slimgrid = doc.createElement( 'div' );
        slimgrid.className = 'slimgrid';

        for( j = 0 ; j < numPerSlide; j++ ) {
          itemIndex = ( i * numPerSlide ) + j;
          if( $items[ itemIndex ] ) {
            slimgrid.appendChild( $items[ itemIndex ] );
          }
        }

        container.appendChild( slimgrid );
        slide.appendChild( container );
        frag.appendChild( slide );
      }

      self.$carousel
        .empty()
        .append( frag );

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
