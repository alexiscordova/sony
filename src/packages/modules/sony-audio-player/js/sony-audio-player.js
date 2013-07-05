
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
    self.$tracks = self.$el.find('.track');
    self.$nav = self.$el.find('nav');
    self.$sourceSelect = self.$nav.find('select');

    self.init();

    log('SONY : SonyAudioPlayer : Initialized');
  };

  SonyAudioPlayer.prototype = {

    constructor: SonyAudioPlayer,

    init: function() {

      var self = this;

      self.currentTrack = 0;
      self.setTrack(0);
    },

    setTrack: function(which) {

      var self = this,
          $track = self.$tracks.eq(which),
          $sources = $track.find('.source'),
          sourceList = {};

      // START: The below should be moved into a trackInit method;
      // we wouldn't want to call (most of) it multiple times.

      self.$sourceSelect.empty();

      $sources.each(function(a,b){

        var key = $(this).text(),
            value = $(this).find('a').attr('href');

        sourceList[key] = value;

        self.$sourceSelect.append('<option value="'+key+'">'+key+'</option>');
      });

      var track = new SonyAudio({
        sources: sourceList
      });

      self.$el.on('click', '.play', function(e) {
        e.preventDefault();
        track.play('default');
      });

      self.$el.on('change', 'select', function(){
        track.play($(this).val());
      });

      // END

      self.setAlbumArt(which);
    },

    setAlbumArt: function(which) {

      var self = this;

      self.$el.css({
        backgroundImage: 'url('+self.$tracks.eq(which).data('album-art')+')'
      });
    }
  };

  return module;

});
