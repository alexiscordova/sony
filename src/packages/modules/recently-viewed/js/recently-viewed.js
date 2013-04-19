// Recently Viewed (RecentlyViewed) Module
// --------------------------------------------
//
// * **Class:** RecentlyViewed
// * **Version:** 1.0
// * **Modified:** 04/18/2013
// * **Author:** Glen Cheney
// * **Dependencies:** jQuery 1.7+ , Modernizr, sony-carousel, sony-scroller
//
// *Notes:*
//
// *Example Usage:*
//
//      new RecentlyViewed( $('.rv-module')[0] )
//
//

define(function(require) {

  'use strict';

  var $ = require('jquery'),
      iQ = require('iQ'),
      enquire = require('enquire'),
      sonyCarousel = require('secondary/index').sonyCarousel,
      sonyScroller = require('secondary/index').sonyScroller;

  var module = {
    init: function() {
      var $rvModule = $('.rv-module');

      if ( $rvModule.length ) {
        new RecentlyViewed( $rvModule[0] );
      }
    }
  };

  var RecentlyViewed = function( element ) {

    var self = this;

    self.isDesktop = false;
    self.isMobile = false;

    self.$el = $( element );
    self.useCSS3 = Modernizr.csstransforms && Modernizr.csstransitions;
    self.init();

    log('SONY : RecentlyViewed : Initialized');
  };

  RecentlyViewed.prototype = {

    constructor: RecentlyViewed,

    init: function() {
      var self = this;

      self.$wrapper = self.$el.find( '.sony-carousel-wrapper' );
      self.$carousel = self.$el.find( '.sony-carousel' );

      if ( Modernizr.mediaqueries ) {

        enquire.register('(min-width: 48em)', {
          match: function() {
            self._setupDesktop();
          }
        })
        .register('(max-width: 47.9375em)', {
          match: function() {
            self._setupMobile();
          }
        });

      } else {
        self._setupDesktop();
      }

    },

    _setupDesktop : function() {
      var self = this,
          wasMobile = self.isMobile;

      if ( wasMobile ) {
        // Destroy the scroller
        self.$wrapper.scrollerModule('destroy');

        // Remove widths set `_setupMobile`
        self.$carousel.find('.sony-carousel-slide').css( 'width', '' );

        // Remove grid classes to wrappers
        self.$el.find('.m-container').removeClass('container');
        self.$wrapper.removeClass('grid');
      }

      // Initialize a new sony carousel
      self.$carousel.sonyCarousel({
        wrapper: '.sony-carousel-wrapper',
        slides: '.sony-carousel-slide',
        useCSS3: self.useCSS3,
        pagination: true,
        paddles: true,
        useSmallPaddles: true
      });

      // Enable snapping in carousel
      self.$carousel.sonyCarousel( 'setSnapping', true );

      self.isDesktop = true;
      self.isMobile = false;
    },
    _setupMobile : function() {
      var self = this,
          wasDesktop = self.isDesktop;

      // Destroy the carousel if there was one
      if ( wasDesktop ) {
        self.$carousel.sonyCarousel( 'destroy' );
      }

      // Add grid classes to wrappers
      self.$el.find('.m-container').addClass('container');
      self.$wrapper.addClass('grid');

      // Initialize the new scroller
      self.$wrapper.scrollerModule({
        itemElementSelector: '.gallery-item',
        iscrollProps: {
          hScrollbar: false,
          isOverflowHidden: false,
          onAnimationEnd: iQ.update()
        },
        getContentWidth: function() {
          var contentWidth = 0,
              slideWidths = [],
              $slides = self.$el.find('.sony-carousel-slide');

          $slides.css( 'width', '' );

          // Loop through all slides to count the gallery item widths
          $slides.each(function() {
            var slideWidth = 0,
                $slide = $( this );

            $slide.find('.gallery-item').each(function() {
              slideWidth += $(this).outerWidth( true );
            });

            slideWidth = Math.ceil( slideWidth );

            // Save the widths to apply them later
            slideWidths.push( slideWidth );

            // Make sure we count the margin on the .slide
            contentWidth += slideWidth + parseInt( $slide.css( 'marginRight' ), 10 );
          });

          // Set slide widths
          $slides.each(function( i ) {
            $(this).css( 'width', slideWidths[ i ] );
          });

          // Tell scroller what the width should be
          return contentWidth;
        }
      });

      self.isDesktop = false;
      self.isMobile = true;
    }
  };

  return module;
});
