
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
      iQ = require('iQ'),
      enquire = require('enquire'),
      Settings = require('require/sony-global-settings'),
      Environment = require('require/sony-global-environment'),
      sonyNavigationDots = require('secondary/index').sonyNavigationDots,
      sonyDraggable = require('secondary/index').sonyDraggable;

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
    self.init();

    log('SONY : ReviewsAwards : Initialized');
  };

  ReviewsAwards.prototype = {

    constructor: ReviewsAwards,

    init: function() {
      var self = this;
    }
  };

  return module;

});
