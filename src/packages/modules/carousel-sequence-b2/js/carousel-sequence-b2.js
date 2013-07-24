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
      Settings = require('require/sony-global-settings'),
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
        animationspeed: 500,
        loop: true,
        viewcontrols: true
      });

      self.createPaddles();
      self.subscribeToEvents();
      self.onResize();
    },

    setVars : function() {
      var self = this,
          data;

      self.$btnTrigger = self.$el.find( '.js-cta' );
      self.$cover = self.$el.find( '.cs-cover' );
      self.$inner = self.$el.find( '.cs-inner' );
      data = self.$inner.data();
      self.stops = data.stops;
      self.totalStops = self.stops.length;
      self.currentStop = 0;

      console.log('stops:', self.stops);

      return self;
    },

    subscribeToEvents : function() {
      var self = this;

      // Listen for global resize
      Environment.on('global:resizeDebounced', $.proxy( self.onResize, self ));

      // Show sequence when the CTA button is clicked
      self.$btnTrigger.on( 'click', $.proxy( self.onCTAClick, self ) );

      // Place the cover behind the sequence when it has been hidden
      self.$cover.on( Settings.transEndEventName, $.proxy( self.onCoverTransitionEnd, self ) );
    },

    createPaddles : function() {
      var self = this,
          $wrapper = self.$inner;

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

    onCTAClick : function() {
      var self = this;

      self.$inner.removeClass('invisible');
      self.$cover.removeClass('in');
    },

    onCoverTransitionEnd : function( evt ) {
      var self = this,
          cover = self.$cover[ 0 ],
          target = evt.target;

      // A transition event has bubbled up to the cover
      // this is not the event the cover is looking for, so exit
      if ( cover !== target ) {
        return;
      }

      // Only want to listen for this event once
      self.$cover.off( Settings.transEndEventName );

      // Add state to module
      self.$el.addClass( 'is-sequence-visible' );

      // Hide cover after it faded out (avoid browser painting it)
      self.$cover.addClass('invisible');
    },

    getStop : function( index ) {
      return index < 0 ?
        this.totalStops - 1 :
        index >= this.totalStops ?
          0 :
          index;
    },

    gotoStop : function( index ) {
      var self = this,
          stop = self.getStop( index );

      self.currentStop = stop;
      console.log( 'goto:', stop, 'which is index:', self.stops[ stop ] );
      self.sequence.startAnimation( self.stops[ stop ] );
    },

    prev : function() {
      return this.gotoStop( this.currentStop - 1 );
    },

    next : function() {
      return this.gotoStop( this.currentStop + 1 );
    }
  };

  return CarouselSequence;
 });
