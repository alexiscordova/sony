
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
        url: 'swf',
        useFastPolling: true,
        flashPollingInterval: 200,
        useHighPerformance: true,
        preferFlash: true
      });

      return self;
    }

  };

  var _controller,
      _moduleCount = 0,
      _currentModule,
      _currentSound;

  var module = function (config) {

    _moduleCount = _moduleCount + 1;

    var moduleId = 'sonyAudio-' + _moduleCount,
        currentTime = 0;

    if ( !_controller ) {
      _controller = new SonyAudioController();
    }

    var sources = {},
        sourceCount = 0,
        setCurrentTime;

    setCurrentTime = function(a,b) {
      currentTime = sources[this.sonyAudioID].position;
    };

    sm.onready(function(){
      for ( var i in config.sources ) {

        sourceCount = sourceCount + 1;

        sources[i] = sm.createSound({
          id: moduleId + '-' + i,
          url: config.sources[i],
          autoLoad: true,
          autoPlay: false,
          onpause: setCurrentTime
        });

        sources[i].sonyAudioID = i;
      }
    });

    var api = {

      current: 'default',

      play: function(source) {

        var self = this;

        if ( !source ) {
          source = self.current;
        }

        sm.pauseAll();

        // EOD stopping point, this refuses to sync in flash. Not sure what's up.
        sm.getSoundById(moduleId + '-' + source).setPosition(currentTime).play();

        self.current = source;
        _currentSound = sources[source];

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
