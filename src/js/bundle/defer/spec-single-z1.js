/*global jQuery, Modernizr, SONY*/

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
    self.$window = SONY.$window || $(window);
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
      self.$jumpLinks = self.$container.find('.spec-views a');

      // Columns to be even heights
      self.$carouselCols = self.$carouselWrap.closest('.grid').children();
      self.$alignedBottom = self.$container.find('.align-right-bottom .has-img').closest('.grid').children();

      self.$alignedBottomImgs = self.$alignedBottom.find('.iq-img');

      if ( !Modernizr.mediaqueries ) {
        Modernizr.mq = function() { return false; };
      }

      self._initCarousel();

      // Init shuffle on the features section
      self._initFeatures();

      self._onResize( true );

      self.$window.on('resize', $.debounce(350, $.proxy( self._onResize, self )));

      // Push to the end of the stack cause it's not needed immediately.
      setTimeout(function() {
        self._initStickyNav();
      }, 100);
    },

    _initFeatures : function() {
      var self = this;

      // self.$specTiles.children().eq(0).attr('data-delay-order', 1);
      // self.$specTiles.children().eq(3).attr('data-delay-order', 2);

      self.$specTiles.shuffle({
        itemSelector: '.spec-tile',
        easing: SONY.Settings.shuffleEasing,
        speed: SONY.Settings.shuffleSpeed,
        hideLayoutWithFade: true,
        sequentialFadeDelay: 100,
        columnWidth: function( containerWidth ) {
          var column = containerWidth;

          // 568px+
          if ( !Modernizr.mediaqueries || Modernizr.mq('(min-width: 30em)') ) {
            column = SONY.Settings.COLUMN_WIDTH_SLIM * containerWidth;
          }

          return column;
        },
        gutterWidth: function( containerWidth ) {
          var gutter = 0,
              is3Col = !Modernizr.mediaqueries || Modernizr.mq('(min-width: 47.9375em)'),
              is2Col = is3Col ? false : Modernizr.mq('(min-width: 30em)'),
              numCols = is3Col ? 3 : is2Col ? 2 : 1;

          if ( is3Col || is2Col ) {
            gutter = SONY.Settings.GUTTER_WIDTH_SLIM * containerWidth;
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
      var self = this,
          $body = SONY.$body,
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

      self._initJumpLinks();

      setTimeout(function() {
        $body.scrollspy('refresh');
      }, 100);
    },

    _initCarousel : function() {
      var self = this,
          $firstImage = self.$carousel.find(':first-child img'),
          spanWidth = self.$carouselWrap.width();

      self.$carousel.find('img').css({
        maxWidth: spanWidth
      });

      // Wait for first image to be loaded,
      // then get its height and set it on the container, then initialize the scroller
      $firstImage.on('imageLoaded', function() {
        self.$carousel.height( $firstImage.height() );

        self.$carouselWrap.scrollerModule({
          mode: 'carousel',
          contentSelector: '.spec-carousel',
          itemElementSelector: '.slide'
        });
      });
    },

    _initJumpLinks : function() {
      var self = this,
          scrollspyOffset = 10,
          navHeight = parseFloat( self.$stickyNav.css('height') ),
          offset = scrollspyOffset + navHeight;

      self.$jumpLinks.simplescroll({
        showHash: true,
        speed: 400,
        offset: offset
      });
    },

    _onScroll : function() {
      var self = this,
          st = self.$window.scrollTop();

      // Open the stick nav if it's past the trigger
      if ( st > self.stickyTriggerOffset ) {
        if ( !self.$stickyNav.hasClass('open') ) {
          self.$stickyNav.addClass('open');
        }

      // Close the sticky nav if it's past the trigger
      } else {
        if ( self.$stickyNav.hasClass('open') ) {
          self.$stickyNav.removeClass('open');
        }
      }

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

    _onResize : function( isFirst ) {
      var self = this,
          $imgs = self.$carousel.find('img');

      // isFirst can be the event object too
      isFirst = isFirst === true;

      if ( !isFirst ) {

        // Set max width equal to the container width
        // Don't remember why I do this instead of max-width:100%
        $imgs.css({
          maxWidth: self.$carouselWrap.width()
        });

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

      // Update the positions for the scroll spy
      SONY.$body
        .scrollspy('refresh')
        .scrollspy('process');
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
    currentFeatureCols: null
  };


}(jQuery, Modernizr, window));







SONY.on('global:ready', function() {

  if ( $('.spec-single').length > 0 ) {

    $('.spec-single').specSingle();

  }
});
