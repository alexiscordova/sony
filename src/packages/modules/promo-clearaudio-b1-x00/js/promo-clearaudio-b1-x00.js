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

      return self;
    },

    bindAudioControls: function() {

      var self = this,
        $sonyAudioPlayer = self.$el.find('.sony-audio-player'),
        $clearAudioNav = self.$el.find('.clearaudio-player-controls');

      $clearAudioNav.on('click', '.clearaudio-play', function(e) {

        e.preventDefault();

        self.$el.addClass('playing');
        $sonyAudioPlayer.trigger('SonyAudioPlayer:play');
      });

      $clearAudioNav.on('click', '.clearaudio-pause', function(e) {

        e.preventDefault();

        self.$el.removeClass('playing');
        $sonyAudioPlayer.trigger('SonyAudioPlayer:pause');
      });

      return self;
    }
  };

  return module;

});