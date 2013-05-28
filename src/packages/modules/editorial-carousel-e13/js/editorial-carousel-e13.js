// E13 Editorial Carousel (EditorialCarouselE13) Module
// --------------------------------------------
//
// * **Class:** EditorialCarousel
// * **Version:** 1.0
// * **Modified:** 04/22/2013
// * **Author:** Glen Cheney
// * **Dependencies:** jQuery 1.7+ , Modernizr, enquire, sony-carousel
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
      Environment = require('require/sony-global-environment'),
      Settings = require('require/sony-global-settings'),
      sonyCarousel = require('secondary/index').sonyCarousel;

  var module = {
    init: function() {
      var $module = $('.ec-module');

      if ( $module.length ) {
        $module.each(function() {
          new EditorialCarousel( this );
        });
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

      self.initialized = false;
      self.$wrapper = self.$el.find( '.sony-carousel-wrapper' );
      self.$carousel = self.$el.find( '.sony-carousel' );
      self.$titles = self.$el.find( '.tile-title' );
      self.paginationTheme = self.$el.data('mode') === 'dark' ? 'light' : 'dark';

      self
        .setupBreakpoints()
        .onResize();

      // Listen for global resize
      Environment.on('global:resizeDebounced', $.proxy( self.onResize, self ));

      self.fadeIn();

      self.initialized = true;
    },

    fadeIn : function() {
      var self = this;

      // Fade in the carousel container (not the text)
      setTimeout(function() {
        self.$el.find('.m-container').addClass( 'in' );
      }, 0);
    },

    initCarousel : function() {
      var self = this;

      // Initialize a new sony carousel
      self.$carousel.sonyCarousel({
        wrapper: '.sony-carousel-wrapper',
        slides: '.sony-carousel-slide',
        CSS3Easing: Settings.easing.easeOut,
        pagination: true,
        paddles: true,
        paddlePosition: 'outset',
        paginationTheme: self.paginationTheme
      });
    },

    updateCarousel : function() {
      this.$carousel
        .sonyCarousel('resetSlides')
        .sonyCarousel('gotoNearestSlide');
      return this;
    },

    // Make sure that initCarousel is only called when the class hasn't finished initializing
    fixCarousel : function() {
      if ( !this.initialized ) {
        this.initCarousel();
      } else {
        this.updateCarousel();
      }

      return this;
    },

    onResize : function() {
      var self = this;

      // Make all product name heights even
      function evenTheHeights() {
        self.$titles.evenHeights();
      }

      requestAnimationFrame( evenTheHeights );

      return self;
    },

    setupBreakpoints : function() {
      var self = this,
          desktopBreakpoint = '(min-width: 48em)',
          setupTabletBreakpoint = '(min-width: 48em) and (max-width: 61.1875em)',
          teardownTabletBreakpoint = '(min-width: 61.25em)',
          setupMobileBreakpoint = '(max-width: 47.9375em)';

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
          .register( setupMobileBreakpoint, function() {
            self.setupMobile();
          });

      } else {
        self.setupDesktop();
      }

      return self;
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

      // Avoid initializing carousel twice on load because the tablet breakpoint overlaps desktop
      if ( self.isTabletAndDesktopOnLoad !== true ) {
        self.fixCarousel();
      }

      self.isTabletAndDesktopOnLoad = false;
      self.isDesktop = true;
      self.isMobile = false;
    },

    setupTablet : function() {
      var self = this;

      self.arrangeItemsInSlides( 3 );

      self.fixCarousel();

      self.isTablet = true;
    },

    teardownTablet : function() {
      var self = this;

      // Don't do anything if this isn't in tablet state
      if ( !self.isTablet ) {
        return;
      }

      self.arrangeItemsInSlides( 4 );

      self.fixCarousel();

      self.isTablet = false;
    },

    setupMobile : function() {
      var self = this;

      self.arrangeItemsInSlides( 2 );

      // Add grid classes to wrappers
      self.$el.find('.m-container').addClass('container');
      self.$wrapper.addClass('grid');

      // Mobile slides need the slimgrid where others don't
      self.$el.find('.sony-carousel-slide').addClass( 'slimgrid' );

      self.fixCarousel();

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
        .append( frag );
    }
  };

  return module;
});
