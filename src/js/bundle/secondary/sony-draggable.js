
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

      self.$containment.on('mousedown touchstart', $.proxy(self.onScrubStart, self));
      self.$containment.on('mouseup touchend click', $.proxy(self.onScrubEnd, self));
      $(window).on('mouseup touchend', $.proxy(self.onScrubEnd, self));

      self.setDimensions();
      self.setPositions();
    },

    'onScrubStart': function(e) {

      var self = this,
          $this = $(e.target);

      if ( self.$el.has($this).length === 0 ) {
        return;
      }

      e.preventDefault();

      self.setDimensions();
      self.handleStartPosition = self.getPagePosition(e);

      self.$containment.on('mousemove touchmove', $.proxy(self.onScrubbing, self));
    },

    'onScrubbing': function(e) {

      var self = this;

      e.preventDefault();

      self.handlePosition.x = self.scrubberLeft + self.getPagePosition(e).x - self.handleStartPosition.x;
      self.handlePosition.y = self.scrubberTop + self.getPagePosition(e).y - self.handleStartPosition.y;

      self.setPositions();
    },

    'onScrubEnd': function(e) {

      var self = this;

      e.preventDefault();

      self.$containment.off('mousemove touchmove');
    },

    'getConstrainedBounds': function(val, which) {

      var self = this;

      if ( self.bounds && self.bounds[which] ) {
        if ( val < self.bounds[which].min ) {
          return self.bounds[which].min;
        } else if ( val > self.bounds[which].max ) {
          return self.bounds[which].max;
        }
      }

      return val;
    },

    'getPagePosition': function(e) {

      if ( !e.pageX && !e.originalEvent ) {
        return;
      }

      return {
        'x': (e.pageX || e.originalEvent.touches[0].pageX),
        'y': (e.pageY || e.originalEvent.touches[0].pageY)
      };
    },

    'setPositions': function(){

      var self = this,
          newX, newY;

      if ( self.unit === 'px' ) {
        if ( self.axis.search('x') >= 0 ) {
          newX = self.handlePosition.x;
        }
        if ( self.axis.search('y') >= 0 ) {
          newY = self.handlePosition.y;
        }
      }

      if ( self.unit === '%' ) {
        if ( self.axis.search('x') >= 0 ) {
          newX = ((self.handlePosition.x) / self.containmentWidth * 100);
        }
        if ( self.axis.search('y') >= 0 ) {
          newY = ((self.handlePosition.y) / self.containmentHeight * 100);
        }
      }

      newX = self.getConstrainedBounds(newX, 'x');
      newY = self.getConstrainedBounds(newY, 'y');

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

    'setDimensions': function() {

      var self = this;

      self.containmentWidth = self.$containment.width();
      self.containmentHeight = self.$containment.height();
      self.scrubberLeft = self.$el.position().left;
      self.scrubberTop = self.$el.position().top;
    },

    'setBounds': function(newBounds) {

      var self = this;

      self.bounds = newBounds;
      self.setPositions();
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
    'unit': 'pixel',
    'handlePosition': {
      'x': 0,
      'y': 0
    }
  };

})(jQuery);
