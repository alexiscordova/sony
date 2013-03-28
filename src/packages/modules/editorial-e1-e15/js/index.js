
define(function(require){

  var editorial = require('modules/editorial-e1-e15/editorial-e1-e15');

  // Initialize Modules that don't require additional configuration.
  Editorial.init();

  // Return up a level if desired.
  return {
    Editorial: Editorial
  };
});