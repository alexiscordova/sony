
define(function(require){

  var EditorialCarouselE13 = require('modules/editorial-carousel-e13/editorial-carousel-e13');

  // Initialize Modules that don't require additional configuration.
  EditorialCarouselE13.init();

  // Return up a level if desired.
  return {
    EditorialCarouselE13: EditorialCarouselE13
  };
});