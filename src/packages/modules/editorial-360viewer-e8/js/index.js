define(function(require){

  var HotspotsController = require('modules/editorial-360viewer-e8/360viewer-controller');

  // Initialize Modules that don't require additional configuration.
  HotspotsController.init();

  // Return up a level if desired.
  return {
    HotspotsController: HotspotsController
  };
});