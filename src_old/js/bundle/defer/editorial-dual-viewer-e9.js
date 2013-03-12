
// Sony Editorial + Dual Viewer (EditorialDualViewer) ModuleModule
// ---------------------------------------------------------------
//
// * **Class:** EditorialDualViewer
// * **Version:** 0.1
// * **Modified:** 01/23/2013
// * **Author:** George Pantazis
// * **Dependencies:** jQuery 1.7+, [SonyDraggable](sony-draggable.html)

(function($) {

  'use strict';

  var EditorialDualViewer = function($element, options){

    var self = this;

    $.extend(self, {}, $.fn.editorialDualViewer.defaults, options);

    self.$el = $element;
    self.$dualViewContainer = self.$el.find('.edv-images');
    self.$scrubber = self.$el.find('.edv-scrubber-container');
    self.$bottomSlide = self.$el.find('.image-1');
    self.$topSlide = self.$el.find('.image-2');
    self.$topSlideImageContainer = self.$topSlide.find('.edv-image-wrapper');
    self.$images = self.$dualViewContainer.find('img');

    self.initTimeout();

    // **TODO:** This should be replaced with the global debounced throttle event once that is available.
    $(window).on('resize', $.proxy(self.setPositions, self));
  };

  EditorialDualViewer.prototype = {

    'constructor': EditorialDualViewer,

    '_init': function() {

      var self = this;

      self.$scrubber.sonyDraggable({
        'axis': 'x',
        'unit': '%',
        'containment': self.$dualViewContainer,
        'drag': $.proxy(self.onDrag, self),
        'bounds': self.getDragBounds()
      });

      log('SONY : EditorialDualViewer : Initialized');
    },

    // We just need the images to be ready *enough* to provide dimensions.
    // Since the usual imagesLoaded plugin approach wasn't compatible with iQ,
    // we just poll for a width until one is available.

    'initTimeout': function() {

      var self = this,
          ready = true;

      self.$images.each(function(){
        if ( $(this).width() === 0 || $(this).height() === 0 ) {
          ready = false;
        }
      });

      if ( ready ) {
        self._init();
      } else {
        setTimeout($.proxy(self.initTimeout, self), 500);
      }
    },

    // Compute the dragging bounds based on the width of the container.

    'getDragBounds': function() {

      var self = this,
          minBounds = self.$dualViewContainer.width() * 0.1,
          containerWidth = self.$dualViewContainer.width();

      return {
        'x': {
          'min': 100 * minBounds / containerWidth,
          'max': 100 - 100 * minBounds / containerWidth
        }
      };
    },

    // Based on the current bounds, Reset the position of the scrubber via
    // [SonyDraggable's](sony-draggable.html) *setBounds* method.

    'setPositions': function() {

      var self = this,
          bounds = self.getDragBounds();

      self.$scrubber.sonyDraggable('setBounds', bounds);
    },

    // As [SonyDraggable](sony-draggable.html) returns scrubbing changes, update the top slide's width to match,
    // and adjust the image container's width by that percentage's inverse to maintain the
    // desired positioning.

    'onDrag': function(e) {

      var self = this;

      self.$topSlide.css('width', (100 - e.position.left) + '%');
      self.$topSlideImageContainer.css('width', 10000 / (100 - e.position.left) + '%');
    }

  };

  $.fn.editorialDualViewer = function( options ) {
    var args = Array.prototype.slice.call( arguments, 1 );
    return this.each(function() {
      var self = $(this),
        editorialDualViewer = self.data('editorialDualViewer');

      // If we don't have a stored editorialDualViewer, make a new one and save it
      if ( !editorialDualViewer ) {
          editorialDualViewer = new EditorialDualViewer( self, options );
          self.data( 'editorialDualViewer', editorialDualViewer );
      }

      if ( typeof options === 'string' ) {
        editorialDualViewer[ options ].apply( editorialDualViewer, args );
      }
    });
  };

  $.fn.editorialDualViewer.defaults = {

  };

  // Initialization.
  $(function(){
    $('.edv').editorialDualViewer();
  });

})(jQuery);
