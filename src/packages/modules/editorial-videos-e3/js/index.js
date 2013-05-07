
define(function(require){

  var EditorialVideo = require('modules/editorial-videos-e3/editorial-videos-e3');

  // Initialize Modules that don't require additional configuration.
  EditorialVideo.init();

  // Return up a level if desired.
  return {
    EditorialVideo: EditorialVideo
  };
});