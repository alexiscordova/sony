
define(function(require){

  var Demo = require('modules/demo-x99/demo-x99');

  // Initialize Modules that don't require additional configuration.
  Demo.init();

  // Return up a level if desired.
  return {
    Demo: Demo
  };

});