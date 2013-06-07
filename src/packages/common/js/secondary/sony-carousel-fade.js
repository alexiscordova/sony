
// Sony Chapters (SonyChapters) Module
// --------------------------------------------
//
// * **Class:** SonyCarouselFade
// * **Version:** 0.1
// * **Modified:** 04/22/2013
// * **Author:** Steve Davis
// * **Dependencies:** jQuery 1.7+
//
// This was originally a fork of the SonyCarousel module, with the intention from the
// developer that we'd integrate it into the main SonyCarousel module later. I no longer
// think that's a great idea; these carousels are so much more basic, it seems wasteful
// to initialize the much more robust carousel code onto them when they don't need it.
// I've pared this down to more or less the essentials for a crossfade, but it still needs
// work, as noted below. More likely than not it should just be rewritten.

define(function(require){

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      iQ = require('iQ'),
      Settings = require('require/sony-global-settings'),
      Utilities = require('require/sony-global-utilities');

  var _id = 0;

  var SonyCarouselFade = function($element, options){
    var self = this;

    $.extend(self, {}, $.fn.sonyCarouselFade.defaults, options, $.fn.sonyCarouselFade.settings);

    self.currentSlide = 0;
    self.id = _id++;
    self.$el = $element;
    self.$wrapper = self.$el.parent(self.wrapper);

    self.init();
  };

  SonyCarouselFade.prototype = {

    constructor: SonyCarouselFade,

    init: function() {

      var self = this;

      self.resetSlides( true );

      if ( self.useCSS3 ) {
        self.$el.css(Modernizr.prefixed('transitionTimingFunction'), self.CSS3Easing);
      }

      self.gotoSlide(0);
    },

    // Go to a given slide.

    gotoSlide: function(which, noAnim) {

      var self = this,
          $slideSet = self.$slides,
          speed = ( noAnim ? 0 : self.animationSpeed ),
          $destinationSlide;

      $destinationSlide = $slideSet.eq(which);
      if ( !$destinationSlide ) { return; }

      // TODO : Note that, below, the `active` class is peppered onto the classes.
      // modules then use this class to set opacity, etc. The problem with this is obviously
      // that the JS won't work without that CSS set. We should remove the CSS and set
      // it inline using the JS, here, so that it works out of the box with just the JS plugin.

      if ( self.useCSS3 ) {

        self.$el.on(Settings.transEndEventName + '.slideMoveEnd', function(){
          iQ.reset();
          self.$el.trigger('SonyCarousel:AnimationComplete');
          self.$el.off(Settings.transEndEventName + '.slideMoveEnd');
        });

        self.$el.css(Modernizr.prefixed('transitionDuration'), speed + 'ms' );
        $destinationSlide.addClass('active').siblings().removeClass('active');

      } else {
        $destinationSlide.addClass('active').siblings().removeClass('active');
        var $sibs = $destinationSlide.siblings();
        $sibs.fadeOut(speed);
        $destinationSlide.fadeIn(speed);
      }

      self.currentSlide = which;

      self.$el.trigger('SonyCarouselFade:gotoSlide', self.currentSlide);
    },

    resetSlides: function( isInit ) {

      var self = this;

      if ( !isInit ) {
        // Remove the event because we're going to subscribe to it again
        self.$slides.off('click.sonycarousel');
      }

      self.$slides = self.$el.find(self.slides).not(self.cloneClass);
    },

    // Reset the style attribute for the properties we might have manipulated.
    // Destroy the plugins we've initialized as part of the carousel.

    destroy: function() {

      var self = this,
          $paddleWrapper = self.$paddleWrapper || self.$wrapper;

      // Reset styles.
      self.$el.css(Modernizr.prefixed('transitionTimingFunction'), '')
          .css(Modernizr.prefixed('transitionDuration'), '' )
          .css(Modernizr.prefixed('transform'), '')
          .css(self.posAttr, '');

      // Unbind
      self.$el.off('SonyCarouselFade:gotoSlide');
      self.$slides.off('click.sonycarousel');

      // Remove data from element, allowing for later reinit.
      self.$el.removeData('sonyCarouselFade');
    }
  };

  // jQuery Plugin Definition
  // ------------------------

  $.fn.sonyCarouselFade = function( options ) {
    var args = Array.prototype.slice.call( arguments, 1 );
    return this.each(function() {
      var self = $(this),
          sonyCarouselFade = self.data('sonyCarouselFade');

      if ( !sonyCarouselFade ) {
        sonyCarouselFade = new SonyCarouselFade( self, options );
        self.data( 'sonyCarouselFade', sonyCarouselFade );
      }

      if ( typeof options === 'string' ) {
        sonyCarouselFade[ options ].apply( sonyCarouselFade, args );
      }
    });
  };

  // Defaults
  // --------

  $.fn.sonyCarouselFade.defaults = {

    // **Required**: Selector for the `overflow:hidden;` element that wraps the draggable object.
    // Accessed by .parent() method.
    wrapper: undefined,

    // **Required**: Selector for the individual slides within the carousel, used for
    // positioning, snapping, and pagination.
    slides: undefined,

    // Speed of slide animation, in ms.
    animationSpeed: 500,

    //default CSS3 easing equation
    CSS3Easing: 'cubic-bezier(0.000, 1.035, 0.400, 0.985)',

    // Use CSS3 transitions and transforms over jQuery animations if possible.
    useCSS3: true
  };

});
