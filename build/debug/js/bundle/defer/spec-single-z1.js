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

      // Columns to be even heights
      self.$carouselCols = self.$carouselWrap.closest('.grid').children();
      self.$alignedBottom = self.$container.find('.align-right-bottom .has-img').closest('.grid').children();

      self._initCarousel();

      // Init shuffle on the features section
      self._initFeatures();
      self._onResize( true );

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
        columnWidth: function( containerWidth ) {
          var column = containerWidth;

          // 568px+
          if ( !Modernizr.mediaqueries || Modernizr.mq('(min-width: 30em)') ) {
            column = Exports.COLUMN_WIDTH_SLIM * containerWidth;
          }

          return column;
        },
        gutterWidth: function( containerWidth ) {
          var gutter = 0,
              is3Col = !Modernizr.mediaqueries || Modernizr.mq('(min-width: 47.9375em)'),
              is2Col = is3Col ? false : Modernizr.mq('(min-width: 30em)'),
              numCols = is3Col ? 3 : is2Col ? 2 : 1;

          if ( is3Col || is2Col ) {
            gutter = Exports.GUTTER_WIDTH_SLIM * containerWidth;
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

      dfd = self.$specTiles.imagesLoaded();

      // Relayout shuffle when the images have loaded
      dfd.always( function() {
        setTimeout( function() {
          self.shuffle.layout();
        }, 100 );
      });

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
      var self = this,
          $body = $('body'),
          $offsetTarget = self.$container.find('.spec-views:not(.nav)');

      // jQuery offset().top is returning negative numbers...
      self.stickyTriggerOffset = $offsetTarget[0].offsetTop;


      // REMOVE WHEN ITS NOT BROKEN
      if ( self.stickyTriggerOffset < 100 ) {
        setTimeout(function() {
          self.stickyTriggerOffset = $offsetTarget[0].offsetTop; //$offsetTarget.offset().top;
        }, 50);
        console.error('sticky trigger top is:', self.stickyTriggerOffset, $offsetTarget);
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
          firstImage = self.$carousel.find(':first-child img'),
          spanWidth = self.$carouselWrap.width();

      self.$carousel.find('img').css({
        maxWidth: spanWidth
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

    _onResize : function( isFirst ) {
      var self = this,
          $imgs = self.$carousel.find('img'),
          imgHeight = $imgs.height();

      if ( !isFirst ) {
        self.$carousel.height( imgHeight );
        $imgs.css({
          maxWidth: self.$carouselWrap.width()
        });
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

  // TODO: make its own file and give it options for padding an margin
  $.fn.evenHeights = function() {
    var tallest = 0;
    return this
      .css('height', '')
      .each(function() {
        var $this = $(this),
            // Here we're using `.css()` instead of `height()` or `outerHeight()`
            // because Chrome is 100x slower calculating those values
            height = parseFloat( $this.css('height') );

        if ( height > tallest ) {
          tallest = height;
        }
      })
      .css('height', tallest);
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
    currentFeatureCols: null
  };


}(jQuery, Modernizr, window));







$(document).ready(function() {

  if ( $('.spec-single').length > 0 ) {

    $('.spec-single').specSingle();

  }
});
