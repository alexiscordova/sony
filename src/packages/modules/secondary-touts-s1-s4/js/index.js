
define(function(require){

  var SecondaryTouts = require('modules/secondary-touts-s1-s4/secondary-touts-s1-s4');

  // Initialize Modules that don't require additional configuration.
  SecondaryTouts.init();

  // Return up a level if desired.
  return {
    SecondaryTouts: SecondaryTouts
  };
});