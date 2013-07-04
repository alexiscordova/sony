
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
      SonyAudio = require('secondary/index').sonyAudio;

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

      self.audio = new SonyAudio({
        sources: {
          'default': 'http://ia700200.us.archive.org/22/items/DebroySomersBand-31-40/DebroySomersAndHisBand-WestwardBound.mp3',
          'low': 'http://ia700200.us.archive.org/22/items/DebroySomersBand-31-40/DebroySomersAndHisBand-WestwardBound.mp3'
        }
      });

      self.$el.on('click', '.start-play', function() {
        self.audio.play();
      });

      self.$el.on('click', '.high-quality', function() {
        self.audio.play('default');
      });

      self.$el.on('click', '.low-quality', function() {
        self.audio.play('low');
      });
    }
  };

  return module;

});
