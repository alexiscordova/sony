
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
      Modernizr = require('modernizr');

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
    }

  };

  return module;

});
