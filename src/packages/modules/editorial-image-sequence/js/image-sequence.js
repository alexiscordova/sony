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


  var sonySequence = {
    'init': function() {
      if ( window.atob || Settings.isLTIE10 ) {
        $( self.$controls ).find( '.table-center-wrap' ).addClass( 'ltie' );
      }

      $.extend(this, {}, sonySequence.defaults, sonySequence.settings);
      $( '.sony-sequence' ).each( function( index, el ) {
        var $el = $(this),
            data = $el.data();

        new SonySequence($el, {
          autoplay       : data.sequenceAutoplay || SonySequence.defaults.autoplay,
          viewcontrols   : data.sequenceViewcontrols || SonySequence.defaults.viewcontrols,
          barcontrols    : data.sequenceBarcontrols || SonySequence.defaults.barcontrols,
          loop           : data.sequenceLoop || SonySequence.defaults.loop,
          animationspeed : data.sequenceAnimationSpeed || SonySequence.defaults.speed,
          labelLeft      : data.sequenceLabelLeft || SonySequence.defaults.autoplay,
          labelRight     : data.sequenceLabelRight || SonySequence.defaults.autoplay
        });
      });
    }
  };

  var SonySequenceModule = function(element){

    var self = this;

    self.$el = $(element);
    self.init();

    log('SONY : SonySequence : Initialized');
  };

  // Defaults
  // --------
  sonySequence.defaults = {
    autoplay: false,
    viewcontrols: true,
    barcontrols: false,
    loop: false,
    speed: 100,
    labels: {
      left: 'Left',
      right: 'Right'
    }
  };

  return sonySequence;

});
