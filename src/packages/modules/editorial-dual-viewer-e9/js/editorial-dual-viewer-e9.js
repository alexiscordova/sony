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

      bounds[self.axis] = {'min': 0, 'max': 100};

      self.$scrubber.sonyDraggable({
        'axis': self.axis,
        'unit': '%',
        'containment': self.$dualViewContainer,
        'drag': $.proxy(self.onDrag, self),
        'bounds': bounds,
        'snapToBounds': 25
      });

      // Set initial scrubber position to the middle of the viewer
      //
      // This `dragging2` class is garbage and should be removed.

      self.$scrubber.sonyDraggable('setPositions', {x: 50, y:50});

      self.$handle.mouseenter(function(){
        self.$scrubber.addClass('dragging2');
      });

      self.$handle.mouseleave(function(){
        if ( !self.$scrubber.hasClass('dragging') ) {
          setTimeout(function(){
            self.$scrubber.removeClass('dragging2');
          }, 250);
        }
      });

      self.$scrubber.on('sonyDraggable:dragEnd', function(){
        setTimeout(function(){
          self.$scrubber.removeClass('dragging dragging2');
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

      if ( self.axis == 'x' ) {

        self.$topSlide.css('width', (e.position.left) + '%');
        self.$topSlideImageContainer.css('width', 10000 / (e.position.left) + '%');

        // If scrubber comes close to edge, hide caption for hidden image
        (e.position.left <= 25) ? self.$topSlide.next().fadeOut(200) : self.$topSlide.next().fadeIn(200);
        (e.position.left <= 75) ? self.$bottomSlide.next().fadeIn(200) : self.$bottomSlide.next().fadeOut(200);

      } else if ( self.axis == 'y' ) {

        self.$topSlide.css('height', (e.position.top) + '%');
        self.$topSlideImageContainer.css('height', 10000 / (e.position.top) + '%');

        // If scrubber comes close to edge, hide caption for hidden image
        (e.position.top <= 25) ? self.$topSlide.next().fadeOut(200) : self.$topSlide.next().fadeIn(200);
        (e.position.top <= 75) ? self.$bottomSlide.next().fadeIn(200) : self.$bottomSlide.next().fadeOut(200);
      }
    }
  };

  return module;

});
