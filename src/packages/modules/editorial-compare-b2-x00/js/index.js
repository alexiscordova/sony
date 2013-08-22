
define(function(require){

  var _EditorialCompare = require('modules/editorial-compare-b2-x00/editorial-compare-b2-x00');

  // Initialize Modules that don't require additional configuration.
  _EditorialCompare.init();

  // Return up a level if desired.
  return {
    EditorialCompare: _EditorialCompare
  };

});