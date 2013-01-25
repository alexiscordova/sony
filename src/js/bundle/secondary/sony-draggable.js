
// ------------ Sony Draggable Object (SonyDraggable) Module ------------
// Module: SonyDraggable Module
// Version: 0.1
// Modified: 01/23/2013
// Author: George Pantazis
// Dependencies: jQuery 1.7+
// ----------------------------------------------------------------------
// Notes:
// This plugin is based loosely on the API of jQuery UI Draggable
// (http://api.jqueryui.com/draggable), and serves as a bare(ish)-bones
// class to satisfy the needs of the Dual Viewer (E9).
// ----------------------------------------------------------------------

(function($) {

  'use strict';

  var SonyDraggable = function($element, options){

    var self = this;

    $.extend(self, {}, $.fn.sonyDraggable.defaults, options);

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
      self.containmentWidth = self.$containment.width();
      self.containmentHeight = self.$containment.height();

      self.$containment.on('mousemove touchmove', $.proxy(self.onScrubbing, self));

    },

    'onScrubbing': function(e) {

      var self = this,
          movedX = self.pagePosition(e).x - self.startInteractionPoint.x,
          movedY = self.pagePosition(e).y - self.startInteractionPoint.y,
          newX, newY;

      e.preventDefault();

      if ( self.unit === 'px' ) {
        if ( self.axis.search('x') >= 0 ) {
          newX = self.startPositionX + movedX;
        }
        if ( self.axis.search('y') >= 0 ) {
          newY = self.startPositionY + movedY;
        }
      }

      if ( self.unit === '%' ) {
        if ( self.axis.search('x') >= 0 ) {
          newX = ((self.startPositionX + movedX) / self.containmentWidth * 100);
        }
        if ( self.axis.search('y') >= 0 ) {
          newY = ((self.startPositionY + movedY) / self.containmentHeight * 100);
        }
      }

      newX = self.applyBounds(newX, 'x');

      self.$el.css({
        'left': newX + self.unit,
        'top': newY + self.unit
      });

      self.drag({
        'position': {
          'left': newX,
          'top': newY
        }
      });
    },

    'onScrubEnd': function(e) {

      var self = this;

      e.preventDefault();

      self.$containment.off('mousemove touchmove');
    },

    'applyBounds': function(val, which) {

      var self = this;

      if ( self.bounds ) {
        if ( val < self.bounds[which].min ) {
          return self.bounds[which].min;
        } else if ( val > self.bounds[which].max ) {
          return self.bounds[which].max;
        }
      }

      return val;
    },

    'pagePosition': function(e) {

      if ( !e.pageX && !e.originalEvent ) {
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
