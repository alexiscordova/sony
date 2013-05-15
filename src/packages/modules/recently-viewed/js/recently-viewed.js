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

      self
        .setVars()
        .setupBreakpoints();

      // Extra initialization needed for the module if it has favorites
      if ( self.hasFavorites ) {
        self.initExtendedModule();
      }

      // Fade in the module to hide the slide rearranging
      setTimeout(function() {
        self.$wrapper.addClass( 'in' );
      }, 0);

    },

    setVars : function() {
      var self = this,
          paddleWrapper = self.$el.data( 'paddleWrapper' );

      // If the `.rv-module` element has a data-paddle-wrapper attribute, use that
      self.$paddleWrapper = paddleWrapper ? self.$el.find( paddleWrapper ) : undefined;
      self.$wrapper = self.$el.find( '.sony-carousel-wrapper' );
      self.$carousel = self.$el.find( '.sony-carousel' );
      self.$favorites = self.$el.find('.js-favorite');
      self.$productNames = self.$el.find( '.product-name-wrap' );

      self.hasFavorites = self.$favorites.length > 0;

      return self;
    },

    onResize : function() {
      var self = this;

      self.$productNames.evenHeights();
    },

    // If favorites exist, make them. This also assumes that the product names
    // need to have equal heights because there should be a price under the name
    // which should always line up with other prices
    initExtendedModule : function() {
      var self = this;

      self.$productNames.evenHeights();
      new Favorites( self.$carousel );
      Environment.on('global:resizeDebounced', $.proxy( self.onResize, self ));
    },

    initCarousel : function() {
      var self = this;

      // Initialize a new sony carousel
      self.$carousel.sonyCarousel({
        wrapper: '.sony-carousel-wrapper',
        slides: '.sony-carousel-slide',
        CSS3Easing: Settings.carouselEasing,
        pagination: true,
        paddles: true,
        useSmallPaddles: true,
        $paddleWrapper: self.$paddleWrapper
      });

      return self;
    },

    initScroller : function() {
      var self = this;

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
    },

    destroyCarousel : function() {
      this.$carousel.sonyCarousel( 'destroy' );
      return this;
    },

    setupBreakpoints : function() {
      var self = this,
          breakEarly = self.$el.data( 'breakEarly' ),
          setupTabletBreakpoint = breakEarly ?
            '(min-width: 48em) and (max-width: 87.4375em)' :
            '(min-width: 48em) and (max-width: 61.1875em)',
          teardownTabletBreakpoint = breakEarly ?
            '(min-width: 87.5em)' :
            '(min-width: 61.25em)',
          desktopBreakpoint = '(min-width: 48em)',
          mobileBreakpoint = '(max-width: 47.9375em)';

      self.isTabletAndDesktopOnLoad = Modernizr.mq( setupTabletBreakpoint ) && Modernizr.mq( desktopBreakpoint );

      if ( Modernizr.mediaqueries ) {

        enquire
          .register( desktopBreakpoint, function() {
            self.setupDesktop();
          })
          .register( setupTabletBreakpoint, function() {
            self.setupTablet();
          })
          .register( teardownTabletBreakpoint, function() {
            self.teardownTablet();
          })
          .register( mobileBreakpoint, function() {
            self.setupMobile();
          });

      } else {
        self.setupDesktop();
      }

      return self;
    },

    setupDesktop : function() {
      var self = this,
          wasMobile = self.isMobile;

      if ( wasMobile ) {
        // Destroy the scroller
        self.$wrapper.scrollerModule('destroy');

        // Remove widths set `setupMobile`
        self.$carousel.find('.sony-carousel-slide').css( 'width', '' );

        // Remove grid classes to wrappers
        self.$el.find('.m-container').removeClass('container');
        self.$wrapper.removeClass('grid');

        // Stop images from becoming tiny
        setTimeout( Utilities.forceWebkitRedraw, 0 );
      }

      // Avoid initializing carousel twice on load because the tablet breakpoint overlaps desktop
      if ( self.isTabletAndDesktopOnLoad === false ) {
        self.initCarousel();
      }

      self.isTabletAndDesktopOnLoad = false;
      self.isDesktop = true;
      self.isMobile = false;
    },

    setupTablet : function() {
      var self = this;

      // Teardown the current carousel, rearrange the slides, and build a new one
      self.destroyCarousel();
      self.arrangeItemsInSlides( 4 );
      self.initCarousel();
      self.isTablet = true;
    },

    teardownTablet : function() {
      var self = this;

      // Don't do anything if this isn't in tablet state
      if ( !self.isTablet ) {
        return;
      }

      // Teardown the current carousel, rearrange the slides, and build a new one
      self.destroyCarousel();
      self.arrangeItemsInSlides( 6 );
      self.initCarousel();

      self.isTablet = false;
    },

    setupMobile : function() {
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
      self.initScroller();

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
          allSpans = 'span2 span3 span4 span6',
          newSpan = 'span' + ( 12 / numPerSlide ),
          i = 0,
          j,
          itemIndex, slide, container, slimgrid;

      // Detach slide items from the DOM, remove their span classes and add the correct one
      $items
        .detach()
        .removeClass( allSpans )
        .addClass( newSpan );

      // Loop the number of slides that need to be created
      for ( ; i < numSlides; i++ ) {

        // Create the slide's wrapper
        slide = doc.createElement( 'div' );
        slide.className = 'sony-carousel-slide';
        container = doc.createElement( 'div' );
        container.className = 'container';
        slimgrid = doc.createElement( 'div' );
        slimgrid.className = 'slimgrid';

        // Append slide items to the slide
        for ( j = 0 ; j < numPerSlide; j++ ) {
          itemIndex = (i * numPerSlide) + j;
          if ( $items[ itemIndex ] ) {
            slimgrid.appendChild( $items[ itemIndex ] );
          }
        }

        // Put everything together
        container.appendChild( slimgrid );
        slide.appendChild( container );
        frag.appendChild( slide );
      }

      // Empty out the current content and replace it with the new
      self.$carousel
        .empty()
        .append( frag );
    }
  };

  return module;
});
