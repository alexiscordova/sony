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
    self.init();

    log('SONY : EditorialTransition : Initialized');
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

      // initalize bindings
      var domReady = function() {
        self.initBindings();
      };

      $(domReady);
    },

    initBindings: function() {
      var self = this,
          $labels;

      console.log('-- INITIALIZED BINDINGS FOR MODULE --');

      self.$el.on('click.label-click', '.slider-label', function(e) {
        var $el = $(e.target).closest('.slider-label'),
            $labels = self.$el.find('.slider-label'),
            sliderProperties,
            data = $el.data(),
            direction = data.direction;

        sliderProperties = self.getSliderPositionByIndex(direction);
        self.sequence.startAnimation( direction );
        self.slider.animateSliderToPosition( sliderProperties );
      });

      // going to attach a listener to sliderDrag which 
      // will return back values to go to certain frame.
      // --
      // * will return back a position object where the slider is positioned to the rail.
      self.$el.on('SonySliderControl:slider-drag', function(e, sliderPosition){
        self.sliderPosition = sliderPosition;
        self.handleSliderDrag();
      });

      Environment.on( 'global:resizeDebounced', $.proxy( self.onResize, self ) );
      
    },

    
    onResize: function() {
      console.log('resize!');
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
      
      console.log('-- HANDLE SLIDE HANDLE MOVE --',self.curIndex, positon, self.slider.sliderControlWidth);

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

      steps = (self.slider.sliderControlWidth / (self.sequence.sequenceLength - 1));
      sliderProperties.position = (steps * self.sequence.curIndex);
      sliderProperties.positionPercentage = (sliderProperties.position / (self.slider.sliderControlWidth + 30)) * 100;
      sliderPercentageMax = ((self.slider.sliderControlWidth - 30) / self.slider.sliderControlWidth) * 100;
      sliderPercentageMin = ((self.slider.sliderControlWidth - (self.slider.sliderControlWidth + 30)) / (self.slider.sliderControlWidth + 30)) * 100;

      if (self.sequence.curIndex >= (self.sequence.sequenceLength - 1) || sliderProperties.positionPercentage > sliderPercentageMax) {
        sliderProperties.positionPercentage = sliderPercentageMax;
      } else if (self.curIndex <= 0 && sliderProperties.positionPercentage > sliderPercentageMin) {
        sliderProperties.positionPercentage = sliderPercentageMin;
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
      distanceFromDirection = Math.abs(self.sequence.curIndex - direction);
      sliderPercentageMax = ((self.slider.sliderControlWidth - 30) / self.slider.sliderControlWidth) * 100;
      sliderPercentageMin = ((self.slider.sliderControlWidth - (self.slider.sliderControlWidth + 30)) / (self.slider.sliderControlWidth + 30)) * 100;

      sliderProperties.position = ((self.slider.sliderControlWidth / self.sequence.sequenceLength - 1) * direction);
      // the slider will need to be able to reach a negative value, yet hit 100%. 
      // thus we may need to check the slider width and exaggerate its values.
      // for example: if the slider direction is at 0, 0/560 will always be 0. 
      sliderProperties.positionPercentage = Math.floor(( (((self.slider.sliderControlWidth+30) / self.sequence.sequenceLength - 1) * direction) / (self.slider.sliderControlWidth+30)) * 100);
      self.slider.options.speed ? sliderProperties.sequenceAnimationSpeed = (self.slider.options.speed * distanceFromDirection) : sliderProperties.sequenceAnimationSpeed = (100 * distanceFromDirection); 

      if (direction >= (self.sequence.sequenceLength - 1) || sliderProperties.positionPercentage > sliderPercentageMax) {
        sliderProperties.positionPercentage = sliderPercentageMax;
      } else if (self.curIndex <= 0 && sliderProperties.positionPercentage > sliderPercentageMin) {
        sliderProperties.positionPercentage = sliderPercentageMin;
      }

      console.log(sliderProperties, sliderPercentageMax);
     
      // hand over the properties!
      return sliderProperties;
    },

    handleSliderDrag: function() {
      var pagePos;

      this.sliderGotoFrame(this.sliderPosition.positon);
    }
  };

  return EditorialTransition;

});
