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

  var COLUMNS_IN_GRID = 12;
  var MIN_COUNTRIES_PER_COLUMN = 5;

  var CountryRegionSelection = {
    init: function() {
      this.stickyHeader = this.stickyHeader = StickyHeader.init();
      this.$countryLists = $('.countries > ol');
      this.fluidLists = this.getFluidLists();

      return this.bind();
    },

    bind : function() {
      window.enquire.register('(max-width: 767px)', {
        match : $.proxy(this.toMobile, this)
      });

      window.enquire.register('(min-width: 767px) and (max-width: 988px)', {
        match : $.proxy(this.toTablet, this)
      });

      window.enquire.register('(min-width: 1024px)', {
        match : $.proxy(this.toDesktop, this)
      }, true);

      return this;
    },

    getFluidLists : function() {
      var lists = [];

      this.$countryLists.each(function(index, list) {
        lists.push(new FluidList(COLUMNS_IN_GRID, $(list), MIN_COUNTRIES_PER_COLUMN));
      });

      return lists;
    },

    resetFluidLists : function() {
      var i = 0,
          numLists = this.fluidLists.length;

      for ( ; i < numLists; i += 1) {
        this.fluidLists[i].reset();
      }
    },

    updateFluidLists : function(tag) {
      var i = 0,
          numLists = this.fluidLists.length;

      for ( ; i < numLists; i += 1) {
        this.fluidLists[i].update(tag);
      }
    },

    toMobile : function() {
      this.stickyHeader.enable();
      this.resetFluidLists();
    },

    toTablet : function() {
      this.stickyHeader.disable();
      this.updateFluidLists('tablet');
    },

    toDesktop : function() {
      this.stickyHeader.disable();
      this.updateFluidLists('desktop');
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

  function FluidList(numGridColumns, $list, minItemsPerContainer) {
    return this.init(numGridColumns, $list, minItemsPerContainer);
  }

  FluidList.prototype = {
    MEDIA_TAG_ATTR: "data-fluid-list",
    CONTAINERS_REL_ATTR: "data-fluid-list-containers",

    init: function(numGridColumns, $list, minItemsPerContainer) {
      this.$list = $list;
      this.numGridColumns = numGridColumns;
      this.items = this._getItemsInList();
      this.$containers = this._getContainers();
      this.containersMap = this._getContainersMap();
      this.minItemsPerContainer = minItemsPerContainer || 0;

      return this;
    },

    _getItemsInList: function() {
      var items = [];

      this.$list.find('li').each(function(index, element) {
        var $item = $(element);
        items.push($item);
      });

      return items;
    },

    _getContainers: function() {
      var listContainerRel = this.$list.attr(this.CONTAINERS_REL_ATTR);
      return $("[rel=" + listContainerRel + "]");
    },

    _getContainersMap: function() {
      var tagAttr = this.MEDIA_TAG_ATTR,
          $list = this.$list,
          containersMap = {};

      this.$containers.each(function(index, element) {
        var $container = $(element),
            tags = $container.attr(tagAttr).split(','),
            tag,
            $containerList = $list.clone().empty();

        for( var i = 0; i < tags.length; i += 1 ) {
          tag = tags[i];
          if (!containersMap[tag]) {
            containersMap[tag] = [];
          }

          $container.append($containerList);
          containersMap[tag].push({
            $container: $container,
            $list: $containerList
          });
        }
      });

      return containersMap;
    },

    _getContainersForTag: function(tag) {
        return this.containersMap[tag];
    },

    update: function(tag) {
      var containers = this._getContainersForTag(tag),
          containerWidth = this.numGridColumns / containers.length,
          itemsPerContainer = Math.ceil(this.items.length / containers.length),
          spanClass = 'span' + containerWidth,
          container,
          i = 0,
          j = 0,
          max = 0;

      if (this.minItemsPerContainer && itemsPerContainer < this.minItemsPerContainer) {
        itemsPerContainer = this.minItemsPerContainer;
      }

      this._resetContainers();

      for (i = 0; i < containers.length; i += 1) {
        container = containers[i];
        container.$container.addClass(spanClass);

        j = i * itemsPerContainer;
        max = j + itemsPerContainer;

        for (; j < max; j += 1) {
          if (j < this.items.length) {
            containers[i].$list.append(this.items[j]);
          }
        }
      }
    },

    reset: function() {
      return this._resetItems()._resetContainers();
    },

    _resetItems: function() {
      var i = 0,
          numItems = this.items.length;

      for( ; i < numItems; i += 1) {
        this.items[i].appendTo(this.$list);
      }

      return this;
    },

    _resetContainers: function() {
      this.$containers.removeClass();
      return this;
    }
  };

  return CountryRegionSelection;
});
