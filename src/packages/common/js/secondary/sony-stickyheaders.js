// Sticky Header
// ------------
//
// * **Module:** Sticky Header
// * **Version:** 0.1
// * **Modified:** 05/06/2013
// * **Author:** Chris Pickett
// * **Dependencies:** jQuery 1.7+, sony-iscroll
//
// *Example Usage:*
//
// new StickyHeader('scrollable-element-id');

define(function(require){

  'use strict';

  var $ = require('jquery'),
      Settings = require('require/sony-global-settings'),
      Environment = require('require/sony-global-environment'),
      sonyIScroll = require('plugins/sony-iscroll');

  var StickyHeader = function(scrollableId) {
    this.init(scrollableId);
  };

  StickyHeader.prototype = {
    init: function(scrollableId) {
      this.scrollableId = scrollableId;
      this.$headers = $('.js-sticky-headers');
      this.$fixedHeader = $('.js-sticky-fixed-header').hide();
      this.$fixedHeaderTitle = this.$fixedHeader.find('.js-sticky-header-title');
      this.offsets = [];
      this.currentHeader = undefined;
      this.headerIsVisible = false;

      return this._getHeaderOffsets();
    },

    // Gets the offsets of each of the headers.
    _getHeaderOffsets: function() {
      var offsets = [];

      this.$headers.each(function(index, header) {
        var $header = $(header);
        offsets.push($header.offset().top);
      });

      this.offsets = offsets;
      this.lastScrollOffset = 0;

      return this;
    },

    // Enables iScroll and makes sure sticky header is correctly aligned.
    enable: function() {
      // HEY! function.bind doesn't exist in IE8/7. Don't use it without a polyfill!
      var handler = $.proxy( this.scrollHandler, this );
      this.scroll = new IScroll(this.scrollableId, {
        momentum : true,
        onScrollMove: handler,
        onScrollEnd: handler
      });

      return this;
    },

    // Hides the fixed header and destroys the iscroll.
    disable: function() {
      this.$fixedHeader.hide();

      if (this.scroll) {
        this.scroll.scrollTo();
        this.scroll.destroy();
      }

      return this;
    },

    // Called by iScroll when a scroll event happens.
    scrollHandler: function() {
      var self = this;
      // self.scroll.refresh();

      var offsetTarget = Math.abs(this.scroll.y); // iScroll.y is negative
      this.updateFixedHeader(offsetTarget);
    },

    // Updates the fixed header with the title of the closest header.
    updateFixedHeader: function(targetOffset) {
      var $header,
          headerIndex = this._indexOfClosestHeader(targetOffset);

      // Only update the fixed header if the new header is different.
      if (headerIndex !== this.currentHeader) {
        this.currentHeader = headerIndex;
        $header = $(this.$headers[headerIndex]);
        this.$fixedHeaderTitle.text($header.text());

        if (!this.headerIsVisible) {
          this.$fixedHeader.stop().show();
          this.headerIsVisible = true;
        }
      }

      // Hide the fixed header if there is no header to display.
      if (headerIndex === -1 && this.headerIsVisible) {
          this.$fixedHeader.stop().hide();
          this.headerIsVisible = false;
      }
    },

    // Gets the index of the closest header to the target offset.
    // Closest being the header that is not in view (a negative offset) and nearest to the target offset.
    _indexOfClosestHeader: function (targetOffset) {
      var headerIndex = -1,
          i = 0,
          numHeaders = this.$headers.length,
          offset,
          closestOffset;

      for (; i < numHeaders; i += 1) {
        offset = this.offsets[i] - targetOffset;
        if (offset < 0 && (offset > closestOffset || !closestOffset)) {
          closestOffset = offset;
          headerIndex = i;
        }
      }

      return headerIndex;
    }
  };

  return StickyHeader;
});