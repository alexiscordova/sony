define(function(require){

  // Initialize Modules that don't require additional configuration.
  var $ = require('jquery');
  var EditorialTransition = require('modules/editorial-transition-b1-x00/image-sequence');

  $( '.sony-sequence' ).each( function( index, el ) {
    var $el = $(el),
        data = $el.data(),
        opts = {};

    // since users have the ability to pass in true // false for some options we cannot simply
    // check if (options) { do stuff }, since if they set the option to false it will affect the
    // overall functionality. Also we do not want to pass in options when the users avoid
    // adding them to the jade.
    if (data.sequenceAutoplay != 'undefined') { opts.autoplay = data.sequenceAutoplay; }
    if (data.sequenceViewcontrols != 'undefined') { opts.viewcontrols = data.sequenceViewcontrols; }
    if (data.sequenceBarcontrols != 'undefined') { opts.barcontrols = data.sequenceBarcontrols; }
    if (data.sequenceLoop != 'undefined') { opts.loop = data.sequenceLoop; }
    if (data.sequenceAnimationSpeed != 'undefined') { opts.animationspeed = data.sequenceAnimationSpeed; }
    if (data.sequenceLabelLeft) { opts.labelLeft = data.sequenceLabelLeft; }
    if (data.sequenceLabelRight) { opts.labelRight = data.sequenceLabelRight; }

    new EditorialTransition($el, opts);

  });

  // Return up a level if desired.
  return {
    EditorialTransition: EditorialTransition
  };
});
