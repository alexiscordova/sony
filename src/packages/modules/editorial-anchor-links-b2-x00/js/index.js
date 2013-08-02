
define(function(require){

  var EditorialAnchorLinks = require('modules/editorial-anchor-links-b2-x00/editorial-anchor-links-b2-x00');

  // Initialize Modules that don't require additional configuration.
  EditorialAnchorLinks.init();

  // Return up a level if desired.
  return {
    EditorialAnchorLinks: EditorialAnchorLinks
  };
});