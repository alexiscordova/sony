
define(function(require){

  var ExplodedView = require('modules/exploded-view-b2/exploded-view-b2');

  // Initialize Modules that don't require additional configuration.
  ExplodedView.init();

  // Return up a level if desired.
  return {
    ExplodedView: ExplodedView
  };

});