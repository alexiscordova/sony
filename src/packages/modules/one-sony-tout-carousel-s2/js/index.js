
define(function(require){

  var OneSonyToutCarousel = require('modules/one-sony-tout-carousel-s2/one-sony-carousel-s2');

  // Initialize Modules that don't require additional configuration.
  OneSonyToutCarousel.init();

  // Return up a level if desired.
  return {
    OneSonyToutCarousel: OneSonyToutCarousel
  };
});