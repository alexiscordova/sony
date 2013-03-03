
// One Sony Carousel (OneSonyCarousel) Module
// --------------------------------------------
//
// * **Class:** OneSonyCarousel
// * **Version:** 0.2
// * **Modified:** 02/20/2013
// * **Author:** George Pantazis
// * **Dependencies:** jQuery 1.7+, Modernizr, Enquire, [SonyDraggable](sony-draggable.html),
//                     [SonyNavDots](sony-navigationdots.html), [SonyPaddles](sony-paddles.html)

(function($) {

  'use strict';

  var OneSonyCarousel = function($element, options){

    var self = this;

    $.extend(self, {}, $.fn.oneSonyCarousel.defaults, options);

    self.$el = $element;
    self.$container = self.$el.find('.soc-container');
    self.$innerContainer = self.$container.find('.soc-container-inner');
    self.$slides = self.$container.find('.soc-content');

    self.currentSlide = 0;
    self.useCSS3 = Modernizr.csstransforms && Modernizr.csstransitions;

    self.init();
  };

  OneSonyCarousel.prototype = {

    constructor: OneSonyCarousel,

    init: function() {

      var self = this;

      self.createPaddles();
      self.setupLinkClicks();

      self.$innerContainer.sonyDraggable({
        'axis': 'x',
        'unit': '%',
        'dragThreshold': 50,
        'containment': self.$container,
        'useCSS3': self.useCSS3,
        'drag': window.iQ.update
      });

      self.$el.on('sonyDraggable:dragStart',  $.proxy(self.dragStart, self));
      self.$el.on('sonyDraggable:dragEnd',  $.proxy(self.dragEnd, self));
      self.$innerContainer.on(SONY.Settings.transEndEventName, window.iQ.update);

      SONY.on('global:resizeDebounced-200ms', function(){
        self.gotoSlide(Math.min.apply(Math, [self.currentSlide, self.$slides.length - 1]));
      });

      self.$cachedSlides = self.$slides.detach();
      self.$sliderWrapper = self.$slides.first().clone();
      self.$sliderWrapper.find('.soc-item').remove();

      if ( window.enquire && !SONY.$html.hasClass('lt-ie10') ){

        window.enquire.register("(min-width: 780px)", function() {
          self.renderDesktop();
        });
        window.enquire.register("(min-width: 480px) and (max-width: 779px)", function() {
          self.renderEvenColumns(6);
        });
        window.enquire.register("(max-width: 479px)", function() {
          self.renderEvenColumns(12);
        });

      } else {
        self.renderDesktop();
      }

      self.gotoSlide(0);
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

      if ( data.acceleration.x > 200 ) {

        if ( self.currentSlide === 0 ) {
          self.gotoNearestSlide();
        } else {
          self.gotoSlide(self.currentSlide - 1);
        }
      } else if ( data.acceleration.x < -200 ) {

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

      if ( self.useCSS3 ) {

        var newPosition = destinationLeft / innerContainerWidth;

        // If you're on the last slide, only move over enough to show the last child.
        // Prevents excess whitespace on the right.

        if ( which === self.$slides.length - 1 ) {
          var childrenWidth = 0;
          $destinationSlide.find('.soc-item').each(function(){ childrenWidth += $(this).outerWidth(true); });
          newPosition = (destinationLeft - ( $destinationSlide.width() - childrenWidth )) / innerContainerWidth;
        }

        self.$innerContainer.css(Modernizr.prefixed('transitionDuration'), '500ms');
        self.$innerContainer.css(Modernizr.prefixed('transform'), 'translate(' + (-100 * newPosition + '%') + ',0)');

      } else {

        self.$innerContainer.animate({
          'left': -100 * destinationLeft / SONY.$window.width() + '%'
        }, {
          'duration': 1000,
          'complete': window.iQ.update
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
      });
    },

    createPaddles: function() {

      var self = this;

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

  $.fn.oneSonyCarousel = function( options ) {
    var args = Array.prototype.slice.call( arguments, 1 );
    return this.each(function() {
      var self = $(this),
        oneSonyCarousel = self.data('oneSonyCarousel');

      if ( !oneSonyCarousel ) {
          oneSonyCarousel = new OneSonyCarousel( self, options );
          self.data( 'oneSonyCarousel', oneSonyCarousel );
      }

      if ( typeof options === 'string' ) {
        oneSonyCarousel[ options ].apply( oneSonyCarousel, args );
      }
    });
  };

  // Initialize
  // ----------

  SONY.on('global:ready', function(){
    $('.sony-one-carousel').oneSonyCarousel();
  });

})(jQuery);
