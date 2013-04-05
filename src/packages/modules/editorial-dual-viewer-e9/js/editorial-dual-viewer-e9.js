// Sony Editorial + Dual Viewer (EditorialDualViewer) ModuleModule
// ---------------------------------------------------------------
//
// * **Class:** EditorialDualViewer
// * **Version:** 0.2
// * **Modified:** 03/25/2013
// * **Author:** George Pantazis & Steve Davis
// * **Dependencies:** jQuery 1.7+, [SonyDraggable](sony-draggable.html)

define(function(require){

  'use strict';

  var $ = require('jquery'),
    enquire = require('enquire'),
    SonyDraggable = require('secondary/index').sonyDraggable;

  var module = {
    'init': function() {
      $('.edv').each(function(){
        new EditorialDualViewer(this);
      });
    }
  };

  var EditorialDualViewer = function(element){

    var self = this;

    self.$el = $(element);
    self.$dualViewContainer = self.$el.find('.edv-images');
    self.$scrubber = self.$el.find('.scrubber');
    self.$bottomSlide = self.$el.find('.image-2');
    self.$topSlide = self.$el.find('.image-1');
    self.$topSlideImageContainer = self.$topSlide.find('.edv-image-wrapper');
    self.$images = self.$dualViewContainer.find('img');

    // Set draggable axis
    self.axis = 'x';
    if ( self.$el.hasClass('y') ) {
      self.axis = 'y';
    }

    self.init();

    log('SONY : EditorialDualViewer : Initialized');
  };

  EditorialDualViewer.prototype = {

    'constructor': EditorialDualViewer,

    'init': function() {

      var self = this;

      // Inititalize draggable scrubber for X axis drag
      if ( self.axis == 'x' ) {

        // Inititalize draggable scrubber
        self.$scrubber.sonyDraggable({
          'axis': 'x',
          'unit': '%',
          'containment': self.$dualViewContainer,
          'drag': $.proxy(self.onDrag, self),
          'bounds': {'x': {'min': 0, 'max': 100}}
        });

      // Inititalize draggable scrubber for Y axis drag
      } else if ( self.axis == 'y' ) {

        // Inititalize draggable scrubber
        self.$scrubber.sonyDraggable({
          'axis': 'y',
          'unit': '%',
          'containment': self.$dualViewContainer,
          'drag': $.proxy(self.onDrag, self),
          'bounds': {'y': {'min': 0, 'max': 100}}
        });

      }

      // Set initial scrubber position to the middle of the viewer
      self.$scrubber.sonyDraggable('setPositions', {x: 50, y:50});

    },

    // We just need the images to be ready *enough* to provide dimensions.
    // Since the usual imagesLoaded plugin approach wasn't compatible with iQ,
    // we just poll for a width until one is available.
    'initTimeout': function() {
      var self = this,
          ready = true;

      self.$images.each(function(){
        var $el = $(this);
        if ( $el.width() === 0 || $el.height() === 0 ) {
          ready = false;
        }
      });

      if ( ready ) {
        self._init();
      } else {
        setTimeout($.proxy(self.initTimeout, self), 250);
      }
    },

    // Based on the current bounds, Reset the position of the scrubber via
    // [SonyDraggable's](sony-draggable.html) *setBounds* method.
    
    'setPositions': function() {
      var self = this,
          bounds = self.getDragBounds();

      self.$scrubber.sonyDraggable('setBounds', bounds);
    },

    // As [SonyDraggable](sony-draggable.html) returns scrubbing changes, update the top
    // slide's width or height to match, and adjust the image container's width by that
    // percentage's inverse to maintain the desired positioning.
    
    'onDrag': function(e) {
      var self = this;

      if ( self.axis == 'x' ) {

        self.$topSlide.css('width', (e.position.left) + '%');
        self.$topSlideImageContainer.css('width', 10000 / (e.position.left) + '%');

        // If scrubber comes close to edge, hide caption for hidden image
        (e.position.left <= 20) ? self.$topSlide.next().fadeOut(200) : self.$topSlide.next().fadeIn(200);
        (e.position.left <= 80) ? self.$bottomSlide.next().fadeIn(200) : self.$bottomSlide.next().fadeOut(200);

      } else if ( self.axis == 'y' ) {

        self.$topSlide.css('height', (e.position.top) + '%');
        self.$topSlideImageContainer.css('height', 10000 / (e.position.top) + '%');

        // If scrubber comes close to edge, hide caption for hidden image
        (e.position.top <= 20) ? self.$topSlide.next().fadeOut(200) : self.$topSlide.next().fadeIn(200);
        (e.position.top <= 80) ? self.$bottomSlide.next().fadeIn(200) : self.$bottomSlide.next().fadeOut(200);

      }
    }

  };

  return module;

});
