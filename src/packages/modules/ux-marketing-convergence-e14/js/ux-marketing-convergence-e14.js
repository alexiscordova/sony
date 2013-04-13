
// Sony UX Marketing Convergence (MarketingConvergence) Module
// -----------------------------------------------------------
//
// * **Class:** MarketingConvergenceModule
// * **Version:** 0.2
// * **Modified:** 03/25/2013
// * **Author:** George Pantazis
// * **Dependencies:** jQuery 1.7+, [jQuery SimpleKnob](jquery.simpleknob.html)

define(function(require){

  'use strict';

  var $ = require('jquery'),
      iQ = require('iQ'),
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
    self.$reloadButton = self.$el.find('.btn-reload');
    self.$dialWrappers = self.$el.find('.uxmc-dial-wrapper');
    self.$dials = self.$dialWrappers.find('.uxmc-dial');
    self.$dialLabels = self.$dialWrappers.find('.uxmc-dial-label');
    self.$partnerCarousel = self.$el.find('.partner-products');
    self.$partnerCarouselSlides = self.$partnerCarousel.find('li');

    self.init();

    log('SONY : MarketingConvergenceModule : Initialized');
  };

  MarketingConvergenceModule.prototype = {

    'constructor': MarketingConvergenceModule,

    'init': function() {

      var self = this;

      // Detaches slides from DOM, stores them in the plugin's memory.

      self.currentPartnerProduct = -1;
      self.$partnerCarouselSlides.detach();

      self.gotoNextPartnerProduct();
      self.resetPartnerCarouselInterval();
      self.animationLoop();
      self.setupButtons();   
      self.setupDials();
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
          $currentSlide = self.$partnerCarousel.children(),
          $newSlide;

      if ( self.isAnimating ) { return; }

      self.currentPartnerProduct = which;

      $newSlide = self.$partnerCarouselSlides
        .eq(which)
        .clone()
        .appendTo(self.$partnerCarousel);

      self.$reloadButton.css('color', $newSlide.css('backgroundColor'));

      if ( self.$partnerCarousel.children().length > 1 ) {

        self.isAnimating = true;

        self.$partnerCarousel.children().animate({
          'top': '-100%'
        }, {
          'duration': self.transitionTime,
          'complete': function() {
            $currentSlide.remove();
            $newSlide.css('top', '');
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
