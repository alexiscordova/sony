
// Promo: Clear Audio (PromoClearAudio) Module
// ---------------------------------------
//
// * **Version:** 0.1
// * **Modified:** 07/01/2013
// * **Author:** George Pantazis

define(function(require){

  'use strict';

  var $ = require('jquery');

  var module = {
    'init': function() {
      $('.promo-clearaudio').each(function(){
        new PromoClearAudio(this);
      });
    }
  };

  var PromoClearAudio = function(element){

    var self = this;

    self.$el = $(element);

    self.init();

    log('SONY : PromoClearAudio : Initialized');
  };

  PromoClearAudio.prototype = {

    constructor: PromoClearAudio,

    init: function() {

      var self = this;

    }
  };

  return module;

});
