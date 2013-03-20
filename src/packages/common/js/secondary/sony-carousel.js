
// Sony Carousel (SonyCarousel) Module
// --------------------------------------------
//
// * **Class:** SonyCarousel
// * **Version:** 0.1
// * **Modified:** 03/19/2013
// * **Author:** George Pantazis
// * **Dependencies:** jQuery 1.7+
//
// *Example Usage:*
//
// See Defaults for detailed explanation of properties.
//
//      $('#foo').sonyCarousel({
//        $wrapper: $('#foo-carousel-wrapper'),
//        $draggable: $('#foo-carousel-container'),
//        $slides: $('.foo-carousel-slides'),
//        slideChildren: '.foo-slide-children',
//        axis: 'x',
//        unit: '%',
//        dragThreshold: 10,
//        useCSS3: true,
//        paddles: true,
//        pagination: true
//      });
//
// Go to a specific slide (0-based).
//
//      $('#foo').sonyCarousel('gotoSlide', 0);
//
// If you've replaced or manipulated the slides, gather them up and tell SonyCarousel to update.
//
//      $('#foo').sonyCarousel('setSlides', $newSlides);


define(function(require){

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      iQ = require('iQ'),
      Settings = require('require/sony-global-settings'),
      Environment = require('require/sony-global-environment'),
      sonyDraggable = require('secondary/sony-draggable'),
      sonyPaddles = require('secondary/sony-paddles'),
      sonyNavigationDots = require('secondary/sony-draggable');

  var SonyCarousel = function($element, options){
    var self = this;

    $.extend(self, {}, $.fn.sonyCarousel.defaults, options, $.fn.sonyCarousel.settings);

    self.$el = $element;

    self.init();
  };

  SonyCarousel.prototype = {

    constructor: SonyCarousel,

    init: function() {

      var self = this;

      self.setupLinkClicks();
      self.setupDraggable();
    },

    setupDraggable: function() {

      var self = this;

      self.currentSlide = 0;

      if ( self.useCSS3 ) {
        self.$draggable.css(Modernizr.prefixed('transitionTimingFunction'), 'cubic-bezier(0.450, 0.735, 0.445, 0.895)');
      }

      self.$draggable.sonyDraggable({
        'axis': self.axis,
        'unit': self.unit,
        'dragThreshold': self.dragThreshold,
        'containment': self.$wrapper,
        'useCSS3': self.useCSS3,
        'drag': function(){ iQ.update(true); }
      });

      if ( self.paddles ) {
        self.createPaddles();
      }

      if ( self.pagination ) {
        self.createPagination();
      }

      Environment.on('global:resizeDebounced-200ms', function(){
        self.gotoSlide(Math.min.apply(Math, [self.currentSlide, self.$slides.length - 1]));
      });

      self.$draggable.on('sonyDraggable:dragStart',  $.proxy(self.dragStart, self));
      self.$draggable.on('sonyDraggable:dragEnd',  $.proxy(self.dragEnd, self));
    },

    // Stop animations that were ongoing when you started to drag.

    dragStart: function() {

      var self = this;

      self.startInteractionTime = new Date().getTime();
      self.$draggable.stop();
    },

    // Depending on how fast you were dragging, either proceed to an adjacent slide or
    // reset position to the nearest one.

    dragEnd: function(e, data) {

      var self = this,
          goToWhich;

      if ( data.acceleration.x > 150 ) {

        if ( self.currentSlide === 0 ) {
          self.gotoNearestSlide();
        } else {
          self.gotoSlide(self.currentSlide - 1);
        }
      } else if ( data.acceleration.x < -150 ) {

        if ( self.currentSlide === self.$slides.length - 1 ) {
          self.gotoNearestSlide();
        } else {
          self.gotoSlide(self.currentSlide + 1);
        }
      } else {
        self.gotoNearestSlide();
      }
    },

    // Find the nearest slide, and move the carousel to that.

    gotoNearestSlide: function(e, data) {

      var self = this,
          leftBounds = self.$wrapper.get(0).getBoundingClientRect().left,
          positions = [];

      self.$slides.each(function(a){
        positions.push(Math.abs(leftBounds - this.getBoundingClientRect().left));
      });

      self.gotoSlide(positions.indexOf(Math.min.apply(Math, positions)));
    },

    // Go to a given slide.

    gotoSlide: function(which) {

      var self = this,
          $destinationSlide = self.$slides.eq(which),
          destinationLeft, innerContainerWidth;

      if ( $destinationSlide.length === 0 ) { return; }

      self.currentSlide = which;

      destinationLeft = $destinationSlide.position().left;
      innerContainerWidth = self.$draggable.width();

      // If the browser doesn't properly support the getStyles API for auto margins, manually
      // shift the destination back to compensate.

      if ( !Modernizr.jsautomargins ) {
        destinationLeft -= ( innerContainerWidth -  $destinationSlide.width() ) / 2;
      }

      if ( self.useCSS3 ) {

        var newPosition = destinationLeft / innerContainerWidth;

        // If you're on the last slide, only move over enough to show the last child.
        // Prevents excess whitespace on the right.

        if ( self.slideChildren && which === self.$slides.length - 1 ) {
          var childrenWidth = 0;
          $destinationSlide.find(self.slideChildren).each(function(){ childrenWidth += $(this).outerWidth(true); });
          newPosition = (destinationLeft - ( $destinationSlide.width() - childrenWidth )) / innerContainerWidth;
        }

        self.$draggable.css(Modernizr.prefixed('transitionDuration'), '450ms');
        self.$draggable.css(Modernizr.prefixed('transform'), 'translate(' + (-100 * newPosition + '%') + ',0)');

      } else {

        self.$draggable.animate({
          'left': -100 * destinationLeft / Settings.$window.width() + '%'
        }, {
          'duration': 350,
          'complete': function(){ iQ.update(true); }
        });
      }

      self.$el.trigger('oneSonyCarousel:gotoSlide', self.currentSlide);
    },

    createPagination: function () {

      var self = this;

      if ( self.$dotnav ) {
        self.$dotnav.sonyNavDots('reset', {
          'buttonCount': self.$slides.length
        });
        return;
      }

      var $dotnavWrapper = $('<div class="sony-dot-nav" />');

      $dotnavWrapper.insertAfter(self.$el);

      self.$dotnav = $dotnavWrapper.sonyNavDots({
        'buttonCount': self.$slides.length
      });

      self.$dotnav.on('SonyNavDots:clicked', function(e, which) {
        self.gotoSlide(which);
      });

      self.$el.on('oneSonyCarousel:gotoSlide', function(e, which) {
        self.$dotnav.sonyNavDots('reset', {
          'activeButton': which
        });

        if( $('html').hasClass('lt-ie9') ){
          var height = 0;
          self.$dotnav.css('display' , 'none');
          height = self.$dotnav.get(0).offsetHeight;
          self.$dotnav.css('display' , 'block');
        }
      });
    },

    createPaddles: function() {

      var self = this;

      if ( Modernizr.touch ) {
        return;
      }

      self.$el.sonyPaddles();

      self.$el.on('oneSonyCarousel:gotoSlide', function(e, which) {

        self.$el.sonyPaddles('showPaddle', 'left');
        self.$el.sonyPaddles('showPaddle', 'right');

        if ( which === 0 ) {
          self.$el.sonyPaddles('hidePaddle', 'left');
        }

        if ( which === self.$slides.length - 1 ) {
          self.$el.sonyPaddles('hidePaddle', 'right');
        }
      });

      self.$el.on('sonyPaddles:clickLeft', function(){
        self.gotoSlide(self.currentSlide - 1);
      });

      self.$el.on('sonyPaddles:clickRight', function(){
        self.gotoSlide(self.currentSlide + 1);
      });
    },

    // To prevent drags from being misinterpreted as clicks, we only redirect the user
    // if their interaction time and movements are below certain thresholds.

    setupLinkClicks: function() {

      var self = this;

      self.$el.find(self.slideChildren).on('click', function(e){

        var $this = $(this),
            destination = $this.find(self.defaultLink).attr('href'),
            closestLink = $(e.target).closest('a').attr('href');

        if ( !self.isDragging ) {

          if ((new Date().getTime()) - self.startInteractionTime < 250 ) {

            if ( !closestLink && !destination ) {
              return;
            }

            if ( closestLink && closestLink !== destination ) {
              destination = closestLink;
            }

            window.location = destination;
          }
        }
      });
    },

    setSlides: function($newSlides) {

      var self = this;

      self.$slides = $newSlides;
      self.createPagination();
    }
  };

  // jQuery Plugin Definition
  // ------------------------

  $.fn.sonyCarousel = function( options ) {
    var args = Array.prototype.slice.call( arguments, 1 );
    return this.each(function() {
      var self = $(this),
        sonyCarousel = self.data('sonyCarousel');

      if ( !sonyCarousel ) {
          sonyCarousel = new SonyCarousel( self, options );
          self.data( 'sonyCarousel', sonyCarousel );
      }

      if ( typeof options === 'string' ) {
        sonyCarousel[ options ].apply( sonyCarousel, args );
      }
    });
  };

  // Defaults
  // --------

  $.fn.sonyCarousel.defaults = {

    // **Required**: The `overflow:hidden;` element that wraps the carousel ($draggable).
    $wrapper: undefined,

    // **Required**: The draggable object, usually a long `<div>` masked by $wrapper.
    $draggable: undefined,

    // **Required**: A jQuery object containing the individual slides within the carousel.
    // Used for positioning, pagination.
   $slides: undefined,

    // If a selector is specified, gotoSlide will look for this on the last slide
    // and not reveal unneccesary whitespace to the right of the last matched element.
    slideChildren: undefined,

    // If a selector is specified, the matched anchor's href will be the default click for any point
    // in the slideChildren set.
    defaultLink: undefined,

    // Which direction the carousel moves in. Plugin currently only supports 'x'.
    axis: 'x',

    // Unit by which sony-draggable positions the carousel. Plugin not tested for 'px'.
    unit: '%',

    // Amount of distance user must move in touch environments before the carousel begins to move
    // **and** preventDefault() is triggered. Allows for vertical scrolling before trapping the touch.
    dragThreshold: 10,

    // Use CSS3 transitions and transforms over jQuery animations if possible.
    useCSS3: true,

    // Create paddles.
    paddles: false,

    // Create dot pagination, which is inserted after self.$el.
    pagination: true
  };

});