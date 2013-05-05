define(function(require){

  'use strict';

  var $ = require('jquery'),
      iQ = require('iQ'),
      sonyTab = require('secondary/index').sonyTab;

  var module = {
    init: function() {
      var self = this,
          containerSelector = '.sen-convergence .tab-pane.active .slides',
          $container = $(containerSelector);

      self.carousel = new SlideCrossFade($container);

      $('.tab-pane').on('shown', function (evt) {
        self.carousel.stop();
        iQ.update();
        var $container = $(containerSelector);
        self.carousel = new SlideCrossFade($container);
      });
    }
  };

  var SlideCrossFade = function ($container) {
    this.init($container);
  };

  SlideCrossFade.prototype = {
    init: function($container) {
      this.$slides = $container.children();
      this.$slides.first().show();
      this.$slides.not(':first').hide();
      this.$currentSlide = this.$slides.first();

      this.interval = setInterval($.proxy(this.showNextSlide, this), 3500);
    },

    showNextSlide: function() {
      var currentSlideIndex = this.$slides.index(this.$currentSlide),
          nextSlideIndex = (currentSlideIndex + 1) % this.$slides.length,
          $nextSlide = $(this.$slides[nextSlideIndex]);

      this.$currentSlide.fadeOut(750);
      $nextSlide.fadeIn(750);

      this.$currentSlide = $nextSlide;
    },

    stop: function () {
      clearInterval(this.interval);
    }
  };

  return module;

});
