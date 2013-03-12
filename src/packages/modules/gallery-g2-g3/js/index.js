
define(function(require){

  var Gallery = require('modules/gallery-g2-g3/gallery-g2-g3');

  // Initialize Modules that don't require additional configuration.
  Gallery.init();

  // Return up a level if desired.
  return {
    Gallery: Gallery
  };
});