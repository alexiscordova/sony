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
    Settings = require('require/sony-global-settings'),
    SonyDraggable = require('secondary/index').sonyDraggable,
    hammer = require('plugins/index').hammer;

  var module = {
    'init': function() {

      // Do not initialize if you're a PS3, since that system doesn't work
      // well with the touch events.

      if ( Settings.isPS3 ) {
        return;
      }

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
    self.$handle = self.$el.find('.handle');
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

      var self = this,
          bounds = {};

      self.$scrubber.show();

      bounds[self.axis] = {'min': 0, 'max': 100};

      self.$scrubber.hammer();
      self.$scrubber.sonyDraggable({
        'axis': self.axis,
        'unit': '%',
        'containment': self.$dualViewContainer,
        'drag': $.proxy(self.onDrag, self),
        'bounds': bounds,
        'snapToBounds': 25
      });

      // Set initial scrubber position to the middle of the viewer

      self.$scrubber.sonyDraggable('setPositions', {x: 50, y:50});

      self.$scrubber.on('dragend', $.proxy(self.onRelease, self));

      // The below is some junk that Steve added, I need to do this in a smarter way.

      self.$handle.mouseenter(function(){
        self.$scrubber.addClass('hover');
      });

      self.$handle.mouseleave(function(){
        if ( !self.$scrubber.hasClass('dragging') ) {
          setTimeout(function(){
            self.$scrubber.removeClass('hover');
          }, 250);
        }
      });

      self.$scrubber.on('sonyDraggable:dragEnd', function(){
        setTimeout(function(){
          self.$scrubber.removeClass('dragging hover');
        }, 250);
      });

      self.bindClicks();
    },

    bindClicks: function() {

      var self = this;

      self.$topSlide.next().on('click', function(){
        self.$scrubber.sonyDraggable('snapTo', self.axis, 100);
      });

      self.$bottomSlide.next().on('click', function(){
        self.$scrubber.sonyDraggable('snapTo', self.axis, 0);
      });
    },

    // We just need the images to be ready *enough* to provide dimensions.
    // Since the usual imagesLoaded plugin approach wasn't compatible with iQ,
    // we just poll for a width until one is available.

    initTimeout: function() {

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

    // As [SonyDraggable](sony-draggable.html) returns scrubbing changes, update the top
    // slide's width or height to match, and adjust the image container's width by that
    // percentage's inverse to maintain the desired positioning.

    onDrag: function(e) {

      var self = this;

      self.position = e.position;

      if ( self.axis === 'x' ) {

        self.$topSlide.css('width', (e.position.left) + '%');
        self.$topSlideImageContainer.css('width', 10000 / (e.position.left) + '%');

        // If scrubber comes close to edge, hide caption for hidden image
        (e.position.left <= 25) ? self.$topSlide.next().fadeOut(200) : self.$topSlide.next().fadeIn(200);
        (e.position.left <= 75) ? self.$bottomSlide.next().fadeIn(200) : self.$bottomSlide.next().fadeOut(200);

      } else if ( self.axis === 'y' ) {

        self.$topSlide.css('height', (e.position.top) + '%');
        self.$topSlideImageContainer.css('height', 10000 / (e.position.top) + '%');

        // If scrubber comes close to edge, hide caption for hidden image
        (e.position.top <= 25) ? self.$topSlide.next().fadeOut(200) : self.$topSlide.next().fadeIn(200);
        (e.position.top <= 75) ? self.$bottomSlide.next().fadeIn(200) : self.$bottomSlide.next().fadeOut(200);
      }
    },

    // This is hammer-based release logic to ease the slider as you throw it. Should look into
    // making it less complex, too many if/elses to cover the cases. Also abstract it back
    // up the food chain to sony-draggable for carousels, etc.

    onRelease: function(e) {

      var self = this,
          gesture = e.gesture,
          newPosition;

      if ( self.axis === 'x' ) {

        newPosition = self.position.left;

        if ( gesture.direction === 'left' && gesture.velocityX > 0.5 ) {
          newPosition = newPosition + gesture.velocityX * -10;
        } else if ( gesture.direction === 'right' && gesture.velocityX > 0.5 ) {
          newPosition = newPosition + gesture.velocityX * 10;
        }

      } else if ( self.axis === 'y' ) {

        newPosition = self.position.top;

        if ( gesture.direction === 'up' && gesture.velocityY > 0.4 ) {
          newPosition = newPosition + gesture.velocityY * -20;
        } else if ( gesture.direction === 'down' && gesture.velocityY > 0.4 ) {
          newPosition = newPosition + gesture.velocityY * 20;
        }
      }

      self.$scrubber.sonyDraggable('snapTo', self.axis, newPosition);
    }
  };

  return module;

});
