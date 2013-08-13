// Sony Slide Nav (SonySlideNav) Module
// --------------------------------------------
//
// * **Class:** SonySlideNav
// * **Version:** 0.1
// * **Modified:** 08/01/2013
// * **Author:** George Pantazis

define(function(require) {

  'use strict';

  var $ = require('jquery'),
    Modernizr = require('modernizr'),
    Utilities = require('require/sony-global-utilities'),
    hammer = require('plugins/index').hammer,
    SonyDraggable = require('secondary/index').sonyDraggable;

  var SonySlideNav = function(element) {

    var self = this,
      init;

    init = self.init(element);

    return init;
  };

  SonySlideNav.prototype = {

    constructor: SonySlideNav,

    init: function(element) {

      var self = this,
        instances = [];

      self.$el = $(element);

      if (self.$el.length > 1) {
        self.$el.each(function() {
          instances.push(new SonySlideNav(this));
        });
        return instances;
      }

      self.createSlider();
      self.updatePoints();
      self.bindUIEvents();
      self.bindAPI();

      log('SONY : SonySlideNav : Initialized');

      return self;
    },

    createSlider: function() {

      var self = this,
        $scrubberContainer = self.$el.find('.scrubber-container'),
        $scrubber = $scrubberContainer.find('.scrubber'),
        bounds = {};

      bounds.x = {
        'min': 0,
        'max': 100
      };

      $scrubber.hammer();

      $scrubber.sonyDraggable({
        'axis': 'x',
        'unit': '%',
        'containment': $scrubberContainer,
        'drag': function(e) {
          self.onDrag(e);
        },
        'bounds': bounds
      });

      $scrubber.on('release dragend', function() {
        self.snapToNearest();
      });

      return self;
    },

    updatePoints: function() {

      var self = this,
        $points = self.$el.find('a');

      $points.each(function() {
        $(this).css({
          left: $(this).data('position') + '%'
        });
      });

      self.snapToNearest();

      return self;
    },

    bindUIEvents: function() {

      var self = this;

      self.$el.hammer();

      self.$el.on('tap', 'a', function(e) {
        e.preventDefault();
        self.gotoPosition(self.$el.find('a').index($(this)));
      });

      return self;
    },

    bindAPI: function() {

      var self = this;

      self.$el.on('SonySlideNav:goto', function(e, which) {
        self.gotoPosition(which);
      });

      self.$el.on('SonySlideNav:update', function(e) {
        self.updatePoints();
      });

      return self;
    },

    onDrag: function(e) {

      var self = this,
        newLeft = e.position.left;

      self.$el.trigger('SonySlideNav:drag', newLeft);

      return self;
    },

    gotoPosition: function(which) {

      var self = this,
        $scrubber = self.$el.find('.scrubber'),
        $points = self.$el.find('a'),
        $destination = $points.eq(which);

      if ($destination.length === 0) {
        return false;
      }

      $scrubber.sonyDraggable('snapTo', 'x', $destination.position().left / self.$el.width() * 100);

      $points.removeClass('active');
      $destination.addClass('active');

      return self;
    },

    snapToNearest: function() {

      var self = this,
        $points = self.$el.find('a'),
        $scrubber = self.$el.find('.scrubber'),
        scrubberLeft = Utilities.getElementCenter($scrubber.get(0)).x,
        positions = [],
        destination;

      $points.each(function() {
        positions.push(Utilities.getElementCenter(this).x);
      });

      destination = positions.indexOf(Utilities.closestInArray(positions, scrubberLeft));

      self.gotoPosition(destination);

      return self;
    }
  };

  return SonySlideNav;
});