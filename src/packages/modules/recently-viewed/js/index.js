
define(function(require){

  var RecentlyViewed = require('modules/recently-viewed/recently-viewed');

  // Initialize Modules that don't require additional configuration.
  RecentlyViewed.init();

  // Return up a level if desired.
  return {
    RecentlyViewed: RecentlyViewed
  };
});