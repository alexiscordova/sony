
// ------ Sony Editorial + Dual Viewer (EditorialDualViewer) Module ------
// Module: EditorialDualViewer Module
// Version: 0.1
// Modified: 01/22/2013
// Dependencies: jQuery 1.7+
// -----------------------------------------------------------------------

(function($) {

  'use strict';

  var EditorialDualViewer = function($element, options){

    var self = this;

    $.extend(self, {}, $.fn.editorialDualViewer.defaults, options);

    self.$el = $element;
    self.$dualViewContainer = $('.edv-images');
    self.$topSlide = self.$dualViewContainer.find('.image-2');

    self.init();
  };

  EditorialDualViewer.prototype = {

    'constructor': EditorialDualViewer,

    'init': function() {

      var self = this;

      self.$el.find('.edv-scrubber-container').sonyDraggable({
        'axis': 'x',
        'containment': self.$dualViewContainer,
        'drag': $.proxy(self.onDrag, self)
      });
    },

    'onDrag': function(e) {

      var self = this,
          containerWidth = self.$el.width(),
          newSlideWidth = ( 1 - e.position.left / containerWidth ) * 100 + '%';

      self.$topSlide.css('width', newSlideWidth);
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
