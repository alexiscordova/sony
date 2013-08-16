
define(function(require){

  var SlideshowImageCaption = require('modules/slideshow-image-caption-b3-x00/slideshow-image-caption-b3-x00');

  // Initialize Modules that don't require additional configuration.
  SlideshowImageCaption.init();

  // Return up a level if desired.
  return {
    SlideshowImageCaption: SlideshowImageCaption
  };

});