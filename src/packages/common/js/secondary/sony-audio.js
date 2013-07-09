
// Sony Audio (SonyAudio) Component
// --------------------------------------------
//
// * **Class:** SonyAudio
// * **Version:** 0.1
// * **Author:** George Pantazis
//
// A shared interface and initializer for the SoundManager2 Library,
// for use on Sony.com.
//
// You may provide a set of different `sources` that can be toggled between,
// but note that these are intended to demonstrate sound effects, and not
// different bitrates; HTML5 Audio may incorrectly report file lengths and
// positions, particularly for longer tracks.
//
// You must provide a `default` source, as in the first example below.
//
// *Example Usage:*
//
//      var SonyAudio = require('secondary/index').sonyAudio;
//
//      var Audio = new SonyAudio({
//        sources: {
//          default: 'foo.mp3'
//        }
//      });
//
//      Audio.play();

define(function(require){

  'use strict';

  var $ = require('jquery'),
      sm = require('soundManager');

  // `SonyAudioController` prototype is the global sound player. All instances of `module` create an independent
  // instance of SonyAudio's API that interface back to the `SonyAudioController` object.

  var SonyAudioController = function(){

    var self = this;
    self.init();
  };

  SonyAudioController.prototype = {

    constructor: SonyAudioController,

    init: function() {

      var self = this;

      // These configuration settings are optimized for source-switching,
      // and provide Flash fallbacks where either <audio> or MP3 audio
      // (in the case of Mozilla) is poorly supported.

      sm.setup({
        flashVersion: 9,
        debugMode: false,
        debugFlash: false,
        url: 'swf',
        useFastPolling: true,
        flashPollingInterval: 200,
        useHighPerformance: true,
        preferFlash: false
      });

      return self;
    }

  };

  var _controller,
      _moduleCount = 0,
      _currentModule;

  var module = function (config) {

    _moduleCount = _moduleCount + 1;

    var moduleId = 'sonyAudio-' + _moduleCount,
        currentTime = 0,
        currentSound,
        onPause,
        onPlay;

    if ( !_controller ) {
      _controller = new SonyAudioController();
    }

    onPause = function() {
      currentTime = this.position;

      if ( config.onpause ) {
        config.onpause();
      }
    };

    onPlay = function() {
      if ( config.onplay ) {
        config.onplay();
      }
    };

    sm.onready(function(){
      for ( var i in config.sources ) {

        sm.createSound({
          id: moduleId + '-' + i,
          url: config.sources[i],
          autoLoad: true,
          autoPlay: false,
          onpause: onPause,
          onplay: onPlay,
          onresume: onPlay
        });
      }

      currentSound = sm.getSoundById(moduleId + '-default');
    });

    // Public API
    // ----------

    var api = {

      // `Audio.play()`: Play the sound.
      //
      // * `source`: the key string corresponding to one of the audio sources. If not specified,
      //             plays the previously loaded source.

      play: function(source) {

        var self = this;

        if ( source ) {
          currentSound = sm.getSoundById(moduleId + '-' + source);
        }

        self.pause();

        currentSound.setPosition(currentTime).play();

        return self;
      },

      // `Audio.pause()`: Pause all sound. To prevent audio collisions, all audio is stopped when
      //                  this method is called.

      pause: function() {

        var self = this;

        sm.pauseAll();

        return self;
      }
    };

    return api;
  };

  return module;
});
