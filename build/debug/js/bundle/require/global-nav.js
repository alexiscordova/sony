// ------------ Sony Global Nav ------------
// Module: Global Nav
// Version: 1.0
// Modified: 2012-12-17 by Christopher Mischler
// Dependencies: jQuery 1.7+, Modernizr
// Optional: jQuery throttle-debounce (only used on window resize)
// -------------------------------------------------------------------------

(function($, Modernizr, window, undefined) {

  'use strict';

  // Start module
  var GlobalNav = function( $container ) {

    var self = this;
    self.searchMenu = {};
    self.$container = $container;
    self.$activePrimaryNavBtns = self.$container.find('.nav-dropdown-toggle');
    self.$currentOpenNavBtn = false;
    self.$pageWrapOuter = $('#page-wrap-outer');
    self.mobileNavIScroll = false,
    self.mobileNavVisible = false;

    // we should make a bunch of this stuff global.
    self.transEndEventNames = {
        'WebkitTransition' : 'webkitTransitionEnd',
        'MozTransition'    : 'transitionend',
        'OTransition'      : 'oTransitionEnd',
        'msTransition'     : 'MSTransitionEnd',
        'transition'       : 'transitionend'
    };

    // Get the right prefixed names e.g. WebkitTransitionDuration
    self.tapOrClick = self.hasTouch ? 'touchstart' : 'click';
    self.transformName = Modernizr.prefixed('transform'); // css version
    self.transitionName = Modernizr.prefixed('transition');
    self.transitionProperty = Modernizr.prefixed('transitionProperty');
    self.transitionDuration = Modernizr.prefixed('transitionDuration');
    self.transitionEasing = Modernizr.prefixed('transitionTimingFunction');
    self.transitionEnd = self.transEndEventNames[self.transitionName];



    if ( self.mode === 'mobile' ) {
      // do something
    }


    if ( $(window).width() <= 767 ) {
      self.initPrimaryNavBtns(false);
      self.initFooter(false);
    } else {
      self.initPrimaryNavBtns(true);
      self.initFooter(true);
    }

    self.isInitialized = true;
  };

  GlobalNav.prototype = {

    constructor: GlobalNav,

    initPrimaryNavBtns : function( isDesktop ) {
      var self = this;
      // console.log('## ## initPrimaryNavBtns: ' + isDesktop);

      // Set up primary nav buttons
      if (isDesktop){
        // Init Desktop Nav
        self.$activePrimaryNavBtns.each(function(){

          // init
          self.resetPrimaryNavBtn($(this));

          $(this).on('click', function() {
            // console.log('## ## ######CLICK######');
            var $thPrimaryNavBtn = $(this);
            // var $thNavTarget = $('.' + $thPrimaryNavBtn.data('target'));

            // console.log('## CLICK $thNavTarget.height: ' + $thNavTarget.outerHeight());

            if (!$thPrimaryNavBtn.parent().hasClass('nav-li-selected')){
              // if this button isn't already activated, deactivate any others, and activate this one.
              // console.log('## ## inactive button clicked');

              // if there's another button already activated, deactivate it first, and delay opening the new one.
              if (self.$currentOpenNavBtn !== false ){
                // console.log('## ## old nav was open - close it now.' );
                self.resetPrimaryNavBtn(self.$currentOpenNavBtn);

                var $oldNavTarget = $('.' + self.$currentOpenNavBtn.data('target'));

                if ($oldNavTarget.hasClass('navtray-w')){
                  // if the open target was a navtray, delay opening the new one until the old tray has a chance to close.
                  setTimeout(function(){
                    self.setActivePrimaryNavBtn($thPrimaryNavBtn);
                  },350);
                } else {
                  // update the Nav button & open the new tray after just a short delay for the old menu to fade out.
                  setTimeout(function(){
                    self.setActivePrimaryNavBtn($thPrimaryNavBtn);
                  },150);
                }

              } else {
                // update the Nav button & open the new tray immediately
                self.setActivePrimaryNavBtn($thPrimaryNavBtn);
              }


            } else {
              // if this tray was already visible, hide/reset it.
              // console.log('## ## this is already open - close it now.' );
              self.resetPrimaryNavBtn(self.$currentOpenNavBtn);
              self.$currentOpenNavBtn = false;
            }
          });
        });
      } else {
        // Init Mobile Nav


        $('#btn-mobile-nav').on(self.tapOrClick,function(){
          if (!self.mobileNavVisible){
            self.showMobileNav();
          } else {
            self.hideMobileNav();
          }
        });
      }
    },

    setActivePrimaryNavBtn: function( $btn ){
      var self = this;
      self.activatePrimaryNavBtn($btn);
      self.$currentOpenNavBtn = $btn;
    },

    resetPrimaryNavBtn : function ( $oldNavBtn ) {
      var self = this;
      // console.log('## ## resetPrimaryNavBtn: ' + $oldNavBtn.attr('class'));

      // reset this button
      $oldNavBtn.removeClass('active').parent().removeClass('nav-li-selected');

      // if there's a navTray/navMenu, reset it
      if ($oldNavBtn.data('target').length){
        var $thNavTarget = $('.' + $oldNavBtn.data('target'));

        if ($thNavTarget.hasClass('navtray-w')){
          self.slideNavTray($thNavTarget,false);
        } else {
          $('.navmenu-w-visible').removeClass('navmenu-w-visible');
        }
      }
    },

    slideNavTray: function( $navTray, opening ){
      // console.log('## ## slideNavTray $navTray.outerHeight(): ' + $navTray.outerHeight());
      var self = this,
        startHeight,
        endHeight,
        expandedHeight = $navTray.outerHeight();

      $navTray.data('expandedHeight',expandedHeight);

      // console.log('#### $navTray.data(): ', $navTray.data('expandedHeight'));

      if (opening){
        startHeight = '1px';
        endHeight = expandedHeight;
      } else {
        // if you're not opening, it's just initializing on page load
        startHeight = expandedHeight;
        endHeight = '1px';
      }

      // console.log('## ## $navTray: ' + $navTray.attr('class'))
      // console.log('## ## opening: ' + opening + ', startHeight: ' + startHeight + ', expandedHeight: ' + expandedHeight);

      $navTray
        .data('expandedHeight',startHeight)
        .css('height', startHeight)
        .find('.navtray')
          .addClass('navtray-absolute')
          .css('height',expandedHeight);

      setTimeout(function(){ // wait just a moment to make sure the height is applied
        // console.log('## ## setTimeout1 ' + $navTray.attr('class'));
        $navTray
          .removeClass('no-transition');

        setTimeout(function(){ // wait just a moment to make sure the height is applied
          // console.log('## ## setTimeout2: opening: ' + opening + ', endHeight: ' + endHeight + ', self.transitionEnd: ' + self.transitionEnd);
          $navTray
            .css('height',endHeight)
            // .one(self.transitionEnd, function(){console.log('## ## ## ## WTFFFFFFFFFFFF ## ## ## ');});
            .one(self.transitionEnd, onNavTrayComplete);

            if (opening){
              $navTray.addClass('navtray-w-visible');
            } else {
              $navTray.removeClass('navtray-w-visible');
            }

        },1);
      },1);

      function onNavTrayComplete(){
        // console.log('## ## onNavTrayComplete');
        // prepare the tray for browser resize - even though it's offscreen, we still need to get its natural height next time we need to expand it.
        self.setNavTrayContentNaturalFlow($navTray);
      }
    },

    setNavTrayContentNaturalFlow: function($navTray){
      $navTray
        .css('height','')
        .addClass('no-transition')
        .find('.navtray')
          .removeClass('navtray-absolute')
          .css('height','');
    },

    activatePrimaryNavBtn : function ($newNavBtn) {
      var self = this;
      // console.log('## ## activatePrimaryNavBtn: ' + $newNavBtn.attr('class'));

      $newNavBtn.addClass('active').parent().addClass('nav-li-selected');

      // if there's a navTray/navMenu, reset it to get its height
      if ($newNavBtn.data('target').length){
        var $thNavTarget = $('.' + $newNavBtn.data('target'));

        // console.log('## ## thNavTarget.outerHeight(): ' + $thNavTarget.outerHeight());

        // figure out if this is a tray or menu.
        if ($thNavTarget.hasClass('navtray-w')){
          // Tray-style
          // first get the tray's natural height, which it should have offscreen.
          // expand the tray. When it's done, set it to position:relative and natural heights.
          self.slideNavTray($thNavTarget, true);
        } else {
          // Menu-style - show the menu.
          $thNavTarget.addClass('navmenu-w-visible');

          // just the search menu, needs to be positioned with js. This way it can be in the flow at the top of the page, so it's in place for mobile.
          if ($thNavTarget.hasClass('navmenu-w-search')){
            // Line it up with the right edge of the search button.
            var btnRightEdge = $newNavBtn.parent().position().left + parseInt( $newNavBtn.css('marginLeft'),10 ) + $newNavBtn.innerWidth();
            var leftPos = btnRightEdge - $thNavTarget.innerWidth();
            $thNavTarget.css({'right':'auto','left':leftPos+'px'});
          }
        }
      }
    },

    showMobileNav: function(){
      var self = this;

      self.showMobileBackdrop();

      // Since the page-wrap-inner is going to be fixed, the browser will see the page as having no height.
      // on iOS, this means the Safari nav will always be visible. And that's not cool. So, to give the
      // page some height, so the Safari nav will hide.
      // need tp compensate for Safari nav bar on iOS - MAY BE DIFFERENT ON ANDROID/OTHER.
      var pageHeight = parseInt( $(window).height(),10 ) + 60 + 'px';
      self.$pageWrapOuter.height(pageHeight);

      if (!self.mobileNavIScroll){
        var $outer = $('#nav-outer-container'),
          $inner = $outer.find('.nav-mobile-scroller');

        $outer.height(pageHeight);
        $inner.height($inner.height());

        setTimeout(function(){ // make sure heights are already set before initializing iScroll.
          self.mobileNavIScroll = new window.IScroll('nav-outer-container',{ vScroll: true, hScroll: false, hScrollbar: false, snap: false, momentum: true, bounce: false });
        },1);
      }

      $('#page-wrap-inner').addClass('show-mobile-menu');
      self.mobileNavVisible = true;
    },

    hideMobileNav: function(){
      var self = this;
      self.hideMobileBackdrop();

      $('#page-wrap-inner').one(self.transitionEnd, function(){
        // wait until the $('#page-wrap-inner') is done animating closed before destroying the iScroll.
        self.mobileNavIScroll.destroy();
        self.mobileNavIScroll = false;
        self.$pageWrapOuter.css('height','');
      });
      $('#page-wrap-inner').removeClass('show-mobile-menu');
      self.mobileNavVisible = false;
    },

    showMobileBackdrop: function(){
      var self = this;

      self.$mobileScreenOverlay = $('<div class="modal-backdrop mobile-screen-overlay opacity0" />')
        .appendTo($('#page-wrap-inner'));

      setTimeout(function(){
        self.$mobileScreenOverlay.removeClass('opacity0').addClass('opacity1');
      },1);
    },

    hideMobileBackdrop: function(){
      var self = this;

      self.$mobileScreenOverlay.one(self.transitionEnd, function(){
        self.$mobileScreenOverlay.remove();
      });

      self.$mobileScreenOverlay.removeClass('opacity1').addClass('opacity0');
    },

    initFooter : function( isDesktop ) {
      var self = this;

      if (isDesktop){
        // just making lint happy, cuz maybe I'll use isDesktop eventually.
      }

      $('#country-selector').on('mouseenter mouseleave',function(){
        var pageContainerWidth = $(this).closest('.grid-footer').width();
        $(this).find('.dropdown-hover-menu-lists-w').width(pageContainerWidth);
      });

      var footerNavCollapseHeight = 49; // plus 1 for the border
      $('#footer-wrapper .footer-mobile-section h5').on(self.tapOrClick,function(){
        if ($(window).width() <= 767 ){

          var $thFootSection = $(this).parent();


          if ($thFootSection.hasClass('collapsed')){
            // collapsed height - expand it.

            $thFootSection
              .height($thFootSection.data('expHeight'))
              .removeClass('collapsed');

          } else {
            // natural height - collapse it.
            var expHeight = $thFootSection.height();

            $thFootSection
              .data('expHeight',expHeight)
              .height(expHeight);

            setTimeout(function(){
              $thFootSection.addClass('transition-height');
              setTimeout(function(){
                $thFootSection
                  .height(footerNavCollapseHeight)
                  .addClass('collapsed');
              },1);
            },1);
          }
        }
      });
    }
  };

  // Plugin definition
  $.fn.globalNav = function( opts ) {
    var args = Array.prototype.slice.apply( arguments );
    return this.each(function() {
      var self = $(this),
        globalNav = self.data('globalNav');

      // If we don't have a stored globalNav, make a new one and save it
      if ( !globalNav ) {
        globalNav = new GlobalNav( self );
        self.data( 'globalNav', globalNav );
      }

      if ( typeof opts === 'string' ) {
        globalNav[ opts ].apply( globalNav, args.slice(1) );
      }
    });
  };


  // Overrideable options
  $.fn.globalNav.options = {
    sampleOption: 0
  };

  // Not overrideable
  $.fn.globalNav.settings = {
    isTouch: !!( 'ontouchstart' in window ),
    isInitialized: false
  };

})(jQuery, Modernizr, window);


$(function() {
  $('.nav-wrapper').globalNav();
});


