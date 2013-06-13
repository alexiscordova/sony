
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
      throttleDebounce = require('plugins/index').throttleDebounce,
      imagesLoaded = require('plugins/index').imagesLoaded,
      viewport = require( 'plugins/index' ).viewport;

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

        enquire.register( Utilities.enquire.min(980), function() {
          self.mode = 'desktop';
          self.subcatCols = 3;
          self.renderSubcats(self.$activeSubcat, 3);
          self.renderNav(2);
        });

        enquire.register( Utilities.enquire.minMax(768, 979), function() {
          self.mode = 'tablet';
          self.subcatCols = 4;
          self.renderSubcats(self.$activeSubcat, 4);
          self.renderNav(3);
        });

        enquire.register( Utilities.enquire.minMax(480, 767), function() {
          self.mode = 'tablet-small';
          self.subcatCols = 6;
          self.renderSubcats(self.$activeSubcat, 6);
          self.renderNav(3);
        });

        enquire.register( Utilities.enquire.max(479), function() {
          self.mode = 'mobile';
          self.subcatCols = 12;
          self.renderSubcats(self.$activeSubcat, 12);
          self.renderNav(4);
        });

      } else {
        self.mode = 'desktop';
        self.subcatCols = 3;
        self.renderSubcats(self.$activeSubcat, 3);
        self.renderNav(2);
      }

      self.$el.addClass('active');
    },

    // Render a subcategory; this is done on-demand so that we don't needlessly
    // compute every subcat on pageload / resize.

    renderSubcats: function($subcat, columns) {

      var self = this,
          $grids;

      if ( !$subcat ) {
        return;
      }

      Utilities.reassignSpanWidths($subcat.find('.product, .marketing-tout, .subnav-accessories'), columns);

      $grids = $subcat.find('.subnav-product-grid');

      $grids = Utilities.gridApportion({
        $groups: $grids
      });

      self.$activeSubcat = $subcat;

      self.setTrayHeight();

      self.trayHeightInterval = setInterval(function(){
        self.setTrayHeight();
      }, 1000);
    },

    // Render and re-bind the nav, and recreate the appropriate carousel if on
    // mobile vs. desktop.

    renderNav: function(columns) {

      var self = this,
          isMobile = (self.mode === 'mobile'),
          currentSlide = 0;

      Utilities.reassignSpanWidths(self.$navgroups.find('.subcategory-link'), columns);

      self.$navgroups = Utilities.gridApportion({
        $groups: self.$navgroups
      });

      self.$slideChildren = self.$navgroups.find('.subcategory-link');

      if ( self.$navgroups.find('.active').length > 0 ) {
        currentSlide = self.$navgroups.find('.active').closest(self.$navgroups).index();
      }

      if ( self.$navCarousel ) {
        self.$navCarousel.sonyCarousel('destroy');
      }

      self.$navCarousel = self.$el.find('.subnav-nav-carousel-wrapper').sonyCarousel({
        draggable: true,
        wrapper: '.grid',
        slides: '.subnav-nav-carousel-slide',
        slideChildren: '.subcategory-link',
        paddles: !isMobile,
        $paddleWrapper: self.$navgroups.closest('.grid'),
        paddlePosition: 'outset',
        useSmallPaddles: !isMobile
      });

      if ( self.$navCarousel.hasClass('sony-carousel-active') ) {
        self.$navCarousel.sonyCarousel('gotoSlide', currentSlide, true);
      }

      self.revealOnlyGroup(currentSlide);

      self.bindNav();
    },

    // Bind click/tap events against nav for opening, closing, and navigating to a new URL.

    bindNav: function() {

      var self = this,
          $buttons = self.$navgroups.find('.subcategory-link'),
          debouncedeNavTap;

      self.$navCarousel.on('sonyDraggable:dragStart', function(){
        self.revealAllGroups();
      });

      self.$navCarousel.on('SonyCarousel:gotoSlide', function(e, which){
        self.revealOnlyGroup(which);
      });

      self.$navCarousel.on('SonyCarousel:released', function(e, which){
        self.revealOnlyGroup(which);
      });

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

    // Show all `$slideChildren`.

    revealAllGroups: function() {

      var self = this;

      clearTimeout(self.childRevealTimeout);

      self.childRevealTimeout = setTimeout(function(){

        self.$slideChildren.addClass('on');

        if ( !self.useCSS3 ) {
          self.$slideChildren.stop().fadeTo(500, 1);
        }

      }, 250);
    },

    // Fade up only the elements of group with index `whichGroup`.

    revealOnlyGroup: function(whichGroup) {

      var self = this,
          $targetChildren = self.$navgroups.eq(whichGroup).find(self.$slideChildren),
          childrenPerSlide = self.$navgroups.first().find(self.$slideChildren).length;

      if ( self.mode === 'mobile' ) {
        self.revealAllGroups();
        return;
      }

      if ( $targetChildren.length < childrenPerSlide ) {
        $targetChildren = $targetChildren.add( self.$navgroups.eq(whichGroup - 1).find(self.$slideChildren).slice($targetChildren.length) );
      }

      clearTimeout(self.childRevealTimeout);

      self.childRevealTimeout = setTimeout(function(){

        self.$slideChildren.removeClass('on');
        $targetChildren.addClass('on');

        if ( !self.useCSS3 ) {
          self.$slideChildren.stop().fadeTo(500, 0.01);
          $targetChildren.stop().fadeTo(500, 1);
        }

      }, 250);
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

      $subcat.find('.lazy-image').each(function(){
        var $this = $(this);

        $this.attr('src', $this.data('src'));
        $this.removeClass('.lazy-image');

        $this.imagesLoaded().done(function(){
          self.setTrayHeight();
        });
      });

      self.renderSubcats($subcat, self.subcatCols);

      self.$subcats.removeClass('active');

      $subcat.addClass('active');
    },

    // Close the subnav.

    closeTray: function() {

      var self = this;

      self.$subcats.removeClass('active');
      self.$tray.css('height', 0);
      self.$activeSubcat = null;

      clearInterval(self.trayHeightInterval);
    },

    // Set the tray height.

    setTrayHeight: function() {

      var self = this;

      if ( self.$activeSubcat && self.$activeSubcat.is(':in-viewport') ) {
        self.$tray.css('height', self.$activeSubcat.outerHeight());
      }
    }

  };

  return module;

});
