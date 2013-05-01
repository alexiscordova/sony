define(function(require){

  var SearchResults = require('modules/search-results-z07/search-results-z07');

  // Initialize Modules that don't require additional configuration.
  SearchResults.init();

  // Return up a level if desired.
  return {
    SearchResults: SearchResults
  };
});
