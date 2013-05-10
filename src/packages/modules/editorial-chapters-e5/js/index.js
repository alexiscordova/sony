
define(function(require){

  var EditorialChapters = require('modules/editorial-chapters-e5/editorial-chapters-e5');

  // Initialize Modules that don't require additional configuration.
  EditorialChapters.init();

  // Return up a level if desired.
  return {
    EditorialChapters: EditorialChapters
  };
});
