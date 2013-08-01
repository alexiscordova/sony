/*jshint debug:true*/

// ------------ Sony Slider Controls ------------
// * **Module:** Sony Slider Controls
// * **Version:** 0.0.1
// * **Modified:** 07/26/2013
// * **Author:** Kaleb White
// * **Dependencies:** jQuery 1.7+, hammerJS, Viewport
//
// *Example Usage:*
//
//      require('path/to/global/module') // self instantiation
//

define(function(require) {

  'use strict';

  // provisions
  var $ = require( 'jquery' ),
      iQ = require( 'iQ' ),
      Settings     = require( 'require/sony-global-settings' ),
      Environment  = require( 'require/sony-global-environment' ),
      hammer       = require( 'plugins/index' ).hammer,
      Viewport     = require( 'secondary/sony-viewport' );


  var SonySliderControl = function( element, options ) {

    var self = this;

    self.options = $.extend({}, SonySliderControl.defaults, options);
      
    // Settings
    self.showFallback   = ( Settings.isSonyTabletP || Settings.isGoogleTV || Settings.isVita || Settings.isPS3 );

    // Cached jQuery objects
    self.$el = $( element );
    self.$sequence      = self.$el.find('[data-sequence-id]');    
    self.sequenceLength = self.$sequence.length;  
    self.$controls      = self.$el.find( '.controls' );
    
    self.$win           = Settings.$window;
    self.$body          = Settings.$body;

    // Initialize
    self.init();
  };
      
  SonySliderControl.prototype = {
    constructor: SonySliderControl,

    init : function() {
      var self = this;
      
      $(domReady);

      // domReady!
      function domReady(){
        self.getSliderData();
        if (!self.showFallback) {
          self.initalizeSliderBindings();
          // reset the step buffer when the window changes size
          Environment.on( 'global:resizeDebounced', $.proxy( self.onResize, self ) );
        }
      }
    },

    onResize: function() {
      var self = this;

      self.sliderGetDimensions();
      // destroy the labels and recreate them to their new positions
      self.destroyLabels( $.proxy(self.createSliderLabels, self) );
    },

    getLabels: function() {
      var self = this,
          $labelContainer,
          labelArray = [],
          labels;

      $labelContainer = self.$el.find('.label-data');
      labels = $labelContainer.find('i');

      // push our new items into the object.currLabels
      for(var _i=0;_i < labels.length;_i++) {
        var $el = $(labels[_i]),
            elData = $el.data();

        var obj = { 
          id: elData.id,
          type: elData.type,
          name: elData.label
        };
        // push the label attributes into the object
        labelArray.push(obj);
      }

      // remove the labels since we cached the data
      $labelContainer.remove();

      // close the method with our new array
      return labelArray;
    },    

    sliderGetDimensions: function() {
      this.sliderControlWidth = (this.$sliderControl.width());
      return (this.sliderControlWidth);
    },

    getSliderData: function() {
      // get all the data needed for the slider 
      // before destroying the div which contains the data
      this.controlTemplate = {};
      this.labels = this.getLabels();

      // we are going to throw these inside a create slider method
      this.createSliderBar();
      this.createSliderLabels();

      this.$controls.remove();
      
    },

    destroyLabels: function( cb ) {
      // we need to destroy the labels and call the callback at the end when
      // they're killed.
      this.$sliderControlContainer.find('.slider-label').remove();

      if (cb && typeof(cb) == "function") {cb();}
    },

    // creates the slider labels 
    createSliderLabels: function() {
      var labelTemplate;
      this.controlTemplate.labels = [];

      if (this.labels.length == 2) {
        this.controlTemplate.labelLeft = '<span class="slider-label label-left l3" data-direction="'+ 0 +'">' + this.labels[0].name + '</span>';
        this.controlTemplate.labelRight = '<span class="slider-label label-right l3" data-direction="'+ this.sequenceLength +' ">' + this.labels[1].name + '</span>';
      } else if(this.labels.length > 2) {
        // add the new labels to controlTmpl
        for (var _i = 0; _i < this.labels.length; _i++) {
          var currentLabel = this.labels[_i];
          // we should get the percentage of the label to position it?
          var labelPosition = {};
          // we need to give a class to the labels to determine width 
          // and text direction
          if (_i === 0 || _i === (this.labels.length - 1) ) {            
            // this is the first or the last label
            if (_i === 0) {
              // the first label
              currentLabel.class = 'text-right';
            } else {
              // the last label
              currentLabel.class = 'text-left';
            }
          } else {
            // any label in between 0 and the last label
            currentLabel.class = 'text-middle';
          }
          
          labelPosition.sliderControlWidth = this.sliderControlWidth;
          labelPosition.distanceBetween = (this.sliderControlWidth / (this.sequenceLength));
          labelPosition.distanceForNotch = (labelPosition.distanceBetween / 2);
          // if the position is the last or the first we don't want to give it
          // positioning compensating the middle ground of where a notch
          // should be. It will alwyas be the min or the max, never a middle
          // ground
          // see: (http://cl.ly/image/2Z1p2f3Y2K0n)
          if (_i === 0 || _i === (this.labels.length -1)) {
            labelPosition.px = (currentLabel.id * (this.sliderControlWidth / (this.sequenceLength - 1)));
            labelPosition.percetnage = ( labelPosition.px / (this.sliderControlWidth + 10) ) * 100;
          } else {
            labelPosition.px = (currentLabel.id * labelPosition.distanceBetween) + (labelPosition.distanceForNotch);
            labelPosition.percetnage = ( labelPosition.px / (this.sliderControlWidth + 10) ) * 100;
          }
          
          if (this.showFallback) {
            if (currentLabel.type == 'icon') {
              labelTemplate = [
                '<div class="slider-label label-int l3 icon-mode" data-direction="'+ currentLabel.id +'">',
                  '<span class="label-item-container">',
                    '<span class="nav-label">',
                      '<i class="l3 '+ currentLabel.name +'" ></i>',
                    '</span>',
                  '</span>',
                '</div>'
              ].join('\n');
            } else {
              labelTemplate = [
                '<div class="slider-label label-int l3" data-direction="'+ currentLabel.id +'">',
                  '<span class="label-item-container">',
                    '<span class="nav-label">',
                      currentLabel.name,
                    '</span>',
                  '</span>',
                '</div>'
              ].join('\n');
            }
          } else {
            if (currentLabel.type == 'icon') {
              labelTemplate = [
                '<div class="slider-label label-int l3 '+ currentLabel.class +'" data-direction="'+ currentLabel.id +'" style="left:' + labelPosition.percetnage + '%;">',
                  '<div class="label-item-container">',
                    '<span class="notch" ></span>',
                    '<i class="l3 '+ currentLabel.name +'" ></i>',
                  '</div>',
                '</div>'
              ].join('\n');
            } else {
              labelTemplate = [
                '<span class="slider-label label-int l3 '+ currentLabel.class +'" data-direction='+ currentLabel.id +' style=" left:' + labelPosition.percetnage + '%; " >',
                  '<div class="label-item-container">',
                    '<span class="notch" ></span>',
                    '<span class="label-text">',
                      currentLabel.name,
                    '</span>',
                  '</div>',
                '</span>'
              ].join('\n');
            }
          }

          //log(" -- ADDING LABEL -- "+currentLabel.id+" properties", labelPosition);
          // push them into a cached object
          this.controlTemplate.labels.push(labelTemplate);
        }
      }

      // save it to the namespace
      //this.labelProperties = {};
      //this.labelProperties.positioning = labelPosition;
      //this.labelPosition.attributes = currentLabel;

      // check for how many labels we have
      // if there are only two labels toss the labels on the left and right of the slier
      // otherwise we will need to position the labels below the slider 
      // do we have labels that we can show?
      if (this.labels.length == 2) {
        this.$sliderControlContainer.append(this.controlTemplate.labelRight)
          .prepend(this.controlTemplate.labelLeft);
      } else if(this.labels.length > 2) {
        var labelContainer = '<div class="label-container"></div>',
            $labelContainer;

        this.$sliderControlContainer.addClass('multi-label')
          .append(labelContainer);

        $labelContainer = $('.label-container');
        $labelContainer.append(this.controlTemplate.labels);
        if (this.showFallback) {
          $('.slider-label').eq(0).addClass('active');
        }
        //log('-- SONY SLIDER CONTROL LABELS --');
      }
    },

    // creates the slider template
    createSliderBar: function() {

      this.controlTemplate.slider = [
        '<div class="control-bar-container">',
          '<div class="control-bar slider range-control">',
            '<div class="handle">',
              '<span class="inner">',
                '<span class="icons">',
                  '<i class="fonticon-10-chevron-reverse"/>',
                  '<i class="fonticon-10-chevron"/>',
                '</span>',
              '</span>',
            '</div>',
          '</div>',
        '</div>'
      ].join('\n');

      this.controlTemplate.fallbackSlider = [
        '<div class="control-bar-container fallback">',
        '</div>'
      ].join('\n');

      // do we need to display the fallback experience?
      if (this.showFallback) {
        this.$el.append(this.controlTemplate.fallbackSlider);
        this.$sliderControlContainer = this.$el.find('.control-bar-container');
        //log('TODO: MAKE FALLBACK LABEL MARKUP FOR MORE THAN 2 LABELS');
      } else {
        // add our new controls to the container
        this.$el.append(this.controlTemplate.slider);
        this.$sliderControlContainer = this.$el.find('.control-bar-container');
        this.$sliderControl = this.$el.find('.range-control');
        
        this.sliderGetDimensions();
      }
    },

    setSliderPosition: function(position, isMin) {
       //check if the slider is beyond its bounds
       if (position >= (self.sliderControlWidth-35) || position <= -24) {
         return false;
       }

       this.$slideHandle.css({
          left: position + "%"
       });
    },
    
    animateSliderToPosition: function( sliderProps ) {

      this.$slideHandle.animate({
       left: sliderProps.sliderPositionPercentage + '%'
      }, sliderProps.sequenceAnimationSpeed);

    },

    dragSlider: function(event, position) {
      var pagePos,
          pagePosPercentage,
          data = {},
          page = event.gesture.center,
          direction = event.gesture.direction ? event.gesture.direction : 'left',
          eventX = page.pageX ? page.pageX : 0;

      // get the sldie value positions
      pagePos = eventX - this.$sliderControl.offset().left;
      pagePos = Math.min(this.sliderControlWidth, pagePos);
      pagePos = Math.max(-24, pagePos);

      pagePosPercentage = ( ( pagePos-30 ) / (this.sliderControlWidth) ) * 100;

      if (this.pagePos !== pagePos) {
        this.pagePos = pagePos;

        //check if the slider is beyond its bounds
        if (pagePos <= 0) {
          return false;
        }

        //set the slider positon
        this.$slideHandle.addClass('active');
        this.setSliderPosition(pagePosPercentage);

        data.positionPercentage = pagePosPercentage;
        data.positon = pagePos;

        this.$el.trigger('SonySliderControl:slider-drag', data);
      }

      this.dragged = true;
    },

    touchUp: function() {
      this.$body.removeClass('unselectable');
      this.clicked = false;
      this.$slideHandle.removeClass('active');
    },

    touchDown: function() {
      // Montana to Rice!
      this.$body.addClass('unselectable');
      this.clicked = true;
    },    

    initalizeSliderBindings: function() {
      var self = this;

      self.pagePos = 0;
      // find the handle so we can setup bindings
      self.$slideHandle = self.$sliderControl.find('.handle');
      self.$sliderControlContainer = self.$el.find('.control-bar-container');
      var hammer = new Hammer(self.$slideHandle.get(0) ,{prevent_default:true});
      self.$slideHandle.hammer();

      self.$slideHandle.on({
        touch : function( event ) {
          self.touchDown( event );
        },
        release : function( event ) {
          self.touchUp( event );
        },
        drag : function( event ) {
          var direction = event.gesture.direction;
          if ( 'left' === direction || 'right' === direction ) {
            self.dragSlider( event );
          }
        },
        tap : function( event ) {
          self.touchMove( event );
        }
      });


      self.sliderLabelInitialized = true;   

    }
  };
    
  // Defaults
  // --------
  SonySliderControl.defaults = {
  };

  // Non override-able settings
  // --------------------------
  SonySliderControl.settings = {
  };

  return SonySliderControl;

});     
