
// ------------ Sony Draggable Object (SonyDraggable) Module ------------
// Module: SonyDraggable Module
// Version: 0.1
// Modified: 01/23/2013
// Author: George Pantazis
// Dependencies: jQuery 1.7+
// ----------------------------------------------------------------------
// Notes:
// This plugin is based on the API of jQuery UI Draggable (http://api.jqueryui.com/draggable),
// and serves as a bare-bones version to satisfy the needs of the Dual Viewer (E9).
// ----------------------------------------------------------------------

(function($) {

  'use strict';

  var SonyDraggable = function($element, options){

    var self = this;

    $.extend(self, {}, $.fn.editorialDualViewer.defaults, options);

    self.$el = $element;
    self.$containment = $(self.containment);

    self.init();
  };

  SonyDraggable.prototype = {

    'constructor': SonyDraggable,

    'init': function() {

      var self = this;

      self.startPositionX = self.$el.position().left;
      self.startPositionY = self.$el.position().top;

      self.$containment.on('mousedown touchstart', $.proxy(self.onScrubStart, self));
      self.$containment.on('mouseup touchend mouseleave touchleave click', $.proxy(self.onScrubEnd, self));
    },

    'onScrubStart': function(e) {

      var self = this,
          $this = $(e.target);

      if ( self.$el.has($this).length === 0 || !self.pagePosition(e) ) {
        return;
      }

      e.preventDefault();

      // EOD NOTE: The problem with this is that it doesn't consider the page margins,
      // so if you resize your cursor will be wrong.

      self.startInteractionPoint = self.startInteractionPoint || self.pagePosition(e);

      self.$containment.on('mousemove touchmove', $.proxy(self.onScrubbing, self));

    },

    'onScrubbing': function(e) {

      var self = this,
          movedX = self.pagePosition(e).x - self.startInteractionPoint.x,
          movedY = self.pagePosition(e).y - self.startInteractionPoint.y;

      // Need to make this work for percentages, as an option.

      e.preventDefault();

      if ( self.axis.search('x') >= 0 ) {
        self.$el.css('left', self.startPositionX + movedX);
      }

      if ( self.axis.search('y') >= 0 ) {
        self.$el.css('top', self.startPositionY + movedY);
      }

      self.drag({
        'position': {
          'left': movedX,
          'top': movedY
        }
      });
    },

    'onScrubEnd': function(e) {

      var self = this;

      e.preventDefault();

      self.$containment.off('mousemove touchmove');
    },

    'pagePosition': function(e) {

      if (!e.pageX && !e.originalEvent.touches[0].pageX) {
        return;
      }

      return {
        'x': e.pageX || e.originalEvent.touches[0].pageX,
        'y': e.pageY || e.originalEvent.touches[0].pageY
      };
    }

  };

  $.fn.sonyDraggable = function( options ) {
    var args = Array.prototype.slice.call( arguments, 1 );
    return this.each(function() {
      var self = $(this),
        sonyDraggable = self.data('sonyDraggable');

      if ( !sonyDraggable ) {
          sonyDraggable = new SonyDraggable( self, options );
          self.data( 'sonyDraggable', sonyDraggable );
      }

      if ( typeof options === 'string' ) {
        sonyDraggable[ options ].apply( sonyDraggable, args );
      }
    });
  };

  $.fn.sonyDraggable.defaults = {
    'unit': 'pixel'
  };

})(jQuery);
