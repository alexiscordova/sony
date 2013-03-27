
define(function(require){

  var EditorialDualViewer = require('modules/editorial-dual-viewer-e9/editorial-dual-viewer-e9');

  // Initialize Modules that don't require additional configuration.
  EditorialDualViewer.init();

  // Return up a level if desired.
  return {
    EditorialDualViewer: EditorialDualViewer
  };
});