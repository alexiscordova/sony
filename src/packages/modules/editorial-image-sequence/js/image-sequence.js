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
      $( '.e360' ).each( function( index, el ) {
        var $el = $(this);

        new SonySequence($el, {
          autoplay       : $el.data('sequence-autoplay') || SonySequence.defaults.autoplay,
          viewcontrols   : $el.data('sequence-viewcontrols') || SonySequence.defaults.viewcontrols,
          barcontrols    : $el.data('sequence-barcontrols') || SonySequence.defaults.barcontrols,
          loop           : $el.data('sequence-loop') || SonySequence.defaults.loop,
          animationspeed : $el.data('sequence-animation-speed') || SonySequence.defaults.speed,
          labelLeft      : $el.data('sequence-label-left') || SonySequence.defaults.autoplay,
          labelRight     : $el.data('sequence-label-right') || SonySequence.defaults.autoplay
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
