
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
      $('.one-sony-carousel').each(function(){
        new OneSonyCarousel(this);
      });
    }
  };

  var OneSonyCarousel = function(element){

    var self              = this;
    
    self.$el              = $(element);
    self.$container       = self.$el.find('.st-container');
    self.$innerContainer  = self.$container.find('.st-container-inner');
    self.$slides          = self.$container.find('.st-content');
    self.desktopAnimSpeed = 500;
    self.tabletAnimSpeed  = 300;
    self.mobileAnimSpeed  = 250;
    self.currentSlide     = 0;
    self.useCSS3          = Modernizr.csstransforms && Modernizr.csstransitions;

    self.init();

    log('SONY : OneSonyCarousel : Initialized');
  };

  OneSonyCarousel.prototype = {

    constructor: OneSonyCarousel,

    init: function() {

      var self = this;

      self.bindEvents();

      self.$innerContainer.sonyCarousel({
        wrapper: '.st-container',
        slides: '.st-content',
        slideChildren: '.st-item',
        defaultLink: '.headline a',
        useCSS3: self.useCSS3,
        paddles: true,
        pagination: true
      });

      self.$cachedSlides = self.$slides.detach();

      self.$sliderWrapper = self.$slides.first().clone();
      self.$sliderWrapper.find('.st-item').remove();

      if ( !Settings.$html.hasClass('lt-ie10') ){

        enquire.register("(min-width: 780px)", function() {
          self.renderDesktop();
          self.$slideContainer.sonyCarousel( 'setAnimationSpeed' , self.desktopAnimSpeed );
        });
        enquire.register("(min-width: 480px) and (max-width: 779px)", function() {
          self.renderEvenColumns(6);
          self.$slideContainer.sonyCarousel( 'setAnimationSpeed' , self.tabletAnimSpeed );
        });
        enquire.register("(max-width: 479px)", function() {
          self.renderEvenColumns(12);
          self.$slideContainer.sonyCarousel( 'setAnimationSpeed' , self.mobileAnimSpeed );
        });

      } else {
        self.renderDesktop();
      }

      self.$innerContainer.sonyCarousel('gotoSlide', 0);
    },

    'bindEvents': function() {

      var self = this;

      self.$innerContainer.on(Settings.transEndEventName, function(){ iQ.update(true); });
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
