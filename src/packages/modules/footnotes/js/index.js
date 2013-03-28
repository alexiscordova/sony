
define(function(require){

  var FootnotesModule = require('modules/footnotes/footnotes-module');

  // Initialize Modules that don't require additional configuration.
  FootnotesModule.init();

  return {
    FootnotesModule: FootnotesModule
  };
});