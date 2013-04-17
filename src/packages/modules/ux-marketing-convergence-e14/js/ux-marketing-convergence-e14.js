
// Sony UX Marketing Convergence (MarketingConvergence) Module
// -----------------------------------------------------------
//
// * **Class:** MarketingConvergenceModule
// * **Version:** 0.2
// * **Modified:** 04/17/2013
// * **Author:** George Pantazis, Telly Koosis
// * **Dependencies:** jQuery 1.7+, [jQuery SimpleKnob](jquery.simpleknob.html)

define(function(require){

  'use strict';

  var $ = require('jquery'),
      iQ = require('iQ'),
      Modernizr = require('modernizr'),
      Settings = require('require/sony-global-settings'),
      Environment = require('require/sony-global-environment'),
      SimpleKnob = require('secondary/jquery.simpleknob');

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

    self.$html = $(document.documentElement);
    self.$el = $(element);

    self.debounceEvent = 'global:resizeDebounced-200ms.uxmc';
    self.onResizeFunc = $.proxy(self.handleResize, self);
    self.isResize = false;
    self.atBreakpoint = null;

    self.$reloadButton = self.$el.find('.btn-reload');
    self.$dialWrappers = self.$el.find('.uxmc-dial-wrapper');
    self.$dials = self.$dialWrappers.find('.uxmc-dial');
    self.$dialLabels = self.$dialWrappers.find('.uxmc-dial-label');
    self.$partnerCarousel = self.$el.find('.partner-products');
    self.$partnerCarouselSlides = self.$partnerCarousel.find('li');
    self.$partnerCarouselBackgrounds = self.$el.find('.partner-products-backgrounds'); 
    self.$partnerCarouselBgSlides = self.$partnerCarouselBackgrounds.find('li'); 

    // LISTEN
    Environment.on(self.debounceEvent, self.onResizeFunc);

    self.init();

    log('SONY : MarketingConvergenceModule : Initialized');
  };

  MarketingConvergenceModule.prototype = {

    'constructor': MarketingConvergenceModule,

    'init': function() {

      var self = this;

      self.currentPartnerProduct = -1;
      
      self.setBreakpoint();
      self.setupSlideLinks();
      self.resetPartnerCarouselInterval();
      self.gotoNextPartnerProduct();
      self.animationLoop();
      self.setupButtons();   
      self.setupDials();

      //one off
      // self.gotoPartnerProduct(0);
    },

    // enable entire slide as link without reworking markup
    // assumes mark-up particular markup
    setupSlideLinks : function(){
      var self = this;
      self.$partnerCarouselBgSlides.bind("click",function(){
          var loc = $(this).find(".uxmc-link").attr("href"); // link location
          window.location = loc;
      });
    },

    handleResize : function(){
      var self = this;
      self.isResize = true;
      self.setBreakpoint();
      self.resetPartnerCarouselInterval();
      self.gotoPartnerProduct( self.currentPartnerProduct ); // preserve current slide state
    },

    setBreakpoint : function(){
      var self = this,
          breakpoint = null; 
    
      if(Modernizr.mq('(min-width: 568px) and (max-width: 767px)')){
        breakpoint = "tablet";
      }else if(Modernizr.mq('(max-width: 567px)')){
        breakpoint = "phone";
      }else{
        breakpoint = "desktop";
      }

      self.atBreakpoint = breakpoint;
    },

    'setupButtons': function() {

      var self = this;

      self.$reloadButton.on('click', function(e){

        e.preventDefault();

        self.fadeOutContent();
        self.gotoNextPartnerProduct();
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
          self.fadeOutContent();
          self.gotoPartnerProduct(position);
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
        // fade out content slide
        self.fadeOutContent();

        // go to next
        self.gotoNextPartnerProduct();
      }, self.rotationSpeed);
    },

    // Simple "next slide" progression logic.
    'gotoNextPartnerProduct': function() {

      var self = this;

      if ( self.currentPartnerProduct === self.$partnerCarouselBgSlides.length - 1 ) {
         self.gotoPartnerProduct(0);
      } else {
        self.gotoPartnerProduct(self.currentPartnerProduct + 1);
      }
    },

    // Slide out and destroy current slide, slide in the specified slide.
    // Force an update to iQ for the newly-created assets.
    'gotoPartnerProduct': function(which) {

      var self = this,
          transitionTime = self.transitionTime,
          $newSlide, newTop;

      if ( self.isAnimating ) { return; }

      // if resize, just snap to slide
      if(self.isResize){
        self.isResize = false;
        transitionTime = 0;
      }

      self.currentPartnerProduct = which;
      $newSlide = self.$partnerCarouselBgSlides.eq(which);

      // animated only if there's more than one slide
      if ( self.$partnerCarouselBackgrounds.children().length > 1 ) {

        self.isAnimating = true;

        newTop = self.calcuateNewTop(which);

        self.$reloadButton.css('color', $newSlide.css('backgroundColor'));

        // animate the container ul
        self.$partnerCarouselBackgrounds.animate({ 
          "top": newTop
        },{
          'duration': transitionTime,
          'easing' : Settings.$easing.easeOutQuart,
          'complete': function() {
            self.isAnimating = false;
            // self.swapContent(which);
            self.fadeInContent(which);
          }
        });
      }

      iQ.update();
      self.resetDials();
    },

    fadeOutContent : function(){
      var self = this;
      self.$partnerCarouselSlides
      .removeClass("active")
      .removeAttr("class");
    },

    fadeInContent : function(which){
      var self = this;
      self.$partnerCarouselSlides
        .eq(which)
        .addClass("active");   
    },

    // swapContent : function(which){
    //   var self = this;
    //   self.fadeOutContent();
    //   self.fadeInContent();
    // },

    calcuateNewTop : function(which){
      var self = this,
          slideHeight = 0,
          newTop = null,
          isZero = (which === 0);

      switch (self.atBreakpoint) {
         case "tablet":
            slideHeight = 260;
            break;
         case "phone":
            slideHeight = 220;
            break;
         default:
            slideHeight = 340; // assumes desktop
            break;
      }

      if(self.atBreakpoint === "desktop"){
        newTop = -(which*slideHeight) + "px";
      }else{
        // becuase elements are stacked
        newTop = (slideHeight-(which*slideHeight)) + "px";
      }

      return newTop;
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
          position = (new Date() - self.slideStartTime) / self.rotationSpeed * 100;

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
    //'rotationSpeed': 7500,
    'rotationSpeed': 5000,

    // Duration of slide transition.
    //'transitionTime': 1000
    'transitionTime': 750
  };

  return module;

});
