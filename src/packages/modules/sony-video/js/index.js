
define(function(require){

  var SonyVideo = require('modules/sony-video/sony-video');

  // Initialize Modules that don't require additional configuration.
  SonyVideo.init();

  // Return up a level if desired.
  return {
    SonyVideo: SonyVideo
  };
});