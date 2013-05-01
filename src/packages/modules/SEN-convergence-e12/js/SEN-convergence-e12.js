define(function(require){

  'use strict';

  var $ = require('jquery'),
      bootstrap = require('bootstrap'),
      sonyStickyTabs = require('secondary/index').sonyStickyTabs;

  var module = {
    init: function() {
      $('.sen-convergence .slides').each(function(index, element) {
        var $container = $(element);
        new SlideCrossFade($container);
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

      setInterval($.proxy(this.showNextSlide, this), 3500);
    },

    showNextSlide: function() {
      var currentSlideIndex = this.$slides.index(this.$currentSlide),
          nextSlideIndex = (currentSlideIndex + 1) % this.$slides.length,
          $nextSlide = $(this.$slides[nextSlideIndex]);

      this.$currentSlide.fadeOut(750);
      $nextSlide.fadeIn(750);

      this.$currentSlide = $nextSlide;
    }
  };

  return module;

});
