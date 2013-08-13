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
        loop: false,
        speed: 100
      });

      self.$sequenceNoteContainer = self.$el.find('.sequence-note-container');
      self.$sequenceNotes = self.$sequenceNoteContainer.find('.sequence-notes');

      // initalize bindings
      var domReady = function() {
        self.initBindings();
        self.followSequenceNotes();
      };

      // TODO: This is temporary, should be moved to its own method.

      var $labelContainer = self.$el.find('.label-data');
      var labels = $labelContainer.find('i');

      for (var _i = 0; _i < labels.length; _i++) {

        var $el = $(labels[_i]),
          elData = $el.data();

        var $sliderPosition = $('<a/>');
        var $sliderIcon = $('<i/>');

        $sliderPosition.data('id', elData.id);
        $sliderPosition.data('position', elData.id / (self.sequence.sequenceLength - 1) * 100);
        $sliderIcon.addClass(elData.label);
        $sliderPosition.append($sliderIcon);

        self.$el.find('.sony-slide-nav').append($sliderPosition);

      }

      self.$el.find('.sony-slide-nav').trigger('SonySlideNav:update');

      $(domReady);
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
      this.followSequenceNotes();
    },

    // gets the sequence notes which are in a cached jquery object and loops
    // through though to get each of the notes positioning so it can be placed
    // on the view.
    getSequenceNotes: function() {
      var self = this;

      // loop through our sequence notes and see which one has our current
      // index!
      for (var _i = 0; _i < self.$sequenceNotes.length; _i++) {
        var $el = self.$sequenceNotes.eq(_i),
          sequenceProperties = {},
          elData = $el.data();

        // once we have our sequence notes lets close the method
        if (elData.id === self.sequence.curIndex) {
          sequenceProperties.el = $el;
          sequenceProperties.notes = [];
          sequenceProperties.notes.el = sequenceProperties.el.find('.note');

          // we need to go throught the notes and throw them into an object to
          // access later
          for (var _j = 0; _j < sequenceProperties.notes.el.length; _j++) {
            var $noteEl = sequenceProperties.notes.el.eq(_j),
              note,
              noteData = $noteEl.data();

            note = {
              el: sequenceProperties.notes.el.eq(_j),
              x: noteData.x,
              y: noteData.y
            };

            sequenceProperties.notes.push(note);
          }

          return sequenceProperties;
        }
      }
    },

    hideSequenceNotes: function() {
      var self = this;

      self.$sequenceNotes.addClass('visuallyhidden');
    },

    // places the sequence notes on the page
    positionSequence: function(sequence) {

      for (var _i = 0; _i < sequence.notes.length; _i++) {
        var currSequence = sequence.notes[_i];

        // position the notes!
        currSequence.el.css({
          'left': currSequence.x,
          'top': currSequence.y
        });
      }
    },

    followSequenceNotes: function() {
      var sequenceNotes = this.getSequenceNotes(),
        trackingAsset = this.$el.find('.image-module[data-sequence-id=' + this.sequence.curIndex + ']'),
        assetW = trackingAsset.width(),
        assetH = trackingAsset.height(),
        percX,
        percY,
        adjustedX = null,
        adjustedY = null,
        widthOffset = 0,
        heightOffset = 0;

      // we must not have any notes defined, so lets just close out
      if (!sequenceNotes) {
        return;
      }

      sequenceNotes.el.closest('.sequence-note-container').css({
        height: assetH
      });

      for (var _i = 0; _i < sequenceNotes.notes.length; _i++) {
        var note = sequenceNotes.notes[_i],
          $noteEl = sequenceNotes.notes[_i].el;

        percX = note.x.replace('%', ''),
        percY = note.y.replace('%', ''),
        widthOffset = (trackingAsset.closest('.sony-sequence').width() - assetW) / 2;
        heightOffset = parseInt(trackingAsset.closest('.sony-sequence').css('padding-top'), 10);

        // get x coordinate
        adjustedX = (percX * assetW) / 100;
        adjustedY = (percY * assetH) / 100;

        // lets stop animation
        $noteEl.css("left", adjustedX);
        $noteEl.css("top", adjustedY);
      }
    },

    placeSequenceNote: function() {
      var self = this,
        currentSequence;

      // if we have already shown the notes
      if (self.showNotes === false) {
        return false;
      }

      currentSequence = self.getSequenceNotes();

      // we have sequence notes so we can display them
      if (currentSequence) {
        var $currentSequence = currentSequence.el;

        $currentSequence.removeClass('visuallyhidden inactive')
          .siblings().addClass('visuallyhidden inactive');

        self.positionSequence(currentSequence);
      }

      // weve shown the goods already
      self.showNotes = false;
    },

    handleSliderDrag: function(position) {
      var self = this;

      self.idleTimer = 0;
      self.showNotes = true;

      self.sequence.move(position);
      self.placeSequenceNote();
    }
  };

  return EditorialTransition;
});