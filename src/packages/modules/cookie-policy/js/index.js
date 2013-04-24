/*jshint debug:true */

define(function(require){

  var AlertModule = require('modules/cookie-policy/alert-module');

  // Initialize Modules that don't require additional configuration.
  AlertModule.init();

  return {
    AlertModule: AlertModule
  };
});
