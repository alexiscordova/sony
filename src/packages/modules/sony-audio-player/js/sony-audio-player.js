
// Sony Audio Player (SonyAudioPlayer) Module
// --------------------------------------------
//
// * **Class:** SonyAudioPlayer
// * **Version:** 0.1
// * **Modified:** 07/01/2013
// * **Author:** George Pantazis
// * **Dependencies:** jQuery 1.7+
//
// This module provides a UI interface for controlling an instance of the
// global `SonyAudio` module.

define(function(require){

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      SonyAudio = require('secondary/index').sonyAudio;

  var SonyAudioPlayer = function(element){

    var self = this,
        init;

    init = self.init(element);

    log('SONY : SonyAudioPlayer : Initialized');

    return init;
  };

  SonyAudioPlayer.prototype = {

    constructor: SonyAudioPlayer,

    // Initializes the module and sets the player to the first track.
    // Returns an array of instances of itself, given multiple elements.

    init: function(element) {

      var self = this;

      self.$el = $(element);

      if ( self.$el.length > 1 ) {

        var instances = [];

        self.$el.each(function(){
          instances.push(new SonyAudioPlayer(this));
        });

        return instances;
      }

      self.setTrack(0);

      return self;
    },

    // Gets track at 0-based position `which`, and initializes the audio for that track.
    // Binds track to the nav and the API, and updates album art.

    setTrack: function(which) {

      var self = this,
          $track = self.$el.find('.track').eq(which),
          $sources = $track.find('.source');

      // Create audio track with provided sources.

      var track = new SonyAudio({
        sources: self.getSourceList($sources),
        onpause: function() {
          self.$el.removeClass('playing').addClass('paused');
        },
        onplay: function() {
          self.$el.removeClass('paused').addClass('playing');
        },
        onfinish: function() {
          self.$el.removeClass('playing').addClass('paused');
        }
      });

      self.bindNav(track);
      self.bindModuleAPI(track);
      self.setAlbumArt(which);

      return self;
    },

    // Returns a source list object from a provided set of `$sources`.

    getSourceList: function($sources) {

      var sourceList = {};

      $sources.each(function(a,b){

        var key = $(this).text(),
            value = $(this).find('a').attr('href');

        sourceList[key] = value;
      });

      return sourceList;
    },

    // Binds the <nav> elements to the `track` object's API.

    bindNav: function(track) {

      var self = this;

      self.$el.on('click', '.play', function(e) {
        e.preventDefault();
        track.play();
      });

      self.$el.on('click', '.pause', function(e) {
        e.preventDefault();
        track.pause();
      });

      return self;
    },

    // Creates an Event-driven API of custom events that can be triggered by
    // modules that are using `SonyAudioPlayer` as a submodule.
    //
    // *Example Usage:*
    //
    //      // Just play.
    //      $('#audio-player').trigger('SonyAudioPlayer:play');
    //
    //      // Switch source to `lowQuality` and play.
    //      $('#audio-player').trigger('SonyAudioPlayer:play', 'lowQuality');

    bindModuleAPI: function(track) {

      var self = this;

      self.$el.on('SonyAudioPlayer:play', function(e, setting){
        track.play(setting);
      });

      return self;
    },

    // Gets track at 0-based position `which`, and sets the active album art to the
    // corresponding data object.

    setAlbumArt: function(which) {

      var self = this;

      self.$el.css({
        backgroundImage: 'url('+self.$el.find('.track').eq(which).data('album-art')+')'
      });

      return self;
    }
  };

  return SonyAudioPlayer;

});
