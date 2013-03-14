/*global define, Modernizr, log*/

// -------- Sony Full Specs Single -------
// Module: Full Specs Single
// Version: 1.0
// Author: Glen Cheney
// Date: 02/22/13
// Dependencies: jQuery 1.7+, Modernizr, imagesLoaded 2.1+
// --------------------------------------

define(function(require){

  'use strict';

  var $ = require('jquery'),
      iQ = require('iQ'),
      imagesloaded = require('plugins/jquery.imagesloaded'),
      Settings = require('require/sony-global-settings'),
      Environment = require('require/sony-global-environment'),
      jqueryShuffle = require('secondary/index').jqueryShuffle,
      sonyScroller = require('secondary/index').sonyScroller,
      sonyEvenHeights = require('secondary/index').sonyEvenHeights,
      sonyStickyNav = require('secondary/index').sonyStickyNav,
      jquerySimpleScroll = require('secondary/index').jquerySimpleScroll;

  var module = {
    init: function() {
      if ( $('.spec-single').length > 0 ) {
        $('.spec-single').specSingle();
      }
    }
  };

  var Spec = function( $container, options ) {
    var self = this;

    $.extend(self, $.fn.specSingle.options, options, $.fn.specSingle.settings);

    // jQuery objects
    self.$container = $container;
    self.$window = Settings.$window;
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
      self.$jumpLinks = self.$container.find('.jump-links a');

      // Columns to be even heights
      self.$carouselCols = self.$carouselWrap.closest('.grid').children();
      self.$alignedBottom = self.$container.find('.align-right-bottom .has-img').closest('.grid').children();

      self.$alignedBottomImgs = self.$alignedBottom.find('.iq-img');

      self._initCarousel();

      // Init shuffle on the features section
      self._initFeatures();

      self._onResize( true );

      // self.$window.on('resize', $.debounce(350, $.proxy( self._onResize, self )));
      Environment.on('global:resizeDebounced', $.proxy( self._onResize, self ));

      // Push to the end of the stack cause it's not needed immediately.
      setTimeout(function() {

        // Redraw table when images have loaded
        var debouncedResize = $.debounce( 50, $.proxy( self._onResize, self) );
        self.$specProduct.find('.iq-img').on( 'imageLoaded', debouncedResize );

        self._initStickyNav();
      }, 100);

      log('SONY : Spec : Initialized');
    },

    _initFeatures : function() {
      var self = this;

      // self.$specTiles.children().eq(0).attr('data-delay-order', 1);
      // self.$specTiles.children().eq(3).attr('data-delay-order', 2);

      self.$specTiles.shuffle({
        itemSelector: '.spec-tile',
        easing: Settings.shuffleEasing,
        speed: Settings.shuffleSpeed,
        hideLayoutWithFade: true,
        sequentialFadeDelay: 100,
        columnWidth: function( containerWidth ) {
          var column = containerWidth;

          // 568px+
          if ( !Modernizr.mediaqueries || Modernizr.mq('(min-width: 30em)') ) {
            column = Settings.COLUMN_WIDTH_SLIM * containerWidth;
          }

          return column;
        },
        gutterWidth: function( containerWidth ) {
          var gutter = 0,
              is3Col = !Modernizr.mediaqueries || Modernizr.mq('(min-width: 47.9375em)'),
              is2Col = is3Col ? false : Modernizr.mq('(min-width: 30em)'),
              numCols = is3Col ? 3 : is2Col ? 2 : 1;

          if ( is3Col || is2Col ) {
            gutter = Settings.GUTTER_WIDTH_SLIM * containerWidth;
          }

          if ( self.currentFeatureCols !== numCols && numCols !== 1) {
            self._swapFeatureClasses( numCols );
          }

          self.currentFeatureCols = numCols;

          return gutter;
        },
        showInitialTransition: false
      });
      self.shuffle = self.$specTiles.data('shuffle');

      // Relayout shuffle when the images have loaded
      self.$specTiles.find('.iq-img').on('imageLoaded', $.debounce( 200, $.proxy( self.shuffle.layout, self.shuffle ) ));

      return self;
    },

    _swapFeatureClasses : function( numCols ) {
      var self = this,
          newClass = 'span6',
          oldClass = 'span4';

      if ( numCols === 3 ) {
        newClass = 'span4';
        oldClass = 'span6';
      }

      self.$specTiles.children().each(function() {
        $(this)
          .removeClass( oldClass )
          .addClass( newClass );
      });
    },

    _initStickyNav : function() {
      var self = this;

      self.$stickyNav.stickyNav({
        scrollToTopOnClick: true,
        $jumpLinks: self.$jumpLinks,
        offsetTarget: self.$container.find('.jump-links:not(.nav)')
      });
    },

    _initCarousel : function() {
      var self = this,
          $firstImage = self.$carousel.find(':first-child img');

      function initScroller() {
        var scrollerOpts = {
          mode: 'carousel',
          contentSelector: '.spec-carousel',
          itemElementSelector: '.slide'
        },
        carouselHeight;

        // Initialize scroller module. This will set the width of the carousel (among other things)
        self.$carouselWrap.scrollerModule( scrollerOpts );

        carouselHeight = $firstImage.height();
        // Set the height of the carousel
        self.$carousel.height( carouselHeight );
      }

      // Wait for first image to be loaded,
      // then get its height and set it on the container, then initialize the scroller
      if ( $firstImage.data('hasLoaded') ) {
        initScroller();
      } else {
        $firstImage.on('imageLoaded', initScroller);
      }
    },

    _onScroll : function() {
      var self = this;

      // See if bottom-aligned-imgs have been loaded
      self.$alignedBottomImgs.each(function() {
        var $img = $(this);
        // Skip if the source hasn't been set yet
        if ( this.src === '' || $img.data('loaded') ) {
          return;
        }

        $img.data('loaded', true);

        $img.imagesLoaded(function() {
          self.$alignedBottom.evenHeights();
        });
      });
    },

    _onResize : function( evt ) {
      var self = this,
          $imgs = self.$carousel.find('img'),
          isFirst;

      // isFirst can be the event object too
      isFirst = evt === true;

      if ( !isFirst ) {
        // Set carousel height based on the new image height
        self.$carousel.height( $imgs.height() );
      }

      // If tablet or desktop, center the carousel
      if ( !Modernizr.mq( self.mobileBreakpoint ) ) {

        // Set even heights on columns spans that have an image aligned to the bottom
        self.$alignedBottom.evenHeights();

        // Get the height of the tallest column in this row. We need this to vertically center the carousel
        self.$carouselCols.evenHeights();
      } else {

        // Remove set heights on the columns.
        self.$alignedBottom
          .add( self.$carouselCols )
          .css('height', '');
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
    isScroller: false,
    currentFeatureCols: null,
    isLessThanie9: !!document.attachEvent
  };

  return module;

});
