
// Sony UX Marketing Convergence (MarketingConvergence) Module
// -----------------------------------------------------------
//
// * **Class:** MarketingConvergenceModule
// * **Version:** 0.2
// * **Modified:** 04/30/2013
// * **Author:** George Pantazis, Telly Koosis
// * **Dependencies:** jQuery 1.7+, [jQuery SimpleKnob](jquery.simpleknob.html), [SonyCarousel](sony-carousel.html)


define(function(require){

  'use strict';

  var $ = require('jquery'),
      iQ = require('iQ'),
      Modernizr = require('modernizr'),
      enquire = require('enquire'),
      Settings = require('require/sony-global-settings'),
      Environment = require('require/sony-global-environment'),
      SimpleKnob = require('secondary/jquery.simpleknob'),
      SonyCarousel = require('secondary/index').sonyCarousel;

  var module = {
    'init': function(options) {
      $('.uxmc-container').each(function(){
        new MarketingConvergenceModule(this, options);
      });
    }
  };

  var MarketingConvergenceModule = function(element, options){

    var self = this;

    $.extend(this, {}, module.defaults, options, module.settings);

    // general
    self.$html = $(document.documentElement);
    self.$el = $(element);
    self.isInit = true;
    self.mobileNavThreshold = 567;
    // self.isMobile = Modernizr.mq('(max-width:'+ self.mobileNavThreshold +'px)');

    // resize event related
    //self.debounceEvent = 'global:resizeDebounced-200ms.uxmc';
    //self.onResizeEvent = $.proxy(self.handleResize, self);
    self.isResize = false;

    // buttons & dials
    self.dialInit = {
      'width': 24,
      'height': 24,
      'thickness': 0.3,
      'bgColor': 'rgba(255, 255, 255, 0.5)',
      'fgColor': '#fff'
    };

    self.dialInitMobile = {
      'width': 20,
      'height': 20,
      'thickness': 0.3,
      'bgColor': 'rgba(255, 255, 255, 0.5)',
      'fgColor': '#fff'
    };

    self.dialOn = {
      'thickness': 1.0,
      'bgColor': 'rgba(255, 255, 255, 1.0)'
    };

    self.dialOff = {
      'thickness': 0.3,
      'bgColor': 'rgba(255, 255, 255, 0.5)'
    };

    // self.$dialLabels = self.$dialWrappers.find('.uxmc-dial-label');
    self.isAutomatic = true;
    self.rAF = undefined;
    self.dialStyles = undefined;
    self.$progressIndicators = self.$el.find('.progress-indicators');
    self.$buttonReloadContainer = self.$el.find('.btn-reload-container');
    self.$reloadButton = self.$el.find('.btn-reload');
    self.$dialWrappers = self.$el.find('.uxmc-dial-wrapper');
    self.$dials = self.$dialWrappers.find('.uxmc-dial');

    // carousel
    self.currentPartnerProduct = 0; // default
    self.$carousel = self.$el.find('.uxmc-carousel');
    self.$carouselInstance = undefined;
    self.$carouselSlides = self.$carousel.find('.sony-carousel-slide');
    self.$carouselSlidesChildren = self.$carousel.find('.sony-carousel-slide-children');

    // LISTEN
    // if(!Settings.isLTIE10){
    //   Environment.on(self.debounceEvent, $.proxy(self.onResizeEvent, self));
    // }

    self.init();

    log('SONY : MarketingConvergenceModule : Initialized');
  };

  MarketingConvergenceModule.prototype = {

    'constructor': MarketingConvergenceModule,

    'init': function() {

      var self = this;

      // create caoursel
      self.initCarousel();

      //  attach click event to entire slide
      self.setupSlideLinks();

      // set up knob dials (init, mousedown, mouseover, mouseoff)
      self.setupDials();

      if( !Settings.$html.hasClass('lt-ie10') ){
        // resgister for resize
        enquire.register('(min-width: 568px)', function() {
          self.handleResize();
        });

        enquire.register('(max-width: 567px)', function() {
          self.handleResize();
        });
      }

      // start requestAnimationFrame
      self.animationLoop();

      if(!Settings.isLTIE9){
        self.setButtonColor(self.currentPartnerProduct); // new color for reload buton
        self.$buttonReloadContainer.addClass('on');
      }

      // show content
      self.fadeInContent(self.currentPartnerProduct);

      // start animation
      self.resetDials();

      // start timer
      self.resetPartnerCarouselInterval();
    },

    'dialsINIT' : function(){
      var self = this;

      // tear down knobs and redo
      if(self.isInit){
        self.$dials.simpleKnob(self.dialStyles).show();
      }else{
        self.$dials.simpleKnob(self.dialStyles).trigger('configure', self.dialStyles);
      }
    },

    'handleResize' : function(breakpoint){
      var self = this,
          $activeDial = self.$dials.eq(self.currentPartnerProduct);

      self.isResize = true;

      self.setDialStyles();

      self.dialsINIT();

      self.turnDialON($activeDial);
    },

    'setDialStyles' : function(){
      var self = this,
          isMobile = Modernizr.mq('(max-width:'+ self.mobileNavThreshold +'px)');

      //console.log( 'isMobile? »' , isMobile);
      self.dialStyles = isMobile ? self.dialInitMobile : self.dialInit;
    },

    'initCarousel' : function(){
      var self = this;

      self.$carouselInstance = self.$carousel.sonyCarousel({
        direction: 'vertical',
        wrapper: '.uxmc-carousel-wrapper',
        slides: '.sony-carousel-slide',
        useCSS3: true,
        draggable: false,
        jumping:true,
        setCSS3Easing: Settings.easing.easeInOutExpo,
        animationSpeed: self.transitionTime
      });
    },

    // enable entire slide as link without reworking markup
    // assumes mark-up particular markup
    'setupSlideLinks' : function(){
      var self = this;
      self.$carouselSlides.bind("click",function(e){
          e.preventDefault();
          var loc = $(this).find(".uxmc-link").attr("href"); // link location
          window.location = loc;
      });
    },

    // Setup simpleKnob dials, setup behaviors for hover/click.
    'setupDials': function() {

      var self = this;

      self.setDialStyles();
      self.dialsINIT();

      self.$dialWrappers.on('mousedown', function(e){
        e.preventDefault();
        self.isAutomatic = false;

        var position = $(this).index();
        self.currentPartnerProduct = position - 1;

        // stop timer and rAF
        self.killAutomation();

        // reset the knobs
        self.turnDialOFF(self.$dialWrappers);

        // activate the one clicked
        self.turnDialON($(this));

        // go to the correct slide
        self.gotoPartnerProduct();
      }).on('mouseover', function(e){

        // console.log( 'this »' , $(this).index());
        // console.log( 'active dial »' , self.$activeDial.index());

        // on state
        self.turnDialON( $(this) );


      }).on('mouseout', function(e){
        // off state
        self.turnDialOFF( $(this) );
      });
    },

    'turnDialOFF' : function($el){
      var self = this,
          $inputs = self.$dialWrappers.find("input.uxmc-dial");

      // set active dail at tiem of click
      self.$activeDial = self.$dials.eq(self.currentPartnerProduct);

      // dynamically update knob
      // set dial to 0 and stroke back to normal size
      self.$dials.not(self.$activeDial).val(0).trigger('change').trigger('configure', self.dialOff);
    },

    'turnDialON' : function($el){
      var self = this,
          $input = $el.find("input.uxmc-dial");

      self.turnDialOFF();

      // dynamically update knob
      $input.trigger('configure', self.dialOn);
    },

    'killAutomation' : function(){
      var self = this;
      if ( self.partnerCarouselInterval ) {
        clearInterval(self.partnerCarouselInterval);
      }

      // kill requestAnimationFrame
      window.cancelAnimationFrame(self.rAF);
    },

    // Timer to trigger carousel rotation. Subsequent calls reset the timer's interval.
    'resetPartnerCarouselInterval': function() {
      var self = this;

      if ( self.partnerCarouselInterval ) {
        clearInterval(self.partnerCarouselInterval);
      }

      self.partnerCarouselInterval = setInterval(function(){
        self.gotoPartnerProduct();
      }, self.rotationSpeed);
    },

    'gotoPartnerProduct': function() {
      var self = this,
          newSlideColor,
          which = self.currentPartnerProduct === self.$carouselSlides.length - 1  ?  0 : self.currentPartnerProduct + 1; // loop to first from last

      if(self.isResize){
        which = self.currentPartnerProduct;
        self.isResize = false; // reset
      }else{

        // new slide
        self.fadeOutContent();

        // sonyCarousel api call
        self.$carouselInstance.sonyCarousel('gotoSlide', which);

         // fade out content as slide is moving
        self.fadeInContent(which);

        if(!Settings.isLTIE9){
          self.setButtonColor(which); // new color for reload buton
        }

        // update current slide after transition is complete
        self.currentPartnerProduct = which;
      }

      iQ.update();

      // only if slides are still automated
      if(self.isAutomatic){
        self.resetDials();
      }
    },

    'setButtonColor' : function(which){
      var self = this,
          $reloadBtn = self.$reloadButton,
          $slide = self.$carouselSlides.eq(which);

      $reloadBtn.css('color', $slide.css("background-color"));
    },

    'fadeOutContent' : function(){
      var self = this;

      self.$carouselSlidesChildren
      .removeClass("active");
    },

    'fadeInContent' : function(which){
      var self = this;

      self.$carouselSlides
        .eq(which)
        .find(".sony-carousel-slide-children")
        .addClass("active");
    },

    // Update the current progress indicator dial, reset others to zero, and timestamp the event.
    // Label active dial for IE fallbacks.
    'resetDials': function() {

      var self = this;

      self.$activeDial = self.$dials.eq(self.currentPartnerProduct);
      //self.$activeDialLabel = self.$activeDial.closest(self.$dialWrappers).find(self.$dialLabels);
      self.$dials.not(self.$activeDial).val(0).trigger('change');

      self.slideStartTime = new Date();

      // self.$dialLabels.removeClass('active');
      // self.$activeDialLabel.addClass('active');
    },

    // Animations that should occur as the window is ready to paint.
    'animationLoop': function() {
      var self = this,
          position;

      if(self.isInit) {
        // no transition for initial timer
        position = (new Date() - self.slideStartTime) / self.rotationSpeed * 100;
        self.isInit = false;
      }else{
        position = (new Date() - self.slideStartTime - self.transitionTime) / (self.rotationSpeed - self.transitionTime) * 100;
      }

      if(position < 0){position = 0;}

      self.rAF = window.requestAnimationFrame( $.proxy(self.animationLoop, self) );

      if ( self.$activeDial ) {
        self.$activeDial.val( position ).trigger('change');
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