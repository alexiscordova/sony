
// Sony Draggable Object (SonyDraggable) Module
// --------------------------------------------
//
// * **Class:** SonyDraggable
// * **Version:** 0.1
// * **Modified:** 01/23/2013
// * **Author:** George Pantazis
// * **Dependencies:** jQuery 1.7+
//
// *Notes:*
//
// This plugin is based loosely on the API of [jQuery UI Draggable](http://api.jqueryui.com/draggable),
// and serves as a bare(ish)-bones class to satisfy the needs of the Dual Viewer (E9).
//
// *Example Usage:*
//
//      $('#foo').sonyDraggable({
//        'axis': 'x',
//        'unit': '%',
//        'containment': $('#foo-wrapper'),
//        'drag': self.beingDragged,
//        'bounds': { x: { 'mix': 10, 'max': 90 } }
//      });

(function($) {

  'use strict';

  var _startEvents = 'mousedown.sonyDraggable touchstart.sonyDraggable',
      _endEvents = 'mouseup.sonyDraggable touchend.sonyDraggable',
      _moveEvents = 'mousemove.sonyDraggable touchmove.sonyDraggable';

  var SonyDraggable = function($element, options){

    var self = this;

    $.extend(self, {}, $.fn.sonyDraggable.defaults, options);

    self.$win = $(window);
    self.$el = $element;
    self.$containment = $(self.containment);

    self.init();
  };

  SonyDraggable.prototype = {

    'constructor': SonyDraggable,

    'init': function() {

      var self = this;

      self.$containment.on(_startEvents, $.proxy(self.onScrubStart, self));
      self.$containment.on(_endEvents + ' click.sonyDraggable', $.proxy(self.onScrubEnd, self));
      self.$win.on(_endEvents, $.proxy(self.onScrubEnd, self));

      self.setDimensions();
      self.setPositions();
    },

    // On scrubbing start, cache (or re-cache) the relevant dimensions with setDimensions(),
    // cache the new interaction's start position, then bind for movement onto onScrubbing().

    'onScrubStart': function(e) {

      var self = this,
          $this = $(e.target);

      if ( self.$el.has($this).length === 0 ) {
        return;
      }

      e.preventDefault();

      self.setDimensions();
      self.handleStartPosition = self.getPagePosition(e);

      self.$containment.on(_moveEvents, $.proxy(self.onScrubbing, self));
    },

    // Crunch some vectors to compute the handle's position relative to the user's click/touch.

    'onScrubbing': function(e) {

      var self = this;

      e.preventDefault();

      self.handlePosition.x = self.scrubberLeft + self.getPagePosition(e).x - self.handleStartPosition.x;
      self.handlePosition.y = self.scrubberTop + self.getPagePosition(e).y - self.handleStartPosition.y;

      self.setPositions();
    },

    // User interaction complete; unbind movement events.

    'onScrubEnd': function(e) {

      var self = this;

      e.preventDefault();

      self.$containment.off(_moveEvents);
    },

    // Applies the user-defined boundaries to a given position. The *which* parameter defines the x/y axis.

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

    // Smooths out different event data for desktop and touch users, returns a consistent pageX/Y.

    'getPagePosition': function(e) {

      if ( !e.pageX && !e.originalEvent ) {
        return;
      }

      return {
        'x': (e.pageX || e.originalEvent.touches[0].pageX),
        'y': (e.pageY || e.originalEvent.touches[0].pageY)
      };
    },

    // Reposition the handle based on mouse movement, or may be called at init for initial placement.
    // Also broadcasts the new position via the self.drag() callback.

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

    // Caches important dimensions and positions.

    'setDimensions': function() {

      var self = this;

      self.containmentWidth = self.$containment.width();
      self.containmentHeight = self.$containment.height();
      self.scrubberLeft = self.$el.position().left;
      self.scrubberTop = self.$el.position().top;
    },

    // Allows other classes to reset the handle's position if needed, by calling:
    //
    //      $('#foo').sonyDraggable('setBounds', {...});

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

  // Defaults
  // --------

  $.fn.sonyDraggable.defaults = {
    // Define the axes along which the handle may be dragged.
    'axis': 'xy',
    // 'px' or '%' based positioning for handle / callback coords.
    'unit': 'px',
    // Initial position of handle.
    'handlePosition': {
      'x': 0,
      'y': 0
    },
    // Callback for drag motion, may be used to reposition other elements.
    'drag': function(){}
  };

})(jQuery);
