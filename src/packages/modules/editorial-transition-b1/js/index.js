define(function(require){

  var SonyImageSequence = require('modules/editorial-transition-b1/image-sequence');

  // Initialize Modules that don't require additional configuration.
  SonyImageSequence.init();

  // Return up a level if desired.
  return {
    SonyImageSequence: SonyImageSequence
  };
});
