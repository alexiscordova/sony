
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

      self.throttledSetAcceleration = $.throttle(500, $.proxy(self.setAcceleration, self));

      self.setDimensions();
      self.setPositions();
    },

    // On scrubbing start, cache (or re-cache) the relevant dimensions with setDimensions(),
    // cache the new interaction's start position, then bind for movement onto onScrubbing().

    'onScrubStart': function(e) {

      var self = this,
          $this = $(e.target);

      if ( !Modernizr.touch ) {
        e.preventDefault();
      }

      if ( self.$el.has($this).length === 0 ) {
        return;
      }

      if ( Modernizr.csstransforms && Modernizr.csstransitions ) {
        self.$el.css(Modernizr.prefixed('transitionDuration'), '0ms');
      }

      self.isScrubbing = self.isPastThreshold = false;
      self.handleStartPosition = self.getPagePosition(e);
      self.setDimensions();
      self.$containment.on(_moveEvents, $.proxy(self.scrubbingThreshold, self));

      self.$el.trigger('sonyDraggable:dragStart');
    },

    'scrubbingThreshold': function(e) {

      var self = this,
          distX = self.getPagePosition(e).x - self.handleStartPosition.x,
          distY = self.getPagePosition(e).y - self.handleStartPosition.y;

      if ( !Modernizr.touch || !self.dragThreshold || self.isScrubbing ) {
        self.isScrubbing = true;
        self.onScrubbing(e, distX, distY);
        return;
      }

      if ( self.isPastThreshold ) { return; }

      if ( Math.abs(distX) > self.dragThreshold ) {
        self.isScrubbing = true;
        self.onScrubbing(e, distX, distY);
        return;
      }

      if ( Math.abs(distY) > self.dragThreshold ) {
        self.isPastThreshold = true;
        return;
      }
    },

    // Crunch some vectors to compute the handle's position relative to the user's click/touch.

    'onScrubbing': function(e, distX, distY) {

      var self = this;

      e.preventDefault();

      window.iQ.update();

      self.handlePosition.x = self.scrubberLeft + distX;
      self.handlePosition.y = self.scrubberTop + distY;

      // Periodically query the user's position to see how much they've moved recently.
      self.throttledSetAcceleration(e);

      self.setPositions();
    },

    // User interaction complete; unbind movement events.

    'onScrubEnd': function(e) {

      var self = this;

      if ( !self.isScrubbing ) { return; }

      e.preventDefault();

      // Do a final check on acceleration before returning data in dragEnd.
      self.setAcceleration(e);

      self.isScrubbing = self.isPastThreshold = false;
      self.$containment.off(_moveEvents);

      self.$el.trigger('sonyDraggable:dragEnd', {
        'acceleration': self.acceleration
      });
    },

    // Smooths out different event data for desktop and touch users, returns a consistent pageX/Y.

    'getPagePosition': function(e) {

      var self = this;

      if ( !e.pageX && !e.originalEvent ) {
        return;
      }

      self.lastTouch = self.lastTouch || {};

      // Cache position for touchmove/touchstart, as touchend doesn't provide it.
      if ( e.type === 'touchmove' || e.type === 'touchstart' ) {
        self.lastTouch = e.originalEvent.touches[0];
      }

      return {
        'x': (e.pageX || self.lastTouch.pageX),
        'y': (e.pageY || self.lastTouch.pageY)
      };
    },

    // Periodically queried to determine the dragging acceleration on x/y axes.

    'setAcceleration': function(e) {

      var self = this,
          newPosition = self.getPagePosition(e);

      if ( !self.lastPagePosition ) {
        self.acceleration = {'x': 0, 'y': 0};
      } else {
        self.acceleration.x = newPosition.x - self.lastPagePosition.x;
        self.acceleration.y = newPosition.y - self.lastPagePosition.y;
      }

      self.lastPagePosition = newPosition;
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

      if ( self.bounds ) {
        newX = self.bounds.x ? SONY.Utilities.constrain( newX, self.bounds.x.min, self.bounds.x.max ) : newX;
        newY = self.bounds.y ? SONY.Utilities.constrain( newY, self.bounds.y.min, self.bounds.y.max ) : newY;
      }

      if ( Modernizr.csstransforms && Modernizr.csstransitions ) {
        self.$el.css(Modernizr.prefixed('transform'), 'translate(' + ( newX ? newX : 0 ) + self.unit + ',' + ( newY ? newY : 0 ) + self.unit + ')');
      } else {
        self.$el.css({
          'left': (newX?newX:0)+self.unit,
          'top': (newY?newY:0)+self.unit
        });
      }

      self.drag({
        'position': {
          'left': newX,
          'top': newY
        }
      });
    },

    // Caches important dimensions and positions.

    'setDimensions': function() {

      var self = this,
          widthObject;

      if ( Modernizr.csstransforms && Modernizr.csstransitions ) {
        widthObject = self.$el;
      } else {
        widthObject = self.$containment;
      }

      self.containmentWidth = widthObject.width();
      self.containmentHeight = widthObject.height();
      self.scrubberLeft = self.$el[0].getBoundingClientRect().left - (self.$el.outerWidth(true) - self.$el.width()) / 2;
      self.scrubberTop = self.$el[0].getBoundingClientRect().top - (self.$el.outerHeight(true) - self.$el.height()) / 2;
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
    'dragThreshold': undefined,
    // Initial position of handle.
    'handlePosition': {
      'x': 0,
      'y': 0
    },
    // Callback for drag motion, may be used to reposition other elements.
    'drag': function(){}
  };

})(jQuery);
