
// -------- Sony Country Region Selection -------
// Module: Country / Region Selection
// Version: 1.0
// Author: Chris Pickett
// Date: 04/10/13
// Dependencies: jQuery 1.7+, sony-iscroll
// --------------------------------------

define(function(require){

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      Settings = require('require/sony-global-settings'),
      Environment = require('require/sony-global-environment'),
      sonyIScroll = require('plugins/sony-iscroll'),
      enquire = require('enquire');

  var COLUMNS_IN_GRID = 12;
  var MIN_COUNTRIES_PER_COLUMN = 5;


  // View Controller for country / region selection
  var CountryRegionSelection = {
    init: function() {
      this.stickyHeader = this.stickyHeader = StickyHeader.init();
      this.$countryLists = $('.countries > ol');
      this.fluidLists = this.getFluidLists();

      return this.bind();
    },

    // Binds enquire handlers to setup page for mobile, tablet and desktop.
    bind : function() {

      // Enquire doesn't exist in old IE, so make sure it's there
      if ( Modernizr.mediaqueries ) {

        enquire
          .register('(max-width: 47.9375em)', {
            match : $.proxy(this.toMobile, this)
          })
          .register('(min-width: 48em) and (max-width: 61.1875em)', {
            match : $.proxy(this.toTablet, this)
          })
          .register('(min-width: 64em)', {
            match : $.proxy(this.toDesktop, this)
          }, true);
      } else {
        this.toDesktop();
      }

      return this;
    },

    // Gets a FluidList object for each country list.
    getFluidLists : function() {
      var lists = [];

      this.$countryLists.each(function(index, list) {
        lists.push(new FluidList(COLUMNS_IN_GRID, $(list), MIN_COUNTRIES_PER_COLUMN));
      });

      return lists;
    },

    // Calls reset on each FluidList
    resetFluidLists : function() {
      var i = 0,
          numLists = this.fluidLists.length;

      for ( ; i < numLists; i += 1) {
        this.fluidLists[i].reset();
      }
    },

    // Calls update on each FluidList
    updateFluidLists : function(tag) {
      var i = 0,
          numLists = this.fluidLists.length;

      for ( ; i < numLists; i += 1) {
        this.fluidLists[i].update(tag);
      }
    },

    // Called when media query matches mobile.
    toMobile : function() {
      this.stickyHeader.enable();
      this.resetFluidLists();
    },

    // Called when media query matches tablet.
    toTablet : function() {
      this.stickyHeader.disable();
      this.updateFluidLists('tablet');
    },

    // Called when media query matches desktop.
    toDesktop : function() {
      this.stickyHeader.disable();
      this.updateFluidLists('desktop');
    }
  };


  // Handles continent name sticky header for mobile.
  var StickyHeader = {
    init: function() {
      this.$fixedHeader = $('.continent-sticky-header').hide();
      this.$fixedHeaderTitle = this.$fixedHeader.find('.continent-sticky-header-title');
      this.$headers = $('.continent');
      this.offsets = [];
      this.currentHeader = undefined;
      this.headerIsVisible = false;

      this.$fixedHeader.css('left', $(this.$headers[0]).offset().left + 'px');

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
      this.scroll = new IScroll('scrollable', {
        onScrollMove: handler,
        onScrollEnd: handler
      });

      // Align fixed header with other headers
      this.$fixedHeader.css('left', $(this.$headers[0]).offset().left + 'px');

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


  // FluidList
  // Takes a html list and will make it fit into the given containers

  // FluidList constructor
  function FluidList(numGridColumns, $list, minItemsPerContainer) {
    return this.init(numGridColumns, $list, minItemsPerContainer);
  }

  FluidList.prototype = {
    MEDIA_TAG_ATTR: 'data-fluid-list',
    CONTAINERS_REL_ATTR: 'data-fluid-list-containers',

    init: function(numGridColumns, $list, minItemsPerContainer) {
      this.$list = $list;
      this.numGridColumns = numGridColumns;
      this.items = this._getItemsInList();
      this.$containers = this._getContainers();
      this.containersMap = this._getContainersMap();
      this.minItemsPerContainer = minItemsPerContainer || 0;

      return this;
    },

    // Gets an array of the items in the list.
    _getItemsInList: function() {
      var items = [];

      this.$list.find('li').each(function(index, element) {
        var $item = $(element);
        items.push($item);
      });

      return items;
    },

    // Gets the containers from the markup. Uses the rel attribute.
    _getContainers: function() {
      var listContainerRel = this.$list.attr(this.CONTAINERS_REL_ATTR);
      return $('[rel=' + listContainerRel + ']');
    },

    // Maps the containers to their tags.
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

    // Returns the correct set of containers for the given tag.
    _getContainersForTag: function(tag) {
        return this.containersMap[tag];
    },

    // Reflows the items to fit into the containers for the given tag.
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

    // Removes the items from the containers and puts them back into the initial list and makes sure that span classes are removed from the containers.
    reset: function() {
      return this._resetItems()._resetContainers();
    },

    // Removes the items from the containers and puts them back into the initial list.
    _resetItems: function() {
      var i = 0,
          numItems = this.items.length;

      for( ; i < numItems; i += 1) {
        this.items[i].appendTo(this.$list);
      }

      return this;
    },

    // Removes all classes from the containers
    _resetContainers: function() {
      this.$containers.removeClass();
      return this;
    }
  };

  return CountryRegionSelection;
});
