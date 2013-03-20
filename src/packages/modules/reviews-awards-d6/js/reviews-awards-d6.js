
// Reviews + Awards (ReviewsAwards) Module
// ---------------------------------------
//
// * **Class:** ReviewsAwards
// * **Version:** 0.1
// * **Modified:** 03/15/2013
// * **Author:** George Pantazis
// * **Dependencies:** jQuery 1.7+, Modernizr, Enquire, [SonyDraggable](sony-draggable.html),
//                     [SonyNavDots](sony-navigationdots.html)

define(function(require){

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      enquire = require('enquire'),
      Settings = require('require/sony-global-settings'),
      SonyCarousel = require('secondary/index').sonyCarousel;

  var module = {
    'init': function() {
      $('.raa-module').each(function(){
        new ReviewsAwards(this);
      });
    }
  };

  var ReviewsAwards = function(element){

    var self = this;

    self.$el = $(element);
    self.useCSS3 = Modernizr.csstransforms && Modernizr.csstransitions;

    self.init();

    log('SONY : ReviewsAwards : Initialized');
  };

  ReviewsAwards.prototype = {

    constructor: ReviewsAwards,

    init: function() {

      var self = this;

      if ( !Settings.$html.hasClass('lt-ie10') ){
        enquire.register("(min-width: 480px)", function() {
          self.renderDesktop();
        });
        enquire.register("(max-width: 479px)", function() {
          self.renderMobile();
        });
      } else {
        self.renderDesktop();
      }
    },

    renderDesktop: function() {

      var self = this;

      self.$el.find('.carousel-slide').sonyCarousel({
        $wrapper: self.$el.find('.raa-user-reviews-carousel'),
        $draggable: self.$el.find('.carousel-slide'),
        $slides: self.$el.find('.user-ratings, .raa-social-mentions > div'),
        slideChildren: '.user-ratings, .raa-social-mentions > div',
        axis: 'x',
        unit: '%',
        dragThreshold: 10,
        useCSS3: self.useCSS3,
        paddles: false,
        pagination: true
      });

      self.$el.find('.raa-expert-reviews > div').sonyCarousel({
        $wrapper: self.$el.find('.raa-expert-reviews'),
        $draggable: self.$el.find('.raa-expert-reviews > div'),
        $slides: self.$el.find('.raa-expert-review'),
        slideChildren: '.raa-expert-review',
        axis: 'x',
        unit: '%',
        dragThreshold: 10,
        useCSS3: self.useCSS3,
        paddles: false,
        pagination: true
      });

    },

    renderMobile: function() {

    }
  };

  return module;

});
