
// ------ Sony Editorial + Dual Viewer (EditorialDualViewer) Module ------
// Module: EditorialDualViewer Module
// Version: 0.1
// Modified: 01/22/2013
// Dependencies: jQuery 1.7+, ImagesLoaded
// -----------------------------------------------------------------------

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

    // Kind of sketchy; because iQ hasn't had a chance to switch the <img> src I need a delay
    // To make sure imagesLoaded() can grab the images correctly.
    setTimeout(function(){
      self.$dualViewContainer.imagesLoaded(function( $images, $proper, $broken ){
        self.init();
      });
    }, 100);

  };

  EditorialDualViewer.prototype = {

    'constructor': EditorialDualViewer,

    'init': function() {

      var self = this;

      self.$scrubber.sonyDraggable({
        'axis': 'x',
        'unit': '%',
        'containment': self.$dualViewContainer,
        'drag': $.proxy(self.onDrag, self),
        'bounds': self.getDragBounds()
      });
    },

    'getDragBounds': function() {

      var self = this,
          min = 100 - (self.$topSlide.find('img').width() / self.$dualViewContainer.width() * 100),
          max = self.$bottomSlide.find('img').width() / self.$dualViewContainer.width() * 100;

      // Define boundaries for max and min.
      if ( min < 15 ) { min = 15 };
      if ( max > 85 ) { max = 85 };

      return {
        'x': {
          'min': min,
          'max': max
        }
      }
    },

    'onDrag': function(e) {

      var self = this;

      self.$topSlide.css('width', (100 - e.position.left) + '%');
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

  $(function(){

    $('.edv').editorialDualViewer();

  });

})(jQuery);
