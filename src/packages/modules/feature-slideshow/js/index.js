
define(function(require){

  var $ = require('jquery');
  var FeatureSlideshow = require('modules/feature-slideshow/feature-slideshow');

  // Initialize Modules that don't require additional configuration.
  $('.fs-module').each(function() {
    new FeatureSlideshow( this );
  });

  // Return up a level if desired.
  return {
    FeatureSlideshow: FeatureSlideshow
  };
});