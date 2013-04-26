
define(function(require){

  var AllElectronics = require('modules/all-electronics-z04/all-electronics-z04');

  // Initialize Modules that don't require additional configuration.
  AllElectronics.init();

  // Return up a level if desired.
  return {
    AllElectronics: AllElectronics
  };
});
