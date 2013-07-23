
define(function(require){

  var $ = require('jquery');
  var CarouselSequence = require('modules/carousel-sequence-b2/carousel-sequence-b2');

  // Initialize Modules that don't require additional configuration.
  $('.carousel-sequence').each(function() {
    new CarouselSequence( this );
  });

  // Return up a level if desired.
  return {
    CarouselSequence: CarouselSequence
  };
});