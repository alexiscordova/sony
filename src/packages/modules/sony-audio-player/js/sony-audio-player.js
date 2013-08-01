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

define(function(require) {

  'use strict';

  var $ = require('jquery'),
    Modernizr = require('modernizr'),
    SonyDraggable = require('secondary/index').sonyDraggable,
    SonyAudio = require('secondary/index').sonyAudio;

  var SonyAudioPlayer = function(element) {

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

      if (self.$el.length > 1) {

        var instances = [];

        self.$el.each(function() {
          instances.push(new SonyAudioPlayer(this));
        });

        return instances;
      }

      self.bindNav();
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
          self.$el.trigger('SonyAudioPlayer:isPaused');
        },
        onplay: function() {
          self.$el.removeClass('paused').addClass('playing');
          self.$el.trigger('SonyAudioPlayer:isPlaying');
        },
        onfinish: function() {
          self.$el.removeClass('playing').addClass('paused');
          self.$el.trigger('SonyAudioPlayer:isPaused');
        }
      });

      self.bindModuleAPI(track)
        .bindModuleResponse()
        .setAlbumArt(which);

      return self;
    },

    // Returns a source list object from a provided set of `$sources`.

    getSourceList: function($sources) {

      var sourceList = {};

      $sources.each(function(a, b) {

        var key = $(this).text(),
          value = $(this).find('a').attr('href');

        sourceList[key] = value;
      });

      return sourceList;
    },

    // Binds the <nav> elements to the `track` object's API.

    bindNav: function() {

      var self = this;

      self.$el.on('click', '.play', function(e) {
        e.preventDefault();
        self.$el.trigger('SonyAudioPlayer:play');
      });

      self.$el.on('click', '.pause', function(e) {
        e.preventDefault();
        self.$el.trigger('SonyAudioPlayer:pause');
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

      self.$el.on('SonyAudioPlayer:play', function(e, setting) {
        track.play(setting);
      });

      self.$el.on('SonyAudioPlayer:pause', function(e) {
        track.pause();
      });

      self.$el.on('SonyAudioPlayer:getPosition', function(e, cb) {
        cb(track.getPosition());
      });

      self.$el.on('SonyAudioPlayer:getDuration', function(e, cb) {
        cb(track.getDuration());
      });

      self.$el.on('SonyAudioPlayer:setPosition', function(e, newPosition) {
        track.setPosition(newPosition);
      });

      return self;
    },

    // Listens for custom events and calls the appropriate UI methods in response.

    bindModuleResponse: function() {

      var self = this;

      self.$el.on('SonyAudioPlayer:isPlaying', function(e) {
        self.createScrubber();
      });

      self.$el.on('SonyAudioPlayer:isPaused', function(e) {
        self.removeScrubber();
      });

      return self;
    },

    // Gets track at 0-based position `which`, and sets the active album art to the
    // corresponding data object.

    setAlbumArt: function(which) {

      var self = this,
        $activeTrack = self.$el.find('.active-track'),
        $newAlbumArt = self.$el.find('.track').eq(which).find('img');

      $activeTrack.empty().append($newAlbumArt.clone());

      return self;
    },

    // Creates a scrubber overlay for the track, if `data-scrubber` is defined.

    createScrubber: function() {

      var self = this,
        $containment = self.$el.find('.sap-hit-area'),
        $scrubber = $containment.find('.scrubber'),
        bounds = {};

      bounds.x = {
        'min': 0,
        'max': 100
      };

      $containment.addClass('active');

      $scrubber.sonyDraggable({
        'axis': 'x',
        'unit': '%',
        'containment': $containment,
        'drag': $.proxy(self.onScrubberDrag, self),
        'bounds': bounds
      });

      return self;
    },

    // Responds to drag events from the scrubber, updating the playhead to
    // the current position.

    onScrubberDrag: function(e) {

      var self = this,
          newLeft = e.position.left;

      self.$el.trigger('SonyAudioPlayer:getDuration', function(duration) {
        self.$el.trigger('SonyAudioPlayer:setPosition', newLeft / 100 * duration);
      });

      return self;
    },

    // Remove the scrubber for the track, if it exists.

    removeScrubber: function() {

      var self = this,
        $containment = self.$el.find('.sap-hit-area');

      $containment.removeClass('active');

      $containment.find('.scrubber').sonyDraggable('destroy');

      return self;
    }
  };

  return SonyAudioPlayer;

});