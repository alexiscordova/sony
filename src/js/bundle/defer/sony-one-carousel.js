
// One Sony Carousel (OneSonyCarousel) Module
// --------------------------------------------
//
// * **Class:** OneSonyCarousel
// * **Version:** 0.2
// * **Modified:** 02/20/2013
// * **Author:** George Pantazis
// * **Dependencies:** jQuery 1.7+

if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = (from < 0) ? Math.ceil(from) : Math.floor(from);
    if (from < 0){
      from += len;
    }

    for (; from < len; from++)
    {
      if (from in this && this[from] === elt) {
        return from;
      }
    }
    return -1;
  };
}

(function($) {

  'use strict';

  var OneSonyCarousel = function($element, options){

    var self = this;

    $.extend(self, {}, $.fn.oneSonyCarousel.defaults, options);

    self.$el = $element;
    self.$container = self.$el.find('.soc-container');
    self.$innerContainer = self.$container.find('.soc-container-inner');
    self.$slides = self.$container.find('.soc-content');

    self.init();
  };

  OneSonyCarousel.prototype = {

    'constructor': OneSonyCarousel,

    'init': function() {

      var self = this;

      self.$innerContainer.sonyDraggable({
        'axis': 'x',
        'unit': '%',
        'dragThreshold': 50,
        'containment': self.$container
      });

      self.gotoSlide(0);
      self.createPagination();

      self.$el.on('sonyDraggable:dragStart',  $.proxy(self.dragStart, self));
      self.$el.on('sonyDraggable:dragEnd',  $.proxy(self.dragEnd, self));
      self.$innerContainer.on(SONY.Settings.transEndEventName, window.iQ.update);

      self.teardown();

      if ( window.enquire ){

        window.enquire.register("(min-width: 780px)", {
          match : function() {
            self.renderDesktop();
          }
        });
        window.enquire.register("(min-width: 480px) and (max-width: 779px)", {
          match : function() {
            self.renderTablet();
          }
        });
        window.enquire.register("(max-width: 479px)", {
          match : function() {
            self.renderMobile();
          }
        });
      } else {
        self.renderDesktop();
      }
    },

    'teardown': function() {

      var self = this;

      self.$cachedSlides = self.$slides.detach();
      self.$sliderWrapper = self.$slides.first().clone();
      self.$sliderWrapper.find('.soc-item').remove();
    },

    'renderDesktop': function(which) {

      var self = this,
          $newSlides = self.$cachedSlides.clone();

      self.$innerContainer.empty().append($newSlides);
      self.$slides = $newSlides;
      self.createPagination();
    },

    'renderTablet': function(which) {

      var self = this,
          $newItems = self.$cachedSlides.clone().children().children();

      self.$innerContainer.empty();
      $newItems.removeClass('span8 span6 span4').addClass('span6');

      for ( var i = 0; i < $newItems.length; i=i+2 ) {
        var newItem = self.$sliderWrapper.clone();
        newItem.children().append($newItems.eq(i));
        newItem.children().append($newItems.eq(i+1));
        self.$innerContainer.append(newItem);
      }

      self.$slides = self.$innerContainer.find('.soc-content');
      self.createPagination();
    },

    'renderMobile': function(which) {

      var self = this,
          $newItems = self.$cachedSlides.clone().children().children();

      self.$innerContainer.empty();

      $newItems.removeClass('span8 span6 span4').addClass('span12');

      for ( var i = 0; i < $newItems.length; i++ ) {
        var newItem = self.$sliderWrapper.clone();
        newItem.children().append($newItems.eq(i));
        self.$innerContainer.append(newItem);
      }

      self.$slides = self.$innerContainer.find('.soc-content');
      self.createPagination();
    },

    // Stop animations that were ongoing when you started to drag.

    'dragStart': function() {

      var self = this;

      self.$innerContainer.stop();
    },

    // Depending on how fast you were dragging, either proceed to an adjacent slide or
    // reset position to the nearest one.

    'dragEnd': function(e, data) {

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

    'gotoNearestSlide': function(e, data) {

      var self = this,
          leftBounds =  self.$container[0].getBoundingClientRect().left,
          positions = [];

      self.$slides.each(function(a){
        positions.push(Math.abs(leftBounds - this.getBoundingClientRect().left));
      });

      self.gotoSlide(positions.indexOf(Math.min.apply(Math, positions)));
    },

    // Goto a given slide.

    'gotoSlide': function(which) {

      var self = this,
          $destinationSlide = self.$slides.eq(which);

      self.currentSlide = which;

      if ( Modernizr.csstransforms && Modernizr.csstransitions ) {
        self.$innerContainer.css(Modernizr.prefixed('transitionDuration'), '500ms');
        self.$innerContainer.css(Modernizr.prefixed('transform'), 'translate(' + (-100 * $destinationSlide.position().left / self.$innerContainer.width() + '%') + ',0)');
      } else {
        self.$innerContainer.animate({
          'left': -100 * $destinationSlide.position().left / SONY.$window.width() + '%'
        }, {
          'easing': 'easeOutExpo',
          'duration': 1000,
          'complete': window.iQ.update
        });
      }

      self.$el.trigger('oneSonyCarousel:gotoSlide', self.currentSlide);
    },

    createPagination: function (){

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

      self.$dotnav.on('SonyNavDots:clicked', function(e, which){
        self.gotoSlide(which);
      });

      self.$el.on('oneSonyCarousel:gotoSlide', function(e, which) {
        self.$dotnav.sonyNavDots('reset', {
          'activeButton': which
        });
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

jQuery.extend(jQuery.easing, {
  easeOutExpo: function (x, t, b, c, d) {
    return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
  }
});
