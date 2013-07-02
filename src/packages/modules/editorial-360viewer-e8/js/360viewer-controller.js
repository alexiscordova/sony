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
      iQ = require( 'iQ' ),
      Settings     = require( 'require/sony-global-settings' ),
      SonySequence = require('secondary/index').sonySequence,
      Favorites    = require('secondary/index').sonyFavorites,
      hammer       = require( 'plugins/index' ).hammer;

  var self = {
    'init': function() {

      // IE 10 detection
      if ( window.atob || Settings.isLTIE10 ) {
        $( self.$controls ).find( '.table-center-wrap' ).addClass( 'ltie' );
      }

      // detect if there are 360 viewer constructs on the DOM
      $( '.e360' ).each( function( index, el ) {
        //for each instance, initialize
        var $el = $(this),
            data = $el.data();

        // get options to set the SonySequence
        self.autoplay       = data.sequenceAutoplay ? data.sequenceAutoplay : false;
        self.viewcontrols   = data.sequenceViewcontrols ? data.sequenceViewcontrols : true;
        self.barcontrols    = data.sequenceBarcontrols ? data.sequenceBarcontrols : false;
        self.loop           = data.sequenceLoop ? data.sequenceLoop : false;
        self.animationspeed = data.sequenceAnimationSpeed ? data.sequenceAnimationSpeed : 100;
        self.labelLeft      = data.sequenceLabelLeft ? data.sequenceLabelLeft : null;
        self.labelRight     = data.sequenceLabelRight ? data.sequenceLabelRight : null;

        self.editorial360 = new SonySequence( el, {
          autoplay: self.autoplay,
          viewcontrols: self.viewcontrols,
          barcontrols: self.barcontrols,
          loop: self.loop,
          speed: self.animationspeed,
          labels: {
            left: self.labelLeft,
            right: self.labelRight
          }
        });
      });
    }
  };

  // Non override-able settings
  // --------------------------

  return self;

});
