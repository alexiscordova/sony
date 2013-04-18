
// Reviews + Awards (Subnavigation) Module
// ---------------------------------------
//
// * **Class:** Subnavigation
// * **Version:** 0.1
// * **Modified:** 04/17/2013
// * **Author:** George Pantazis
// * **Dependencies:** jQuery 1.7+, Modernizr, [SonyCarousel](sony-carousel.html),

define(function(require){

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      enquire = require('enquire'),
      Settings = require('require/sony-global-settings'),
      SonyCarousel = require('secondary/index').sonyCarousel;

  var module = {
    'init': function() {
      $('.subnav-module').each(function(){
        new Subnavigation(this);
      });
    }
  };

  var Subnavigation = function(element){

    var self = this;

    self.$el = $(element);
    self.$navgrid = self.$el.find('nav .slimgrid');
    self.$subcats = self.$el.find('.subnav-tray .subcategory');
    self.$subcatgrids = self.$subcats.find('.slimgrid');

    self.useCSS3 = Modernizr.csstransforms && Modernizr.csstransitions;

    self.init();

    log('SONY : Subnavigation : Initialized');
  };

  Subnavigation.prototype = {

    constructor: Subnavigation,

    init: function() {
      var self = this;

      if ( !Settings.$html.hasClass('lt-ie10') ){
        enquire.register("(min-width: 768px)", function() {
          self.renderDesktop();
        });
        enquire.register("(max-width: 767px)", function() {
          self.renderMobile();
        });
      } else {
        self.renderDesktop();
      }
    },

    renderDesktop: function() {},

    renderMobile: function() {}
  };

  return module;

});
