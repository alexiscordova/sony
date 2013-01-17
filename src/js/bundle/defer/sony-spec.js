/*global jQuery, Modernizr, Exports*/

// ----------- Sony Specs Module --------
// Module: Spec Comparison Module
// Version: 1.0
// Author: Glen Cheney
// Date: 01/14/13
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

      self.$specItems = self.$container.find('.spec-item');
      self.$specItemsWrap = self.$container.find('.spec-items-wrap');
      self.$tabStrip = self.$container.find('.tab-strip');

      // Line up spec item cells
      self._onResize();

      // Init shuffle on the features section
      self._initFeatures();

      self.$window.on('resize', $.throttle(250, $.proxy( self._onResize, self )));

      // We're done
      // Add the complete class to the labels to transition them in
      setTimeout(function() {
        self.$container.find('.detail-labels-wrapping').addClass('complete');
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
      var self = this;

      self.$specItemsWrap.scrollerModule({
        contentSelector: '.spec-items-container',
        itemElementSelector: '.spec-item',
        mode: 'paginate', // if mode == 'paginate', the items in the container will be paginated
        nextSelector: '', // selector for next paddle
        prevSelector: '', // selector for previous paddle
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
          onAnimationEnd: null,
        }
      });

      // Save the iScroll instance
      self.scroller = self.$specItemsWrap.data('scrollerModule').scroller;
      self.isScroller = true;

    },

    _teardownScroller : function() {
      var self = this;
      self.$specItemsWrap.scrollerModule('destroy');
      self.scroller = null;
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
    },

    _teardownStickyTabs : function() {
      var self = this;
      self.$tabStrip
        .stickyTabs('destroy')
        .find('.tabs')
          .empty();
      self.isStickyTabs = false;
      self.$specItems.removeClass('tab-pane fade in off-screen active');
    },

    _setRowHeights : function() {
      var self = this;

      // Set detail rows to even heights
      self.$container.find('.detail-label').each(function(i) {
        var $detailLabel = $(this),
            maxHeight = parseFloat( $detailLabel.css('height') ),

            // plus 2 because i is a zero based index and nth-child is one based. Also, the first child in our html
            // is the title, which is not a .spec-item-cell, so we need to add another to our selector
            $cells = self.$specItems.find('.spec-item-cell:nth-child(' + (i + 2) + ')');

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
      if ( self.scroller ) {
        self.scroller.refresh();
      }

      return self;
    },

    _setItemContainerHeight : function() {
      var self = this;

      self.$specItemsWrap.find('.spec-items-container').height( self.$specItems.first().height() );

      return self;
    },

    _onResize : function() {
      var self = this;

      // TODO, going up and back breaks the `stickyness` of the tab


      if ( Modernizr.mq( self.mobileBreakpoint ) ) {

        // If we have a scroller, destroy it
        if ( self.isScroller ) {
          self._teardownScroller();
        }

        // If we don't have sticky tabs, init them
        if ( !self.isStickyTabs ) {
          self._initStickyTabs();
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
    mobileBreakpoint : '(max-width: 567px)'
  };

  // Not overrideable
  $.fn.spec.settings = {
    isStickyTabs: false,
    isScroller: false
  };


}(jQuery, Modernizr, window));







$(document).ready(function() {

  if ( $('.spec-module').length > 0 ) {

    $('.spec-module').spec();

  }
});
