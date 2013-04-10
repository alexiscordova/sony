
define(function(require){

  var EditorialSlideshow = require('modules/editorial-chapters-e5/editorial-chapters-e5');

  // Initialize Modules that don't require additional configuration.
  EditorialSlideshow.init();

  // Return up a level if desired.
  return {
    EditorialSlideshow: EditorialSlideshow
  };
});