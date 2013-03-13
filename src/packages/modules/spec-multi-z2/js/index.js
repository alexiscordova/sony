
define(function(require){

  var SpecMulti = require('modules/spec-multi-z2/spec-multi-z2');

  // Initialize Modules that don't require additional configuration.
  SpecMulti.init();

  // Return up a level if desired.
  return {
    SpecMulti: SpecMulti
  };
});