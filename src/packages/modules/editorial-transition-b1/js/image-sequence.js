/*jshint debug:true */

// ------------ Sony Image Sequencer ------------
// * **Module:** Cloned from the E360 jQuery plugin
// * **Version:** 0.0.1
// * **Modified:** 04/19/2013
// * **Author:** Kaleb White, Brian Kenny
// * **Dependencies:** jQuery 1.7+, Boostrap, Modernizr, Enquire, hammerJS, viewport
//
// *Example Usage:*
//
//      require('path/to/global/module') // self instantiation

define(function(require){

  'use strict';

  // provisions
  var $ = require( 'jquery' ),
      // iQ = require( 'iQ' ),
      Settings     = require( 'require/sony-global-settings' ),
      SonySequence = require('secondary/index').sonySequence,
      SonySliderControl = require('secondary/index').sonySliderControl;
      // Favorites    = require('secondary/index').sonyFavorites,
      // hammer       = require( 'plugins/index' ).hammer;


  var sonySequence = {
    init: function() {
      if ( window.atob || Settings.isLTIE10 ) {
        $( this.$controls ).find( '.table-center-wrap' ).addClass( 'ltie' );
      }

      $.extend(this, {}, sonySequence.defaults, sonySequence.settings);

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

        new SonySequence($el, opts);
        new SonySliderControl($el, opts);
      });
    }
  };

  var SonySequenceModule = function(element) {

    var self = this;

    self.$el = $(element);
    self.init();

    log('SONY : SonySequence : Initialized');
  };

  return sonySequence;

});
