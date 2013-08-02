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
      Settings          = require( 'require/sony-global-settings' ),
      Environment       = require( 'require/sony-global-environment' ),
      SonySequence      = require('secondary/index').sonySequence,
      SonySliderControl = require('secondary/index').sonySliderControl;


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
      self.sequence = new SonySequence( self.$el, {
        loop: false,
        speed: 100
      });
      // initialize the slider
      self.slider = new SonySliderControl( self.$el, {} );
      self.$sequenceNoteContainer = self.$el.find('.sequence-note-container');
      self.$sequenceNotes = self.$sequenceNoteContainer.find('.sequence-notes');

      // initalize bindings
      var domReady = function() {
        self.initBindings();
        self.initSliderTimer();
      };

      $(domReady);
    },

    initBindings: function() {
      var self = this,
          $labels;

      self.$el.on('click.label-click', '.slider-label', function(e) {
        var $el = $(e.target).closest('.slider-label'),
            $labels = self.$el.find('.slider-label'),
            sliderProperties,
            data = $el.data(),
            direction = data.direction;

        // if it's animating don't do anything!
        if (self.isAnimating) { return; }

        self.isAnimating = true;
        self.sequence.startAnimation( direction );

        if (self.slider.showFallback) {
          $el.addClass('active');
          setTimeout(function(){
            $el.siblings().removeClass('active');
          }, 250);
        } else {
          sliderProperties = self.getSliderPositionByIndex(direction);
          self.slider.animateSliderToPosition( sliderProperties );
          self.hideSequenceNotes();

          // run a setTimout after the animation is done + 250 ms
          // to check for if we have notes on the sequence
          setTimeout(function() {
            self.showNotes = true; 
            self.placeSequenceNote();
          }, sliderProperties.sequenceAnimationSpeed+250);
        }
      });

      // going to attach a listener to sliderDrag which
      // will return back values to go to certain frame.
      // --
      // * will return back a position object where the slider is positioned to the rail.
      if (!self.slider.showFallback) {
        self.$el.on('SonySliderControl:slider-drag', function(e, sliderPosition){
          self.sliderPosition = sliderPosition;
          self.handleSliderDrag();
        });
        Environment.on( 'global:resizeDebounced', $.proxy( self.onResize, self ) );
      }

      self.$el.on('SonySequence:stop-sequence', function(){
        // we're done animating so we can set isAnimating to false
        self.isAnimating = false;
      });

    },


    onResize: function() {
      this.getSliderPosition();
    },

    sliderNearestValidValue: function(rawValue) {
      var self = this,
          range;

      range = self.getSliderRange();
      rawValue = Math.min(range.max, rawValue);
      rawValue = Math.max(range.min, rawValue);

      if (self.options.steps) {
        return;
      } else {
        return rawValue;
      }
    },

    sliderGotoFrame: function(positon) {
      var self = this,
          minWidth = 0,
          maxWidth = (self.slider.sliderControlWidth - 35),
          sequenceLength = self.sequence.sequenceLength - 1,
          sequenceDepth = 0,
          lastIndex = self.curIndex;

      sequenceDepth = ( positon / maxWidth );
      //// we need to determine if it's the 360 module or image sequence
      //// why? Because an image sequence needs to go from start to finish with no loop,
      //// a 360 module needs to loop back to the first index.
      self.curIndex = (Math.floor(sequenceLength * sequenceDepth) !== sequenceLength) ? Math.floor(sequenceLength * sequenceDepth) : (self.sequence.sequenceLength - 1);

      if ( self.curIndex < 0 ) {
        self.curIndex = 0;
      }

      // Show the current, hide the others
      self.sequence.move( self.curIndex );
    },

    sliderRatioToValue: function(ratio) {
      var range,
          rawValue;

      range = self.getSliderRange();
      rawValue = ratio * (range.max - range.min) + range.min;

      return this.sliderNearestValidValue(rawValue);
    },


    // gets the slider positon called on resize to fix bugs with positioning
    getSliderPosition: function() {
      var self = this,
          steps,
          position,
          sliderPercentageMin,
          sliderPercentageMax,
          sliderProperties = {};

      // we dont want to animate a bug fix ;)
      sliderProperties.sequenceAnimationSpeed = 0;

      sliderProperties.sequenceWidth = (self.slider.sliderControlWidth / self.sequence.sequenceLength);
      sliderProperties.sliderPosition = (sliderProperties.sequenceWidth * self.sequence.curIndex) + ((sliderProperties.sequenceWidth / 2) - 12);
      sliderProperties.sliderPositionPercentage = (sliderProperties.sliderPosition / (self.slider.sliderControlWidth + 30)) * 100;
      sliderPercentageMax = ((self.slider.sliderControlWidth - 30) / self.slider.sliderControlWidth) * 100;
      sliderPercentageMin = ((self.slider.sliderControlWidth - (self.slider.sliderControlWidth + 30)) / (self.slider.sliderControlWidth + 30)) * 100;

      if (self.sequence.curIndex >= (self.sequence.sequenceLength - 1) || sliderProperties.positionPercentage > sliderPercentageMax) {
        sliderProperties.sliderPositionPercentage = sliderPercentageMax;
      } else if (self.sequence.curIndex <= 0 || sliderProperties.positionPercentage > sliderPercentageMin) {
        sliderProperties.sliderPositionPercentage = sliderPercentageMin;
      }

      // resets the slider position
      self.slider.animateSliderToPosition( sliderProperties );
    },


    getSliderPositionByIndex: function(direction) {
      var self = this,
          distanceFromDirection,
          sliderPercentageMin,
          sliderPercentageMax,
          sliderProperties = {};

      // calculate the distance the slider will be traveling
      sliderProperties.distanceFromDirection = Math.abs(self.sequence.curIndex - direction);
      sliderPercentageMax = ((self.slider.sliderControlWidth - 30) / self.slider.sliderControlWidth) * 100;
      sliderPercentageMin = ((self.slider.sliderControlWidth - (self.slider.sliderControlWidth + 30)) / (self.slider.sliderControlWidth + 30)) * 100;

      sliderProperties.sliderWidth = self.slider.sliderControlWidth;
      sliderProperties.sliderSequenceIndex = direction;
      sliderProperties.sequenceWidth = (self.slider.sliderControlWidth / self.sequence.sequenceLength);

      // if the direction is 0 we need to simply tell the slider that it should run to -24
      if (direction <= 0) {
        sliderProperties.sliderPosition = -24;
      } else {
        sliderProperties.sliderPosition = (sliderProperties.sequenceWidth * direction) + ((sliderProperties.sequenceWidth / 2) - 12);
      }

      // the slider will need to be able to reach a negative value, yet hit 100%.
      // thus we may need to check the slider width and exaggerate its values.
      // for example: if the slider direction is at 0, 0/560 will always be 0.
      sliderProperties.sliderPositionPercentage = Math.floor(( sliderProperties.sliderPosition / (self.slider.sliderControlWidth+30)) * 100);
      self.slider.options.speed ? sliderProperties.sequenceAnimationSpeed = (self.slider.options.speed * sliderProperties.distanceFromDirection) : sliderProperties.sequenceAnimationSpeed = (100 * sliderProperties.distanceFromDirection);

      if (direction >= (self.sequence.sequenceLength - 1) || sliderProperties.positionPercentage > sliderPercentageMax) {
        sliderProperties.sliderPositionPercentage = sliderPercentageMax;
      } else if (self.curIndex <= 0 && sliderProperties.positionPercentage > sliderPercentageMin) {
        sliderProperties.sliderPositionPercentage = sliderPercentageMin;
      }

      // hand over the properties!
      return sliderProperties;
    },


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
          console.log(elData.id, self.sequence.curIndex);
          sequenceProperties.el = $el;
          sequenceProperties.notes = [];
          sequenceProperties.notes.el = sequenceProperties.el.find('.note');

          // we need to go throught the notes and throw them into an object to
          // access later
          for (var _j = 0; _j < sequenceProperties.notes.el.length; _j++) {
            var $noteEl = sequenceProperties.notes.el.eq([_j]),
                note,
                noteData = $noteEl.data();

            note = {
              el: sequenceProperties.notes.el.eq([_j]),
              x: noteData.x,
              y: noteData.y,
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

    positionSequence: function( sequence ) {
      console.log(sequence);

      for (var _i = 0; _i < sequence.notes.length; _i++) {
        var currSequence = sequence.notes[_i];

        // position the notes!
        currSequence.el.css({
          'left' : currSequence.x,
          'top' : currSequence.x,
        });

      }

    },

    placeSequenceNote: function() {
      var self = this,
          currentSequence;

      // if we have already shown the notes
      if (self.showNotes === false) { return false; }

      // TODO:
      // a. check if sequence has notes
      // b. find the note properties (x and y)
      // c. place notes on the view if available
      // d. attach listeners for then browser is resized
      // e. when slider drag is intialized again destroy the notes

      currentSequence = self.getSequenceNotes();

      // we have sequence notes so we can display them
      if (currentSequence) {
        var $currentSequence = currentSequence.el;

        $currentSequence.removeClass('visuallyhidden')
          .siblings().addClass('visuallyhidden');

        self.positionSequence(currentSequence);
      }
          
      // weve shown the goods already
      self.showNotes = false;
    },

    incrementeTimer: function() {
      var self = this;

      self.idleTimer = self.idleTimer + 1;
      if (self.idleTimer > 1) {
        self.placeSequenceNote();
      }
    },

    initSliderTimer: function(){
      var self = this;

      self.idleCounter = setInterval($.proxy(self.incrementeTimer, self), 500);

    },

    handleSliderDrag: function() {
      var self = this;

      self.idleTimer = 0;
      self.showNotes = true;

      self.hideSequenceNotes();
      self.sliderGotoFrame(self.sliderPosition.positon);
    }
  };

  return EditorialTransition;

});
