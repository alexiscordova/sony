
define(function(require){

  var $ = require('jquery');
  var CarouselSequence = require('modules/story-sequence-b2-x00/story-sequence-b2-x00');

  // Initialize Modules that don't require additional configuration.
  $('.carousel-sequence').each(function() {
    new CarouselSequence( this );
  });

  // Return up a level if desired.
  return {
    CarouselSequence: CarouselSequence
  };
});