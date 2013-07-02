
define(function(require){

  var $ = require('jquery');
  var EditorialFeatureList = require('modules/editorial-feature-list/editorial-feature-list');

  // Initialize Modules that don't require additional configuration.
  $('.efl-module').each(function() {
    new EditorialFeatureList( this );
  });

  // Return up a level if desired.
  return {
    EditorialFeatureList: EditorialFeatureList
  };
});