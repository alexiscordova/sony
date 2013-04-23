
define(function(require){

  _AlertModule = require('modules/cookie-policy/alert-module');

  // Initialize Modules that don't require additional configuration.
  _AlertModule.init();

  // Return up a level if desired.
  return {
    AlertModule: _AlertModule
  };
});
