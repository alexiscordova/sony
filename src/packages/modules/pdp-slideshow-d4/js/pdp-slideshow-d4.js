// PDP SlideShow - D4
// ------------
//
// * **Module:** PDP Slideshow - D4
// * **Version:** 1.0a
// * **Modified:** 05/28/2013
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
    enquire = require('enquire'),
    bootstrap = require('bootstrap'),
    Settings = require('require/sony-global-settings'),
    Environment = require('require/sony-global-environment'),
    hammer = require('plugins/index').hammer,
    sonyCarousel = require('secondary/index').sonyCarousel,
    sonyScroller = require('secondary/index').sonyScroller,
    sonyVideo = require('secondary/index').sonyVideo;

  var self = {
    init: function() {
      $('.pdp-slideshow').each(function() {
        new PDPSlideShow(this);
      });
    }
  };

  var PDPSlideShow = function(element) {

    var self = this;

    // Set base element
    self.$el = $(element);

    // CLASS SELECTOR CONSTANTS
    self.SLIDE_CLASS = '.pdp-slideshow-slide';
    self.SLIDE_CONTAINER = '.pdp-slideshow-inner';

    self.isDesktopMode = true; //true by default
    self.isTabletMode = false;
    self.isMobileMode = false;

    // Cache some jQuery objects we'll reference later
    self.hasTouch = Settings.hasTouchEvents;
    self.$document = Settings.$document;
    self.$window = Settings.$window;
    self.$html = Settings.$html;
    self.$slides = self.$el.find(self.SLIDE_CLASS);
    self.$slideContainer = self.$el.find(self.SLIDE_CONTAINER);
    self.$thumbNav = self.$el.find('.thumb-nav-carousel');
    self.$thumbNavContainer = self.$el.find('.thumb-nav-container');
    self.$pagination = null;
    self.$videoPlayers = self.$el.find('.sony-video');

    self.desktopAnimSpeed = 500;
    self.tabletAnimSpeed = 300;
    self.mobileAnimSpeed = 250;

    self.hasThumbs = self.$thumbNav.length > 0;
    self.numSlides = self.$slides.length;
    self.currentId = 0;

    // Inits the module
    self.init();

    log('SONY : PDPSlideShow : Initialized');
  };

  PDPSlideShow.prototype = {
    constructor: PDPSlideShow,

    // Initalize the module
    init: function() {
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
      self.setCarouselHeight();

      // Listen for debounced resize event
      Environment.on('global:resizeDebounced', function(){
        self.setCarouselHeight();
        self.apportionThumbsToSlides();
        self.rebuildThumbCarousel();
      });

      // If the PDP is in a submodule, listen for the Primary Tout to broadcast an event
      // specifying the module's activation.

      self.$el.closest('.submodule').on('PrimaryTout:submoduleActivated', function() {
        self.apportionThumbsToSlides();
        self.rebuildThumbCarousel();
      });

    },

    fadeIn: function() {

      var self = this,
        $firstImage = self.$slides.find('img').first();

      if ($firstImage.data('hasLoaded') || self.$slides.eq(0).data('mode')  === 'video') {
        self.$el.addClass('active');
      } else {
        $firstImage.on('imageLoaded', function() {
          self.$el.addClass('active');
        });
      }
    },

    // Handles global debounced resize event
    setCarouselHeight: function() {
      var self = this,
        isDesktop = !Modernizr.mediaqueries || Modernizr.mq('(min-width: 61.25em)'),
        windowWidth,
        slideshowHeight = '';

      if (isDesktop) {
        windowWidth = self.$window.width(),
        // Make the header grow 1px taller for every 20px over 980w..
        slideshowHeight = 560 + ((windowWidth - 980) / 5);
        slideshowHeight = Math.round(Math.min(720, slideshowHeight));
      }

      // On mobile, the dynamic height is reset back to nothing
      self.$el.css('height', slideshowHeight);
    },

    // Main setup method for the carousel
    setupCarousel: function() {
      var self = this;

      // Using Sony Carousel for this module
      self.$slideContainer.sonyCarousel({
        wrapper: '.pdp-slideshow-outer',
        slides: '.pdp-slideshow-slide',
        looped: !Settings.isPS3,
        jumping: !Settings.isPS3,
        axis: 'x',
        dragThreshold: 2,
        paddles: true,
        paddlePosition: 'outset',
        pagination: true,
        $paddleWrapper: self.$el,
        // $dotNavWrapper: '.thumb-nav-grid',
        nonDraggableChildren: '.sony-video'
      });

      self.$pagination = self.$el.find('.sony-dot-nav');

      self.$slideContainer.on('SonyCarousel:gotoSlide', $.proxy(self.onSlideUpdate, self));

      iQ.update();

      return self;
    },




    // Listens for slide changes and updates the correct thumbnail
    onSlideUpdate: function(e, currentIndex) {

      var self = this;

      self.currentId = currentIndex;
      self.setCurrentActiveThumb();

      //shut off any video players when changing slides
      if (self.$videoPlayers.length) {
        self.$videoPlayers.data('sonyVideo').api().pause();
      }

      iQ.update();
      self.setCarouselHeight();
    },

    // Registers with Enquire JS for breakpoint firing
    setupBreakpoints: function() {
      var self = this;

      if (!Settings.isLTIE10) {
        enquire
        // >= 768
        .register('(min-width: 48em)', function() {
          self.isMobileMode = self.isTabletMode = false;
          self.isDesktopMode = true;
          self.showThumbNav().hideDotNav();
          self.$slideContainer.sonyCarousel('setAnimationSpeed', self.desktopAnimSpeed);
        })

        // >= 568, < 767
        .register('(min-width: 35.5em) and (max-width: 47.9375em)', function() {
          self.isMobileMode = self.isDesktopMode = false;
          self.isTabletMode = true;
          self.hideThumbNav().showDotNav();
          self.$slideContainer.sonyCarousel('setAnimationSpeed', self.tabletAnimSpeed);
        })

        // < 567
        .register('(max-width: 35.4375em)', function() {
          self.isDesktopMode = self.isTabletMode = false;
          self.isMobileMode = true;
          self.hideThumbNav().showDotNav();
          self.$slideContainer.sonyCarousel('setAnimationSpeed', self.mobileAnimSpeed);
        });

        // Doesn't support media queries
      } else {
        self.showThumbNav().hideDotNav();
        self.$slideContainer.sonyCarousel('setAnimationSpeed', self.desktopAnimSpeed);
      }

      return self;
    },

    // Toggles dot nav based on breakpoints
    toggleDotNav: function(hide) {
      this.$pagination[(hide ? 'add' : 'remove') + 'Class']('hidden');

      return this;
    },

    hideDotNav: function() {
      return this.toggleDotNav(true);
    },
    showDotNav: function() {
      return this.toggleDotNav(false);
    },

    toggleThumbNav: function(hide) {
      if (this.$thumbNavContainer.length) {
        this.$thumbNavContainer[(hide ? 'add' : 'remove') + 'Class']('hidden');
      }

      return this;
    },

    // Toggles thumb nav based on breakpoints
    hideThumbNav: function() {
      return this.toggleThumbNav(true);
    },

    // Toggles thumb nav based on breakpoints
    showThumbNav: function() {
      return this.toggleThumbNav(false);
    },

    // Sets up slides to correct width based on how many there are
    setupSlides: function() {
      var self = this,
        slidesWithClones = self.numSlides + 2,
        containerWidth = (100 * slidesWithClones) + '%',
        slideWidth = (100 / slidesWithClones) + '%';

      self.$slideContainer.css('width', containerWidth);

/*      console.log( 'containerWidth' , self.$slideContainer.width() );

      slideWidth = (self.$slideContainer.width() / slidesWithClones) + 'px';

      console.log( 'setting slide widths to actual px' , slideWidth );*/

      self.$slides.css('width', slideWidth);




      return self;
    },

    // Bind events to the thumbnail navigation
    createThumbNav: function() {
      var self = this,
        $anchors = self.$thumbNav.find('a').hammer();

      $anchors.on('click', function(e) {
        e.preventDefault();
      });

      $anchors.on('tap', function(e) {
        self.onThumbSelected(e);
      });

      $anchors.eq(0).addClass('active');

      self.apportionThumbsToSlides();
      self.rebuildThumbCarousel();
    },

    apportionThumbsToSlides: function() {

      var self = this,
          $anchors = self.$thumbNav.find('li'),
          $slides = self.$thumbNav.find('ul'),
          thumbWidth = $anchors.first().width(),
          slideWidth = $slides.first().width(),
          thumbsPerSlide = Math.max( Math.floor( slideWidth / ( thumbWidth - 1 ) ) - 1, 1 ),
          anchorCount = $anchors.length,
          slideCount;

      var $slideClone = $slides.first().clone().empty(),
          newSlides = [];

      // If the final slide has less than four anchors, decrement `thumbsPerSlide` by
      // one until the last slide has at least four anchors.

      if(anchorCount > 4){
        //THIS TOTALLY DOESN'T WORK IF THERE'S LESS THAN 4 TOTAL
        while ( anchorCount % thumbsPerSlide < 4 && thumbsPerSlide > 1 ) {
          thumbsPerSlide = Math.max( thumbsPerSlide - 1, 1 );
        }
      }

      slideCount = Math.ceil( anchorCount / thumbsPerSlide );

      for ( var i = 0; i < slideCount; i++ ) {

        newSlides[i] = $slideClone.clone().get(0);

        var gridWidthRatio = self.$window.width() / self.$thumbNav.width();

        $(newSlides[i]).css('left', 100 * (gridWidthRatio + 1) / 2 * i + '%');

        for ( var j = 0; j < thumbsPerSlide; j++ ) {
          $anchors.eq(thumbsPerSlide * i + j).appendTo(newSlides[i]);
        }

        var $slideAnchors = $(newSlides[i]).find('a');

        $slideAnchors.removeClass('first last');
        $slideAnchors.first().addClass('first');
        $slideAnchors.last().addClass('last');
      }

      self.$thumbNav.empty().append(newSlides);
    },

    rebuildThumbCarousel: function() {

      var self = this;

      if ( self.$thumbNavCarousel ) {
        self.$thumbNavCarousel.sonyCarousel('destroy');
      }

      self.$thumbNavCarousel = self.$thumbNav.sonyCarousel({
        wrapper: '.thumb-nav-grid',
        slides: 'ul',
        pagination: true,
        $dotNavWrapper: self.$thumbNavContainer,
        paddles: true,
        $paddleWrapper: self.$thumbNavContainer,
        useSmallPaddles: true
      });
    },

    // Handles when a thumbnail is chosen
    onThumbSelected: function(evt) {
      var self = this,
        $el = $(evt.delegateTarget),
        $anchors = self.$thumbNav.find('a'),
        selectedIndex = $anchors.index($el);

      self.currentId = selectedIndex;

      $anchors.removeClass('active');
      $el.addClass('active');

      self.$slideContainer.sonyCarousel('gotoSlide', self.currentId);
    },

    // Sets the current active thumbnail
    setCurrentActiveThumb: function() {
      var self = this,
        $anchors = self.$thumbNav.find('a');

      $anchors.removeClass('active');
      $anchors.eq(self.currentId).addClass('active');
    }

    //end prototype
  };



  return self;
});