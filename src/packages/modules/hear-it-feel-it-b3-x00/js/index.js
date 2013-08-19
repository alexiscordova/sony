
define(function(require){

  var HearItFeelIt = require('modules/hear-it-feel-it-b3-x00/hear-it-feel-it-b3-x00');

  // Initialize Modules that don't require additional configuration.
  HearItFeelIt.init();

  // Return up a level if desired.
  return {
    HearItFeelIt: HearItFeelIt
  };

});