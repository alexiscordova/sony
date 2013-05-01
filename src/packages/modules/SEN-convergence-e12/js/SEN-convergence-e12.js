define(function(require){

  'use strict';

  var $ = require('jquery'),
      bootstrap = require('bootstrap'),
      sonyStickyTabs = require('secondary/index').sonyStickyTabs;

  var module = {
    init: function() {
      var self = this;

      $('.sen-convergence .tab-pane.active .slides').each(function(index, element) {
        var $container = $(element);
        self.carousel = new SlideCrossFade($container);
      });

      $('.tabs').on('click', 'li', function () {
        var $container = $('.sen-convergence .tab-pane.active .slides');
        self.carousel.stop();
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
