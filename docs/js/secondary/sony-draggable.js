
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

define(function(require){

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      Utilities = require('require/sony-global-utilities');

  var _id = 0,
      _startEvents = function(id){ return 'mousedown.sonyDraggable-' + id + ' touchstart.sonyDraggable-' + id; },
      _endEvents = function(id){ return 'mouseup.sonyDraggable-' + id + ' touchend.sonyDraggable-' + id; },
      _moveEvents = function(id){ return 'mousemove.sonyDraggable-' + id + ' touchmove.sonyDraggable-' + id; };

  var SonyDraggable = function($element, options){

    var self = this;

    $.extend(self, {}, $.fn.sonyDraggable.defaults, options);

    self.id = _id++;
    self.$win = $(window);
    self.$el = $element;
    self.$containment = $(self.containment);

    self.init();
  };

  SonyDraggable.prototype = {

    'constructor': SonyDraggable,

    'init': function() {

      var self = this;

      self.$containment.on(_startEvents(self.id), $.proxy(self.onScrubStart, self));
      self.$containment.on(_endEvents(self.id) + ' click.sonyDraggable-' + self.id, $.proxy(self.onScrubEnd, self));

      if ( !Modernizr.touch ) {
        self.$win.on(_endEvents(self.id), $.proxy(self.onScrubEnd, self));
      }

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

      if ( self.useCSS3 ) {
        self.$el.css(Modernizr.prefixed('transitionDuration'), '0ms');
      }

      self.$el.addClass('dragging');
      self.isScrubbing = self.hasPassedThreshold = false;
      self.handleStartPosition = self.getPagePosition(e);
      self.setDimensions();

      self.$containment.on(_moveEvents(self.id), $.proxy(self.scrubbingThreshold, self));

      self.$el.trigger('sonyDraggable:dragStart');
    },

    // Logic for controlling the threshold before which *horizontal* scrubbing can occur on touch devices.

    'scrubbingThreshold': function(e) {

      var self = this,
          distX = self.getPagePosition(e).x - self.handleStartPosition.x,
          distY = self.getPagePosition(e).y - self.handleStartPosition.y;

      // If you're not on touch, or if you didn't pass in a threshold setting, go ahead and scrub.

      if ( !Modernizr.touch || !self.dragThreshold || self.isScrubbing ) {
        self.isScrubbing = true;
        self.onScrubbing(e, distX, distY);
        return;
      }

      // If you've gone past the threshold, simply do nothing for this interaction.

      if ( self.hasPassedThreshold ) { return; }

      if ( Math.abs(distX) > self.dragThreshold ) {
        self.isScrubbing = true;
        self.onScrubbing(e, distX, distY);
        return;
      }

      if ( Math.abs(distY) > self.dragThreshold ) {
        self.hasPassedThreshold = true;
        return;
      }
    },

    // Crunch some vectors to compute the handle's position relative to the user's click/touch.

    'onScrubbing': function(e, distX, distY) {

      var self = this;

      e.preventDefault();

      self.handlePosition.x = self.scrubberLeft + distX;
      self.handlePosition.y = self.scrubberTop + distY;

      // Periodically query the user's position to see how much they've moved recently.

      self.throttledSetAcceleration(e);
      self.setPositions();
    },

    // User interaction complete; unbind movement events.

    'onScrubEnd': function(e) {

      var self = this;

      e.preventDefault();

      self.$containment.off(_moveEvents(self.id));

      if ( !self.isScrubbing ) { return; }

      // Do a final check on acceleration before returning data in dragEnd.

      self.setAcceleration(e);

      setTimeout(function(){
        self.$el.removeClass('dragging dragging2');
      }, 250);

      self.isScrubbing = self.hasPassedThreshold = false;

      self.$el.trigger('sonyDraggable:dragEnd', {
        'acceleration': self.acceleration
      });

      if ( self.snapToBounds && self.bounds ) {
        if ( self.axis.search('x') >= 0 ) {
          self.animateToBounds('x');
        }
        if ( self.axis.search('y') >= 0 ) {
          self.animateToBounds('y');
        }
      }
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

    // If self.snapToBounds is specified, handle the logic for animating the scrubbed element
    // to the nearest bounds.

    'animateToBounds': function(axis) {

      var self = this,
          currentPosition = self.handlePosition[axis],
          pctScale = (self.unit === '%' ? ( axis ==='x' ? self.containmentWidth : self.containmentHeight ) : 1),
          boundsDistance = self.snapToBounds  / 100 * pctScale,
          minMax = [self.bounds[axis].min / 100 * pctScale, self.bounds[axis].max / 100 * pctScale],
          currentDistances = [Math.abs(currentPosition - minMax[0]), Math.abs(currentPosition - minMax[1])],
          closest = Math.min.apply(Math, currentDistances),
          destination = minMax[currentDistances.indexOf(closest)],
          newPosition;

      if( currentDistances[0] > boundsDistance && currentDistances[1] > boundsDistance ) {
        return;
      }

      newPosition = Math.floor( (2/3 * currentPosition + 1/3 * destination) );

      if ( currentPosition !== newPosition ) {
        self.handlePosition[axis] = newPosition;
        self.setPositions();
      } else {
        self.handlePosition[axis] = destination;
        self.setPositions();
        return;
      }

      window.requestAnimationFrame(function(){
        self.animateToBounds(axis);
      });
    },

    // Reposition the handle based on mouse movement, or may be called at init for initial placement.
    // Also broadcasts the new position via the self.drag() callback.
    //
    // Optionally, provide an override argument in the form of `{x: 0, y: 0}`
    // to overwrite the scrubber's current position.

    'setPositions': function(overridePosition){

      var self = this,
          newX = 0,
          newY = 0;

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
        newX = self.bounds.x ? Utilities.constrain( newX, self.bounds.x.min, self.bounds.x.max ) : newX;
        newY = self.bounds.y ? Utilities.constrain( newY, self.bounds.y.min, self.bounds.y.max ) : newY;
      }

      if ( overridePosition ) {
        if ( self.axis.search('x') >= 0 ) {
          newX = overridePosition.x;
        }
        if ( self.axis.search('y') >= 0 ) {
          newY = overridePosition.y;
        }
      }

      if ( self.useCSS3 ) {
        self.$el.css(Modernizr.prefixed('transform'), 'translate(' + newX + self.unit + ',' + newY + self.unit + ')');
      } else {
        self.$el.css({
          'left': newX + self.unit,
          'top': newY + self.unit
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
          $widthObject, offsetCorrectionX, offsetCorrectionY;

      if ( self.useCSS3 ) {
        $widthObject = self.$el;
      } else {
        $widthObject = self.$containment;
      }

      offsetCorrectionX = (self.$el.outerWidth(true) - self.$el.width()) / 2;
      offsetCorrectionY = (self.$el.outerHeight(true) - self.$el.height()) / 2;

      offsetCorrectionX += self.$containment.get(0).getBoundingClientRect().left;
      offsetCorrectionY += self.$containment.get(0).getBoundingClientRect().top;

      // This exception is built specifically for carousels like the OSC (S2) module, which must
      // respect the grid even though they aren't really in it. Refer to S2 for usage example;
      // `sony-carousel-flex` is the required trigger class for that layout stategy.

      if ( !Modernizr.jsautomargins ) {
        if ( self.$el.hasClass('sony-carousel-flex') ) {
          offsetCorrectionX = (self.$el.parent().width() - self.$el.width()) / 2;
        }
      }

      self.containmentWidth = $widthObject.width();
      self.containmentHeight = $widthObject.height();
      self.scrubberLeft = self.$el.get(0).getBoundingClientRect().left - offsetCorrectionX;
      self.scrubberTop = self.$el.get(0).getBoundingClientRect().top - offsetCorrectionY;

    },

    // Allows other classes to reset the handle's position if needed, by calling:
    //
    //      $('#foo').sonyDraggable('setBounds', {...});

    'setBounds': function(newBounds) {

      var self = this;

      self.bounds = newBounds;
      self.setPositions();
    },

    destroy: function() {

      var self = this;

      self.$containment.off(_startEvents(self.id), $.proxy(self.onScrubStart, self));
      self.$containment.off(_endEvents(self.id) + ' click.sonyDraggable-' + self.id);

      if ( !Modernizr.touch ) {
        self.$win.off(_endEvents(self.id));
      }

      self.$el.removeData('sonyDraggable');
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

    // Motion that must be passed on touch before dragging will start. Helpful for
    // preventing "touch-trapping" scenarios.
    'dragThreshold': undefined,

    // Initial position of handle.
    'handlePosition': {
      'x': 0,
      'y': 0
    },

    // Set boundaries in the form of `{x:0, y:100}`, in self.unit measurements.
    'bounds': undefined,

    // If scrubber is released within this distance of a bounds (in self.unit measurements),
    // Animates the scrubber to that bounds. Requires `bounds`.
    'snapToBounds': undefined,

    // Use CSS3 Transforms and Transitions for dragging.
    'useCSS3': false,

    // Callback for drag motion, may be used to reposition other elements.
    'drag': function(){}
  };

});
