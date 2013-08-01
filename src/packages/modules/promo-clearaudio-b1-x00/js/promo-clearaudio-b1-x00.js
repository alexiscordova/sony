// Promo: Clear Audio (PromoClearAudio) Module
// ---------------------------------------
//
// * **Version:** 0.1
// * **Modified:** 07/01/2013
// * **Author:** George Pantazis

define(function(require) {

  'use strict';

  var $ = require('jquery');

  var module = {
    'init': function() {
      $('.promo-clearaudio').each(function() {
        new PromoClearAudio(this);
      });
    }
  };

  var PromoClearAudio = function(element) {

    var self = this;

    self.$el = $(element);
    self.init();

    log('SONY : PromoClearAudio : Initialized');
  };

  PromoClearAudio.prototype = {

    constructor: PromoClearAudio,

    init: function() {

      var self = this;

      self.bindAudioControls();
      self.bindAudioResponse();

      return self;
    },

    bindAudioControls: function() {

      var self = this,
        $sonyAudioPlayer = self.$el.find('.sony-audio-player'),
        $clearAudioNav = self.$el.find('.clearaudio-player-controls');

      $clearAudioNav.on('click', '.clearaudio-play', function(e) {
        e.preventDefault();
        $sonyAudioPlayer.trigger('SonyAudioPlayer:play');
      });

      $clearAudioNav.on('click', '.clearaudio-pause', function(e) {
        e.preventDefault();
        $sonyAudioPlayer.trigger('SonyAudioPlayer:pause');
      });

      return self;
    },

    bindAudioResponse: function() {

      var self = this,
        $sonyAudioPlayer = self.$el.find('.sony-audio-player');

      $sonyAudioPlayer.on('SonyAudioPlayer:isPaused', function(){
        self.$el.removeClass('playing');
      });

      $sonyAudioPlayer.on('SonyAudioPlayer:isPlaying', function(){
        self.$el.addClass('playing');
      });

      return self;
    }
  };

  return module;

});