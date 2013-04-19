
// Reviews + Awards (Subnavigation) Module
// ---------------------------------------
//
// * **Class:** Subnavigation
// * **Version:** 0.1
// * **Modified:** 04/17/2013
// * **Author:** George Pantazis
// * **Dependencies:** jQuery 1.7+, Modernizr, [SonyCarousel](sony-carousel.html),

define(function(require){

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      enquire = require('enquire'),
      Settings = require('require/sony-global-settings'),
      SonyCarousel = require('secondary/index').sonyCarousel;

  var module = {
    'init': function() {
      $('.subnav-module').each(function(){
        new Subnavigation(this);
      });
    }
  };

  var Subnavigation = function(element){

    var self = this;

    self.$el = $(element);
    self.$navgrid = self.$el.find('nav .slimgrid');
    self.$subcats = self.$el.find('.subnav-tray .subcategory');

    self.useCSS3 = Modernizr.csstransforms && Modernizr.csstransitions;

    self.init();

    log('SONY : Subnavigation : Initialized');
  };

  Subnavigation.prototype = {

    constructor: Subnavigation,

    init: function() {
      var self = this;

      if ( !Settings.$html.hasClass('lt-ie10') ){
        enquire.register("(min-width: 768px)", function() {
          self.renderDesktop();
        });
        enquire.register("(min-width: 480px) and (max-width: 767px)", function() {
          self.renderTablet();
        });
        enquire.register("(max-width: 479px)", function() {
          self.renderMobile();
        });
      } else {
        self.renderDesktop();
      }

      // Debug
      self.renderSubcategory('televisions');
    },

    renderDesktop: function() {

      var self = this;

      if ( self.$activeSubcatGrids ) {
        self.$activeSubcatGrids = self.gridApportion(self.$activeSubcatGrids, false);
        self.$activeSubcatGrids.removeClass('m-grid-override');
      }

      self.$navgrid = self.gridApportion(self.$navgrid, false, true);
      self.$navgrid.removeClass('m-grid-override');
    },

    renderTablet: function() {

      var self = this;

      if ( self.$activeSubcatGrids ) {
        self.$activeSubcatGrids = self.gridApportion(self.$activeSubcatGrids, true);
        self.$activeSubcatGrids.addClass('m-grid-override');
      }

      self.$navgrid = self.gridApportion(self.$navgrid, false, true);
      self.$navgrid.removeClass('m-grid-override');
    },

    renderMobile: function() {

      var self = this;

      if ( self.$activeSubcatGrids ) {
        self.$activeSubcatGrids = self.gridApportion(self.$activeSubcatGrids, true);
        self.$activeSubcatGrids.addClass('m-grid-override');
      }

      self.$navgrid = self.gridApportion(self.$navgrid, true, true);
      self.$navgrid.addClass('m-grid-override');
    },

    renderSubcategory: function(which) {

      var self = this,
          $subcat = $('#subcategory-' + which);

      self.$activeSubcatGrids = $subcat.find('.subnav-product-grid');
      enquire.fire();
    },

    gridApportion: function($grids, mobile, center) {

      var $grid = $grids.first().clone().empty(),
          $compiledGrids = $(''),
          $workingGrid = $grid.clone(),
          roomRemaining = mobile ? 6 : 12,
          $mSpans = $grids.find(mobile ? '[class*="m-span"]' : '[class*="span"]');

      $mSpans.each(function(i){

        var $this = $(this),
            classes = this.className.split(' '),
            spanCount;

        for (var j in classes) {
          if ( classes[j].indexOf(mobile ? 'm-span' : 'span') === 0 ) {
            spanCount = classes[j].split(mobile ? 'm-span' : 'span')[1] * 1;
          }
        }

        if ( roomRemaining < spanCount ) {
          $compiledGrids = $compiledGrids.add($workingGrid.clone());
          $workingGrid = $grid.clone();
          roomRemaining = mobile ? 6 : 12;
        }

        $workingGrid.append($this);
        roomRemaining -= spanCount;

        if ( i === $mSpans.length - 1 ) {

          if ( center && roomRemaining >= 2 ) {
            $workingGrid.children().first().addClass((mobile ? 'm-offset' : 'offset') + Math.floor(roomRemaining / 2));
          }

          $compiledGrids = $compiledGrids.add($workingGrid.clone());
          $workingGrid = null;
        }
      });

      $grids.not($grids.first()).remove();
      $grids.first().replaceWith($compiledGrids);

      return $compiledGrids;
    }
  };

  return module;

});
