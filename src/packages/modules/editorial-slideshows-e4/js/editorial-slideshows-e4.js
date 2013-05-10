// Editorial SlideShow - E4
// ------------
//
// * **Module:** Editorial Slideshow - E4
// * **Version:** 1.0
// * **Modified:** 05/09/2013
// * **Author:** Tyler Madison, George Pantazis, Glen Cheney
// * **Dependencies:** jQuery 1.9.1+, Modernizr
//
// *Example Usage:*
//
//      new EditorialSlideshow( $('.editorial-slideshow')[0] );

define(function(require) {

    'use strict';

    var $ = require('jquery'),
        Modernizr = require('modernizr'),
        iQ = require('iQ'),
        bootstrap = require('bootstrap'),
        Settings = require('require/sony-global-settings'),
        Environment = require('require/sony-global-environment'),
        enquire = require('enquire'),
        sonyCarousel = require('secondary/index').sonyCarousel;

    var module = {
      init: function() {
        $('.editorial-slidshow-container').each(function() {
          new EditorialSlideshow( this );
        });
      }
    };

    var EditorialSlideshow = function(element, options) {
      var self = this;

      // Extend
      $.extend( self, {}, EditorialSlideshow.defaults, options, EditorialSlideshow.settings );

      // Set base element
      self.$el = $( element );

      // Modernizr vars
      self.hasTouch             = Settings.hasTouchEvents;
      self.transitionDuration   = Modernizr.prefixed('transitionDuration');

      self.isDesktopMode        = true; //true by default
      self.isTabletMode         = false;
      self.isMobileMode         = false;

      // Cache some jQuery objects we'll reference later
      self.$ev                  = $({});
      self.$document            = Settings.$document;
      self.$window              = Settings.$window;
      self.$html                = Settings.$html;
      self.$slides              = self.$el.find( '.editorial-carousel-slide' );
      self.$slideContainer      = self.$el.find( '.editorial-carousel' );
      self.$thumbNav            = self.$el.find( '' );
      self.$pagination          = null;

      self.hasThumbs            = self.$thumbNav.length > 0;
      self.numSlides            = self.$slides.length;
      self.currentId            = 0;

      // Inits the module
      self.init();

      self.$el.data( 'editorialSlideshow', self );
    };

    EditorialSlideshow.prototype = {
      constructor: EditorialSlideshow,

      // Initalize the module
      init : function() {
        var self = this;

        self.setupEvents();
        self.setupSlides();

        self.setupCarousel();

        self.$slideContainer.css( 'opacity' , 1 );

      },

      // Handles global debounced resize event
      onDebouncedResize: function() {
        var self = this,
            isLargeDesktop = Modernizr.mq( '(min-width: 74.9375em)' ),
            overflow = isLargeDesktop ? 'hidden' : 'visible';

        self.$el.css( 'overflow' , overflow );
      },

      // Main setup method for the carousel
      setupCarousel: function() {
        var self = this;

        // Using Sony Carousel for this module
        self.$slideContainer.sonyCarousel({
          wrapper: '.editorial-carousel-wrapper',
          slides: '.editorial-carousel-slide',
          CSS3Easing: Settings.carouselEasing,
          looped: true,
          jumping: true,
          axis: 'x',
          unit: '%',
          dragThreshold: 2,
          paddles: true,
          pagination: true/*,
          $paddleWrapper: self.$el.find('.editorial-carousel-wrapper')*/
        });

        self.$pagination = self.$el.find('.pagination-bullets');

        self.$slideContainer.on( 'SonyCarousel:gotoSlide' , $.proxy( self.onSlideUpdate , self ) );

        iQ.update();

      },

      // Listens for slide changes and updates the correct thumbnail
      onSlideUpdate: function(e , currIndx) {
        var self = this;

        self.currentId = currIndx;
        self.setCurrentActiveThumb();

        iQ.update();
      },


      // Registers with Enquire JS for breakpoint firing
      setupBreakpoints: function() {
        var self = this;

        if ( !Settings.isLTIE10 ) {

          // >= 768
          enquire
            .register('(min-width: 48em)', function() {
              self.isMobileMode = self.isTabletMode = false;
              self.isDesktopMode = true;
              self.showThumbNav();
              self.toggleDotNav(true); //hide
            })

            // >= 568 , < 768
            .register('(min-width: 35.5em) and (max-width: 47.9375em)', function() {
              self.isMobileMode = self.isDesktopMode = false;
              self.isTabletMode = true;
              self.hideThumbNav();
              self.toggleDotNav(true); //hide
            })

            // < 568
            .register('(max-width: 35.4375em)', function() {
              self.isDesktopMode = self.isTabletMode = false;
              self.isMobileMode = true;
              self.hideThumbNav();
              self.toggleDotNav(false); //show
            });

        }

        if ( Settings.isLTIE10 ) {
          self.isMobileMode = self.isTabletMode = false;
          self.isDesktopMode = true;
          self.showThumbNav();
          self.toggleDotNav(true); //hide

        }

      },

      // Toggles dot nav based on breakpoints
      toggleDotNav: function(hide) {
        var self = this;

        if ( hide ) {
          self.$pagination.css('opacity' , 0);
        } else {
          self.$pagination.css('opacity' , 1);
        }

      },

      // Toggles thumb nav based on breakpoints
      hideThumbNav: function() {
        var self = this;
        if (self.$thumbNav.length > 0) {
          self.$thumbNav.hide();
        }
      },

      // Toggles thumb nav based on breakpoints
      showThumbNav: function() {
        var self = this;
        if ( self.$thumbNav.length ) {
          self.$thumbNav.show();
        }
      },

      // Sets up slides to correct width based on how many there are
      setupSlides: function() {
        var self = this;

        self.$slideContainer.width( 100 * (self.numSlides + 2)+ '%' );
        self.$slides.width( 100 / (self.numSlides + 2) + '%' );

        //console.log( 'Setup slides: ' , 1 );

      },

      // Setup touch event types
      setupEvents: function() {
        var self = this;

        if ( self.hasTouch ) {
          self.upEvent = 'touchend.pdpss';
        } else {
          self.clickEvent = 'click.pdpss';
        }

        self.tapOrClick = function() {
          return self.hasTouch ? self.upEvent : self.clickEvent;
        };

      },

      // Bind events to the thumbnail navigation
      createThumbNav: function() {
        var self = this,
        $anchors = self.$thumbNav.find('a');

        $anchors.on( self.tapOrClick() , function(e) {
          e.preventDefault();
          self.onThumbSelected($(this));
        });

        $anchors.eq(0).addClass('active');
      },


      // Handles when a thumbnail is chosen
      onThumbSelected: function($el) {
        var self = this,
        $anchors = self.$thumbNav.find('a'),
        selectedIndx =  $el.parent().index(),
        animDirection = '';

        self.currentId = selectedIndx;

        $anchors.removeClass('active');
        $el.addClass('active');

        self.$slideContainer.sonyCarousel( 'gotoSlide' , self.currentId );

      },

      // Sets the current active thumbnail
      setCurrentActiveThumb: function() {
        var self = this,
        $anchors = self.$thumbNav.find('a');
        $anchors.removeClass('active');
        $anchors.eq( self.currentId ).addClass('active');
      }

      //end prototype object
    };

    // Defaults
    // --------
    EditorialSlideshow.defaults = {};

    // Non override-able settings
    // --------------------------
    EditorialSlideshow.settings = {};

    return module;
 });