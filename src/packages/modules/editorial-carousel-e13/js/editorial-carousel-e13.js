// E13 Editorial Carousel (EditorialCarouselE13) Module
// --------------------------------------------
//
// * **Class:** EditorialCarousel
// * **Version:** 1.0
// * **Modified:** 04/22/2013
// * **Author:** Glen Cheney
// * **Dependencies:** jQuery 1.7+ , Modernizr, sony-carousel
//
// *Notes:*
//
// *Example Usage:*
//
//      new EditorialCarousel( $('.ec-module')[0] )
//
//

define(function(require) {
  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      enquire = require('enquire'),
      sonyCarousel = require('secondary/index').sonyCarousel;

  var module = {
    init: function() {
      var $module = $('.ec-module');

      if ( $module.length ) {
        new EditorialCarousel( $module[0] );
      }
    }
  };

  var EditorialCarousel = function( element ) {

    var self = this;

    self.isDesktop = false;
    self.isMobile = false;

    self.$el = $( element );
    self.init();

    log('SONY : EditorialCarousel : Initialized');
  };

  EditorialCarousel.prototype = {

    constructor: EditorialCarousel,

    init: function() {
      var self = this;

      self.$wrapper = self.$el.find( '.sony-carousel-wrapper' );
      self.$carousel = self.$el.find( '.sony-carousel' );

      // Initialize a new sony carousel
      self.$carousel.sonyCarousel({
        wrapper: '.sony-carousel-wrapper',
        slides: '.sony-carousel-slide',
        pagination: true,
        paddles: true
      });

      if ( Modernizr.mediaqueries ) {

        enquire
          .register('(min-width: 48em)', {
            match: function() {
              self.setupDesktop();
            }
          })
          .register('(min-width: 48em) and (max-width: 61.1875em)', {
            match: function() {
              self.setupTablet();
            }
          })
          .register('(min-width: 61.25em)', {
            match: function() {
              self.teardownTablet();
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

    },

    setupDesktop : function() {
      var self = this,
          wasMobile = self.isMobile,
          stillTablet = Modernizr.mq( '(min-width: 48em) and (max-width: 61.1875em)' );

      // Remove grid classes to wrappers
      if ( wasMobile ) {
        self.$el.find('.m-container').removeClass('container');
        self.$el.find('.sony-carousel-slide').removeClass( 'slimgrid' );
        self.$wrapper.removeClass('grid');

        // Going straight from mobile to desktop without passing tablet in between
        if ( !stillTablet ) {
          self.arrangeItemsInSlides( 4 );
        }
      }

      self.isDesktop = true;
      self.isMobile = false;
    },

    setupTablet : function() {
      var self = this;
      self.arrangeItemsInSlides( 3 );
      self.isTablet = true;
    },

    teardownTablet : function() {
      var self = this;

      // Don't do anything if this isn't in tablet state
      if ( !self.isTablet ) {
        return;
      }

      self.arrangeItemsInSlides( 4 );
      self.isTablet = false;
    },

    setupMobile : function() {
      var self = this;

      // Add grid classes to wrappers
      self.$el.find('.m-container').addClass('container');
      self.$wrapper.addClass('grid');

      self.arrangeItemsInSlides( 2 );

      self.$el.find('.sony-carousel-slide').addClass( 'slimgrid' );

      self.isDesktop = false;
      self.isMobile = true;
    },

    arrangeItemsInSlides : function( numPerSlide ) {
      var self = this,
          doc = document,
          frag = doc.createDocumentFragment(),
          $items = self.$carousel.find('.sony-carousel-slide-children'),
          numItems = $items.length,
          numSlides = Math.ceil( numItems / numPerSlide ),
          i = 0,
          j,
          itemIndex, slide, container, slimgrid;

      $items
        .detach()
        .removeClass( 'span2 span3 span4 span6' )
        .addClass( 'span' + 12 / numPerSlide );

      for ( ; i < numSlides; i++ ) {
        slide = doc.createElement( 'div' );
        slide.className = 'sony-carousel-slide';
        container = doc.createElement( 'div' );
        container.className = 'container';
        slimgrid = doc.createElement( 'div' );
        slimgrid.className = 'slimgrid';

        for ( j = 0 ; j < numPerSlide; j++ ) {
          itemIndex = (i * numPerSlide) + j;
          if ( $items[ itemIndex ] ) {
            slimgrid.appendChild( $items[ itemIndex ] );
          }
        }

        container.appendChild( slimgrid );
        slide.appendChild( container );
        frag.appendChild( slide );
      }

      self.$carousel
        .empty()
        .append( frag )
        .sonyCarousel('resetSlides')
        .sonyCarousel('gotoNearestSlide');
    }
  };

  return module;
});
