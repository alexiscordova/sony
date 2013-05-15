// PDP SlideShow - D4
// ------------
//
// * **Module:** PDP Slideshow - D4
// * **Version:** 1.0a
// * **Modified:** 04/3/2013
// * **Author:** Tyler Madison, George Pantazis, Glen Cheney
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

      // CLASS SELECTOR CONSTANTS
      self.SLIDE_CLASS          = '.pdp-slideshow-slide';
      self.SLIDE_CONTAINER      = '.pdp-slideshow-inner';

      self.isDesktopMode        = true; //true by default
      self.isTabletMode         = false;
      self.isMobileMode         = false;

      // Cache some jQuery objects we'll reference later
      self.$ev                  = $({});
      self.hasTouch             = Settings.hasTouchEvents;
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

        self
          .setupSlides()
          .setupCarousel()
          .setupBreakpoints();

        if (self.hasThumbs) {
          self.createThumbNav();
        }

        // Fade in when the first image has loaded
        self.fadeIn();

        // Listen for debounced resize event
        Environment.on('global:resizeDebounced' , $.proxy( self.onDebouncedResize , self ) );

        //ghost ride the whip
        self.onDebouncedResize();

      },

      fadeIn: function() {
        var self = this,
            $firstImage = self.$slides.find('img').first();

        function fadeIn() {
          self.$el.css( 'opacity' , 1 );
        }

        if ( $firstImage.data('hasLoaded') ) {
          fadeIn();
        } else {
          $firstImage.on( 'imageLoaded', fadeIn );
        }
      },

      // Handles global debounced resize event
      onDebouncedResize: function() {
        var self = this,
            // isLargeDesktop = Modernizr.mq( '(min-width: 74.9375em)' ),
            isDesktop = !Modernizr.mediaqueries || Modernizr.mq( '(min-width: 61.25em)' ),
            // overflow = isLargeDesktop ? 'hidden' : 'visible',
            windowWidth,
            slideshowHeight;

        // self.$el.css( 'overflow' , overflow );

        if ( isDesktop ) {
          windowWidth = self.$window.width();
          slideshowHeight = Math.round( Math.min(720, 560 + ((windowWidth - 980) / 5)) );
          // Make the header grow 1px taller for every 20px over 980w..
          self.$el.css( 'height', slideshowHeight );
          //$('.primary-tout.default .image-module, .primary-tout.homepage .image-module').css('height', Math.round(Math.min(640, 520 + ((w - 980) / 5))));
        } else {
          // Remove the dynamic css so it will reset back to responsive styles
          self.$el.css('height', '');
        }

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

        self.$pagination = self.$el.find('.sony-dot-nav');

        self.$slideContainer.on('SonyCarousel:gotoSlide' , $.proxy( self.onSlideUpdate , self ) );

        iQ.update();

        return self;
      },

      // Listens for slide changes and updates the correct thumbnail
      onSlideUpdate: function(e , currentIndex) {
        var self = this;

        self.currentId = currentIndex;
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
              self.showThumbNav().hideDotNav();
              self.$slideContainer.sonyCarousel( 'setAnimationSpeed' , self.desktopAnimSpeed );
            })

            // >= 568, < 767
            .register('(min-width: 35.5em) and (max-width: 47.9375em)', function() {
              self.isMobileMode = self.isDesktopMode = false;
              self.isTabletMode = true;
              self.hideThumbNav().showDotNav();
              self.$slideContainer.sonyCarousel( 'setAnimationSpeed' , self.tabletAnimSpeed );
            })

            // < 567
            .register('(max-width: 35.4375em)', function() {
              self.isDesktopMode = self.isTabletMode = false;
              self.isMobileMode = true;
              self.hideThumbNav().showDotNav();
              self.$slideContainer.sonyCarousel( 'setAnimationSpeed' , self.mobileAnimSpeed );
            });

        // Doesn't support media queries
        } else {
          self.showThumbNav().hideDotNav();
          self.$slideContainer.sonyCarousel( 'setAnimationSpeed' , self.desktopAnimSpeed );
        }

        return self;
      },

      // Toggles dot nav based on breakpoints
      toggleDotNav: function(hide) {
        this.$pagination[ (hide ? 'add' : 'remove') + 'Class' ]( 'hidden' );

        return this;
      },

      hideDotNav: function() {
        return this.toggleDotNav( true );
      },
      showDotNav: function() {
        return this.toggleDotNav( false );
      },

      toggleThumbNav: function( hide ) {
        if ( this.$thumbNav.length ) {
          this.$thumbNav[ (hide ? 'add' : 'remove') + 'Class' ]( 'hidden' );
        }

        return this;
      },

      // Toggles thumb nav based on breakpoints
      hideThumbNav: function() {
        return this.toggleThumbNav( true );
      },

      // Toggles thumb nav based on breakpoints
      showThumbNav: function() {
        return this.toggleThumbNav( false );
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

        return self;
      },

      // Bind events to the thumbnail navigation
      createThumbNav: function() {
        var self = this,
        $anchors = self.$thumbNav.find('a');

        // Bind to the click event even on touch in order
        // to prevent the default
        if ( self.hasTouch ) {
          $anchors
            .on( 'click', false )
            .on( Settings.END_EV, $.proxy( self.onThumbSelected, self ) );
        } else {
          $anchors.on( 'click', function(e) {
            e.preventDefault();
            self.onThumbSelected( e );
          });
        }

        $anchors.eq(0).addClass('active');
      },


      // Handles when a thumbnail is chosen
      onThumbSelected: function( evt ) {
        var self = this,
            $el = $( evt.delegateTarget ),
            $anchors = self.$thumbNav.find('a'),
            selectedIndex =  $el.parent().index();

        self.currentId = selectedIndex;

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