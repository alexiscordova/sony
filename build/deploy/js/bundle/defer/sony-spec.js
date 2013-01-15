/*global jQuery, Modernizr, iQ, Exports*/

// ----------- Sony Specs Module --------
// Module: Sticky Tabs
// Version: 1.0
// Author: JP Cotoure
// Modified: 01/09/2013 by Glen Cheney
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

      self.setRowHeights();
      self._initFeatures();
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
    },

    setRowHeights : function( /*isFirst*/ ) {
      var self = this;
          // $detailGroup = self.$container.find('.detail-group').first(),
          // offset = 0;

      // Calling this multiple times is resulting in an ever-growing height...
      // if ( isFirst ) {
      //   self.$compareTool.find('.compare-sticky-header').each(function() {
      //     var $this = $(this),
      //         height = parseFloat( $this.css('height') ) + parseFloat( $this.css('paddingTop') );

      //     if ( height > stickyMaxHeight ) {
      //       stickyMaxHeight = height;
      //     }
      //   }).css('height', stickyMaxHeight);
      // }

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
              height = parseFloat( $this.css('height') ) + parseFloat( $this.css('paddingTop') );

          if ( height > maxHeight ) {
            maxHeight = height;
          }
        });

        $cells.add($detailLabel).css('height', maxHeight);
      });

      // Set the top offset for the labels
      // offset = $detailGroup.position().top;
      // offset += parseFloat( $detailGroup.css('marginTop') );
      // self.$container.find('.detail-label-group').css('top', offset);

      // Refresh outer iScroll
      if ( self.outerScroller ) {
        self.outerScroller.refresh();
      }

      return self;
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
  };

  // Not overrideable
  $.fn.spec.settings = {
  };


}(jQuery, Modernizr, window));







$(document).ready(function() {

  if ( $('.spec-module').length > 0 ) {

    $('.spec-module').spec();

  }
});
