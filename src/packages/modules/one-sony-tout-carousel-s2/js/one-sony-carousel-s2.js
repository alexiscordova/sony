
// One Sony Carousel (OneSonyCarousel) Module
// --------------------------------------------
//
// * **Class:** OneSonyCarousel
// * **Version:** 0.2
// * **Modified:** 02/20/2013
// * **Author:** George Pantazis
// * **Dependencies:** jQuery 1.7+, Modernizr, Enquire, [SonyCarousel](sony-carousel.html)

define(function(require){

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      iQ = require('iQ'),
      enquire = require('enquire'),
      Settings = require('require/sony-global-settings'),
      Environment = require('require/sony-global-environment'),
      SonyCarousel = require('secondary/index').sonyCarousel;

  var module = {
    'init': function() {
      $('.sony-one-carousel').each(function(){
        new OneSonyCarousel(this);
      });
    }
  };

  var OneSonyCarousel = function(element){

    var self = this;

    self.$el = $(element);
    self.$container = self.$el.find('.soc-container');
    self.$innerContainer = self.$container.find('.soc-container-inner');
    self.$slides = self.$container.find('.soc-content');

    self.currentSlide = 0;
    self.useCSS3 = Modernizr.csstransforms && Modernizr.csstransitions;

    self.init();

    log('SONY : OneSonyCarousel : Initialized');
  };

  OneSonyCarousel.prototype = {

    constructor: OneSonyCarousel,

    init: function() {

      var self = this;

      self.bindEvents();

      self.$innerContainer.sonyCarousel({
        wrapper: '.soc-container',
        slides: '.soc-content',
        slideChildren: '.soc-item',
        defaultLink: '.headline a',
        axis: 'x',
        unit: '%',
        dragThreshold: 10,
        useCSS3: self.useCSS3,
        paddles: true,
        pagination: true
      });

      self.$cachedSlides = self.$slides.detach();
      self.$cachedSlides.find('.soc-image').addClass('iq-img');

      self.$sliderWrapper = self.$slides.first().clone();
      self.$sliderWrapper.find('.soc-item').remove();

      if ( !Settings.$html.hasClass('lt-ie10') ){

        enquire.register("(min-width: 780px)", function() {
          self.renderDesktop();
        });
        enquire.register("(min-width: 480px) and (max-width: 779px)", function() {
          self.renderEvenColumns(6);
        });
        enquire.register("(max-width: 479px)", function() {
          self.renderEvenColumns(12);
        });

      } else {
        self.renderDesktop();
      }

      self.$innerContainer.sonyCarousel('gotoSlide', 0);
    },

    'bindEvents': function() {

      var self = this;

      self.$innerContainer.on(Settings.transEndEventName, function(){ iQ.update(true); });

      self.$el.find('.soc-image').on('iQ:imageLoaded', function(){
        $(this).closest('.soc-item').addClass('on');
      });
    },

    // Create or restore the default slide layout.

    renderDesktop: function(which) {

      var self = this,
          $newSlides = self.$cachedSlides.clone(true);

      self.$innerContainer.empty().append($newSlides);

      self.$innerContainer.sonyCarousel('resetSlides');
    },

    // Splits the default layout into slides with children each of column width
    // set at colPerItem, which must divide evenly into 12.

    renderEvenColumns: function(colPerItem) {

      var self = this,
          $newItems = self.$cachedSlides.clone(true).children().children();

      self.$innerContainer.empty();
      $newItems.removeClass('span8 span6 span4').addClass('span' + colPerItem);

      for ( var i = 0; i < $newItems.length; i=i+(12/colPerItem) ) {
        var newItem = self.$sliderWrapper.clone();
        for ( var j = i; j < i + 12/colPerItem; j++ ) {
          newItem.children().append( $newItems.eq(j) );
        }
        self.$innerContainer.append(newItem);
      }

      self.$innerContainer.sonyCarousel('resetSlides');
    }

  };

  return module;

});
