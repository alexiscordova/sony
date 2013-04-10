
// What's New Tout (WhatsNewTout) Module
// --------------------------------------------
//
// * **Class:** WhatsNewTout
// * **Version:** 0.1
// * **Modified:** 04/04/2013
// * **Author:** George Pantazis
// * **Dependencies:** jQuery 1.7+

define(function(require){

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      SonyCarousel = require('secondary/index').sonyCarousel;

  var module = {
    'init': function() {
      $('.whats-new-tout').each(function(){
        new WhatsNewTout(this);
      });
    }
  };

  var WhatsNewTout = function(element){

    var self = this;

    self.$el = $(element);
    self.init();

    log('SONY : WhatsNewTout : Initialized');
  };

  WhatsNewTout.prototype = {

    constructor: WhatsNewTout,

    init: function() {
      var self = this;

      self.$el.find('.whats-new-carousel').sonyCarousel({
        wrapper: '.whats-new-carousel-wrapper',
        slides: '.whats-new-carousel-slide',
        useCSS3: true
      });
    }

  };

  return module;

});
