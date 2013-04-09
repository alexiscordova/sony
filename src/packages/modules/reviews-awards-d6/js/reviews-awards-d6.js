
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

      self.$cached = self.$el.clone();

      if ( !Settings.$html.hasClass('lt-ie10') ){
        enquire.register("(min-width: 568px)", function() {
          self.renderDesktop();
        });
        enquire.register("(max-width: 567px)", function() {
          self.renderMobile();
        });
      } else {
        self.renderDesktop();
      }
    },

    reloadCached: function() {

      var self = this,
          $restored = self.$cached.clone();

      self.$el.replaceWith($restored);
      self.$el = $restored;
    },

    renderDesktop: function() {

      var self = this;

      self.reloadCached();

      self.$el.find('.carousel-slide').sonyCarousel({
        wrapper: '.raa-user-reviews-carousel',
        slides: '.user-ratings, .raa-social-mention',
        useCSS3: self.useCSS3,
        pagination: true
      });

      self.$el.find('.raa-expert-reviews > div').sonyCarousel({
        wrapper: '.raa-expert-reviews',
        slides: '.raa-expert-review',
        useCSS3: self.useCSS3,
        pagination: true,
        $dotNavWrapper: self.$el.find('.raa-expert-reviews')
      });
    },

    renderMobile: function() {

      var self = this;

      self.reloadCached();
    }
  };

  return module;

});
