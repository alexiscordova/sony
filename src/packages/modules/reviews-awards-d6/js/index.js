
define(function(require){

  var ReviewsAwards = require('modules/reviews-awards-d6/reviews-awards-d6');

  // Initialize Modules that don't require additional configuration.
  ReviewsAwards.init();

  // Return up a level if desired.
  return {
    ReviewsAwards: ReviewsAwards
  };
});