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

define(function(require) {

  'use strict';

  // provisions
  var $ = require('jquery'),
    Settings = require('require/sony-global-settings'),
    Environment = require('require/sony-global-environment'),
    SonySequence = require('secondary/index').sonySequence;

  var EditorialTransition = function(element) {
    var self = this;

    self.$el = $(element);
    self.idleTimer = 0;

    self.init();
  };

  EditorialTransition.prototype = {
    init: function() {
      var self = this;

      // initialize the sequence
      self.sequence = new SonySequence(self.$el, {
        loop: false
      });

      self.$sequenceHotspotContainer = self.$el.find('.sequence-hotspot-container');
      self.$sequenceHotspots = self.$sequenceHotspotContainer.find('.sequence-hotspots');

      self.initBindings();
      self.updateHotspotsContainer();
      self.createSliderAnchors();
    },

    createSliderAnchors: function() {

      var self = this,
          $labelContainer = self.$el.find('.label-data'),
          $labels = $labelContainer.find('i'),
          $label, $sliderPosition, $sliderIcon;

      $labels.each(function(){

        $label = $(this);

        $sliderIcon = $('<i/>');
        $sliderIcon.addClass($label.data('label'));

        $sliderPosition = $('<a/>');
        $sliderPosition.data('position', $label.data('id') / (self.sequence.sequenceLength - 1) * 100);
        $sliderPosition.append($sliderIcon);

        self.$el.find('.sony-slide-nav').append($sliderPosition);
      });

      self.$el.find('.sony-slide-nav').trigger('SonySlideNav:update');
    },

    initBindings: function() {
      var self = this,
        $labels;

      self.$el.on('SonySequence:stop-sequence', function() {
        // we're done animating so we can set isAnimating to false
        self.isAnimating = false;
      });

      self.$el.find('.sony-slide-nav').on('SonySlideNav:drag', function(e, sliderPosition) {
        self.handleSliderDrag(Math.round(sliderPosition / 100 * (self.sequence.sequenceLength - 1)));
      });

      Environment.on('global:resizeDebounced', $.proxy(self.onResize, self));
    },

    onResize: function() {
      this.updateHotspotsContainer();
    },


    getCurrentHotspotsContainer: function() {
      var self = this;

      // loop through our sequence hotspots and see which one has our current
      // index!
      for (var _i = 0; _i < self.$sequenceHotspots.length; _i++) {
        var $el = self.$sequenceHotspots.eq(_i),
          elData = $el.data();

        // once we have our sequence hotspots return them
        if (elData.id === self.sequence.curIndex) {
          return $el;
        }
      }
    },

    hideHotspots: function() {
      var self = this;

      self.$sequenceHotspots.addClass('inactive visuallyhidden');
    },

    updateHotspotsContainer: function() {
      var $hotspotsContainer = this.getCurrentHotspotsContainer(),
        trackingAsset = this.$el.find('.image-module[data-sequence-id=' + this.sequence.curIndex + ']'),
         assetH = trackingAsset.height();

      // we must not have any hotspots defined, so lets just close out
      if (!$hotspotsContainer) {
        return;
      }

      $hotspotsContainer.closest('.sequence-hotspot-container').css({
        height: assetH
      });
    },

    updateCurrentHotspots: function() {
      var self = this,
        $hotspotsContainer;

      // if we have already shown the hotspots
      if (self.showHotspots === false) {
        return false;
      }
      self.$el.find('.hotspot-module').trigger('HotspotsController:reset');

      $hotspotsContainer = self.getCurrentHotspotsContainer();

      // we have sequence hotspots we can display them
      if ( $hotspotsContainer ) {

        $hotspotsContainer.removeClass('visuallyhidden inactive')
          .siblings().addClass('visuallyhidden inactive'); //There's no fade, is that what we want?
      }
      else {
        self.hideHotspots();
      }

      // weve shown the goods already
      self.showHotspots = false;
    },

    handleSliderDrag: function(position) {
      var self = this;

      self.idleTimer = 0;
      self.showHotspots = true;

      self.sequence.move(position);
      self.updateCurrentHotspots();
    }
  };

  return EditorialTransition;
});