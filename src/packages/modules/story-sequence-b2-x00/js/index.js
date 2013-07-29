
define(function(require){

  var $ = require('jquery');
  var StorySequence = require('modules/story-sequence-b2-x00/story-sequence-b2-x00');

  // Initialize Modules that don't require additional configuration.
  $('.story-sequence').each(function() {
    new StorySequence( this );
  });

  // Return up a level if desired.
  return {
    StorySequence: StorySequence
  };
});