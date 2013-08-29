// Sony UX Marketing Convergence (MarketingConvergence) Module
// -----------------------------------------------------------
//
// * **Class:** MarketingConvergenceModule
// * **Version:** 0.2
// * **Modified:** 06/11/2013
// * **Author:** George Pantazis, Telly Koosis
// * **Dependencies:** jQuery 1.7+, [jQuery SimpleKnob](jquery.simpleknob.html), [SonyCarousel](sony-carousel.html)


define(function(require) {

  'use strict';

  var $ = require('jquery'),
    iQ = require('iQ'),
    Modernizr = require('modernizr'),
    enquire = require('enquire'),
    Settings = require('require/sony-global-settings'),
    Utilities = require('require/sony-global-utilities'),
    Environment = require('require/sony-global-environment'),
    SimpleKnob = require('secondary/jquery.simpleknob'),
    SonyCarousel = require('secondary/index').sonyCarousel;

  var module = {
    'init': function(options) {
      $('.uxmc-container').each(function() {
        new MarketingConvergenceModule(this, options);
      });
    }
  };

  var MarketingConvergenceModule = function(element, options) {

    var self = this;

    $.extend(this, {}, module.defaults, options, module.settings);

    // general
    self.$el = $(element);

    // defaults
    self.isInit = true;
    self.isAutomatic = true;
    self.currentPartnerProduct = 0;
    self.rAF = undefined;
    self.dialStyle = undefined;

    // dial defaults
    self.$dialWrappers = self.$el.find('.uxmc-dial-wrapper');
    self.$dialLabels = self.$dialWrappers.find('.uxmc-dial-label');
    self.$dials = self.$dialWrappers.find('.uxmc-dial');

    // carousel defaults
    self.$carouselInstance = undefined;
    self.$carousel = self.$el.find('.uxmc-carousel');
    self.$carouselSlides = self.$carousel.find('.sony-carousel-slide');

    // start
    self.init();

    log('SONY : MarketingConvergenceModule : Initialized');
  };

  MarketingConvergenceModule.prototype = {

    'constructor': MarketingConvergenceModule,

    'init': function() {
      var self = this,
        $carouselSlidesChildren = self.$carousel.find('.sony-carousel-slide-children');

      // create caoursel
      self.initCarousel();

      //  attach click event to entire slide
      self.setupSlideLinks();

      // only one slide doesn't get any knobs
      if ($carouselSlidesChildren.length > 1) {

        // set up knob events (mousedown, mouseover, mouseoff)
        self.setDialEvents();

        if (!Settings.$html.hasClass('lt-ie10')) {
          // register resize events; event is also triggered on init
          self.registerEnquire();
        } else {
          // still set active dial in IE
          self.setActiveDial();
        }
      }
      // always show content of first slide
      self.fadeInContent(self.currentPartnerProduct);
    },

    // create carousel
    'initCarousel': function() {
      var self = this;

      self.$carouselInstance = self.$carousel.sonyCarousel({
        direction: 'vertical',
        wrapper: '.uxmc-carousel-wrapper',
        slides: '.sony-carousel-slide',
        useCSS3: true,
        draggable: false,
        jumping: true
      });
    },

    // enable entire slide as link without reworking markup
    'setupSlideLinks': function() {
      var self = this;

      self.$carouselSlides.bind("click", function(e) {
        e.preventDefault();

        // get location from link href
        var loc = $(this).find(".uxmc-link").attr("href"); // link location

        // go to location only if there is one
        if (loc) {
          window.location = loc;
        }
      });
    },

    // Setup dials events
    'setDialEvents': function() {
      var self = this,
        dialIndex, isDialActive;

      self.$dialWrappers.on('mousedown', function(e) {
        e.preventDefault();

        // get the current dial index
        dialIndex = $(this).index();

        // is this dial the active dial?
        isDialActive = dialIndex === self.currentPartnerProduct ? true : false;

        // if the dial is inactive > allow click
        // if the dial is active and automatic > allow click
        // if the dial is active and manual > no click (do nothing)
        if ((!isDialActive) || ((isDialActive) && (self.isAutomatic))) {

          // turn off the active dial first
          self.setDialStyle("off");
          self.turnDialOff($(self.$activeDial).parent());

          // activate the dial selected
          self.setDialStyle("on");
          self.turnDialOn($(this));

          // set the new index
          self.currentPartnerProduct = dialIndex;

          // go to the slide selected
          self.gotoPartnerProduct(self.currentPartnerProduct);
        }

        // this must come after the inactive/active/manual/automatic logic
        if (self.isAutomatic) {
          // once a dial is selelected the slide naviation becomes manual
          self.isAutomatic = false;

          // stop animation
          self.killAutomation();
        }

      }).on('mouseover', function(e) {
        isDialActive = $(this).index() == self.currentPartnerProduct ? true : false;

        // if the dial is active and automatic > allow over/out
        // if the dial is inactive > allow over/out
        // if the dial is active and manual > no over/out (do nothing)
        if (((isDialActive) && (self.isAutomatic)) || (!isDialActive)) {
          self.setDialStyle("on");
          self.turnDialOn($(this)); // on state
        }
      }).on('mouseout', function(e) {
        isDialActive = $(this).index() == self.currentPartnerProduct ? true : false;

        // if the dial is active and automatic > allow over/out
        // if the dial is inactive > allow over/out
        // if the dial is active and manual > no over/out (do nothing)
        if (((isDialActive) && (self.isAutomatic)) || (!isDialActive)) {
          self.setDialStyle("off");
          self.turnDialOff($(this)); // off state
        }
      });
    },

    // register resize events for tablet/desktop and phone
    'registerEnquire': function() {
      var self = this;

      enquire.register(Utilities.enquire.min(568), function() {
        self.reset();
      });

      enquire.register(Utilities.enquire.max(567), function() {
        self.reset();
      });
    },

    // reset everything on init and resize
    'reset': function() {
      var self = this;

      // reset dial styles and functionality to init state
      self.resetDials();

      // if a dial was selected, don't restart the animation loop
      if (self.isAutomatic) {

        // start requestAnimationFrame
        self.animationLoop();

        // start timer
        self.resetPartnerCarouselInterval();
      }

      // activate dial of current slide
      self.turnDialOn(self.$dialWrappers.eq(self.currentPartnerProduct));

      // show content
      self.fadeInContent(self.currentPartnerProduct);

      // if not IE or IE9+ then set the button color
      if (!Settings.isLTIE9) {
        self.setButtonColor(self.currentPartnerProduct); // new color for reload buton
        self.$el.find('.btn-reload-container').addClass('on');
      }
    },

    'setActiveDial': function() {
      var self = this;

      self.$activeDial = self.$dials.eq(self.currentPartnerProduct);
      self.$activeDialLabel = self.$activeDial.closest(self.$dialWrappers).find(self.$dialLabels);

      // set current active
      self.$dialLabels.removeClass('active');
      self.$activeDialLabel.addClass('active');

    },

    // Update the current progress indicator dial, reset others to zero, and timestamp the event.
    // Label active dial for IE fallbacks.
    'resetDials': function() {
      var self = this;

      self.$dials.not(self.$activeDial).val(0).trigger('change');
      self.slideStartTime = new Date();

      self.setActiveDial();

      // rest styles on new dials
      self.setDialStyle("off");
      self.$dials.simpleKnob(self.dialStyle).show();
    },

    // set dial styles according to breakpoint and on/off state
    'setDialStyle': function(state) {
      var self = this,
        isMobile = Modernizr.mq('(max-width: 567px)'),
        dialStyleDesktopOff = {
          'width': 24,
          'height': 24,
          'thickness': 0.3,
          'bgColor': 'rgba(255, 255, 255, 0.5)',
          'fgColor': '#fff'
        },
        dialStyleDesktopOn = {
          'width': 24,
          'height': 24,
          'thickness': 1.0,
          'bgColor': 'rgba(255, 255, 255, 1.0)',
          'fgColor': '#fff'
        },
        dialStyleMobileOff = {
          'width': 20,
          'height': 20,
          'thickness': 0.3,
          'bgColor': 'rgba(255, 255, 255, 0.5)',
          'fgColor': '#fff'
        },
        dialStyleMobileOn = {
          'width': 20,
          'height': 20,
          'thickness': 1.0,
          'bgColor': 'rgba(255, 255, 255, 1.0)',
          'fgColor': '#fff'
        };


      if ((isMobile) && (state === "on")) {
        self.dialStyle = dialStyleMobileOn;
      } else if ((isMobile) && (state === "off")) {
        self.dialStyle = dialStyleMobileOff;
      } else if ((!isMobile) && (state === "on")) {
        self.dialStyle = dialStyleDesktopOn;
      } else if ((!isMobile) && (state === "off")) {
        self.dialStyle = dialStyleDesktopOff;
      }
    },

    // turn off element
    'turnDialOff': function($el) {
      var self = this,
        $inputs = $el.find("input.uxmc-dial");

      // dynamically update dial
      $inputs
        .val(0)
        .trigger('change')
        .trigger('configure', self.dialStyle);
    },

    // update dial style to on
    'turnDialOn': function($el) {
      var self = this,
        $input = $el.find("input.uxmc-dial");

      $input.trigger('configure', self.dialStyle);
    },

    'killAutomation': function() {
      var self = this;
      if (self.partnerCarouselInterval) {
        clearInterval(self.partnerCarouselInterval);
      }

      // kill requestAnimationFrame
      window.cancelAnimationFrame(self.rAF);
    },

    // Timer to trigger carousel rotation. Subsequent calls reset the timer's interval.
    'resetPartnerCarouselInterval': function() {
      var self = this;
      if (self.partnerCarouselInterval) {
        clearInterval(self.partnerCarouselInterval);
      }

      self.partnerCarouselInterval = setInterval(function() {
        // if last slide then next slide is the first one (for looping)
        var which = self.currentPartnerProduct === self.$carouselSlides.length - 1 ? 0 : self.currentPartnerProduct + 1;
        self.gotoPartnerProduct(which);
      }, self.rotationSpeed);
    },

    'gotoPartnerProduct': function(which) {
      var self = this,
        newSlideColor,
        noAnimation = Settings.isAndroid;

      // fade out existing slide
      self.fadeOutContent(self.currentPartnerProduct);

      // sonyCarousel api call

      self.$carouselInstance.sonyCarousel('gotoSlide', which, noAnimation);

      // fade in new slide
      self.fadeInContent(which);

      // if we're IE9+ or other set the reload button color ("+") to the slide color
      if (!Settings.isLTIE9) {
        self.setButtonColor(which);
      }

      // update current slide index after transition is complete
      self.currentPartnerProduct = which;

      // run iq again
      iQ.update();

      self.resetDials();
    },

    // based on slide background color, set "+" color
    'setButtonColor': function(which) {
      var self = this,
        $reloadBtn = self.$el.find('.btn-reload'),
        $slide = self.$carouselSlides.eq(which);

      $reloadBtn.css('color', $slide.css("background-color"));
    },

    // remove active class to current slide child
    // css transitions opacity off
    'fadeOutContent': function(which) {
      var self = this;

      // fade out active slide
      self.$carouselSlides
        .eq(which)
        .find(".sony-carousel-slide-children")
        .removeClass("active");
    },

    // add active class to current slide child
    // css transitions opacity on
    'fadeInContent': function(which) {
      var self = this;

      self.$carouselSlides
        .eq(which)
        .find(".sony-carousel-slide-children")
        .addClass("active");
    },

    // Animations that should occur as the window is ready to paint.
    'animationLoop': function() {
      var self = this,
        position;

      if (self.isInit) {
        // no transition for initial timer
        position = (new Date() - self.slideStartTime) / self.rotationSpeed * 100;
        self.isInit = false;
      } else {
        position = (new Date() - self.slideStartTime - self.transitionTime) / (self.rotationSpeed - self.transitionTime) * 100;
      }

      if (position < 0) {
        position = 0;
      }

      self.rAF = window.requestAnimationFrame($.proxy(self.animationLoop, self));

      if (self.$activeDial) {
        self.$activeDial.val(position).trigger('change');
      }
    }
  };

  // Defaults
  // --------

  module.defaults = {

    // Timeout between slide rotation.
    'rotationSpeed': 5000,

    // Duration of slide transition.
    'transitionTime': 750
  };

  return module;

});