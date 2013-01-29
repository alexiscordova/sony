/*global jQuery, Modernizr, Exports*/

// -------- Sony Full Specs Single -------
// Module: Full Specs Single
// Version: 1.0
// Author: Glen Cheney
// Date: 01/24/13
// Dependencies: jQuery 1.7+, Modernizr, imagesLoaded 2.1+
// --------------------------------------

(function($, Modernizr, window, undefined) {
  'use strict';

  var Spec = function( $container, options ) {
    var self = this;

    $.extend(self, $.fn.specSingle.options, options, $.fn.specSingle.settings);

    // jQuery objects
    self.$container = $container;
    self.$window = $(window);
    self._init();
  };

  Spec.prototype = {

    constructor: Spec,

    _init : function() {
      var self = this;

      self.$specProduct = self.$container.find('.spec-product');
      self.$specTiles = self.$container.find('.spec-tiles');
      self.$stickyNav = self.$container.find('.spec-sticky-nav');
      self.$carouselWrap = self.$container.find('.spec-carousel-wrap');
      self.$carousel = self.$carouselWrap.find('.spec-carousel');

      self._initCarousel();

      // Init shuffle on the features section
      self._initFeatures();

      self.$window.on('resize', $.throttle(250, $.proxy( self._onResize, self )));
      self.$window.on('load', $.proxy( self._initStickyNav, self ));
    },

    _initFeatures : function() {
      var self = this,
          dfd;

      self.$specTiles.shuffle({
        itemSelector: '.spec-tile',
        easing: 'ease-out',
        speed: 250,
        columnWidth: Exports.masonryColumns,
        gutterWidth: Exports.masonryGutters,
        showInitialTransition: false
      });
      self.shuffle = self.$specTiles.data('shuffle');

      dfd = self.$specTiles.imagesLoaded();

      // Relayout shuffle when the images have loaded
      dfd.always( function() {
        setTimeout( function() {
          self.shuffle.layout();
        }, 100 );
      });

      return self;
    },

    _initStickyNav : function() {
      var self = this,
          $body = $('body'),
          $offsetTarget = self.$container.find('.spec-views:not(.nav)');

      self.stickyTriggerOffset = $offsetTarget.offset().top;


      // REMOVE WHEN ITS NOT BROKEN
      if ( self.stickyTriggerOffset < 0 ) {
        setTimeout(function() {
          self.stickyTriggerOffset = $offsetTarget.offset().top;
        }, 50);
        console.error('sticky trigger top is:', self.stickyTriggerOffset, self.$container.find('.spec-views').first());
        // throw new Error('sticky trigger top is: ' + self.stickyTriggerOffset);
      }

      self.$window.on('scroll', $.proxy( self._onScroll, self ));

      // Set up twitter bootstrap scroll spy
      $body.scrollspy({
        target: '.spec-sticky-nav'
      });

      setTimeout(function() {
        $body.scrollspy('refresh');
      }, 100);
    },

    _initCarousel : function() {
      var self = this,
          firstImage = self.$carousel.find(':first-child img');

      self.$carousel.find('img').css({
        maxWidth: self.$carouselWrap.width()
      });

      // Give the image a src, otherwise imagesLoaded is pointless...
      window.iQ.update();

      // Wait for first image to be loaded, then setTimeout to allow it to get a height
      // then get its height and set it on the container, then initialize the scroller
      firstImage.imagesLoaded(function() {
        setTimeout(function() {
          self.$carousel.height( firstImage.height() );

          self.$carouselWrap.scrollerModule({
            contentSelector: '.spec-carousel',
            itemElementSelector: '.slide',
            mode: 'carousel',
            generatePagination: true,
            nextSelector: self.$container.find('.overview-nav-next'),
            prevSelector: self.$container.find('.overview-nav-prev')

          });
        }, 100);
      });

    },

    _onScroll : function() {
      var self = this,
          st = self.$window.scrollTop();

      if ( st > self.stickyTriggerOffset ) {
        if ( !self.$stickyNav.hasClass('open') ) {
          self.$stickyNav.addClass('open');
        }
      } else {
        if ( self.$stickyNav.hasClass('open') ) {
          self.$stickyNav.removeClass('open');
        }
      }
    },

    _onResize : function() {
      var self = this,
          $imgs = self.$carousel.find('img'),
          imgHeight = $imgs.height();

      self.$carousel.height( imgHeight );
      $imgs.css({
        maxWidth: self.$carouselWrap.width()
      });
    }



  };

  // Plugin definition
  $.fn.specSingle = function( options ) {
    var args = Array.prototype.slice.call( arguments, 1 );
    return this.each(function() {
      var self = $(this),
          spec = self.data('spec');

      // If we don't have a stored spec, make a new one and save it
      if ( !spec ) {
        spec = new Spec( self, options );
        self.data( 'spec', spec );
      }

      if ( typeof options === 'string' ) {
        spec[ options ].apply( spec, args );
      }
    });
  };


  // Overrideable options
  $.fn.specSingle.options = {
    mobileBreakpoint : '(max-width: 35.4375em)'
  };

  // Not overrideable
  $.fn.specSingle.settings = {
    isStickyTabs: false,
    isScroller: false
  };


}(jQuery, Modernizr, window));







$(document).ready(function() {

  if ( $('.spec-single').length > 0 ) {

    $('.spec-single').specSingle();

  }
});
