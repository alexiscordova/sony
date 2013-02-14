/*global jQuery, Modernizr, Exports*/

// -------- Sony Full Specs Multi -------
// Module: Full Specs Multi
// Version: 1.0
// Author: Glen Cheney
// Date: 01/24/13
// Dependencies: jQuery 1.7+, Modernizr
// --------------------------------------

(function($, Modernizr, window, undefined) {
  'use strict';

  var Spec = function( $container, options ) {
    var self = this;

    $.extend(self, $.fn.spec.options, options, $.fn.spec.settings);

    // jQuery objects
    self.$container = $container;
    self.$window = $(window);
    self._init();
  };

  Spec.prototype = {

    constructor: Spec,

    _init : function() {
      var self = this;

      self.$specProducts = self.$container.find('.spec-products');
      self.$specItems = self.$specProducts.find('.spec-item');
      self.$specItemsWrap = self.$specProducts.find('.spec-items-wrap');
      self.$specItemsGrid = self.$specProducts.find('.spec-items-grid');
      self.$tabStrip = self.$container.find('.tab-strip');
      self.$specTiles = self.$container.find('.spec-tiles');
      self.$modal = $('#ports-modal');

      // Nav
      self.$navWrap = self.$container.find('.spec-nav-wrap');
      self.$navContainer = self.$navWrap.find('.spec-nav-container');
      self.$navNext = self.$navWrap.find('.spec-nav-next');
      self.$navPrev = self.$navWrap.find('.spec-nav-prev');
      self.$stickyHeaders = self.$specProducts.find('.compare-sticky-header');
      self.$stickyNav = self.$container.find('.spec-sticky-nav');
      self.$jumpLinks = self.$container.find('.spec-views a');

      self.$enlargeTriggers = self.$specProducts.find('.js-enlarge');
      self.$enlargeClosers = self.$container.find('.spec-modal .box-close');
      self.$detailLabelsWrap = self.$specProducts.find('.detail-labels-wrap');

      self.stickyHeaderHeight = self.$stickyHeaders.first().height();
      self.stickyNavHeight = self.$stickyNav.outerHeight();

      // Line up spec item cells
      self._onResize();

      // Init shuffle on the features section
      self._initFeatures();

      self.$window.on('resize', $.debounce(250, $.proxy( self._onResize, self )));
      self.$window.on('scroll', $.proxy( self._onScroll, self ));

      self.$enlargeTriggers.on('click', $.proxy( self._onEnlarge, self ));

      // We're done
      setTimeout(function() {

        // Redraw table when images have loaded
        var debouncedSetRowHeights = $.debounce( 200, $.proxy( self._setRowHeights, self) );
        self.$specProducts.find('.iq-img').on( 'imageLoaded', debouncedSetRowHeights );

        self._initStickyNav();
        self._onScroll();

        // Add the complete class to the labels to transition them in
        self.$detailLabelsWrap.find('.detail-labels-wrapping').addClass('complete');

      }, 250);



    },

    _initFeatures : function() {
      var self = this;

      self.$specTiles.shuffle({
        itemSelector: '.spec-tile',
        easing: Exports.shuffleEasing,
        speed: Exports.shuffleSpeed,
        hideLayoutWithFade: true,
        sequentialFadeDelay: 100,
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

      // Relayout shuffle when the images have loaded
      self.$specTiles.find('.iq-img').on('imageLoaded', $.debounce( 200, $.proxy( self.shuffle.layout, self.shuffle ) ));

      return self;
    },

    _initScroller : function() {
      var self = this,
          data;

      self.$specItemsWrap.scrollerModule({
        contentSelector: '.spec-items-container',
        itemElementSelector: '.spec-item',
        mode: 'free',
        nextSelector: self.$navNext,
        prevSelector: self.$navPrev,
        centerItems: false,

        // iscroll props get mixed in
        iscrollProps: {
          snap: true,
          hScroll: true,
          vScroll: false,
          hScrollbar: false,
          vScrollbar: false,
          momentum: true,
          bounce: false,
          onScrollMove : function() {
            self._onScroll( this );
          },
          onAnimate : function() {
            self._onScroll( this );
          },
          onAnimationEnd : function() {
            self._onScroll( this );
            window.iQ.update();
          }
        }
      });

      // Save the iScroll instance
      data = self.$specItemsWrap.data('scrollerModule');
      self.scroller = data;
      self.iscroll = data.scroller;
      self._onScroll( self.iscroll );
      self.isScroller = true;

    },

    _teardownScroller : function() {
      var self = this;
      self.$specItemsWrap.scrollerModule('destroy');
      self.iscroll = null;
      self.isScroller = false;
    },

    _initStickyTabs : function() {
      var self = this,
          $headers = self.$specItems.find('.spec-column-header').clone(),
          $btns = $(),
          $tabs = self.$tabStrip.find('.tabs');

      self.isStickyTabs = true;
      self.$specItems.slice(1).addClass('tab-pane fade off-screen');
      self.$specItems.slice(0, 1).addClass('tab-pane fade in active');

      // Make the column headers into tabs
      $headers.each(function(i) {
        var $header = $(this),
            $btn = $('<button/>', {
              html : $header.contents()
            });

        // Make the first tab active
        if ( i === 0 ) {
          $btn.addClass('active');
        }

        // Set the data attributes
        $btn
          .attr({
            'data-target': 'spec-tab' + i,
            'data-toggle': 'tab'
          })
          .removeClass('spec-column-header hidden-phone')
          .addClass('tab');

        // iOS wasn't appending the buttons in the right order, so we'll have to append them inside the loop
        // $tabs.append( $btn );
        $btns = $btns.add( $btn );
      });

      $btns.appendTo( $tabs );

      self.$tabStrip.stickyTabs({
        mq: self.mobileBreakpoint
      });


      self.$tabStrip.find('.tab').on('shown', $.proxy( self._setStickyHeaderContent, self ));

      // Undo what _setRowHeights sets
      self._removeHeights();
    },

    _teardownStickyTabs : function() {
      var self = this;
      self.$tabStrip
        .stickyTabs('destroy')
        .find('.tabs')
          .off('shown')
          .empty();
      self.isStickyTabs = false;
      self.$specItems.removeClass('tab-pane fade in off-screen active');
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

      // Set up twitter bootstrap scroll spy
      $body.scrollspy({
        target: '.spec-sticky-nav'
      });

      self._initJumpLinks();

      setTimeout(function() {
        $body.scrollspy('refresh');
      }, 100);
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

    _setRowHeights : function( isFromResize ) {
      var self = this;

      isFromResize = isFromResize === true;

      // Put a bottom margin on the sibling of the absoluting positioned element
      // to make up for its lack of document space
      self.$container.find('.btm-aligned').each(function() {
        var $img = $(this);
        $img.prev().css('marginBottom', $img.css('height'));
      });

      // Set detail rows to even heights
      self.$container.find('.detail-label').each(function(i) {
        var $detailLabel = $(this),

            // plus 2 because i is a zero based index and nth-child is one based. Also, the first child in our html
            // is the title, which is not a .spec-item-cell, so we need to add another to our selector
            // Also, there is a sticky header that needs to be excluded: add 1 more
            $cells = self.$specItems.find('.spec-item-cell:nth-child(' + (i + 3) + ')');

        // Loop through the cells (`.spec-item-cell`'s in the same 'row')
        $cells.add($detailLabel).evenHeights();

        // Make bottom aligned images the same height
        // $cells.find('.dl-img').evenHeights();
      });

      // If this is not triggered from a window resize, we still need to update the offsets
      // because the heights have changed.
      if ( !isFromResize ) {
        self.stickyNavHeight = self.$stickyNav.outerHeight();
        self.stickyOffset = self._getStickyHeaderOffset();
      }

      // Refresh iScroll
      if ( self.iscroll ) {
        self.iscroll.refresh();
      }

      return self;
    },

    _setItemContainerHeight : function() {
      var self = this;

      self.$specItemsWrap.find('.spec-items-container').height( self.$specItems.first().height() );

      return self;
    },

    // Get the text from the currently active sticky tab
    _getMobileStickyContent : function() {
      return this.$tabStrip.find('.tab.active').html();
    },

    _setStickyHeaderContent : function() {
      var self = this,
          $stickyNavContent = self.$stickyNav.find('.js-sticky-nav-content'),
          $mobileStickyNavContent = self.$stickyNav.find('.js-sticky-mobile-content'),
          mobileContent = '';

      if ( self.isMobile ) {
        // Hide original content if it's not hidden already
        if ( !$stickyNavContent.hasClass('hidden') ) {
          $stickyNavContent.addClass('hidden');
        }

        // Show mobile content if it's hidden
        if ( $mobileStickyNavContent.hasClass('hidden') ) {
          $mobileStickyNavContent.removeClass('hidden');
        }

        mobileContent = self._getMobileStickyContent();
        $mobileStickyNavContent.find('.js-mobile-content').html( mobileContent );


      } else {
        // Show original content if it's hidden
        if ( $stickyNavContent.hasClass('hidden') ) {
          $stickyNavContent.removeClass('hidden');
        }
        // Hide mobile content if it's not hidden already
        if ( !$mobileStickyNavContent.hasClass('hidden') ) {
          $mobileStickyNavContent.addClass('hidden');
        }
      }
    },

    _removeHeights : function() {
      var self = this;

      self.$specItems.find('.spec-item-cell').css('height', '');
      self.$specItemsWrap.find('.spec-items-container').css('height', '');
    },

    _onResize : function() {
      var self = this;

      if ( Modernizr.mq( self.mobileBreakpoint ) ) {

        // If we have a scroller, destroy it
        if ( self.isScroller ) {
          self._teardownScroller();
        }

        // If we don't have sticky tabs, init them
        if ( !self.isStickyTabs ) {
          self._initStickyTabs();
        }

        if ( !self.isMobile ) {
          self.isMobile = true;
          self._setStickyHeaderContent();
        }

      } else {

        // If we have sticky tabs, destroy them
        if ( self.isStickyTabs ) {
          self._teardownStickyTabs();
        }

        // If we don't have a scroller, create it
        if ( !self.isScroller ) {
          self._initScroller();
        }

        if ( self.isMobile ) {
          self.isMobile = false;
          self._setStickyHeaderContent();
        }

        // Re-compute heights for each cell and total height
        self
          ._setRowHeights( true )
          ._setItemContainerHeight();
      }

      // Set timeout here because we were getting the wrong height for the
      // spec products after a big resize
      setTimeout(function() {
        self.stickyNavHeight = self.$stickyNav.outerHeight();
        self.stickyOffset = self._getStickyHeaderOffset();
      }, 100);
    },

    _onScroll : function( iscroll ) {
      var self = this,
          isIScroll = iscroll !== undefined && iscroll.y !== undefined,
          scrollTop = isIScroll ? iscroll.y * -1 : self.$window.scrollTop(),
          x, maxScrollX;

      // Add/remove a class to show the items have been scrolled horizontally
      if ( isIScroll ) {
        x = iscroll.x;
        maxScrollX = iscroll.maxScrollX + 3;

        // Overflow left
        if ( x < -3 && !self.$detailLabelsWrap.hasClass('overflowing') ) {
          self.$detailLabelsWrap.addClass('overflowing');
        } else if ( x >= -3 && self.$detailLabelsWrap.hasClass('overflowing') ) {
          self.$detailLabelsWrap.removeClass('overflowing');
        }

        // Overflow right
        if ( x > maxScrollX && !self.$specItemsGrid.hasClass('overflowing') ) {
          self.$specItemsGrid.addClass('overflowing');
        } else if ( x <= maxScrollX && self.$specItemsGrid.hasClass('overflowing') ) {
          self.$specItemsGrid.removeClass('overflowing');
        }

        // We haven't scrolled vertically, exit the function
        return;
      }

      // Open/close sticky headers
      if ( !self.isMobile && scrollTop >= self.stickyOffset.top && scrollTop <= self.stickyOffset.bottom ) {
        if ( !self.$stickyHeaders.hasClass('open') ) {
          self.$stickyHeaders.addClass('open');
          self.$container.addClass('sticky-header-open');
          self.$navContainer.addClass('container');
          self.$navWrap.css('top', self.stickyNavHeight);
        }
        self._setStickyHeaderPos( scrollTop - self.stickyOffset.top + self.stickyNavHeight );

      } else {
        if ( self.$stickyHeaders.hasClass('open') ) {
          self.$container.removeClass('sticky-header-open');
          self.$stickyHeaders.removeClass('open');
          self.$navContainer.removeClass('container');
          self.$navWrap.css('top', 'auto');
        }
      }


      // Open the stick nav if it's past the trigger
      if ( scrollTop > self.stickyTriggerOffset ) {
        if ( !self.$stickyNav.hasClass('open') ) {
          self.$stickyNav.addClass('open');
        }

      // Close the sticky nav if it's past the trigger
      } else {
        if ( self.$stickyNav.hasClass('open') ) {
          self.$stickyNav.removeClass('open');
        }
      }
    },

    _onEnlarge : function( evt ) {
      var self = this,
          $specModal = $(evt.target).closest('.spec-item-cell').find('.spec-modal'),
          title = $specModal.find('.js-spec-modal-title').text(),
          $specModalBody = $specModal.find('.js-spec-modal-body').clone();

      self.$modal
        .find('#ports-modal-label')
          .html( title )
          .end()
        .find('.modal-body')
          .html( $specModalBody )
          .end()
        .modal({
          backdrop: false
        });
    },

    _setStickyHeaderPos : function( scrollTop ) {
      var self = this,
          translateZ = Modernizr.csstransforms3d ? ' translateZ(0)' : '',
          prop = Modernizr.csstransforms ? 'transform' : 'top',
          value = Modernizr.csstransforms ? 'translate(0,' + scrollTop + 'px)' + translateZ : scrollTop + 'px';

      self.$stickyHeaders.css( prop, value );

      return self;
    },

    _getStickyHeaderOffset : function() {
      var self = this,
          top = self.$specProducts.offset().top,
          bottom = self.$specProducts.height() + top;

      // Factor in the height of the sticky nav and sticky headers
      bottom = bottom - self.stickyHeaderHeight - self.stickyNavHeight;

      return {
        top: top,
        bottom: bottom
      };
    }

  };

  // Plugin definition
  $.fn.spec = function( options ) {
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
  $.fn.spec.options = {
    mobileBreakpoint : '(max-width: 35.4375em)'
  };

  // Not overrideable
  $.fn.spec.settings = {
    isStickyTabs: false,
    isScroller: false,
    isMobile: false
  };


})(jQuery, Modernizr, window);







$(document).ready(function() {

  if ( $('.spec-multi').length > 0 ) {

    $('.spec-multi').spec();

  }
});
