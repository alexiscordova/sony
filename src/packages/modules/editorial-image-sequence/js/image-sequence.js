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
        var $el = $(this);

        // get options to set the SonySequence
        self.autoplay       = $el.data('sequence-autoplay') ? $el.data('sequence-autoplay') : false;
        self.viewcontrols   = $el.data('sequence-viewcontrols') ? $el.data('sequence-viewcontrols') : false;
        self.barcontrols    = $el.data('sequence-barcontrols') ? $el.data('sequence-barcontrols') : false;
        self.loop           = $el.data('sequence-loop') ? $el.data('sequence-loop') : false;
        self.animationspeed = $el.data('sequence-animation-speed') ? $el.data('sequence-animation-speed') : 100;
        self.labelLeft      = $el.data('sequence-label-left') ? $el.data('sequence-label-left') : null;
        self.labelRight     = $el.data('sequence-label-right') ? $el.data('sequence-label-right') : null;

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
