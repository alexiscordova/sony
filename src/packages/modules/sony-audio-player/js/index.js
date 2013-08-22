
// Sony Audio Player (SonyAudioPlayer) Index
// -----------------------------------------

define(function(require){

  var SonyAudioPlayer = require('modules/sony-audio-player/sony-audio-player');

  var $elements = $('.sony-audio-player');

  new SonyAudioPlayer($elements);
});