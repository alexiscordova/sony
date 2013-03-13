
define(function(require){

  var TertiaryModule = require('modules/tertiary-tout-t1-t5/tertiary-t1-t5-module');

  // Initialize Modules that don't require additional configuration.
  TertiaryModule.init();

  return {
    TertiaryModule: TertiaryModule
  };
});