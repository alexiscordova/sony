
define(function(require){

  var MarketingConvergenceModule = require('modules/ux-marketing-convergence-e14/ux-marketing-convergence-e14');

  // Initialize Modules that don't require additional configuration.
  MarketingConvergenceModule.init();

  // Return up a level if desired.
  return {
    MarketingConvergenceModule: MarketingConvergenceModule
  };
});