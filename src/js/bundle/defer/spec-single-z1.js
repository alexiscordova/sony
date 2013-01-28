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
      self.stickyTriggerOffset = self.$container.find('.spec-views').first().offset().top;

      // Set up twitter bootstrap scroll spy
      $('body').scrollspy({
        target: '.spec-sticky-nav'
      });

      // self._onResize();

      // Init shuffle on the features section
      self._initFeatures();

      self.$window.on('scroll', $.proxy( self._onScroll, self ));
      // self.$window.on('resize', $.throttle(250, $.proxy( self._onResize, self )));
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
        console.log('images loaded');
        setTimeout( function() {
          self.shuffle.layout();
        }, 100 );
      });

      return self;
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
