
// Reviews + Awards (ReviewsAwards) Module
// ---------------------------------------
//
// * **Class:** ReviewsAwards
// * **Version:** 0.1
// * **Modified:** 03/15/2013
// * **Author:** George Pantazis
// * **Dependencies:** jQuery 1.7+, Modernizr, Enquire, [SonyCarousel](sony-carousel.html),

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

      self.inititialized = true;
    },

    reloadCached: function() {

      var self = this,
          $restored;

      if ( !self.inititialized ) {
        return;
      }

      $restored = self.$cached.clone();

      if ( self.$userReviewCarousel ) {
        self.$userReviewCarousel.sonyCarousel('destroy');
      }
      if ( self.$expertReviewCarousel ) {
        self.$expertReviewCarousel.sonyCarousel('destroy');
      }
      if ( self.$mergedCarousel ) {
        self.$mergedCarousel.sonyCarousel('destroy');
      }

      // Clear these variables up for garbage collection.
      self.$userReviewCarousel = self.$expertReviewCarousel = self.$mergedCarousel = null;

      self.$el.replaceWith($restored);
      self.$el = $restored;
    },

    renderDesktop: function() {

      var self = this;

      self.reloadCached();

      self.$userReviewCarousel = self.$el.find('.carousel-slide').sonyCarousel({
        wrapper: '.raa-user-reviews-carousel',
        slides: '.user-ratings, .raa-social-mention',
        useCSS3: self.useCSS3,
        pagination: true,
        $dotNavWrapper: self.$el.find('.raa-user-reviews-carousel')
      });

      self.$expertReviewCarousel = self.$el.find('.raa-expert-reviews .reviews > div').sonyCarousel({
        wrapper: '.raa-expert-reviews .reviews',
        slides: '.raa-expert-review',
        useCSS3: self.useCSS3,
        pagination: true,
        $dotNavWrapper: self.$el.find('.raa-expert-reviews .reviews')
      });
    },

    renderMobile: function() {

      var self = this;

      self.reloadCached();

      self.$mergedCarousel = self.$el.find('.raa-merged-carousel > div');
      self.$mergedCarouselHeader = self.$mergedCarousel.parent().find('h3');

      self.$el.find('.raa-expert-review, .user-ratings, .raa-social-mention').each(function(){
        self.$mergedCarousel.append(this);
      });

      self.$mergedCarousel.append(self.$el.find('.raa-awards'));

      self.$mergedCarousel.sonyCarousel({
        wrapper: '.raa-merged-carousel',
        slides: '.raa-expert-review, .user-ratings, .raa-social-mention, .raa-awards',
        useCSS3: self.useCSS3,
        pagination: true
      });

      self.setMobileHeader(0);

      self.$mergedCarousel.on('SonyCarousel:gotoSlide', function(e, which) {
        self.setMobileHeader(which);
      });
    },

    setMobileHeader: function(which){

      var self = this,
          newHeader = self.$mergedCarousel.children().eq(which).data('header');

      self.$mergedCarouselHeader.html(newHeader);
    }
  };

  return module;

});
