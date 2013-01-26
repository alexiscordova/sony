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
      self.$tabStrip = self.$container.find('.tab-strip');
      self.$navNext = self.$container.find('.spec-nav-next');
      self.$navPrev = self.$container.find('.spec-nav-prev');
      self.$enlargeTriggers = self.$specProducts.find('.js-enlarge');
      self.$enlargeClosers = self.$container.find('.spec-modal .box-close');
      self.$detailLabelsWrap = self.$specProducts.find('.detail-labels-wrap');
      self.$stickyHeaders = self.$specProducts.find('.compare-sticky-header');

      self.stickyHeaderHeight = self.$stickyHeaders.first().height();

      // Line up spec item cells
      self._onResize();

      // Init shuffle on the features section
      self._initFeatures();

      self.$window.on('resize', $.throttle(250, $.proxy( self._onResize, self )));
      self.$window.on('scroll', $.proxy( self._onScroll, self ));

      self.$enlargeTriggers.on('click', $.proxy( self._onEnlarge, self ));
      self.$enlargeClosers.on('click', $.proxy( self._closeEnlarge, self ));

      // We're done
      // Add the complete class to the labels to transition them in
      setTimeout(function() {
        self.$detailLabelsWrap.find('.detail-labels-wrapping').addClass('complete');
      }, 250);
    },

    _initFeatures : function() {
      var self = this;

      self.$specTiles = self.$container.find('.spec-tiles');
      self.$specTiles.shuffle({
        itemSelector: '.spec-tile',
        easing: 'ease-out',
        speed: 250,
        columnWidth: Exports.masonryColumns,
        gutterWidth: Exports.masonryGutters,
        showInitialTransition: false
      });
      self.shuffle = self.$specTiles.data('shuffle');

      return self;
    },

    _initScroller : function() {
      var self = this,
          data;

      self.$specItemsWrap.scrollerModule({
        contentSelector: '.spec-items-container',
        itemElementSelector: '.spec-item',
        mode: 'paginate', // if mode == 'paginate', the items in the container will be paginated
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
          bounce: true,
          onScrollEnd: null,
          lockDirection: true,
          onBeforeScrollStart: null,
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
          $btns = $();

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

        $btns = $btns.add( $btn );
      });

      $btns.appendTo( self.$tabStrip.find('.tabs') );

      self.$tabStrip.stickyTabs({
        mq: self.mobileBreakpoint
      });

      // Undo what _setRowHeights sets
      self._removeHeights();
    },

    _teardownStickyTabs : function() {
      var self = this;
      self.$tabStrip
        .stickyTabs('destroy')
        .find('.tabs')
          .empty();
      self.isStickyTabs = false;
      self.$specItems.removeClass('tab-pane fade in off-screen active');
      self._closeEnlarge();
    },

    _setRowHeights : function() {
      var self = this;

      // Set detail rows to even heights
      self.$container.find('.detail-label').each(function(i) {
        var $detailLabel = $(this),
            maxHeight = parseFloat( $detailLabel.css('height') ),

            // plus 2 because i is a zero based index and nth-child is one based. Also, the first child in our html
            // is the title, which is not a .spec-item-cell, so we need to add another to our selector
            // Also, there is a sticky header that needs to be excluded: add 1 more
            $cells = self.$specItems.find('.spec-item-cell:nth-child(' + (i + 3) + ')');

        // Loop through the cells
        $cells.each(function() {
          var $this = $(this),
              height = parseFloat( $this.css('height') );

          if ( height > maxHeight ) {
            maxHeight = height;
          }
        });

        $cells.add($detailLabel).css('height', maxHeight);
      });

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

        if ( self.$modal ) {
          self._closeEnlarge();
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

        // Re-compute heights for each cell and total height
        self
          ._setRowHeights()
          ._setItemContainerHeight();
      }

      self.stickyOffset = self._getStickyHeaderOffset();
    },

    _onScroll : function( iscroll ) {
      var self = this,
          isIScroll = iscroll !== undefined && iscroll.y !== undefined,
          scrollTop = isIScroll ? iscroll.y * -1 : self.$window.scrollTop();

      if ( isIScroll ) {
        if ( iscroll.x < -3 && !self.$detailLabelsWrap.hasClass('overflowing') ) {
          self.$detailLabelsWrap.addClass('overflowing');
        } else if ( iscroll.x >= -3 && self.$detailLabelsWrap.hasClass('overflowing') ) {
          self.$detailLabelsWrap.removeClass('overflowing');
        }

        // We haven't scrolled vertically, exit the function
        return;
      }

      if ( scrollTop >= self.stickyOffset.top && scrollTop <= self.stickyOffset.bottom ) {
        if ( !self.$stickyHeaders.hasClass('open') ) {
          self.$stickyHeaders.addClass('open');
        }
        self._setStickyHeaderPos( scrollTop - self.stickyOffset.top );

      } else {
        if ( self.$stickyHeaders.hasClass('open') ) {
          self.$stickyHeaders.removeClass('open');
        }
      }
    },

    _onEnlarge : function( evt ) {
      var self = this,
          $cell = $(evt.target).closest('.spec-item-cell'),
          $container = $cell.closest('.spec-items-container'),
          $modal = $cell.find('.spec-modal'),
          cellTop = $cell.position().top,
          wrapperOffset = self.isScroller ? self.iscroll.x * -1 : 0,
          cellHeight = $cell.outerHeight(),
          columnWidth = $cell.parent().outerWidth(),
          modalWidth = self.isScroller ? (self.scroller.itemsPerPage * columnWidth) + 'px' : '100%';

      // Make sure we don't open 2 modals at once
      self._closeEnlarge();

      $modal
        .detach()
        .removeClass('hide')
        .css({
          'top': cellTop,
          'left': wrapperOffset,
          'width': modalWidth,
          'minHeight': cellHeight
        })
        .data('$cell', $cell)
        .appendTo( $container );

      self.$modal = $modal;
    },

    _closeEnlarge : function() {
      var self = this,
          $cell;

      // No current modal
      if ( !self.$modal ) {
        return;
      }

      $cell = self.$modal.data('$cell');


      // Detach and re-attach the modal in the spec-item
      self.$modal
        .detach()
        .addClass('hide')
        .appendTo($cell);
      self.$modal = null;
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
          bottom = self.$specProducts.height() + top - self.stickyHeaderHeight;

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
    isScroller: false
  };


}(jQuery, Modernizr, window));







$(document).ready(function() {

  if ( $('.spec-multi').length > 0 ) {

    $('.spec-multi').spec();

  }
});
