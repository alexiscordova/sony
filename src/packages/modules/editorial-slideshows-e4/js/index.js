
define(function(require){

  var EditorialSlideshow = require('modules/editorial-slideshows-e4/editorial-slideshows-e4');

  // Initialize Modules that don't require additional configuration.
  EditorialSlideshow.init();

  // Return up a level if desired.
  return {
    EditorialSlideshow: EditorialSlideshow
  };
});