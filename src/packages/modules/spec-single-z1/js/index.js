
define(function(require){

  var SpecSingle = require('modules/spec-single-z1/spec-single-z1');

  // Initialize Modules that don't require additional configuration.
  SpecSingle.init();

  // Return up a level if desired.
  return {
    SpecSingle: SpecSingle
  };
});