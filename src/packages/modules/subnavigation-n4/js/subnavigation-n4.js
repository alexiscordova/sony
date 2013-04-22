
// Reviews + Awards (Subnavigation) Module
// ---------------------------------------
//
// * **Class:** Subnavigation
// * **Version:** 0.1
// * **Modified:** 04/17/2013
// * **Author:** George Pantazis
// * **Dependencies:** jQuery 1.7+, Modernizr, Enquire, [SonyCarousel](sony-carousel.html),

define(function(require){

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      enquire = require('enquire'),
      Settings = require('require/sony-global-settings'),
      Utilities = require('require/sony-global-utilities'),
      Environment = require('require/sony-global-environment'),
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
    self.$tray = self.$el.find('.subnav-tray');
    self.$subcats = self.$tray.find('.subcategory');

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
          self.renderSubcats(null, false);
          self.renderNav();
          self.mode = 'desktop';
        });
        enquire.register("(min-width: 480px) and (max-width: 767px)", function() {
          self.renderSubcats(null, true);
          self.renderNav();
          self.mode = 'tablet';
        });
        enquire.register("(max-width: 479px)", function() {
          self.renderSubcats(null, true);
          self.renderNav(true);
          self.mode = 'mobile';
        });
      } else {
        self.renderSubcats(null, false);
        self.renderNav();
        self.mode = 'desktop';
      }

      Environment.on('global:resizeDebounced', $.proxy(self.setTrayHeight, self));
    },

    renderSubcats: function($subcat, mobile) {

      var self = this,
          $grids;

      $subcat = $subcat || self.$activeSubcat;

      if ( !$subcat ) {
        return;
      }

      $grids = $subcat.find('.subnav-product-grid');

      $grids = Utilities.gridApportion($grids, mobile);
      $grids[ mobile ? 'addClass' : 'removeClass' ]('m-grid-override');

      self.$activeSubcat = $subcat;
      self.setTrayHeight();
    },

    renderNav: function(mobile) {

      var self = this;

      self.$navgrid = Utilities.gridApportion(self.$navgrid, mobile, true);
      self.$navgrid[ mobile ? 'addClass' : 'removeClass' ]('m-grid-override');

      self.bindNav();
    },

    bindNav: function() {

      var self = this,
          $buttons = self.$el.find('.subcategory-link');

      $buttons.on('click', function(){

        var $this = $(this);

        if ( $this.hasClass('active') ) {
          $buttons.removeClass('active');
          self.closeTray();
        } else {
          $buttons.removeClass('active');
          $this.addClass('active');
          self.openSubcat($this.data('subcategory'));
        }
      });
    },

    openSubcat: function(which) {

      var self = this,
          $subcat = $('#subcategory-' + which);

      self.renderSubcats($subcat, self.mode !== 'desktop');

      self.$subcats.removeClass('active');

      $subcat.addClass('active');
    },

    closeTray: function() {

      var self = this;

      self.$subcats.removeClass('active');
      self.$tray.css('height', 0);
      self.$activeSubcat = null;
    },

    setTrayHeight: function() {

      var self = this;

      if ( self.$activeSubcat ) {
        self.$tray.css('height', self.$activeSubcat.height());
      }
    }

  };

  return module;

});
