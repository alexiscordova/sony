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
//      new FeatureSlideshow( $('.feature-slideshow')[0] );

define(function(require) {

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      Environment = require('require/sony-global-environment'),
      Fade = require('secondary/sony-fade');

  var FeatureSlideshow = function( element ) {
    var self = this;

    // Set base element
    self.element = element;
    self.$el = $( element );

    // Inits the module
    self.init();

    self.$el.data( 'featureSlideshow', self );

    log('SONY : FeatureSlideshow : Initialized');
  };

  FeatureSlideshow.prototype = {

    init : function() {
      var self = this;

      self.setVars();

      self.setupCarousel();
      self.subscribeToEvents();
      self.onResize();
    },

    setVars : function() {
      var self = this,
          data;

      self.$wrapper = self.$el.find( '.fs-carousel-wrapper' );
      self.$slideContainer = self.$wrapper.find( '.fs-carousel' );
      self.$slides = self.$slideContainer.find( '.fs-slide' );
      self.$captions = self.$slides.find( '.caption-inner' );

      self.evenColumnGroups = [];
      self.$captions.each(function() {
        self.evenColumnGroups.push( $(this).find('.js-even-col') );
      });

      // Properties based on data-* attributes
      data = self.$slideContainer.data();
      self.threshold = data.threshold || '50%';
      self.delay = data.delay || 200;
      self.crossfade = data.crossfade || undefined;
      self.speed = data.speed || 300;

      return self;
    },

    subscribeToEvents : function() {
      var self = this;

      // Listen for global resize
      Environment.on('global:resizeDebounced', $.proxy( self.onResize, self ));
    },

    onResize : function() {
      this.setExplicitCaptionSizes();
    },

    // $.evenHeights is mixed in here so as not to cause two reflows
    setExplicitCaptionSizes : function() {
      var self = this,
          widths = [],
          heights = [],
          groups = self.evenColumnGroups,
          isSmallerThanTablet = Modernizr.mq( '(max-width: 47.9375em)' );

      // Reset
      self.$captions.css( 'width', '' );

      $.each( groups, function( i, $elements ) {
        $elements.css('height', '');
      });

      // Width and height should be reset in case the user goes from desktop to mobile,
      // but the dimensions do not need to be set.
      if ( isSmallerThanTablet ) {
        return;
      }


      // Add up stat and copy width and save it
      self.$captions.each(function() {
        var $media = $( this ),
            mediaWidth = $media.find('.stat-wrap').outerWidth( true ),
            bodyWidth = $media.find('.caption-body').outerWidth();

        widths.push( mediaWidth + bodyWidth + 1 ); // +1 is for FF being dumb
      });

      $.each( groups, function( i, $elements ) {
        var tallest = 0;
        $elements.each(function() {
          var height = $(this).outerHeight();

          if ( height > tallest ) {
            tallest = height;
          }
        });

        // Keep track of the winner!
        heights.push( tallest );
      });

      // Set them all at once
      self.$captions.each(function( i ) {
        $( this ).css( 'width', widths[ i ] + 'px' );
      });

      // Lastly, we set them all
      $.each( groups, function( i, $elements ) {
        $elements.css( 'height', heights[ i ] );
      });
    },

    // Main setup method for the carousel
    setupCarousel: function() {
      var self = this;

      self.fade = new Fade( self.$slideContainer, {
        slides: '.fs-slide',
        paddlePosition: 'outset',
        animationSpeed: self.speed,
        crossfade: self.crossfade,
        $dotNavWrapper: self.$wrapper
      });

      // The wrapper doesn't have a .container class, so without this,
      // the paddle are at the edge of the browser
      self.$wrapper.find('.pagination-paddles').addClass('container');

      return self;
    }
  };

  return FeatureSlideshow;
 });
