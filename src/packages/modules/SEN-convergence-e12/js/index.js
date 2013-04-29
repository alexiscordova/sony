define(function(require){

  var SenConvergence = require('modules/SEN-convergence-e12/SEN-convergence-e12');

  // Initialize Modules that don't require additional configuration.
  SenConvergence.init();

  // Return up a level if desired.
  return {
    SenConvergence: SenConvergence
  };
});
