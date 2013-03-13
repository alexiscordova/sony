
define(function(require){

  var GlobalHeaderFooter = require('modules/global-header-footer/global-header-footer');

  // Initialize Modules that don't require additional configuration.
  GlobalHeaderFooter.init();

  // Return up a level if desired.
  return {
    GlobalHeaderFooter: GlobalHeaderFooter
  };
});