
// Sony Audio (SonyAudio) Component
// --------------------------------------------
//
// * **Class:** SonyAudio
// * **Version:** 0.1
// * **Author:** George Pantazis
//
// Documentation to come.
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
        setCurrentTime;

    if ( !_controller ) {
      _controller = new SonyAudioController();
    }

    setCurrentTime = function() {
      currentTime = this.position;
    };

    sm.onready(function(){
      for ( var i in config.sources ) {

        sm.createSound({
          id: moduleId + '-' + i,
          url: config.sources[i],
          autoLoad: true,
          autoPlay: false,
          whileplaying: setCurrentTime
        });
      }

      currentSound = sm.getSoundById(moduleId + '-default');
    });

    var api = {

      play: function(source) {

        var self = this;

        if ( source ) {
          currentSound = sm.getSoundById(moduleId + '-' + source);
        }

        sm.pauseAll();

        currentSound.setPosition(currentTime).play();

        return self;
      },

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
