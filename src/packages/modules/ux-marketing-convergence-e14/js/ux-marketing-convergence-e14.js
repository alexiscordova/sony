
// Sony UX Marketing Convergence (MarketingConvergence) Module
// -----------------------------------------------------------
//
// * **Class:** MarketingConvergenceModule
// * **Version:** 0.2
// * **Modified:** 04/15/2013
// * **Author:** George Pantazis, Telly Koosis
// * **Dependencies:** jQuery 1.7+, [jQuery SimpleKnob](jquery.simpleknob.html)


define(function(require){

  'use strict';

  var $ = require('jquery'),
      iQ = require('iQ'),
      Settings = require('require/sony-global-settings'),
      Environment = require('require/sony-global-environment'),
      Modernizr = require('modernizr'),
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

    self.$reloadButton = self.$el.find('.btn-reload');
    self.$dialWrappers = self.$el.find('.uxmc-dial-wrapper');
    self.$dials = self.$dialWrappers.find('.uxmc-dial');
    self.$dialLabels = self.$dialWrappers.find('.uxmc-dial-label');
    self.$partnerCarousel = self.$el.find('.partner-products');
    self.$partnerCarouselSlides = self.$partnerCarousel.find('li');

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

      self.gotoNextPartnerProduct();
      self.resetPartnerCarouselInterval();
      self.animationLoop();
      self.setupButtons();   
      self.setupDials();
      self.setupSlideLinks();

    },

    // enable entire slide as link without reworking markup
    // assumes mark-up particular markup
    setupSlideLinks : function(){
      var self = this;

      self.$partnerCarouselSlides.bind("click",function(){
          var loc = $(this).find(".uxmc-link").attr("href"); // link location
          window.location = loc;
      });

    },

  
    handleResize : function(){
      var self = this;
      self.resetPartnerCarouselInterval();
      self.gotoPartnerProduct( self.currentPartnerProduct ); // preserve state
    },


    'setupButtons': function() {

      var self = this;

      self.$reloadButton.on('click', function(e){

        e.preventDefault();

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
        self.gotoNextPartnerProduct();
      }, self.rotationSpeed);
    },

    // Simple "next slide" progression logic.

    'gotoNextPartnerProduct': function() {

      var self = this;

      if ( self.currentPartnerProduct === self.$partnerCarouselSlides.length - 1 ) {
         self.gotoPartnerProduct(0);
      } else {
        self.gotoPartnerProduct(self.currentPartnerProduct + 1);
      }
    },

    // Slide out and destroy current slide, slide in the specified slide.
    // Force an update to iQ for the newly-created assets.

    'gotoPartnerProduct': function(which) {

      var self = this,
          isZero = (which === 0),
          $newSlide, newTop;

      if ( self.isAnimating ) { return; }

      self.currentPartnerProduct = which;
      $newSlide = self.$partnerCarouselSlides.eq(which);

      // animated only if there's more than one slide
      if ( self.$partnerCarousel.children().length > 1 ) {

        self.isAnimating = true;

        // if we're in mobile, position will be 1/2 
        // since slides are stacked instead of side by side (in desktop)
        if (isZero){
          newTop = (0) + "%";
        }else{
          if(Modernizr.mediaqueries && Modernizr.mq('(max-width: 767px)')){
            newTop = (-(which * 100) / 2) + "%";
          }else{
            // assumes desktop
            newTop = (-(which * 100)) + "%";
          }
        }

        // console.log( 'newTop »' , newTop);

        self.$reloadButton.css('color', $newSlide.css('backgroundColor'));

        // animate the container ul
        self.$partnerCarousel.animate({
          "top": newTop
        }, {
          'duration': self.transitionTime,
          // 'easing' : 'easeInOutQuart',
          'complete': function() {
            self.isAnimating = false;
          }
        });

      }

      iQ.update();
      self.resetDials();
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
    'rotationSpeed': 7500,

    // Duration of slide transition.
    'transitionTime': 1000
  };

  return module;

});
