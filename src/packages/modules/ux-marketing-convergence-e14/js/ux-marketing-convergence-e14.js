
// Sony UX Marketing Convergence (MarketingConvergence) Module
// -----------------------------------------------------------
//
// * **Class:** MarketingConvergenceModule
// * **Version:** 0.2
// * **Modified:** 04/18/2013
// * **Author:** George Pantazis, Telly Koosis
// * **Dependencies:** jQuery 1.7+, [jQuery SimpleKnob](jquery.simpleknob.html), [SonyCarousel](sony-carousel.html)

define(function(require){

  'use strict';

  var $ = require('jquery'),
      iQ = require('iQ'),
      Modernizr = require('modernizr'),
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

    // resize event related
    // self.debounceEvent = 'global:resizeDebounced-200ms.uxmc';
    // self.onResizeFunc = $.proxy(self.handleResize, self);    
    // self.isResize = false;
    // self.atBreakpoint = undefined;
    
    // buttons & dials
    self.$reloadButton = self.$el.find('.btn-reload');
    self.$dialWrappers = self.$el.find('.uxmc-dial-wrapper');
    self.$dials = self.$dialWrappers.find('.uxmc-dial');
    self.$dialLabels = self.$dialWrappers.find('.uxmc-dial-label');

    // carousel
    self.$carousel = self.$el.find('.uxmc-carousel'); 
    self.$carouselInstance = undefined;
    self.$carouselSlides = self.$carousel.find('.sony-carousel-slide');
    self.$carouselSlidesChildren = self.$carousel.find('.sony-carousel-slide-children');

    // LISTEN
    self.$carousel.on('SonyCarousel:AnimationComplete', $.proxy(self.onAnimationComplete, self));

    self.init();

    log('SONY : MarketingConvergenceModule : Initialized');
  };

  MarketingConvergenceModule.prototype = {

    'constructor': MarketingConvergenceModule,

    'init': function() {

      var self = this;

      // self.currentPartnerProduct = -1;
      self.currentPartnerProduct = 0;

      self.initCarousel();  
      self.setupSlideLinks();
      
      self.animationLoop();
      self.setupButtons();
      self.setupDials();

      // INIT SEQUENCE 
      self.setButtonColor(self.currentPartnerProduct); // set color
      self.fadeInContent(self.currentPartnerProduct); // show content
      self.resetDials(); // start animation
      self.resetPartnerCarouselInterval(); // start timer
    },

    'initCarousel' : function(){
      var self = this;
      
      self.$carouselInstance = $('.uxmc-carousel').sonyCarousel({
        direction: 'vertical',
        wrapper: '.uxmc-carousel-wrapper',
        slides: '.sony-carousel-slide',
        useCSS3: true,
        draggable: false,
        jumping:true,
        setCSS3Easing: Settings.easing.easeOutQuart,
        animationSpeed: self.transitionTime
      });    
    },

    'onAnimationComplete' : function(){
      var self = this;
      self.fadeOutContent(); 
      self.fadeInContent(self.currentPartnerProduct); 
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

    'setupButtons': function() {

      var self = this;

      self.$reloadButton.on('click', function(e){

        e.preventDefault();

        self.gotoPartnerProduct();
        self.resetPartnerCarouselInterval();
      });
    },

    // Setup simpleKnob dials, setup behaviors for hover/click.
    'setupDials': function() {

      var self = this;

      self.$dials.simpleKnob({
        'width': 28,
        'height': 28,
        'thickness': 0.15,
        'fontSize': '1em',
        'bgColor': 'rgba(255, 255, 255, 0.5)',
        'fgColor': '#fff'
      }).css('display', 'block');

      self.$dialLabels.on('mousedown', function(e){

        e.preventDefault();

        var position = self.$dials.index($(this).parent().find(self.$dials));

        if ( position === self.currentPartnerProduct ) {
          self.resetDials();
        } else {
          self.currentPartnerProduct = position;
          self.gotoPartnerProduct();
        }

        self.resetPartnerCarouselInterval();

      }).on('mouseover', function(e){

        $(this).parent().find(self.$dials).not(self.$activeDial).val(100).trigger('change');

      }).on('mouseout', function(e){

        $(this).parent().find(self.$dials).not(self.$activeDial).val(0).trigger('change');

      });
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
          which = self.currentPartnerProduct === self.$carouselSlides.length - 1  ?  0 : self.currentPartnerProduct + 1;

      // new color for reload buton
      self.setButtonColor(which);

      // fade out content as slide is moving
      // self.fadeOutContent(); 

      // to go the slide
      self.$carouselInstance.sonyCarousel('gotoSlide', which);
      
      // update current slide
      self.currentPartnerProduct = which;  

      iQ.update();
      self.resetDials();      
    },

    'setButtonColor' : function(which){
      var self = this;

      self.$reloadButton.css('color', self.$carouselSlides.eq(which).css("backgroundColor"));
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
        .children(".sony-carousel-slide-children")
        .addClass("active"); 
    },

    // Update the current progress indicator dial, reset others to zero, and timestamp the event.
    // Label active dial for IE fallbacks.
    'resetDials': function() {

      var self = this;

      self.$activeDial = self.$dials.eq(self.currentPartnerProduct);
      self.$activeDialLabel = self.$activeDial.closest(self.$dialWrappers).find(self.$dialLabels);

      self.$dials.not(self.$activeDial).val(0).trigger('change');
      self.slideStartTime = new Date();

      self.$dialLabels.removeClass('active');
      self.$activeDialLabel.addClass('active');
    },

    // Animations that should occur as the window is ready to paint.
    'animationLoop': function() {

      var self = this,
          position;

      if(self.isInit){
        // remove transition time since there's no transition on init
        position = (new Date() - self.slideStartTime) / (self.rotationSpeed) * 100;
        self.isInit = false;
      }else{
        position = (new Date() - self.slideStartTime - self.transitionTime) / (self.rotationSpeed - self.transitionTime) * 100;
      }
          
      if(position < 0){
        position = 0;
      }

      window.requestAnimationFrame( $.proxy(self.animationLoop, self) );

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
    'transitionTime': 1500
  };

  return module;

});