
define(function(require){

  var WhatsNewTout = require('modules/whats-new-tout-s4/whats-new-tout-s4');

  // Initialize Modules that don't require additional configuration.
  WhatsNewTout.init();

  // Return up a level if desired.
  return {
    WhatsNewTout: WhatsNewTout
  };
});