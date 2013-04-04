
define(function(require){

  var editorial = require('modules/editorial-layouts-e1/editorial-layouts-e1');

  // Initialize Modules that don't require additional configuration.
  Editorial.init();

  // Return up a level if desired.
  return {
    Editorial: Editorial
  };
});