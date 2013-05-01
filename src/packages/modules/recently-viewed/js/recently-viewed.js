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
      Modernizr = require('modernizr'),
      Utilities = require('require/sony-global-utilities'),
      Environment = require('require/sony-global-environment'),
      Settings = require('require/sony-global-settings'),
      iQ = require('iQ'),
      enquire = require('enquire'),
      Favorites = require('secondary/index').sonyFavorites,
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
    self.init();

    log('SONY : RecentlyViewed : Initialized');
  };

  RecentlyViewed.prototype = {

    constructor: RecentlyViewed,

    init: function() {
      var self = this;

      self.$wrapper = self.$el.find( '.sony-carousel-wrapper' );
      self.$carousel = self.$el.find( '.sony-carousel' );
      self.$favorites = self.$el.find('.js-favorite');
      self.$productNames = self.$el.find( '.product-name-wrap' );

      if ( Modernizr.mediaqueries ) {

        enquire
          .register('(min-width: 48em)', {
            match: function() {
              self._setupDesktop();
            }
          })
          .register('(min-width: 48em) and (max-width: 61.1875em)', {
            match: function() {
              self._setupTablet();
            }
          })
          .register('(min-width: 61.25em)', {
            match: function() {
              self._teardownTablet();
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

      if ( self.$favorites.length ) {
        self.$productNames.evenHeights();
        new Favorites( self.$carousel );
        Environment.on('global:resizeDebounced', $.proxy( self.onResize, self ));
      }

    },

    onResize : function() {
      var self = this;

      self.$productNames.evenHeights();
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

        // Stop images from becoming tiny
        setTimeout( Utilities.forceWebkitRedraw, 0 );
      }

      // Initialize a new sony carousel
      self.$carousel.sonyCarousel({
        wrapper: '.sony-carousel-wrapper',
        slides: '.sony-carousel-slide',
        pagination: true,
        paddles: true,
        useSmallPaddles: true
      });

      self.isDesktop = true;
      self.isMobile = false;
    },

    _setupTablet : function() {
      var self = this;
      self.arrangeItemsInSlides( 4 );
      self.isTablet = true;
    },

    _teardownTablet : function() {
      var self = this;

      // Don't do anything if this isn't in tablet state
      if ( !self.isTablet ) {
        return;
      }

      self.arrangeItemsInSlides( 6 );
      self.isTablet = false;
    },

    _setupMobile : function() {
      var self = this,
          wasDesktop = self.isDesktop;

      // Destroy the carousel if there was one
      if ( wasDesktop ) {
        self.$carousel.sonyCarousel( 'destroy' );

        // Stop images from becoming tiny
        setTimeout( Utilities.forceWebkitRedraw, 0 );
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
          onAnimationEnd: iQ.update
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
            contentWidth += slideWidth;
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
    },

    arrangeItemsInSlides : function( numPerSlide ) {
      var self = this,
          doc = document,
          frag = doc.createDocumentFragment(),
          $items = self.$carousel.find('.gallery-item'),
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
