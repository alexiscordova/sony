
define(function(require){

  var PDPSlideShow = require('modules/pdp-slideshow-d04/pdp-slideshow-d04');

  // Initialize Modules that don't require additional configuration.
  PDPSlideShow.init();

  // Return up a level if desired.
  return {
    PDPSlideShow: PDPSlideShow
  };
});