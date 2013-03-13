
define(function(require){

  var PrimaryTout = require('modules/primary-tout-p1-d7/primary-tout-p1-d7');

  // Initialize Modules that don't require additional configuration.
  PrimaryTout.init();

  // Return up a level if desired.
  return {
    PrimaryTout: PrimaryTout
  };
});