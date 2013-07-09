
// Promo: Clear Audio (PromoClearAudio) Module
// ---------------------------------------
//
// * **Version:** 0.1
// * **Modified:** 07/01/2013
// * **Author:** George Pantazis

define(function(require){

  'use strict';

  var $ = require('jquery');

  var module = {
    'init': function() {
      $('.promo-clearaudio').each(function(){
        new PromoClearAudio(this);
      });
    }
  };

  var PromoClearAudio = function(element){

    var self = this;

    self.$el = $(element);
    self.$audioPlayer = self.$el.find('.sony-audio-player');
    self.$audioControls = self.$el.find('.clear-audio-controls');

    self.init();

    log('SONY : PromoClearAudio : Initialized');
  };

  PromoClearAudio.prototype = {

    constructor: PromoClearAudio,

    init: function() {

      var self = this;

      self.$audioControls.on('click', '.activate', function(e){

        e.preventDefault();

        self.$el.addClass('demo-active');
        self.$audioPlayer.trigger('SonyAudioPlayer:play');
      });

      self.setupToggle('On', 'Off');

      return self;
    },

    // This should be moved into its own secondary module (`sony-toggle`)
    // for re-use. Left/right events could be subscribed to for SAP triggers below.

    setupToggle: function(rightLabel, leftLabel, position) {

      var self = this,
          $toggle = self.$audioControls.find('.toggle'),
          $label = $toggle.find('.toggle-label'),
          $slider = $toggle.find('.toggle-dial'),
          labels = [];

      if ( !position ) {
        position = 'right';
      }

      labels.left = leftLabel;
      labels.right = rightLabel;

      // Should be a separate method in a new `sony-toggle` module.

      var setToggle = function(newPosition) {
        position = newPosition;
        $label.html( labels[position] );
        $toggle.removeClass('left right').addClass(position);
      };

      setToggle(position);

      $toggle.on('click', function(e){
        e.preventDefault();
        if ( position === 'left' ) {
          setToggle('right');
          self.$audioPlayer.trigger('SonyAudioPlayer:play', 'default');
        } else {
          setToggle('left');
          self.$audioPlayer.trigger('SonyAudioPlayer:play', 'low');
        }
      });

      return $toggle;
    }
  };

  return module;

});
