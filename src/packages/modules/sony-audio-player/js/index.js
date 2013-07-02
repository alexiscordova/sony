
define(function(require){

  var SonyAudioPlayer = require('modules/sony-audio-player/sony-audio-player');

  // Initialize Modules that don't require additional configuration.
  SonyAudioPlayer.init();

  // Return up a level if desired.
  return {
    SonyAudioPlayer: SonyAudioPlayer
  };
});