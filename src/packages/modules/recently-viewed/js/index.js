
define(function(require){

  _recentlyViewed = require('modules/recently-viewed/recently-viewed');

  // Initialize Modules that don't require additional configuration.
  _recentlyViewed.init();

  // Return up a level if desired.
  return {
    RecentlyViewed: _recentlyViewed
  };

});