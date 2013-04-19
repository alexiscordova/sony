
define(function(require){

  var LightCompare = require('modules/light-compare-d9/light-compare-d9');

  // Initialize Modules that don't require additional configuration.
  LightCompare.init();

  // Return up a level if desired.
  return {
    LightCompare: LightCompare
  };
});
