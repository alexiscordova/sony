define(function(require){

  var HotspotsController = require('modules/editorial-hotspots-e6/hotspots-controller');

  // Initialize Modules that don't require additional configuration.
  HotspotsController.init();

  // Return up a level if desired.
  return {
    HotspotsController: HotspotsController
  };
});