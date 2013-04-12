
define(function(require){

  var SpecMulti = require('modules/unsupported-z19/unsupported-z19');

  // Initialize Modules that don't require additional configuration.
  SpecMulti.init();

  // Return up a level if desired.
  return {
    SpecMulti: SpecMulti
  };
});
