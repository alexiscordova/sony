// Light Compare Module.
// ---------------------------------------
//
// * **Version:** 0.1
// * **Modified:** 05/07/2013
// * **Author:** Mark Ernst
// * **Dependencies:** jQuery 1.7+, Bootstrap

define(function(require){

  'use strict';

  var $ = require('jquery'),
      Router = require('require/sony-global-router'),
      Modernizr = require('modernizr'),
      iQ = require('iQ'),
      bootstrap = require('bootstrap'),
      Settings = require('require/sony-global-settings'),
      Environment = require('require/sony-global-environment'),
      sonyEvenHeights = require('secondary/index').sonyEvenHeights,
      sonyCarouselFade = require('secondary/index').sonyCarouselFade,
      sonyScroller = require('secondary/index').sonyScroller;

  var module = {
    'init': function() {
      var self = this,
          element = $('.modal-light-compare');

      if ( element ) {
        new LightCompare(element);
      }
    }
  };

  var LightCompare = function(element) {
    var self = this;

    // Set base element
    self.$el = $( element );

    // Modernizr vars
    self.hasTouch             = Modernizr.touch;
    self.transitionDuration   = Modernizr.prefixed('transitionDuration');
    self.cssTransitions       = Modernizr.transitions;
    self.useCSS3              = Modernizr.csstransforms && Modernizr.csstransitions;

    // Basic selectors
    self.$doc                   = Settings.$document;
    self.$win                   = Settings.$window;
    self.$html                  = Settings.$html;

    // Cache some jQuery objects we'll reference later
    self.$ev                  = $({});
    self.$window              = Settings.$window;
    self.$slides              = self.$el.find('.compare-carousel-slide');
    self.$slideWrapper        = self.$el.find('.compare-carousel-wrapper');
    self.$slideContainer      = self.$el.find('.compare-carousel');
    self.$thumbNav            = self.$el.find('.thumb-nav');
    self.$slider              = self.$el.find('.slider');
    self.$leftShade           = self.$el.find('.left-shade');
    self.$rightShade          = self.$el.find('.right-shade');
    self.$thumbItems          = self.$thumbNav.find('li');
    self.$thumbLabels         = self.$thumbNav.find('span');
    self.$slideInner          = self.$slides.find('.compare');

    self.hasThumbs            = self.$thumbNav.length > 0;
    self.numSlides            = self.$slides.length;
    self.moduleId             = self.$el.attr('id');
    self.currentId            = 0;

    // touch defaults
    self.startInteractionPointX = null;
    self.lastTouch            = null;
    self.handleStartPosition  = null;

    // deep linking vars
    self.location             = window.location;
    self.history              = window.history;
    self.initFromhash         = false;

    self.isDesktop = false;
    self.isMobile = false;

    // Inits the module
    self.init();
    log('SONY : LightCompare : Initialized');
  };

  LightCompare.prototype = {
    constructor: LightCompare,

    init: function( param ) {
      var self = this;

      self.setupEvents();

      self.setupSlides();

      self.setupCarousel();

      if(self.hasThumbs){
          self.createThumbNav();
      }

      self.$slideContainer.fadeTo(0,1);

      // add enquire due to functionality difference with mobile => desktop
      if ( Modernizr.mediaqueries ) {
        enquire
        .register('(min-width: 48em)', {
          match: function() {
            self.setupMobilePlus();
          }
        })
        .register('(max-width: 47.9375em)', {
          match: function() {
            self.setupMobile();
          }
        });
      } // end if(Modernizr.mediaqueries )

     // initialize the router for deep linking
      Router.on('chapter-'+self.moduleId+'(/:a)', $.proxy(self.directFromHash, self));

      self.$thumbNav.on(self.downEvent, function(e) { self.dragStart(e); });

      self.$win = $(window);
      self.modalID = 'light-compare-modal';
      self.hasTouch = Settings.hasTouchEvents;
      self.useIScroll = self.hasTouch;
      if (self.useIScroll) {
        self.initiScroll();
      }

      var supportsOrientationChange = "onorientationchange" in window,
      orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

      window.addEventListener(orientationEvent, function() {
        self.measureModal();
      }, false);


      self.bind();
    },

    bind: function() {
      var self = this;

      $('.launch-modal').on('click', $.proxy(self.launchModal, self));
      self.$win.resize($.proxy(self.measureModal, this));

      if (self.useIScroll) {
        $('#' + self.modalID).on('shown', $.proxy(self.updateiScroll, self));
      }
    },

    // Sets up slides to correct width based on how many there are
    setupSlides: function(){
      var self = this;

      self.$slideContainer.width( 100 * (self.numSlides + 2)+ '%' );
      self.$slides.width( 100 / (self.numSlides + 2) + '%' );
    },

    // Setup touch event types
    setupEvents: function(){
      var self = this;


      if (Modernizr.touch) {
        self.hasTouch         = true;
        self.downEvent        = 'touchstart.rp';
        self.moveEvent        = 'touchmove.rp';
        self.upEvent          = 'touchend.pdpss';
        self.cancelEvent      = 'touchcancel.rp';
        self.lastItemFriction = 0.5;
      } else {
        self.hasTouch = false;
        self.lastItemFriction = 0.2;
        self.downEvent   = 'mousedown.rp';
        self.moveEvent   = 'mousemove.rp';
        self.upEvent     = 'mouseup.rp';
        self.cancelEvent = 'mouseup.rp';
        self.clickEvent = 'click.pdpss';
      }

      self.tapOrClick = function(){
        return self.hasTouch ? self.upEvent : self.clickEvent;
      };
    },

    setupMobilePlus: function() {
      var self = this;

      self.isMobile = false;
      self.isDesktop = true;

      self.$window.off('resize.d9-mobile-resize');
      self.removeWrapperStyles();

    },

    setupMobile: function() {
      var self = this;

      self.isMobile = true;
      self.isDesktop = false;

      self.$window.on('resize.d9-mobile-resize', $.proxy(self.getSlideHeight, self ));

      // for some reason it $.evenHeights calculates the wrong height
      // this is even if DomReady is true. Even if debugger; is run now
      // the height of the tallest element will be incorrect. A setTimeout
      // seems to fix this issue.
      setTimeout(function(){
        self.getSlideHeight();
        self.getSliderWidth();
        if (self.$el.hasClass('text-mode')) { self.initScroller(); }
      }, 250);
    },

    dragStart: function(e) {
        var self = this,
            point;

        if (self.hasTouch) {
          var touches = e.originalEvent.touches;
          if (touches && touches.length > 0) {
            point = touches[0];
            if (touches.length > 1) {
              self.multipleTouches = true;
            }
          } else {
            return;
          }
        } else {
          point = e;
          e.preventDefault();

          if (e.which !== 1) {
            return;
          }
        }

        // reset the distance moved since its a new start
        self.distanceMoved = null;
        self.handleStartPosition = self.getPagePosition(e);
        self.startInteractionPointX = point.pageX;

        self.$doc.on(self.moveEvent , $.proxy(self.dragMove , self)).on(self.upEvent , $.proxy(self.dragEnd, self));

    },

    dragMove: function(e) {
      var self = this,
          distX = self.getPagePosition(e).x - self.handleStartPosition.x,
          distY = self.getPagePosition(e).y - self.handleStartPosition.y,
          point,
          distanceMoved;

      // some really gross logic
      if (self.hasTouch) {
        if (self.lockAxis) {
          return;
        }
        var touches = e.originalEvent.touches;
        if (touches) {
          if (touches.length > 1) {
            return;
          } else {
            point = touches[0];
          }
        } else {
          return;
        }
      } else {
        point = e;
      }

      self.distanceMoved = Math.abs(point.pageX - self.startInteractionPointX);
    },

    dragEnd: function(e) {
      var self = this;

      //stop listening on the document for movement
      self.$doc.off(self.moveEvent).off(self.upEvent);
    },

    getPagePosition: function(e) {

      var self = this;

      if ( !e.pageX && !e.originalEvent ) {
        return;
      }

      self.lastTouch = self.lastTouch || {};

      // Cache position for touchmove/touchstart, as touchend doesn't provide it.
      if ( e.type === 'touchmove' || e.type === 'touchstart' ) {
        self.lastTouch = e.originalEvent.touches[0];
      }

      return {
        'x': (e.pageX || self.lastTouch.pageX),
        'y': (e.pageY || self.lastTouch.pageY)
      };
    },

    removeWrapperStyles: function() {
      var self = this;

      self.$slider.removeAttr('style');
      self.$slideWrapper.removeAttr('style');

    },

    // Main setup method for the carousel
    setupCarousel: function(){
      var self = this;

      // Using Sony Carousel for this module
      self.$slideContainer.sonyCarouselFade({
        wrapper: '.compare-carousel-wrapper',
        slides: '.compare-carousel-slide',
        looped: false,
        jumping: false,
        axis: 'x',
        useCSS3: self.useCSS3,
        paddles: false,
        pagination: false,
        draggable: false
      });

      self.$slideContainer.on('SonyCarouselFade:gotoSlide' , $.proxy( self.onSlideUpdate , self ) );

      iQ.update();
    },

    getSliderWidth: function() {
      var self = this,
          $currTabs,
          sliderWidth,
          minSliderWidth;

      $currTabs = self.$slider.find('li');
      sliderWidth = 5; // adding 5 just to be prepared for bleed
      minSliderWidth = 100; // no slider should ever be smaller than this

      $currTabs.each(function(){
        var $el = $(this);
        sliderWidth = (sliderWidth + $el.outerWidth());
      });

      // only if we have a slider width do we want to apply it
      if (sliderWidth >= minSliderWidth) { self.$slider.width(sliderWidth); }
    },

    // if its on a mobile device per slide change we need to
    // get the height of the container to the height of the
    // active slide.
    getSlideHeight: function() {
      var self = this,
          $currSlides,
          groups;

      $currSlides = self.$slides.find('.inner');
      groups = [$currSlides];

      $.evenHeights(groups);
    },

    // Listens for slide changes and updates the correct thumbnail
    onSlideUpdate: function(e , currIndx){
      var self = this;

      self.currentId = currIndx;
      self.setCurrentActiveThumb();

      iQ.update();
    },

    // Bind events to the thumbnail navigation
    createThumbNav: function(){
      var self = this,
      $anchors = self.$thumbNav.find('li');

      $anchors.on( self.tapOrClick() , function(e){
        if (self.distanceMoved >= 25) { return; }
        e.preventDefault();
        self.onThumbSelected($(this));
      });

      $anchors.eq(0).addClass('active');

    },

    // Handles when a thumbnail is chosen
    onThumbSelected: function($el){
      var self = this,
      selectedIndex =  $el.index(),
      $anchors = self.$thumbNav.find('li').not(':eq(' + selectedIndex + ')'),
      animDirection = '';

      self.currentId = selectedIndex;

      // need to set a tmeout of 100ms so we can
      // fix a flicker bug on mobile devices
      $el.addClass('active');

      setTimeout(function(){
        $anchors.removeClass('active');
      },100);

      self.$slideContainer.sonyCarouselFade( 'gotoSlide' , self.currentId );
    },

    // Runs when a tab is updated and changes the hash
    updateHash: function(location, currentId) {
      var self = this,
          href,
          fragment;

      // if we don't have a module id we dont want to continue
      if (!self.moduleId) { return; }

      href = location.href.replace(/(javascript:|#).*$/, '');
      fragment = 'chapter-' + self.moduleId + '/' + currentId;
      location.replace(href + '#' + fragment);
    },

    // Runs when a hash change is detected and will direct users to the proper tab
    directFromHash: function() {
      var self = this,
          hash,
          chapterId,
          $chapterTabs,
          $chapterEl;

      // if we have already initialized from hash return
      if (self.initFromhash) { return; }

      // hash = Router.getHash();
      // chapterId = hash.replace(/.*?(\d+)[^\d]*$/,'$1');
      // $chapterTabs = self.$thumbNav.find('li');

      // // only if the chapter id is less than the length of actual tabs
      // // i.e `chapter-100` will probably not exist
      // if (chapterId < $chapterTabs.length) {
      //   $chapterEl = $chapterTabs.eq(chapterId);
      //   self.onThumbSelected($chapterEl);
      // }

      // // we should never run the method again unless script inits again
      // self.initFromhash = true;
    },

    // Sets the current active thumbnail
    setCurrentActiveThumb: function(){

      var self = this,
          $chapterTabs,
          $currTab;

      $chapterTabs = self.$thumbNav.find('li').not(':eq(' + self.currentId + ')');
      $currTab = self.$thumbNav.find('li').eq( self.currentId );

      // need to set a tmeout of 100ms so we can
      // fix a flicker bug on mobile devices
      $currTab.addClass('active');
        iQ.update();
      setTimeout(function(){
        $chapterTabs.removeClass('active');
      },100);

        self.launchModal();
        self.updateiScroll();

        var t = setTimeout(function(){
          self.updateiScroll();
        }, 1000);
      // update the hash after we got the correct slide transition
      self.updateHash(self.location, self.currentId);
    },

    initScroller: function(){
      var self = this;

      self.$thumbNav.scrollerModule({
        contentSelector: '.slider',
        iscrollProps: {
          hScrollbar: false,
          vScrollbar: false,
          isOverflowHidden: false,
          //increase width of slider by 1 on load so scrolled items dont wrap in FF
          onRefresh: function(){
            self.$slider.width( self.$slider.width() + 5 );
          },
          onScrollMove: function(){
            var node = self.$slider.get(0),
                curTransform = new WebKitCSSMatrix(window.getComputedStyle(node).webkitTransform),
                sliderOffset = node.offsetLeft + curTransform.m41, //real offset left
                sliderWidth = self.$slider.width(),
                navWidth = self.$thumbNav.width();

            //left shadow
            if (sliderOffset < 0) {
              self.$leftShade.show();
            } else {
              self.$leftShade.hide();
            }

            //right shadhow
            if ( sliderOffset > ((-1 * sliderWidth) + navWidth)) {
              self.$rightShade.show();
            } else {
              self.$rightShade.hide();
            }
          }
        }
      });
    },

    launchModal: function() {
      var self = this;
      $('#' + self.modalID).modal();
      self.measureModal();
    },

    initiScroll: function() {
      var self = this;
      self.iscroll =  new IScroll(self.modalID);
      window.iscroll = self.iscroll;
    },

    updateiScroll: function(){
      var self = this;
      self.iscroll.refresh();
      self.iscroll.scrollTo();
    },

    measureModal: function() {
      var self = this,
          width = self.$win.width();
          $('.modal-light-compare').css({
            'width': width + 'px'
          });

      if ( width > 767 ) {
        var bodyheight = self.$el.find('.modal-body').get(0).clientHeight;

        var modalheight = self.$el.height(),
            modalwidth = self.$el.width(),
            windowheight = self.$win.height();

        self.positionModal(modalwidth, modalheight);
      } else {
        self.resetModal();
      }
    },

    positionModal: function(width, height) {
      var self = this;
      self.$el.css({
        'margin-top': -height / 2,
        'margin-left': -width / 2
      });
    },

    resetModal: function() {
      var self = this;

      self.$el.css({
        'margin-top': '',
        'margin-left': ''
      });
    }
  };

  return module;
});
