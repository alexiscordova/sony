
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
      SonyCarousel = require('secondary/index').sonyCarousel,
      throttleDebounce = require('plugins/index').throttleDebounce;

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
          self.renderSubcats(self.$activeSubcat, false);
          self.renderNav(2);
        });
        enquire.register("(min-width: 480px) and (max-width: 979px)", function() {
          self.mode = 'tablet';
          self.renderSubcats(self.$activeSubcat, true);
          self.renderNav(3);
        });
        enquire.register("(max-width: 479px)", function() {
          self.mode = 'mobile';
          self.renderSubcats(self.$activeSubcat, true);
          self.renderNav(4);
        });
      } else {
        self.mode = 'desktop';
        self.renderSubcats(self.$activeSubcat, false);
        self.renderNav(2);
      }

      self.$el.addClass('active');

      Environment.on('global:resizeDebounced', $.proxy(self.setTrayHeight, self));
    },

    // Render a subcategory; this is done on-demand so that we don't needlessly
    // compute every subcat on pageload / resize.

    renderSubcats: function($subcat, mobile) {

      var self = this,
          $grids;

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

    // Render and re-bind the nav, and recreate the appropriate carousel if on
    // mobile vs. desktop.

    renderNav: function(columns) {

      var self = this,
          isMobile = (self.mode === 'mobile'),
          currentSlide;

      Utilities.reassignSpanWidths(self.$navgroups.find('.subcategory-link'), columns);

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

    // Bind click/tap events against nav for opening, closing, and navigating to a new URL.

    bindNav: function() {

      var self = this,
          $buttons = self.$navgroups.find('.grid').children(),
          debouncedeNavTap;

      $buttons.on('click', function(){
        return !$(this).hasClass('has-products');
      });

      // Because it is possible for certian devices (Vita, known) to rapidly fire
      // `tap` events, we must debounce it slightly to prevent overruns.

      debouncedeNavTap = $.debounce(200, true, function(e){
        self.onNavTap(e, $buttons);
      });

      $buttons.hammer().on('tap', debouncedeNavTap);
    },

    // Open or close nav depending on whether the currently tapped item is active.

    onNavTap: function(e, $buttons) {

      var self = this,
          $this = $(e.currentTarget),
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
    },

    // Open the subnav at a given position.

    openSubcat: function(which) {

      var self = this,
          $subcat = self.$el.find('#subcategory-' + which);

      self.renderSubcats($subcat, self.mode !== 'desktop');

      self.$subcats.removeClass('active');

      $subcat.addClass('active');
    },

    // Close the subnav.

    closeTray: function() {

      var self = this;

      self.$subcats.removeClass('active');
      self.$tray.css('height', 0);
      self.$activeSubcat = null;
    },

    // Set the tray height. May need to tap into `imagesLoaded` to get the
    // correct height.

    setTrayHeight: function() {

      var self = this;

      if ( self.$activeSubcat ) {
        self.$tray.css('height', self.$activeSubcat.outerHeight());
      }
    }

  };

  return module;

});
