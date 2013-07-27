
define(function(require){

  var PromoClearAudio = require('modules/promo-clearaudio-b1-x00/promo-clearaudio-b1-x00');

  // Initialize Modules that don't require additional configuration.
  PromoClearAudio.init();

  // Return up a level if desired.
  return {
    PromoClearAudio: PromoClearAudio
  };
});