// Feature Slideshow
// ------------
//
// * **Module:** Feature Slideshow
// * **Version:** 1.0
// * **Modified:** 06/24/2013
// * **Author:** Glen Cheney
// * **Dependencies:** jQuery 1.9.1+, Modernizr
//
// *Example Usage:*
//
//      new CarouselSequence( $('.carousel-sequence')[0] );

define(function(require) {

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      Environment = require('require/sony-global-environment'),
      SonySequence = require('secondary/index').sonySequence,
      sonyPaddles = require('secondary/index').sonyPaddles;

  var CarouselSequence = function( element ) {
    var self = this;

    // Set base element
    self.element = element;
    self.$el = $( element );

    // Inits the module
    self.init();

    self.$el.data( 'carouselSequence', self );

    log('SONY : CarouselSequence : Initialized');
  };

  CarouselSequence.prototype = {

    init : function() {
      var self = this;

      self.setVars();

      self.sequence = new SonySequence( self.$el, {
        loop: false,
        viewcontrols: false
      });

      self.createPaddles();
      self.subscribeToEvents();
      self.onResize();
    },

    setVars : function() {
      var self = this,
          data;

      return self;
    },

    subscribeToEvents : function() {
      var self = this;

      // Listen for global resize
      Environment.on('global:resizeDebounced', $.proxy( self.onResize, self ));
    },

    createPaddles : function() {
      var self = this,
          $wrapper = self.$el;

      $wrapper.sonyPaddles();

      // Show paddles by default
      $wrapper.sonyPaddles('showPaddle', 'both');

      $wrapper.on('sonyPaddles:clickLeft', function(e) {
        e.stopPropagation();
        self.prev();
      });

      $wrapper.on('sonyPaddles:clickRight', function(e) {
        e.stopPropagation();
        self.next();
      });
    },

    onResize : function() {

    },

    prev : function() {
      var self = this;
      console.log('right');
      self.sequence.startAnimation( 0 );
    },

    next : function() {
      var self = this;
      console.log('left');
      self.sequence.startAnimation( 8 );
    }
  };

  return CarouselSequence;
 });
