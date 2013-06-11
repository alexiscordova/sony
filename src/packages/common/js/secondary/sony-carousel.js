
// Sony Carousel (SonyCarousel) Module
// --------------------------------------------
//
// * **Class:** SonyCarousel
// * **Version:** 0.1
// * **Modified:** 03/19/2013
// * **Author:** George Pantazis
// * **Dependencies:** jQuery 1.7+
//
// This plugin is used to create flexible carousels. Given that *#foo* is an element containing a
// number of slides, hidden by *#foo-carousel-wrapper*'s `overflow: hidden;` property, #foo will
// become draggable with each slide being a snap-point for progression between the slides.
// Additionally, your CSS should be such that the carousel can have slides added to it
// on either end without breaking; this allows for "infinite" carousels.
//
// Refer to this Jade structure:
//
//      div#foo-carousel-wrapper
//        div#foo
//          div.foo-carousel-slide
//            div.foo-slide-children
//            div.foo-slide-children
//          div.foo-carousel-slide
//            div.foo-slide-children
//            div.foo-slide-children
//          div.foo-carousel-slide
//            div.foo-slide-children
//            div.foo-slide-children
//
// *Example Usage:*
//
// See Defaults for detailed explanation of properties. The sonyCarousel() method should be called
// on the draggable carousel object.
//
//      $('#foo').sonyCarousel({
//        wrapper: '#foo-carousel-wrapper',
//        slides: '.foo-carousel-slide',
//        slideChildren: '.foo-slide-children',
//        useCSS3: true,
//        paddles: true,
//        pagination: true
//      });
//
// Go to a specific slide (0-based).
//
//      $('#foo').sonyCarousel('gotoSlide', 0);
//
// If you've replaced or manipulated the slides, tell SonyCarousel to cache them again.
//
//      $('#foo').sonyCarousel('resetSlides');
//
// If you need to destroy the carousel, run the method below. You should be sure
// to run destroy if you're wiping/reinitializing your carousels as part of resize
// or something similar; otherwise you'll retain a ton of references in memory that
// can't be garbage-collected.
//
//      $('#foo').sonyCarousel('destroy');
//
// If you need to execute code at the end of an animation sequence, bind to the
// `SonyCarousel:AnimationComplete` event.
//
//      $('#foo').on('SonyCarousel:AnimationComplete', function(){...});

define(function(require){

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      iQ = require('iQ'),
      Settings = require('require/sony-global-settings'),
      Utilities = require('require/sony-global-utilities'),
      Environment = require('require/sony-global-environment'),
      hammer = require('plugins/index').hammer,
      sonyDraggable = require('secondary/sony-draggable'),
      sonyPaddles = require('secondary/sony-paddles'),
      sonyNavigationDots = require('secondary/sony-navigationdots');

  var _id = 0;

  var SonyCarousel = function($element, options){
    var self = this;

    $.extend(self, {}, $.fn.sonyCarousel.defaults, options, $.fn.sonyCarousel.settings);

    self.currentSlide = 0;
    self.id = _id++;
    self.$el = $element;
    self.$wrapper = self.$el.parent(self.wrapper);

    self.init();
  };

  SonyCarousel.prototype = {

    constructor: SonyCarousel,

    init: function() {

      var self = this;

      self.resetSlides( true );

      if ( self.direction === 'vertical' ) {
        self.posAttr = 'top';
      } else {
        self.posAttr = 'left';
      }

      if ( self.useCSS3 ) {

        // Check to see if this browser actually supports CSS3.
        if ( !Modernizr.csstransforms || !Modernizr.csstransitions ) {
          self.useCSS3 = false;
        } else {
          self.$el.css(Modernizr.prefixed('transitionTimingFunction'), self.CSS3Easing);
        }
      }

      if ( self.draggable ) {
        self.setupDraggable();
      }

      if ( self.$slides.length <= 1 ) {
        self.destroy();
        return;
      }

      Environment.on('global:resizeDebounced-200ms.SonyCarousel-' + self.id, function() {
        if ( self.snap ) {
          self.gotoSlide(Math.min.apply(Math, [self.currentSlide, self.$slides.length - 1]));
        }
      });

      self.gotoSlide(0, true);

      self.$el.addClass('sony-carousel-active');
    },

    setupLoopedCarousel: function() {

      var self = this,
          $clonedSlides = $();

      self.$allSlides = self.$slides;

      for ( var i = 0; i < self.edgeSlides; i++ ) {

        var $frontSlide = self.$slides.eq(i).clone(true),
            $backSlide = self.$slides.eq(self.$slides.length - 1 - i).clone(true);

        $frontSlide.addClass(self.cloneClass)
            .data('sonyCarouselGoto', i);

        $backSlide.addClass(self.cloneClass)
            .data('sonyCarouselGoto', self.$slides.length - 1 - i);

        self.$el.append($frontSlide).prepend($backSlide);

        iQ.reset();

        $clonedSlides = $clonedSlides.add($frontSlide).add($backSlide);
      }

      self.$allSlides = self.$allSlides.add($clonedSlides);

      $clonedSlides.find('a').removeAttr('href');
    },

    setupDraggable: function() {

      var self = this,
          axis = 'x';

      if ( self.direction === 'vertical' ) {
        axis = 'y';
      }

      self.$el.sonyDraggable({
        'axis': axis,
        'dragThreshold': self.dragThreshold,
        'nonDraggableChildren': self.nonDraggableChildren,
        'containment': self.$wrapper,
        'useCSS3': self.useCSS3,
        'drag': iQ.update
      });

      self.$el.hammer();
      self.$el.on('dragstart.sonycarousel', $.proxy(self.dragStart, self));
      self.$el.on('dragend.sonycarousel', $.proxy(self.dragEnd, self));
    },

    // Stop animations that were ongoing when you started to drag.

    dragStart: function() {

      var self = this;

      self.isDragging = true;
      self.startInteractionTime = new Date().getTime();
      self.$el.stop();
    },

    // Depending on how fast you were dragging, either proceed to an adjacent slide or
    // reset position to the nearest one.

    dragEnd: function(e) {

      var self = this,
          gesture = e.gesture;

      self.isDragging = false;

      if ( !self.snap ) {

        if ( self.onlySnapAtEnds ) {
          self.snapAtEnds();
        }

        return;
      }

      if ( gesture.velocityX > 0.7 ) {
        if ( gesture.direction === 'right' ) {
          if ( self.currentSlide === 0 ) {
            self.gotoNearestSlide();
          } else {
            self.gotoSlide(self.currentSlide - 1);
          }
        } else if ( gesture.direction === 'left' ) {
          if ( self.currentSlide === self.$slides.length - 1 ) {
            self.gotoNearestSlide();
          } else {
            self.gotoSlide(self.currentSlide + 1);
          }
        }
      } else {
        self.gotoNearestSlide();
      }
    },

    getPositions: function($slideSet) {

      var self = this,
          bounds = self.$wrapper.get(0).getBoundingClientRect()[self.posAttr],
          positions = [],
          destination;

      $slideSet.each(function(a){
        positions.push(this.getBoundingClientRect()[self.posAttr] - bounds);
      });

      return positions;
    },

    // Find the nearest slide, and move the carousel to that.

    gotoNearestSlide: function(e, data) {

      var self = this,
          $slideSet = self.$allSlides || self.$slides,
          destination, positions;

      positions = self.getPositions($slideSet);

      destination = positions.indexOf(Utilities.closestInArray(positions, 0));

      if ( self.looped ) {
        destination -= self.edgeSlides;
      }

      self.gotoSlide(destination);
    },

    // START GOTOSLIDE UTILITY METHODS

    // If this is a looped carousel, substitue the slideset with the slides *including* the edge clones,
    // And figure out where the $destination should be set based on that.

    setupLoopedCarouselSlides: function(which, $slideSet, cb) {

      var self = this,
          $destinationSlide;

      if ( self.looped && ( which === -1 || which >= self.$slides.length )) {
        $slideSet = self.$allSlides;
        if ( which === -1 ) {
          $destinationSlide = $slideSet.eq(self.edgeSlides - 1);
        } else if ( which >= self.$slides.length ) {
          $destinationSlide = $slideSet.eq(self.edgeSlides + self.$slides.length);
        }
      } else {
        $destinationSlide = $slideSet.eq(which);
      }

      cb($slideSet, $destinationSlide);
    },

    // If this is a jumped carousel, prepare the slides for the jump by swapping elements out and
    // setting the `isJumped` option.

    setupJumpedCarouselSlides: function(speed, $destinationSlide) {

      var self = this;

      if ( self.jumping && !self.isJumped && self.$slides.filter($destinationSlide).length > 0 && speed ) {

        var positions = self.getPositions(self.$slides),
            destIndex = self.$slides.index($destinationSlide),
            currentIndex = positions.indexOf(Utilities.closestInArray(positions, 0)),
            leftIndex, rightIndex, positionsExcludingCurrent;

        if ( Math.abs(currentIndex - destIndex) > 1 ) {

          self.isJumped = true;

          positionsExcludingCurrent = positions.slice(0);
          positionsExcludingCurrent.splice(currentIndex, 1);

          leftIndex = positions.indexOf(Utilities.closestInArray(positionsExcludingCurrent, 0, '<'));
          rightIndex = positions.indexOf(Utilities.closestInArray(positionsExcludingCurrent, 0, '>'));

          if ( destIndex > currentIndex ) {
            Utilities.swapElements(self.$slides.eq(rightIndex), $destinationSlide);
          } else if ( destIndex < currentIndex ) {
            Utilities.swapElements(self.$slides.eq(leftIndex), $destinationSlide);
          }
        }
      }
    },

    // Return the destination position. If you're in a browser that doesn't support auto margins properly,
    // correct the value with `innerContainerMeasurement` (the container's width or height, depending on
    // carousel orientation) before returning.
    //
    // The auto-margin fix should only be needed for carousels like the OSC (S2) module, which
    // respect the grid even though they're not really in it. Refer to S2 for usage example;
    // `sony-carousel-flex` is the required trigger class for that layout strategy.

    getDestinationPosition: function($destinationSlide, innerContainerMeasurement) {

      var self = this,
          destinationPosition;

      destinationPosition = $destinationSlide.position()[self.posAttr];

      if ( !Modernizr.jsautomargins && self.$el.hasClass('sony-carousel-flex') ) {
        if ( self.direction === 'horizontal' ) {
          destinationPosition -= ( innerContainerMeasurement - $destinationSlide.width() ) / 2;
        } else {
          destinationPosition -= ( innerContainerMeasurement - $destinationSlide.height() ) / 2;
        }
      }

      return destinationPosition;
    },

    gotoSlide: function(which, noAnim) {

      var self = this,
          $slideSet = self.$slides,
          speed = ( noAnim ? 0 : self.animationSpeed ),
          $destinationSlide, destinationPosition, destinationRedirect, innerContainerMeasurement, repositionCb, newPosition;

      self.setupLoopedCarouselSlides(which, $slideSet, function($slides, $dest){
        $slideSet = $slides;
        $destinationSlide = $dest;
      });

      self.setupJumpedCarouselSlides(speed, $destinationSlide);

      if ( $destinationSlide.length === 0 ) { return; }

      if ( self.direction === 'horizontal' ) {
        innerContainerMeasurement = self.$el.width();
      } else {
        innerContainerMeasurement = self.$el.height();
      }

      destinationPosition = self.getDestinationPosition( $destinationSlide, innerContainerMeasurement );

      if ( self.useCSS3 ) {

        newPosition = destinationPosition / innerContainerMeasurement;

        // If you're on the last slide, only move over enough to show the last child.
        // Prevents excess whitespace on the right.

        if ( self.slideChildren && which === $slideSet.length - 1 ) {
          var childrenSumMeasurement = 0;

          if ( self.direction === 'horizontal' ) {
            $destinationSlide.find(self.slideChildren).each(function(){ childrenSumMeasurement += $(this).outerWidth(true); });
            newPosition = (destinationPosition - ( $destinationSlide.width() - childrenSumMeasurement )) / innerContainerMeasurement;
          }

        }

        self.$el.on(Settings.transEndEventName + '.slideMoveEnd', function(e){

          if ( e.currentTarget !== e.target ) {
            return;
          }

          iQ.update();
          self.$el.trigger('SonyCarousel:AnimationComplete');
          self.$el.off(Settings.transEndEventName + '.slideMoveEnd');
        });

        self.$el.css(Modernizr.prefixed('transitionDuration'), speed + 'ms' );

        if ( self.direction === 'horizontal' ) {
          self.$el.css(Modernizr.prefixed('transform'), 'translate(' + (-100 * newPosition + '%') + ', 0)');
        } else {
          self.$el.css(Modernizr.prefixed('transform'), 'translate(0, ' + (-100 * newPosition + '%') + ')');
        }

      } else {

        var props = {};

        if ( self.direction === 'horizontal' ) {
          props[self.posAttr] = -100 * destinationPosition / self.$wrapper.width() + '%';
        } else {
          props[self.posAttr] = -100 * destinationPosition / self.$wrapper.height() + '%';
        }

        self.$el.animate(props, {
          'duration': speed,
          'complete': function(){
            iQ.update();
            self.$el.trigger('SonyCarousel:AnimationComplete');
          }
        });
      }

      // If you've taken the carousel out of its normal flow (either with `self.jumping` or `self.looped`)
      // Reset the carousel to its natural position and order.

      destinationRedirect = $destinationSlide.data('sonyCarouselGoto');

      if ( ( self.isJumped && speed ) || typeof destinationRedirect !== 'undefined' ) {

        repositionCb = Utilities.once(function(e){

          if ( e && (e.currentTarget !== e.target)) {
            return;
          }

          if ( self.isJumped ) {
            ( self.$allSlides || self.$slides ).each(function(){
              $(this).detach().appendTo(self.$el);
            });
          }

          // Given the jump of a looped carousel, we must update before and after the swap.
          iQ.update();
          self.gotoSlide( self.isJumped ? which : destinationRedirect, true );
          iQ.update();

          self.isJumped = false;
        });

        if ( self.useCSS3 ) {
          self.$el.on(Settings.transEndEventName, repositionCb);
        } else {
          setTimeout(repositionCb, speed);
        }

        return;
      }

      self.currentSlide = which;

      self.$el.trigger('SonyCarousel:gotoSlide', self.currentSlide);
    },

    snapAtEnds: function() {

      var self = this,
          lastSlide = self.$slides.length - 1;

      if ( self.$slides.get(0).getBoundingClientRect().left - self.$wrapper.get(0).getBoundingClientRect().left > 0 ) {
        self.gotoSlide(0);
        return;
      }

      if ( self.$slides.get(lastSlide).getBoundingClientRect().right - self.$wrapper.get(0).getBoundingClientRect().right  < 0 ) {
        self.gotoSlide(lastSlide);
        return;
      }
    },

    createPagination: function () {

      var self = this;

      if ( self.$slides.length <= 1 ) {
        return;
      }

      if ( self.$dotnav ) {
        self.$dotnav.sonyNavDots('reset', {
          'buttonCount': self.$slides.length
        });
        return;
      }

      var $dotnavWrapper = $('<div class="sony-dot-nav" />');

      if ( self.$dotNavWrapper ) {
        $dotnavWrapper.appendTo(self.$dotNavWrapper);
      } else {
        $dotnavWrapper.insertAfter(self.$wrapper);
      }

      self.$dotnav = $dotnavWrapper.sonyNavDots({
        'buttonCount': self.$slides.length,
        'theme': self.paginationTheme
      });

      self.$dotnav.on('SonyNavDots:clicked', function(e, which) {
        self.gotoSlide(which);
      });

      self.$el.on('SonyCarousel:gotoSlide', function(e, which) {
        self.$dotnav.sonyNavDots('reset', {
          'activeButton': which
        });
      });
    },

    createPaddles: function() {

      var self = this,
          $wrapper = self.$paddleWrapper || self.$wrapper;

      if ( Modernizr.touch || self.paddlesInit ) {
        return;
      }

      self.paddlesInit = true;

      $wrapper.sonyPaddles({
        useSmallPaddles: self.useSmallPaddles,
        paddlePosition: self.paddlePosition
      });

      self.$el.on('SonyCarousel:gotoSlide', function(e, which) {

        $wrapper.sonyPaddles('showPaddle', 'both');

        if ( which === 0 && !self.looped ) {
          $wrapper.sonyPaddles('hidePaddle', 'left');
        }

        if ( which === self.$slides.length - 1 && !self.looped ) {
          $wrapper.sonyPaddles('hidePaddle', 'right');
        }
      });

      $wrapper.on('sonyPaddles:clickLeft', function(e){
        e.stopPropagation();
        self.gotoSlide(self.currentSlide - 1);
      });

      $wrapper.on('sonyPaddles:clickRight', function(e){
        e.stopPropagation();
        self.gotoSlide(self.currentSlide + 1);
      });
    },

    // Update animation speed, in ms.
    //
    //      $('#foo').sonyCarousel('setAnimationSpeed', 100);
    //
    setAnimationSpeed: function(newSpeed){

      var self = this;

      self.animationSpeed = newSpeed;
    },

    // Update CSS3 Easing equation.
    //
    //      $('#foo').sonyCarousel('setCSS3Easing', 'ease-in');
    //      $('#foo').sonyCarousel('setCSS3Easing',
    //          'cubic-bezier(0.000, 1.035, 0.400, 0.985)');
    //
    setCSS3Easing: function(bezierStr){

      var self = this;

      self.CSS3Easing = bezierStr;
    },

    resetSlides: function( isInit ) {

      var self = this,
          $clickContext;

      if ( !isInit ) {
        // Remove the event because we're going to subscribe to it again
        $clickContext = self.slideChildren ? self.$el.find(self.slideChildren) : self.$slides;
        $clickContext.off('click.sonycarousel');
      }

      self.$slides = self.$el.find(self.slides).not(self.cloneClass);

      if ( self.looped ) {
        self.setupLoopedCarousel();
      }

      if ( self.paddles ) {
        self.createPaddles();
      }

      if ( self.pagination ) {
        self.createPagination();
      }

      self.$el.find('a').on('focus', function(e){
        self.gotoSlide(self.$slides.index($(this).closest(self.$slides)));
      });
    },

    // Reset the style attribute for the properties we might have manipulated.
    // Destroy the plugins we've initialized as part of the carousel.

    destroy: function() {

      var self = this,
          $paddleWrapper = self.$paddleWrapper || self.$wrapper,
          $clickContext = self.slideChildren ? self.$el.find(self.slideChildren) : self.$slides,
          containerStyles = {
            transitionTimingFunction: '',
            transitionDuration: '',
            transform: ''
          };

      containerStyles[ self.posAttr ] = '';

      // Reset styles.
      self.$el.css( containerStyles );

      // Unbind
      Environment.off('global:resizeDebounced-200ms.SonyCarousel-' + self.id);
      self.$el.off('dragstart.sonycarousel dragend.sonycarousel SonyCarousel:gotoSlide ' + Settings.transEndEventName + '.slideMoveEnd');
      $clickContext.off('click.sonycarousel');

      // Destroy all plugins.
      if ( self.draggable ) {
        self.$el.sonyDraggable('destroy');
      }

      if ( self.paddles ) {
        $paddleWrapper.sonyPaddles('destroy');
        $paddleWrapper.off('sonyPaddles:clickLeft');
        $paddleWrapper.off('sonyPaddles:clickRight');
      }

      if ( self.$dotnav ) {
        self.$dotnav.sonyNavDots('destroy');
        self.$dotnav.remove();
        self.$dotnav = null;
      }

      // Remove data from element, allowing for later reinit.
      self.$el.removeData('sonyCarousel');
      self.$el.removeClass('sony-carousel-active');
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

        if ( typeof options === 'string' ) {
          return;
        }

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

    direction: 'horizontal',

    // **Required**: Selector for the `overflow:hidden;` element that wraps the draggable object.
    // Accessed by .parent() method.
    wrapper: undefined,

    // **Required**: Selector for the individual slides within the carousel, used for
    // positioning, snapping, and pagination.
    slides: undefined,

    // If a selector is specified, gotoSlide will look for this on the last slide
    // and not reveal unneccesary whitespace to the right of the last matched element.
    slideChildren: undefined,

    // If a selector is specified, the matched anchor's href will be the default click for any point
    // in the slideChildren set.
    defaultLink: undefined,

    // Should this be draggable? True for most carousels, so default on.
    draggable: true,

    // Set a valid selector to define children of hte carousel that should *not* trigger a drag.
    nonDraggableChildren: undefined,

    // Should this carousel seamlessly loop from end to end?
    looped: false,

    snap: true,

    onlySnapAtEnds: false,

    // Should the carousel jump directly to the next slide in either direction?
    jumping: false,

    // If this is a looped carousel, how many clones should be on either side to create the infinite illusion?
    // Helpful if your carousel lets the user see more than a few slides at once.
    edgeSlides: 1,

    // Default class for edgeSlides.
    cloneClass: 'sony-carousel-edge-clone',

    // Speed of slide animation, in ms.
    animationSpeed: 500,

    //default CSS3 easing equation
    CSS3Easing: 'cubic-bezier(0.000, 1.035, 0.400, 0.985)',

    // Which direction the carousel moves in. Plugin currently only supports 'x'.
    axis: 'x',

    // Amount of distance user must move in touch environments before the carousel begins to move
    // **and** preventDefault() is triggered. Allows for vertical scrolling before trapping the touch.
    dragThreshold: Settings.isVita ? 5 : 10,

    // Use CSS3 transitions and transforms over jQuery animations if possible.
    useCSS3: true,

    // Create paddles.
    paddles: false,

    // Set to `outset` to allow grid-based positioning of paddles above 1400px screen width.
    paddlePosition: 'inset',

    // Will use `.nav-paddle` instead of `.pagination-paddle` for the paddle class
    useSmallPaddles: false,

    // If element is specified, insert pagination into that element instead of using the default position.
    $dotNavWrapper: undefined,

    // If element is specified, insert paddles into that element instead of using the default position.
    $paddleWrapper: undefined,

    // Create dot pagination, which is inserted after self.$el.
    pagination: false,

    // Use `light` or `dark` bullets for pagination.
    paginationTheme: 'dark'
  };

});