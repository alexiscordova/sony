
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
      SoundManager = require('soundManager');

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

      SoundManager.setup({
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
      _moduleCount = 0;

  var module = function (config) {

    _moduleCount = _moduleCount + 1;

    if ( !_controller ) {
      _controller = new SonyAudioController();
    }

    var moduleId = 'sonyAudio-' + _moduleCount,
        currentTime = 0,
        currentSound = {},
        configDefaults,
        initializeSource;

    // Define defaults for configuration object (`config`).

    configDefaults = {
      sources: {},
      oninit: function() {},
      onpause: function() {},
      onplay: function() {},
      onfinish: function() {}
    };

    // Extend `config` value over `configDefaults`

    config = $.extend(true, configDefaults, config);

    initializeSource = function(i) {
      SoundManager.createSound({
        id: moduleId + '-' + i,
        url: config.sources[i],
        autoLoad: false,
        autoPlay: false,
        volume: 25,
        onpause: function() {
          currentTime = this.position;
          config.onpause();
        },
        onplay: function() {
          config.onplay();
        },
        onresume: function() {
          config.onplay();
        },
        onfinish: function() {
          currentTime = 0;
          config.onfinish();
        }
      });
    };

    SoundManager.onready(function(){
      for ( var i in config.sources ) {
        initializeSource(i);
      }

      currentSound = SoundManager.getSoundById(moduleId + '-default');
    });

    // Public API
    // ----------

    var api = {

      // `Audio.play()`: Play the sound.
      //
      // * `source`: the key string corresponding to one of the audio sources.
      //     If not specified, plays the previously loaded source.

      play: function(source) {

        var self = this;

        if ( source ) {
          currentSound = SoundManager.getSoundById(moduleId + '-' + source);
        }

        // Wait until track is ready to play before attempting to play.

        if ( currentSound.readyState !== 3 ) {

          config.oninit();

          self.initInterval = setInterval(function(){
            if ( currentSound.readyState === 3 ) {
              self.play(source);
              clearInterval(self.initInterval);
            }
          }, 500);

          // The next two lines replaced `currentSound.load()`, which didn't
          // work well in mobile devices. Now it works, but mainly in isolation.
          // Multiple instances of sony-audio seem to be buggy, but we don't have
          // that use-case to account for at the moment. Noting this for a refactor
          // if we ever have to have two or more audio files at once.

          currentSound.setPosition(currentTime).play();
          self.pause();

          return self;
        }

        self.pause();

        currentSound.setPosition(currentTime).play();

        return self;
      },

      // `Audio.pause()`: Pause all sound. To prevent audio collisions, all audio is stopped when
      //     this method is called.

      pause: function() {

        var self = this;

        SoundManager.pauseAll();

        return self;
      },

      // `Audio.getPosition()`: Return the current track's position, in ms.

      getPosition: function() {

        var self = this;

        return currentSound.position;
      },

      // `Audio.getPosition()`: Return the current track's duration, in ms.

      getDuration: function() {

        var self = this;

        return currentSound.duration;
      },

      // `Audio.setPosition()`: Set the current track's position, in ms.
      //
      // * `newPosition`: integer position to set track to, in ms.

      setPosition: function(newPosition) {

        var self = this;

        if ( !currentSound.setPosition ) {
          return false;
        }

        currentSound.setPosition(newPosition);

        return self;
      },

      // `Audio.setVolume()`: Sets the current track's volume.
      //
      // * `newVolume`: integer volume, 0-100.

      setVolume: function(newVolume) {

        var self = this;

        if ( !currentSound.setVolume ) {
          return false;
        }

        currentSound.setVolume(newVolume);

        return self;
      }

    };

    return api;
  };

  return module;
});
