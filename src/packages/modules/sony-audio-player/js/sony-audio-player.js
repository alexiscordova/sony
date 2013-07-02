
// Sony Audio Player (SonyAudioPlayer) Module
// --------------------------------------------
//
// * **Class:** SonyAudioPlayer
// * **Version:** 0.1
// * **Modified:** 07/01/2013
// * **Author:** George Pantazis
// * **Dependencies:** jQuery 1.7+

define(function(require){

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      Audio = require('secondary/index').sonyAudio;

  var module = {
    'init': function() {
      $('.sony-audio-player').each(function(){
        new SonyAudioPlayer(this);
      });
    }
  };

  var SonyAudioPlayer = function(element){

    var self = this;

    self.$el = $(element);
    self.init();

    log('SONY : SonyAudioPlayer : Initialized');
  };

  SonyAudioPlayer.prototype = {

    constructor: SonyAudioPlayer,

    init: function() {
      var self = this;
    }

  };

  return module;

});
