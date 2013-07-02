define(function(require){

  var Editorial360Viewer = require('modules/editorial-360viewer-e8/360viewer-controller');

  // Initialize Modules that don't require additional configuration.
  Editorial360Viewer.init();

  // Return up a level if desired.
  return {
    Editorial360Viewer: Editorial360Viewer
  };
});