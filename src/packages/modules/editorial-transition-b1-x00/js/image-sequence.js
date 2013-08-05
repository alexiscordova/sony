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
        self.followSequenceNotes();
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

        // when the slider stops we need to check if were on a label or near
        // one and snap the slider to the label
        self.$el.on('SonySliderControl:slider-stop', function(e){
          //console.log('-- SLIDER STOPPED --');
          //console.log(self.sliderPosition);

          self.snapToLabel(self.sliderPosition);
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
      this.followSequenceNotes();
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

    snapToLabel: function(sliderPosition) {
      var self = this,
          sequenceLength = self.sequence.sequenceLength,
          adjustedSliderPosition,
          sliderProperties;

      adjustedSliderPosition = (sliderPosition.positon / self.slider.sliderControlWidth) * 100;
      for(var _i = 0;_i < self.slider.labelData.length;_i++) {
        var label = self.slider.labelData[_i],
            tolerance = (((label.distanceBetween / self.slider.sliderControlWidth) * 100) / sequenceLength),
            direction = self.getSliderPositionByIndex( label.sequenceId );

        // we need some logic for our sequence lenghts
        // for example if a sequence only contains 3 images the start / end
        // positon per each label is massive causing the slider to jump even
        // at any point. 
        if (self.sequence.sequenceLength <= 3 ) {

          if(adjustedSliderPosition >= (label.sequencePosition.startPercentage) && adjustedSliderPosition <= (label.sequencePosition.endPercentage)) {

            self.sequence.move( label.sequenceId );
            self.slider.animateSliderToPosition(direction);
            return;
          }  
        } else if (self.sequence.sequenceLength >= 4 &&  self.sequence.sequenceLength <= 10) {
          if(adjustedSliderPosition >= (label.sequencePosition.startPercentage - tolerance) && adjustedSliderPosition <= (label.sequencePosition.endPercentage + tolerance)) {

            self.sequence.move( label.sequenceId );
            self.slider.animateSliderToPosition(direction);
            return;
          }  
        } else if (self.sequence.sequenceLength >= 11) {
          // if they add more labels were doomed :(
          tolerance += 10;
          if(adjustedSliderPosition >= (label.sequencePosition.startPercentage - tolerance) && adjustedSliderPosition <= (label.sequencePosition.endPercentage + tolerance)) {

            // we need to set the curIndex for the sequence to our
            // destination slide because sequence can only fire once and if
            // our destination is more than 2 slides away mayhem breaks out
            self.sequence.curIndex =  label.sequenceId;

            // move, get out the way
            self.sequence.move( label.sequenceId );
            self.slider.animateSliderToPosition(direction);
            return;
          }  
        }
      }
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
    positionSequence: function( sequence ) {

      for (var _i = 0; _i < sequence.notes.length; _i++) {
        var currSequence = sequence.notes[_i];

        // position the notes!
        currSequence.el.css({
          'left' : currSequence.x,
          'top' : currSequence.y
        });

      }

    },

    followSequenceNotes: function() {
      var sequenceNotes = this.getSequenceNotes(),
          trackingAsset = this.$el.find('.image-module[data-sequence-id='+this.sequence.curIndex+']'),
          assetW = trackingAsset.width(),
          assetH = trackingAsset.height(),
          percX,
          percY,
          adjustedX   = null,
          adjustedY   = null,
          widthOffset = 0,
          heightOffset = 0;

      // we must not have any notes defined, so lets just close out
      if (!sequenceNotes) { return; }

      sequenceNotes.el.closest('.sequence-note-container').css({
        height: assetH
      });

      for (var _i = 0; _i < sequenceNotes.notes.length; _i++) {
        var note = sequenceNotes.notes[_i],
            $noteEl = sequenceNotes.notes[_i].el;

        percX       = note.x.replace( '%', '' ),
        percY       = note.y.replace( '%', '' ),
        widthOffset = ( trackingAsset.closest('.sony-sequence').width() - assetW ) / 2;
        heightOffset = parseInt( trackingAsset.closest('.sony-sequence').css( 'padding-top' ), 10 );

        // get x coordinate
        adjustedX = ( percX * assetW ) / 100;
        adjustedY = ( percY * assetH ) / 100;

        // lets stop animation
        $noteEl.css( "left", adjustedX );
        $noteEl.css( "top", adjustedY );
      }
    },

    placeSequenceNote: function() {
      var self = this,
          sliderProperties,
          currentSequence;

      // if we have already shown the notes
      if (self.showNotes === false) { return false; }

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
