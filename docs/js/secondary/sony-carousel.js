
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
<<<<<<< HEAD
=======
// Additionally, your CSS should be such that the carousel can have slides added to it
// on either end without breaking; this allows for "infinite" carousels.
//
>>>>>>> origin/master
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


define(function(require){

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      iQ = require('iQ'),
      Settings = require('require/sony-global-settings'),
      Utilities = require('require/sony-global-utilities'),
      Environment = require('require/sony-global-environment'),
      sonyDraggable = require('secondary/sony-draggable'),
      sonyPaddles = require('secondary/sony-paddles'),
      sonyNavigationDots = require('secondary/sony-draggable');

  var SonyCarousel = function($element, options){
    var self = this;

    $.extend(self, {}, $.fn.sonyCarousel.defaults, options, $.fn.sonyCarousel.settings);

    self.$el = $element;
    self.$wrapper = self.$el.parent(self.wrapper);
    self.$slides = self.$el.find(self.slides);

    self.init();
  };

  SonyCarousel.prototype = {

    constructor: SonyCarousel,

    init: function() {

      var self = this;

      self.setupLinkClicks();
      self.setupDraggable();

      if ( self.looped ) {
        self.setupLoopedCarousel();
      }

      if ( self.paddles ) {
        self.createPaddles();
      }

      if ( self.pagination ) {
        self.createPagination();
      }

      Environment.on('global:resizeDebounced-200ms', function(){
        self.gotoSlide(Math.min.apply(Math, [self.currentSlide, self.$slides.length - 1]));
      });

      self.gotoSlide(0);
    },

    setupLoopedCarousel: function() {

      var self = this;

      self.$allSlides = self.$slides;

      for ( var i = 0; i < self.edgeSlides; i++ ) {

        var $frontSlide = self.$slides.eq(i).clone(true),
            $backSlide = self.$slides.eq(self.$slides.length - 1 - i).clone(true);

        $frontSlide.addClass('sony-carousel-edge-clone');
        $frontSlide.data('sonyCarouselGoto', i);

        $backSlide.addClass('sony-carousel-edge-clone');
        $backSlide.data('sonyCarouselGoto', self.$slides.length - 1 - i);

<<<<<<< HEAD
        self.$el.append($frontSlide);
        self.$el.prepend($backSlide);
=======
        self.$el.append($frontSlide).prepend($backSlide);
>>>>>>> origin/master

        self.$allSlides = self.$allSlides.add($frontSlide).add($backSlide);
      }
    },

    setupDraggable: function() {

      var self = this;

      self.currentSlide = 0;

      if ( self.useCSS3 ) {
        self.$el.css(Modernizr.prefixed('transitionTimingFunction'), 'cubic-bezier(0.450, 0.735, 0.445, 0.895)');
      }

      self.$el.sonyDraggable({
        'axis': self.axis,
        'unit': self.unit,
        'dragThreshold': self.dragThreshold,
        'containment': self.$wrapper,
        'useCSS3': self.useCSS3,
        'drag': function(){ iQ.update(true); }
      });

      self.$el.on('sonyDraggable:dragStart',  $.proxy(self.dragStart, self));
      self.$el.on('sonyDraggable:dragEnd',  $.proxy(self.dragEnd, self));
    },

    // Stop animations that were ongoing when you started to drag.

    dragStart: function() {

      var self = this;

      self.startInteractionTime = new Date().getTime();
      self.$el.stop();
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

    getPositions: function($slideSet) {

      var self = this,
          leftBounds = self.$wrapper.get(0).getBoundingClientRect().left,
          positions = [],
          destination;

      $slideSet.each(function(a){
        positions.push(this.getBoundingClientRect().left - leftBounds);
      });

      return positions;
    },

    // Find the nearest slide, and move the carousel to that.

    gotoNearestSlide: function(e, data) {

      var self = this,
          leftBounds = self.$wrapper.get(0).getBoundingClientRect().left,
          $slideSet = self.$allSlides || self.$slides,
<<<<<<< HEAD
          positions = [],
          destination;

      $slideSet.each(function(a){
        positions.push(Math.abs(leftBounds - this.getBoundingClientRect().left));
      });

      destination = positions.indexOf(Math.min.apply(Math, positions));

      if ( self.looped ) {
        destination -= self.edgeSlides;
      }

=======
          destination, positions;

      positions = self.getPositions($slideSet);

      destination = positions.indexOf(Utilities.closestInArray(positions, 0));

      if ( self.looped ) {
        destination -= self.edgeSlides;
      }

>>>>>>> origin/master
      self.gotoSlide(destination);
    },

    // Go to a given slide.
    // TODO: This is getting to be confusing. Should split it into a few methods for readability.

    gotoSlide: function(which, noAnim) {

      var self = this,
          $slideSet = self.$slides,
          speed = ( noAnim ? 0 : self.animationSpeed ),
          $destinationSlide, destinationLeft, innerContainerWidth;

<<<<<<< HEAD
=======
      // Logic for the natural ends of a carousel that has been looped

>>>>>>> origin/master
      if ( self.looped && ( which === -1 || which >= self.$slides.length )) {
        if ( which === -1 ) {
          $slideSet = self.$allSlides;
          $destinationSlide = $slideSet.eq(self.edgeSlides - 1);
        } else if ( which >= self.$slides.length ) {
          $slideSet = self.$allSlides;
          $destinationSlide = $slideSet.eq(self.edgeSlides + self.$slides.length);
        }
      } else {
        $destinationSlide = $slideSet.eq(which);
      }

      // Logic for swapping slides around, to make transitions from distant slides seamless. (see: `self.jumping`)

<<<<<<< HEAD
=======
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

      if ( $destinationSlide.length === 0 ) { return; }

>>>>>>> origin/master
      destinationLeft = $destinationSlide.position().left;
      innerContainerWidth = self.$el.width();

      // This exception is built specifically for carousels like the OSC (S2) module, which must
      // respect the grid even though they aren't really in it. Refer to S2 for usage example;
      // `sony-carousel-flex` is the required trigger class for that layout stategy.

      if ( !Modernizr.jsautomargins ) {
        if ( self.$el.hasClass('sony-carousel-flex') ) {
          destinationLeft -= ( innerContainerWidth -  $destinationSlide.width() ) / 2;
        }
      }

      if ( self.useCSS3 ) {

        var newPosition = destinationLeft / innerContainerWidth;

        // If you're on the last slide, only move over enough to show the last child.
        // Prevents excess whitespace on the right.

        if ( self.slideChildren && which === $slideSet.length - 1 ) {
          var childrenWidth = 0;
          $destinationSlide.find(self.slideChildren).each(function(){ childrenWidth += $(this).outerWidth(true); });
          newPosition = (destinationLeft - ( $destinationSlide.width() - childrenWidth )) / innerContainerWidth;
        }

        self.$el.css(Modernizr.prefixed('transitionDuration'), speed + 'ms' );
        self.$el.css(Modernizr.prefixed('transform'), 'translate(' + (-100 * newPosition + '%') + ',0)');

      } else {

        self.$el.animate({
          'left': -100 * destinationLeft / self.$wrapper.width() + '%'
        }, {
          'duration': speed,
          'complete': function(){ iQ.update(true); }
        });
      }

<<<<<<< HEAD
      if ( typeof $destinationSlide.data('sonyCarouselGoto') !== 'undefined' ) {
        setTimeout(function(){
          self.gotoSlide( $destinationSlide.data('sonyCarouselGoto'), true );
          iQ.update(true);
        }, speed);
=======
      // Reorder if you were jumping (see: `self.jumping`)
      // TODO: The callback logic here should be extracted, I'm re-typing it for the looped case below.

      if ( self.isJumped && speed ) {

        var jumpCb = Utilities.once(function(){

          self.$allSlides.each(function(){
            $(this).detach().appendTo(self.$el);
          });

          self.gotoSlide( which, true );
          iQ.update(true);

          self.isJumped = false;
        });

        if ( self.useCSS3 ) {
          self.$el.on(Settings.transEndEventName, jumpCb);
        } else {
          setTimeout(jumpCb, speed);
        }

        return;
      }

      // If this is a cloned slide, jump to the "real" slide.

      if ( typeof $destinationSlide.data('sonyCarouselGoto') !== 'undefined' ) {

        var loopedCb = Utilities.once(function(){
          self.gotoSlide( $destinationSlide.data('sonyCarouselGoto'), true );
          iQ.update(true);
        });

        if ( self.useCSS3 ) {
          self.$el.on(Settings.transEndEventName, loopedCb);
        } else {
          setTimeout(loopedCb, speed);
        }

>>>>>>> origin/master
        return;
      }

      self.currentSlide = which;

      self.$el.trigger('SonyCarousel:gotoSlide', self.currentSlide);
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

      $dotnavWrapper.insertAfter(self.$wrapper);

      self.$dotnav = $dotnavWrapper.sonyNavDots({
        'buttonCount': self.$slides.length
      });

      self.$dotnav.on('SonyNavDots:clicked', function(e, which) {
        self.gotoSlide(which);
      });

      self.$wrapper.on('SonyCarousel:gotoSlide', function(e, which) {
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

      var self = this,
          paddles = function(a,b){ self.$wrapper.sonyPaddles(a,b); };

      if ( Modernizr.touch ) {
        return;
      }

      paddles();

      self.$wrapper.on('SonyCarousel:gotoSlide', function(e, which) {

        paddles('showPaddle', 'left');
        paddles('showPaddle', 'right');

        if ( which === 0 && !self.looped ) {
<<<<<<< HEAD
          self.$wrapper.sonyPaddles('hidePaddle', 'left');
        }

        if ( which === self.$slides.length - 1 && !self.looped ) {
          self.$wrapper.sonyPaddles('hidePaddle', 'right');
=======
          paddles('hidePaddle', 'left');
        }

        if ( which === self.$slides.length - 1 && !self.looped ) {
          paddles('hidePaddle', 'right');
>>>>>>> origin/master
        }
      });

      self.$wrapper.on('sonyPaddles:clickLeft', function(){
        self.gotoSlide(self.currentSlide - 1);
      });

      self.$wrapper.on('sonyPaddles:clickRight', function(){
        self.gotoSlide(self.currentSlide + 1);
      });
    },

    // To prevent drags from being misinterpreted as clicks, we only redirect the user
    // if their interaction time and movements are below certain thresholds.

    setupLinkClicks: function() {

      var self = this,
          $clickContext;

      if ( self.slideChildren ) {
        $clickContext = self.$el.find(self.slideChildren);
      } else {
        $clickContext = self.$slides;
      }

      $clickContext.on('click', function(e){

        var $this = $(this),
            destination = $this.find(self.defaultLink).attr('href'),
            closestLink = $(e.target).closest('a').attr('href');

        if ( !self.isDragging ) {

          if ((new Date().getTime()) - self.startInteractionTime < 150 ) {

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

    resetSlides: function() {

      var self = this;

      self.$slides = self.$el.find(self.slides).not('.sony-carousel-edge-clone');

      if ( self.pagination ) {
        self.createPagination();
      }

      if ( self.looped ) {
        self.setupLoopedCarousel();
      }
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

    // Should this carousel seamlessly loop from end to end?
    looped: false,

<<<<<<< HEAD
=======
    // Should the carousel jump directly to the next slide in either direction?
    jumping: false,

>>>>>>> origin/master
    // If this is a looped carousel, how many clones should be on either side to create the infinite illusion?
    // Helpful if your carousel lets the user see more than a few slides at once.
    edgeSlides: 1,

    // Speed of slide animation, in ms.
    animationSpeed: 450,

    // Which direction the carousel moves in. Plugin currently only supports 'x'.
    axis: 'x',

    // Unit by which sony-draggable positions the carousel. Plugin not tested for 'px'... *yet*.
    unit: '%',

    // Amount of distance user must move in touch environments before the carousel begins to move
    // **and** preventDefault() is triggered. Allows for vertical scrolling before trapping the touch.
    dragThreshold: 10,

    // Use CSS3 transitions and transforms over jQuery animations if possible.
    useCSS3: true,

    // Create paddles.
    paddles: false,

    // Create dot pagination, which is inserted after self.$el.
    pagination: false
  };

});