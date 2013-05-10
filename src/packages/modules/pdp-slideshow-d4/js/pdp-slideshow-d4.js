// PDP SlideShow - D4
// ------------
//
// * **Module:** PDP Slideshow - D4
// * **Version:** 1.0a
// * **Modified:** 04/3/2013
// * **Author:** Tyler Madison, George Pantazis
// * **Dependencies:** jQuery 1.9.1+, Modernizr
//
// *Example Usage:*
//
//      new PDPSlideShow( $(.pdp-slideshow')[0] )

define(function(require) {

    'use strict';

    var $ = require('jquery'),
        Modernizr = require('modernizr'),
        iQ = require('iQ'),
        bootstrap = require('bootstrap'),
        Settings = require('require/sony-global-settings'),
        Environment = require('require/sony-global-environment'),
        enquire = require('enquire'),
        sonyCarousel = require('secondary/index').sonyCarousel,
        sonyVideo = require('secondary/index').sonyVideo;

    var self = {
      init: function() {
        $('.pdp-slideshow').each(function() {
          new PDPSlideShow( this );
        });
      }
    };

    var PDPSlideShow = function(element) {
      var self = this;

      // Set base element
      self.$el = $( element );

      // Modernizr vars
      self.hasTouch             = Settings.hasTouchEvents;

      // CLASS SELECTOR CONSTANTS
      self.SLIDE_CLASS          = '.pdp-slideshow-slide';
      self.SLIDE_CONTAINER      = '.pdp-slideshow-inner';

      self.isDesktopMode        = true; //true by default
      self.isTabletMode         = false;
      self.isMobileMode         = false;

      // Cache some jQuery objects we'll reference later
      self.$ev                  = $({});
      self.$document            = Settings.$document;
      self.$window              = Settings.$window;
      self.$html                = Settings.$html;
      self.$slides              = self.$el.find( self.SLIDE_CLASS );
      self.$slideContainer      = self.$el.find( self.SLIDE_CONTAINER );
      self.$thumbNav            = self.$el.find('.thumb-nav');
      self.$pagination          = null;

      self.desktopAnimSpeed     = 500;
      self.tabletAnimSpeed      = 300;
      self.mobileAnimSpeed      = 250;

      self.hasThumbs            = self.$thumbNav.length > 0;
      self.numSlides            = self.$slides.length;
      self.currentId            = 0;

      // Inits the module
      self.init();

    };

    PDPSlideShow.prototype = {
      constructor: PDPSlideShow,

      // Initalize the module
      init : function() {
        var self = this;

        self.setupEvents();
        self.setupSlides();
        self.setupCarousel();
        self.setupBreakpoints();

        if (self.hasThumbs) {
          self.createThumbNav();
        }

        self.$slideContainer.css( 'opacity' , 1 );


        // Listen for debounced resize event
        Environment.on('global:resizeDebounced' , $.proxy( self.onDebouncedResize , self ) );

        //ghost ride the whip
        self.onDebouncedResize();

      },

      // Handles global debounced resize event
      onDebouncedResize: function() {
        var self = this,
            isLargeDesktop = Modernizr.mq( '(min-width: 74.9375em)' ),
            isDesktop = isLargeDesktop || Modernizr.mq( '(min-width: 61.25em)' ),
            overflow = isLargeDesktop ? 'hidden' : 'visible',
            windowWidth;

        self.$el.css( 'overflow' , overflow );

        if ( isDesktop ) {
          windowWidth = self.$window.width();
          //this makes the header grow 1px taller for every 20px over 980w..
          self.$el.css('height', Math.round(Math.min(720, 560 + ((windowWidth - 980) / 5))));
          //$('.primary-tout.default .image-module, .primary-tout.homepage .image-module').css('height', Math.round(Math.min(640, 520 + ((w - 980) / 5))));
        } else {
          //this removes the dynamic css so it will reset back to responsive styles
          self.$el.css('height', '');
        }


        // self.$el.find('.pdp-slideshow-slide > .ghost-center-wrap').css('height' , self.$el.height() + 'px');

      },

      // Main setup method for the carousel
      setupCarousel: function() {
        var self = this;

        // Using Sony Carousel for this module
        self.$slideContainer.sonyCarousel({
          wrapper: '.pdp-slideshow-outer',
          slides: '.pdp-slideshow-slide',
          looped: true,
          jumping: true,
          axis: 'x',
          dragThreshold: 2,
          paddles: true,
          pagination: true,
          $paddleWrapper: self.$el,
          CSS3Easing: Settings.carouselEasing
        });

        self.$pagination = self.$el.find('.pagination-bullets');

        self.$slideContainer.on('SonyCarousel:gotoSlide' , $.proxy( self.onSlideUpdate , self ) );

        iQ.update();

      },

      // Listens for slide changes and updates the correct thumbnail
      onSlideUpdate: function(e , currIndex) {
        var self = this;

        self.currentId = currIndex;
        self.setCurrentActiveThumb();

        setTimeout( iQ.update , 250 );
      },


      // Registers with Enquire JS for breakpoint firing
      setupBreakpoints: function() {
        var self = this;

        if ( !Settings.isLTIE10 ) {
        enquire

          // >= 768
          .register('(min-width: 48em)', function() {
            self.isMobileMode = self.isTabletMode = false;
            self.isDesktopMode = true;
            self.showThumbNav();
            self.toggleDotNav(true); //hide
            self.$slideContainer.sonyCarousel( 'setAnimationSpeed' , self.desktopAnimSpeed );
          })

          // >= 568, < 767
          .register('(min-width: 35.5em) and (max-width: 47.9375em)', function() {
            self.isMobileMode = self.isDesktopMode = false;
            self.isTabletMode = true;
            self.hideThumbNav();
            self.toggleDotNav(false); //show
            self.$slideContainer.sonyCarousel( 'setAnimationSpeed' , self.tabletAnimSpeed );
          })

          // < 567
          .register('(max-width: 35.4375em)', function() {
            self.isDesktopMode = self.isTabletMode = false;
            self.isMobileMode = true;
            self.hideThumbNav();
            self.toggleDotNav(false); //show
            self.$slideContainer.sonyCarousel( 'setAnimationSpeed' , self.mobileAnimSpeed );
          });

      }

        if ( Settings.isLTIE10 ) {
          self.isMobileMode = self.isTabletMode = false;
          self.isDesktopMode = true;
          self.showThumbNav();
          self.toggleDotNav(true); //hide
          self.$slideContainer.sonyCarousel( 'setAnimationSpeed' , self.desktopAnimSpeed );

        }

      },

      // Toggles dot nav based on breakpoints
      toggleDotNav: function(hide) {
        var self = this;

        if (hide) {
          self.$pagination.css('opacity' , 0);
        } else {
          self.$pagination.css('opacity' , 1);
        }

      },

      // Toggles thumb nav based on breakpoints
      hideThumbNav: function() {
        var self = this;
        if (self.$thumbNav.length) {
          self.$thumbNav.hide();
        }
      },

      // Toggles thumb nav based on breakpoints
      showThumbNav: function() {
        var self = this;
        if (self.$thumbNav.length) {
          self.$thumbNav.show();
        }
      },

      // Sets up slides to correct width based on how many there are
      setupSlides: function() {
        var self = this,
            slidesWithClones = self.numSlides + 2,
            containerWidth = (100 * slidesWithClones) + '%',
            slideWidth = (100 / slidesWithClones) + '%';

        self.$slideContainer.css( 'width', containerWidth );
        self.$slides.css( 'width', slideWidth );

        sonyVideo.initVideos( self.$el.find('.player') );
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

    return self;
 });