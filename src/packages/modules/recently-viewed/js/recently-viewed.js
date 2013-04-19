// Recently Viewed (RecentlyViewed) Module
// --------------------------------------------
//
// * **Class:** RecentlyViewed
// * **Version:** 1.0
// * **Modified:** 04/18/2013
// * **Author:** Glen Cheney
// * **Dependencies:** jQuery 1.7+ , Modernizr, sony-carousel
//
// *Notes:*
//
// *Example Usage:*
//
//      $('.recently-views-products').recentlyViewed();
//
//

define(function(require) {

  'use strict';

  var $ = require('jquery'),
      // Modernizr = require('modernizr'),
      iQ = require('iQ'),
      enquire = require('enquire'),
      sonyCarousel = require('secondary/index').sonyCarousel,
      sonyScroller = require('secondary/index').sonyScroller;
      // Settings = require('require/sony-global-settings'),
      // Environment = require('require/sony-global-environment'),
      // Utilities = require('require/sony-global-utilities');

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

      // Environment.on('global:resizeDebounced', $.proxy( self._onResize, self ));

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

      // self._onResize();
    },

    _setupDesktop : function() {
      var self = this,
          wasMobile = self.isMobile;

      if ( wasMobile ) {
        self.$wrapper.scrollerModule('destroy');

        // Remove grid classes to wrappers
        self.$el.find('.m-container').removeClass('container');
        self.$wrapper.removeClass('grid');
        self.$carousel.find('.sony-carousel-slide').css( 'width', '' );
      }

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

      if ( wasDesktop ) {
        self.$carousel.sonyCarousel( 'destroy' );
      }

      // Add grid classes to wrappers
      self.$el.find('.m-container').addClass('container');
      self.$wrapper.addClass('grid');

      self.$wrapper.scrollerModule({
        itemElementSelector: '.gallery-item',
        iscrollProps: {
          hScrollbar: false,
          isOverflowHidden: false,
          onAnimationEnd: function() {
            iQ.update();
          }
        },
        getContentWidth: function() {
          var contentWidth = 0,
              slideWidths = [],
              $slides = self.$el.find('.sony-carousel-slide');

          $slides.css( 'width', '' );

          // Count it
          $slides.each(function() {
            var slideWidth = 0,
                $slide = $( this );

            $slide.find('.gallery-item').each(function() {
              slideWidth += $(this).outerWidth( true );
            });

            slideWidth = Math.ceil( slideWidth );
            slideWidths.push( slideWidth );

            contentWidth += slideWidth + parseInt( $slide.css( 'marginRight' ), 10 );
          });

          self.$el.find('.sony-carousel-slide').each(function( i ) {
            $(this).css( 'width', slideWidths[ i ] );
          });


          return contentWidth;
        }
      });

      self.isDesktop = false;
      self.isMobile = true;
    }
  };

  return module;

});
