// SEN Convergence (SenConvergence) Module.
// ---------------------------------------
//
// * **Version:** 0.1
// * **Modified:** 05/05/2013
// * **Author:** Chris Pickett, Sam Carlton
// * **Dependencies:** jQuery 1.7+, iQ, Sony Tabs

define(function(require){

  'use strict';

  var $ = require('jquery'),
      iQ = require('iQ'),
      sonyTab = require('secondary/index').sonyTab;

  var module = {
    'init': function() {
      var self = this,
          containerSelector = '.sen-convergence .tab-pane.active .slides',
          $container = $(containerSelector);

      self.carousel = new SenConvergence($container);

      $('.tab-pane').on('shown', function(evt) {
        self.carousel.stop();
        iQ.update();
        var $container = $(containerSelector);
        self.carousel = new SenConvergence($container);
      });
    }
  };

  var SenConvergence = function(element) {
    var self = this;
    self.$el = $(element);

    self.init();

    log('SONY : SenConvergence : Initialized');
  };

  SenConvergence.prototype = {

    constructor: SenConvergence,

    init: function() {
      var self = this;
      self.$slides = self.$el.children();

      self.$slides.first().show();
      self.$slides.not(':first').hide();

      self.$currentSlide = self.$slides.first();

      self.interval = setInterval($.proxy(self.showNextSlide, self), 3500);
    },

    showNextSlide: function() {
      var self = this,
          currentSlideIndex = self.$slides.index(self.$currentSlide),
          nextSlideIndex = (currentSlideIndex + 1) % self.$slides.length,
          $nextSlide = $(self.$slides[nextSlideIndex]);

      self.$currentSlide.fadeOut(750);
      $nextSlide.fadeIn(750);

      self.$currentSlide = $nextSlide;
    },

    stop: function() {
      var self = this;
      clearInterval(self.interval);
    }
  };

  return module;
});
