
// Subnavigation (Subnavigation) Module
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
      hammer = require('plugins/index').hammer,
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
    self.$navgroups = self.$el.find('nav .subnav-nav-carousel-slide');
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
        enquire.register("(min-width: 980px)", function() {
          self.mode = 'desktop';
          self.renderSubcats(null, false);
          self.renderNav();
        });
        enquire.register("(min-width: 480px) and (max-width: 979px)", function() {
          self.mode = 'tablet';
          self.renderSubcats(null, true);
          self.renderNav();
        });
        enquire.register("(max-width: 479px)", function() {
          self.mode = 'mobile';
          self.renderSubcats(null, true);
          self.renderNav();
        });
      } else {
        self.mode = 'desktop';
        self.renderSubcats(null, false);
        self.renderNav();
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

      $grids = Utilities.gridApportion({
        $groups: $grids,
        mobile: mobile
      });

      $grids[ mobile ? 'addClass' : 'removeClass' ]('m-grid-override');

      self.$activeSubcat = $subcat;
      self.setTrayHeight();
    },

    renderNav: function() {

      var self = this,
          isMobile = (self.mode === 'mobile'),
          newCols, currentSlide;

      switch ( self.mode ) {
        case 'desktop':
          newCols = 2;
          break;
        case 'tablet':
          newCols = 3;
          break;
        case 'mobile':
          newCols = 4;
          break;
      }

      Utilities.reassignSpanWidths(self.$navgroups.find('.subcategory-link'), newCols);

      self.$navgroups = Utilities.gridApportion({
        $groups: self.$navgroups,
        gridSelector: '.grid'
      });

      if ( self.$navgroups.find('.active').length > 0 ) {
        currentSlide = self.$navgroups.find('.active').closest(self.$navgroups).index();
      }

      if ( self.$navCarousel ) {
        self.$navCarousel.sonyCarousel('destroy');
      }

      self.$navCarousel = self.$el.find('.subnav-nav-carousel-wrapper nav').sonyCarousel({
        draggable: true,
        snap: !isMobile,
        onlySnapAtEnds: isMobile,
        wrapper: '.subnav-nav-carousel-wrapper',
        slides: '.subnav-nav-carousel-slide',
        paddles: !isMobile,
        useSmallPaddles: !isMobile
      });

      self.$navCarousel.sonyCarousel('gotoSlide', currentSlide, true);

      self.bindNav();
    },

    bindNav: function() {

      var self = this,
          $buttons = self.$navgroups.find('.grid').children();

      $buttons.on('click', function(){
        return !$(this).hasClass('has-products');
      });

      $buttons.hammer().on('tap', function(){

        var $this = $(this),
            isActive = $this.hasClass('active');

        if ( !$this.hasClass('has-products') ) {
          return true;
        }

        $buttons.removeClass('active');

        if ( !$this.parents().hasClass('dragging') ) {
          if ( isActive ) {
            self.closeTray();
          } else {
            $this.addClass('active');
            self.openSubcat($this.data('subcategory'));
          }
        }
      });
    },

    openSubcat: function(which) {

      var self = this,
          $subcat = self.$el.find('#subcategory-' + which);

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
        self.$tray.css('height', self.$activeSubcat.outerHeight(true));
      }
    }

  };

  return module;

});
