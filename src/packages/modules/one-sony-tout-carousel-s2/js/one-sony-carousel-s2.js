
// One Sony Carousel (OneSonyCarousel) Module
// --------------------------------------------
//
// * **Class:** OneSonyCarousel
// * **Version:** 0.2
// * **Modified:** 02/20/2013
// * **Author:** George Pantazis
// * **Dependencies:** jQuery 1.7+, Modernizr, Enquire, [SonyDraggable](sony-draggable.html),
//                     [SonyNavDots](sony-navigationdots.html), [SonyPaddles](sony-paddles.html)

define(function(require){

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      iQ = require('iQ'),
      enquire = require('enquire'),
      Settings = require('require/sony-global-settings'),
      Environment = require('require/sony-global-environment'),
      sonyPaddles = require('secondary/index').sonyPaddles,
      sonyNavigationDots = require('secondary/index').sonyNavigationDots,
      sonyDraggable = require('secondary/index').sonyDraggable;

  var module = {
    'init': function() {
      $('.sony-one-carousel').each(function(){
        new OneSonyCarousel(this);
      });
    }
  };

  var OneSonyCarousel = function(element){

    var self = this;

    self.$el = $(element);
    self.$container = self.$el.find('.soc-container');
    self.$innerContainer = self.$container.find('.soc-container-inner');
    self.$slides = self.$container.find('.soc-content');

    self.currentSlide = 0;
    self.useCSS3 = Modernizr.csstransforms && Modernizr.csstransitions;

    self.init();

    log('SONY : OneSonyCarousel : Initialized');
  };

  OneSonyCarousel.prototype = {

    constructor: OneSonyCarousel,

    init: function() {

      var self = this;

      self.createPaddles();
      self.setupLinkClicks();

      if ( self.useCSS3 ) {
        self.$innerContainer.css(Modernizr.prefixed('transitionTimingFunction'), 'cubic-bezier(0.450, 0.735, 0.445, 0.895)');
      }

      self.$innerContainer.sonyDraggable({
        'axis': 'x',
        'unit': '%',
        'dragThreshold': 10,
        'containment': self.$container,
        'useCSS3': self.useCSS3,
        'drag': function(){ iQ.update(true); }
      });

      self.bindEvents();
      self.$cachedSlides = self.$slides.detach();
      self.$cachedSlides.find('.soc-image').addClass('iq-img');

      self.$sliderWrapper = self.$slides.first().clone();
      self.$sliderWrapper.find('.soc-item').remove();

      if ( !Settings.$html.hasClass('lt-ie10') ){

        enquire.register("(min-width: 780px)", function() {
          self.renderDesktop();
        });
        enquire.register("(min-width: 480px) and (max-width: 779px)", function() {
          self.renderEvenColumns(6);
        });
        enquire.register("(max-width: 479px)", function() {
          self.renderEvenColumns(12);
        });

      } else {
        self.renderDesktop();
      }

      self.gotoSlide(0);
    },

    'bindEvents': function() {

      var self = this;

      self.$el.on('sonyDraggable:dragStart',  $.proxy(self.dragStart, self));
      self.$el.on('sonyDraggable:dragEnd',  $.proxy(self.dragEnd, self));

      self.$innerContainer.on(Settings.transEndEventName, function(){ iQ.update(true); });

      self.$el.find('.soc-image').on('iQ:imageLoaded', function(){
        $(this).closest('.soc-item').addClass('on');
      });

      Environment.on('global:resizeDebounced-200ms', function(){
        self.gotoSlide(Math.min.apply(Math, [self.currentSlide, self.$slides.length - 1]));
      });
    },

    // Create or restore the default slide layout.

    renderDesktop: function(which) {

      var self = this,
          $newSlides = self.$cachedSlides.clone(true);

      self.$innerContainer.empty().append($newSlides);
      self.$slides = $newSlides;
      self.createPagination();
    },

    // Splits the default layout into slides with children each of column width
    // set at colPerItem, which must divide evenly into 12.

    renderEvenColumns: function(colPerItem) {

      var self = this,
          $newItems = self.$cachedSlides.clone(true).children().children();

      self.$innerContainer.empty();
      $newItems.removeClass('span8 span6 span4').addClass('span' + colPerItem);

      for ( var i = 0; i < $newItems.length; i=i+(12/colPerItem) ) {
        var newItem = self.$sliderWrapper.clone();
        for ( var j = i; j < i + 12/colPerItem; j++ ) {
          newItem.children().append( $newItems.eq(j) );
        }
        self.$innerContainer.append(newItem);
      }

      self.$slides = self.$innerContainer.find('.soc-content');
      self.createPagination();
    },

    // Stop animations that were ongoing when you started to drag.

    dragStart: function() {

      var self = this;

      self.startInteractionTime = new Date().getTime();
      self.$innerContainer.stop();
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
          leftBounds = self.$container.get(0).getBoundingClientRect().left,
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
      innerContainerWidth = self.$innerContainer.width();

      // If the browser doesn't properly support the getStyles API for auto margins, manually
      // shift the destination back to compensate.

      if ( !Modernizr.jsautomargins ) {
        destinationLeft -= (innerContainerWidth -  $destinationSlide.width()  ) / 2;
      }

      if ( self.useCSS3 ) {

        var newPosition = destinationLeft / innerContainerWidth;

        // If you're on the last slide, only move over enough to show the last child.
        // Prevents excess whitespace on the right.

        if ( which === self.$slides.length - 1 ) {
          var childrenWidth = 0;
          $destinationSlide.find('.soc-item').each(function(){ childrenWidth += $(this).outerWidth(true); });
          newPosition = (destinationLeft - ( $destinationSlide.width() - childrenWidth )) / innerContainerWidth;
        }

        self.$innerContainer.css(Modernizr.prefixed('transitionDuration'), '450ms');
        self.$innerContainer.css(Modernizr.prefixed('transform'), 'translate(' + (-100 * newPosition + '%') + ',0)');

      } else {

        self.$innerContainer.animate({
          'left': -100 * destinationLeft / Settings.$window.width() + '%'
        }, {
          'duration': 350,
          'complete': function(){ iQ.update(true); }
        });
      }

      self.$el.trigger('oneSonyCarousel:gotoSlide', self.currentSlide);
    },

    // To prevent drags from being misinterpreted as clicks, we only redirect the user
    // if their interaction time and movements are below certain thresholds.

    setupLinkClicks: function() {

      var self = this;

      self.$el.find('.soc-item').on('click', function(e){

        var $this = $(this),
            destination = $this.find('.headline a').attr('href'),
            closestLink = $(e.target).closest('a').attr('href');

        if ( !self.isDragging ) {

          if ((new Date().getTime()) - self.startInteractionTime < 100 ) {

            if ( closestLink && closestLink !== destination ) {
              destination = closestLink;
            }

            window.location = destination;
          }
        }
      });
    },

    createPagination: function () {

      var self = this;

      if ( self.$dotnav ) {
        self.$dotnav.sonyNavDots('reset', {
          'buttonCount': self.$slides.length
        });
        return;
      }

      self.$dotnav = self.$el.find('.soc-dot-nav').sonyNavDots({
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
    }
  };

  return module;

});
