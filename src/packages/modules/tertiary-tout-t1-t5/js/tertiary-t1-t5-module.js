
// Sony Tertiary Content Container
// -------------------------------------------------
//
// * **Module:** Tertiary Module
// * **Version:** 0.2
// * **Modified:** 04/11/2013
// * **Author:** Telly Koosis
// * **Dependencies:** jQuery 1.7+, Modernizr, Enquire, [SonyCarousel](sony-carousel.html), 

// //jQuery 1.7+, Modernizr, [sony-iscroll.js](sony-iscroll.html), [sony-scroller.js](sony-scroller.html), [sony-sequencer.js](sony-sequencer.html)
//

define(function(require){

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      iQ = require('iQ'),
      enquire = require('enquire'),
      Settings = require('require/sony-global-settings'),
      SonyCarousel = require('secondary/index').sonyCarousel;

  var module = {
    'init': function() {
      $('.tcc-module').each(function(){
        new TertiaryTouts(this);
      });
    }
  };

  var TertiaryTouts = function(element){

    var self = this;
    self.$el = $(element);

    // GLOBAL
    self.useCSS3 = Modernizr.csstransforms && Modernizr.csstransitions;

    // CLASS NAMES
    self.carouselWrapperClass = '.tcc-carousel-wrapper';
    self.carouselClass = '.tcc-carousel';
    self.slideClass = '.sony-carousel-slide';
    self.slideChildClass = '.sony-carousel-slide-children';

    // CACHE
    self.$carouselWrapper = self.$el.find(self.carouselWrapperClass);
    self.$carousel = self.$el.find(self.carouselClass);

    // NEW DOM 
    self.$newGrid = $('<div/>').addClass('grid');
    self.$newContainer = $('<div/>').addClass("container").html(self.$newGrid); 
    self.$newSlide = $('<div/>').addClass(self.slideClass.replace(".", "")).html(self.$newContainer); 

    // go
    self.init();

    log('SONY : TertiaryTouts : Initialized');
  };

  TertiaryTouts.prototype = {

    constructor: TertiaryTouts,

    init: function() {

      var self = this;

      self.$cached = self.$el.clone();

      if ( !Settings.$html.hasClass('lt-ie10') ){
        enquire.register("(min-width: 980px)", function() {
          self.renderDesktop();
        });

        // enquire.register("(min-width: 580px) and (max-width: 979px)", function() {
        enquire.register("(min-width: 480px) and (max-width: 979px)", function() {
          self.renderTablet();
        });

        //enquire.register("(max-width: 579px)", function() {
        enquire.register("(max-width: 479px)", function() {
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

      if ( self.$tccCarousel ) {
        self.$tccCarousel.sonyCarousel('destroy');
      }
   
      // Clear these variables up for garbage collection.
      self.$tccCarousel = self.$carouselWrapper = self.$carousel = null;

      // restore to default (cached)
      self.$el.replaceWith($restored);
      self.$el = $restored;
      
      // reset 
      self.$carouselWrapper = self.$el.find(self.carouselWrapperClass);
      self.$carousel = self.$carouselWrapper.find(self.carouselClass);
      iQ.update();
    },

    renderDesktop: function() {
      var self = this;
      self.reloadCached();
    },

    renderTablet : function(){
      var self = this,
          $slide2 = self.$newSlide.clone(true),
          $lastChild = null;

      // reset to default
      self.reloadCached();

      // find the third content module in the default layout
      $lastChild = self.$el.find(self.slideClass).find(".span4").last();

      // add last child to new slide
      $slide2
        .find(".grid")
        .append($lastChild);

      // add to carousel
      self.$carousel.append($slide2);
     
      // update all spans to be span6
      self.updateSpans("span6");
            
      // swap three-up class with two-up on div#carousel
      self.updateId("two-up");

      // init the carousel
      self.$tccCarousel = self.$el.find(self.$carousel).sonyCarousel({
        wrapper:        self.carouselWrapperClass,
        slides:         self.slideClass,
        useCSS3:        self.useCSS3,
        pagination:     true,
        paddles:        true,
        $dotNavWrapper: self.$carouselWrapper
      });

      self.resetSlides();    
    },

    renderMobile: function() {
      var self = this,
          $slide2 = self.$newSlide.clone(true),
          $slide3 = self.$newSlide.clone(true),
          $secondChild, $lastChild;

      // reset to default
      self.reloadCached();

      // find 2nd content module
      $secondChild = self.$el.find(self.slideClass).find(".span4:nth-last-child(2)");

      // find the third content module in the default layout
      $lastChild = self.$el.find(self.slideClass).find(".span4").last();

      // add 2nd child to slide2
      $slide2
        .find(".grid")
        .append($secondChild);

      // last slide to slide3
      $slide3
        .find(".grid")
        .append($lastChild);

      // add to carousel
      self.$carousel.append($slide2).append($slide3);
     
      // update all sony-carousel-slid > grid > spans to be span12
      self.updateSpans("span12");
            
      // swap three-up class with two-up on div#carousel
      self.updateId("one-up");

      // init the carousel
      self.$tccCarousel = self.$el.find(self.$carousel).sonyCarousel({
        wrapper:        self.carouselWrapperClass,
        slides:         self.slideClass,
        useCSS3:        self.useCSS3,
        pagination:     true,
        paddles:        true,
        $dotNavWrapper: self.$carouselWrapper
      });
      
      self.resetSlides();
    },

    resetSlides : function(){
      var self = this;
      self.$tccCarousel.sonyCarousel('resetSlides');
    },

    updateId : function(newID){
      var self = this;
      self.$carouselWrapper.parent().attr("id",newID);
    },

    updateSpans : function(updateClass){
      var self = this;    
      self.$el
        .find(self.slideClass)
        .find('.span4, .span6, .span12')
        .removeClass('span4 span6 span12')
        .addClass(updateClass);
    }
  };

  return module;

});
