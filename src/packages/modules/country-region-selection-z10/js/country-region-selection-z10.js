/*global define, Modernizr, log*/

// -------- Sony Country Region Selection -------
// Module: Country Region Selection
// Version: 1.0
// Author: Chris Pickett
// Date: 04/10/13
// Dependencies: jQuery 1.7+, sony-iscroll
// --------------------------------------

define(function(require){

  'use strict';

  var $ = require('jquery'),
      Settings = require('require/sony-global-settings'),
      Environment = require('require/sony-global-environment'),
      sonyIScroll = require('plugins/sony-iscroll'),
      enquire = require('enquire');

  var CountryRegionSelection = {
    init: function() {
      this.stickyHeader = StickyHeader.init();
      this.fluidList = new FluidList(12, $('.continents'), $('.countryContainer'));

      window.enquire.register('(max-width: 767px)', {
        match : function() {
          stickyHeader.enable();
          console.log('mobile');
        }
      });

      window.enquire.register('(min-width: 767px) and (max-width: 988px)', {
        match : function() {
          stickyHeader.disable();
          console.log('tablet');
        }
      });

      window.enquire.register('(min-width: 1024px)', {
        match : function() {
          stickyHeader.disable();
          console.log('desktop');
        }
      }, true);
    }
  };


  var StickyHeader = {
    init: function() {
      this.$fixedHeader = $('.continent-sticky-header').hide();
      this.$fixedHeaderTitle = this.$fixedHeader.find('.continent-sticky-header-title');
      this.$headers = $('.continent');
      this.offsets = [];
      this.currentHeader = undefined;
      this.headerIsVisible = false;

      $('.scrollable').attr('id', 'scrollable');

      this.$fixedHeader.css('left', $(this.$headers[0]).offset().left + 'px');

      return this._getHeaderOffsets();
    },

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

    enable: function() {
      this.scroll = new IScroll('scrollable', {
        onScrollMove: this.scrollHandler.bind(this),
        onScrollEnd: this.scrollHandler.bind(this)
      });

      // Align fixed header with other headers
      this.$fixedHeader.css('left', $(this.$headers[0]).offset().left + 'px');

      return this;
    },

    disable: function() {
      this.$fixedHeader.hide();

      if (this.scroll) {
        this.scroll.destroy();
      }

      return this;
    },

    scrollHandler: function() {
      var offsetTarget = Math.abs(this.scroll.y); // iScroll.y is negative
      this.updateFixedHeader(offsetTarget);
    },

    updateFixedHeader: function(targetOffset) {
      var $header,
          headerIndex = this._indexOfClosestHeader(targetOffset);

      if (headerIndex != this.currentHeader) {
        this.currentHeader = headerIndex;
        $header = $(this.$headers[headerIndex]);
        this.$fixedHeaderTitle.text($header.text());

        if (!this.headerIsVisible) {
          this.$fixedHeader.stop().show();
          this.headerIsVisible = true;
        }
      }

      if (headerIndex === -1 && this.headerIsVisible) {
          this.$fixedHeader.stop().hide();
          this.headerIsVisible = false;
      }
    },

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

  function FluidList(numGridColumns, $list, $containers) {
    return this.init(numGridColumns, $list, $containers);
  }

  FluidList.prototype = {
    DATA_TAG_ATTR: "data-fluid-list",

    init: function(numGridColumns, $list, $containers) {
      this.$containers = $containers;
      this.$list = $list;
      this.numGridColumns = numGridColumns;

      console.log(this.$containers, this.$list, this.numGridColumns);

      return this;
    }
  };

  return CountryRegionSelection;
});
