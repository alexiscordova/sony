
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
    self.useCSS3 = Modernizr.csstransforms && Modernizr.csstransitions;

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

        enquire.register("(min-width: 480px) and (max-width: 979px)", function() {
          self.renderTablet();
        });

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
      self.$tccCarousel = null;

      self.$el.replaceWith($restored);
      self.$el = $restored;
    },

    renderDesktop: function() {
      var self = this;

      console.log( 'renderDesktop »');

      self.reloadCached();

    },

    renderTablet : function(){
      var self = this;

      console.log( 'renderTablet »');

      // find the third content module
      

      // take it out of the slide
       
      // put it in its own slide
      // div.tcc-carousel-slide.container
      //  .grid
      //     .tcc-carousel-slide-children.span6
      //       | child 3

      // update all span from 12 to 6 per slide

      self.$tccCarousel = self.$el.find('.tcc-carousel').sonyCarousel({
        wrapper: '.tcc-carousel-wrapper',
        slides: '.tcc-carousel-slide',
        useCSS3: self.useCSS3,
        pagination: true,
        $dotNavWrapper: self.$el.find('.tcc-carousel-wrapper')
      });

    
    },

    renderMobile: function() {

      var self = this;

      console.log( 'renderMobile »');

      self.reloadCached();

      // self.$mergedCarousel = self.$el.find('.raa-merged-carousel > div');
      // self.$mergedCarouselHeader = self.$mergedCarousel.parent().find('h3');

      // self.$el.find('.raa-expert-review, .user-ratings, .raa-social-mention').each(function(){
      //   self.$mergedCarousel.append(this);
      // });

      // self.$mergedCarousel.append(self.$el.find('.raa-awards'));

      // self.$mergedCarousel.sonyCarousel({
      //   wrapper: '.raa-merged-carousel',
      //   slides: '.raa-expert-review, .user-ratings, .raa-social-mention, .raa-awards',
      //   useCSS3: self.useCSS3,
      //   pagination: true
      // });

      // self.setMobileHeader(0);

      // self.$mergedCarousel.on('SonyCarousel:gotoSlide', function(e, which) {
      //   self.setMobileHeader(which);
      // });
    },

    // setMobileHeader: function(which){

    //   var self = this,
    //       newHeader = self.$mergedCarousel.children().eq(which).data('header');

    //   self.$mergedCarouselHeader.html(newHeader);
    // }
  };

  return module;

});
