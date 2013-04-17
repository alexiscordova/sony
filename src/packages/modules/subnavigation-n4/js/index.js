
define(function(require){

  var Subnavigation = require('modules/subnavigation-n4/subnavigation-n4');

  // Initialize Modules that don't require additional configuration.
  Subnavigation.init();

  // Return up a level if desired.
  return {
    Subnavigation: Subnavigation
  };
});