
define(function(require){

  var $ = require('jquery');
  var FeatureSlideshow = require('modules/feature-slideshow-b1-x00/feature-slideshow-b1-x00');

  // Initialize Modules that don't require additional configuration.
  $('.fs-module').each(function() {
    new FeatureSlideshow( this );
  });

  // Return up a level if desired.
  return {
    FeatureSlideshow: FeatureSlideshow
  };
});