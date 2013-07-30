
define(function(require){

  var EditorialCompare = require('modules/editorial-compare-b2-x00/editorial-compare-b2-x00');

  // Initialize Modules that don't require additional configuration.
  EditorialCompare.init();

  // Return up a level if desired.
  return {
    EditorialCompare: EditorialCompare
  };

});