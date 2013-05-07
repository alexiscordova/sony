
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
      StickyHeader = require('secondary/index').sonyStickyHeaders,
      enquire = require('enquire');

  var COLUMNS_IN_GRID = 12;
  var MIN_COUNTRIES_PER_COLUMN = 5;

  var module = {
    'init': function() {
      var countryRegion = $('.country-region');
      if ( countryRegion ) {
        new CountryRegionSelection(countryRegion);
      }
    }
  };

  // View Controller for country / region selection
  var CountryRegionSelection = function(element) {
    var self = this;
    self.$el = $(element);

    self.init();
  };

  CountryRegionSelection.prototype = {

    constructor: CountryRegionSelection,

    init: function() {
      var self = this;
      self.$pageWrapperOuter = $('#page-wrap-outer');

      if ( self.$pageWrapperOuter.length > 0 ) {
        self.initFullPageBuild();
        self.scrollableId = 'scroll';
      } else {
        self.scrollableId = 'scrollable';
      }
      self.stickyHeader = new StickyHeader(self.scrollableId);
      self.$countryLists = $('.countries > ol');
      self.fluidLists = self.getFluidLists();

      return self.bind();
    },

    initFullPageBuild : function() {
      var self = this;

      $('.country-region').removeClass();
      self.$pageWrapperOuter.addClass('country-region');

      $('.continent-sticky-header').appendTo(self.$pageWrapperOuter);

      $('.scrollable').attr('id', '').removeClass();

      self.$pageWrapperInner = $('#page-wrap-inner');
      self.$crollContainer = $('<div id="scrollcontainer">');
      var $croll = $('<div id="scroll">').addClass('scrollable');

      self.$crollContainer.append($croll);
      $('<div>').append(self.$pageWrapperInner.children().not('#nav-wrapper')).appendTo($croll);

      $(self.$pageWrapperInner).append(self.$crollContainer);
    },

    setMobileHeight : function() {
      var self = this;
      var winheight = parseInt($(window).height(), 10);
      var navheight = parseInt($('#nav-wrapper').height(), 10);

      self.$crollContainer.css({
        'height': winheight - navheight +'px',
        'position': 'relative'
      });

    },

    resetHeight : function () {
      var self = this;
      self.$crollContainer.css({
        'height': 'auto',
        'position': 'relative'
      });
    },

    // Binds enquire handlers to setup page for mobile, tablet and desktop.
    bind : function() {
      var self = this;

      // Enquire doesn't exist in old IE, so make sure it's there
      if ( Modernizr.mediaqueries ) {

        enquire
          .register('(max-width: 47.9375em)', {
            match : $.proxy(self.toMobile, self)
          })
          .register('(min-width: 48em) and (max-width: 61.1875em)', {
            match : $.proxy(self.toTablet, self)
          })
          .register('(min-width: 64em)', {
            match : $.proxy(self.toDesktop, self)
          }, true);
      } else {
        self.toDesktop();
      }

      return self;
    },

    // Gets a FluidList object for each country list.
    getFluidLists : function() {
      var self = this,
          lists = [];

      self.$countryLists.each(function(index, list) {
        lists.push(new FluidList(COLUMNS_IN_GRID, $(list), MIN_COUNTRIES_PER_COLUMN));
      });

      return lists;
    },

    // Calls reset on each FluidList
    resetFluidLists : function() {
      var self = this,
          i = 0,
          numLists = this.fluidLists.length;

      for ( ; i < numLists; i += 1) {
        self.fluidLists[i].reset();
      }
    },

    // Calls update on each FluidList
    updateFluidLists : function(tag) {
      var self = this,
          i = 0,
          numLists = self.fluidLists.length;

      for ( ; i < numLists; i += 1) {
        self.fluidLists[i].update(tag);
      }
    },

    // Called when media query matches mobile.
    toMobile : function() {
      var self = this;
      self.stickyHeader.enable();
      self.resetFluidLists();
      self.setMobileHeight();
    },

    // Called when media query matches tablet.
    toTablet : function() {
      var self = this;
      self.stickyHeader.disable();
      self.updateFluidLists('tablet');
      self.resetHeight();
    },

    // Called when media query matches desktop.
    toDesktop : function() {
      var self = this;
      self.stickyHeader.disable();
      self.updateFluidLists('desktop');
      self.resetHeight();
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

  return module;
});
