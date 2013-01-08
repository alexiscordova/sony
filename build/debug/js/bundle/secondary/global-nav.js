// ------------ Sony Global Nav ------------
// Module: Global Nav
// Version: 1.0
// Modified: 2012-12-17 by Christopher Mischler
// Dependencies: jQuery 1.7+, Modernizr
// Optional: jQuery throttle-debounce (only used on window resize)
// -------------------------------------------------------------------------

(function($, Modernizr, window, undefined) {
  
  var myScroll;
  function loaded() {
    myScroll = new iScroll('#nav-outer-container');
  }
  document.addEventListener('DOMContentLoaded', loaded, false);

  'use strict';

  // Start module
  var GlobalNav = function( $container ) {

    var self = this;
    self.searchMenu = {};
    self.$container = $container;
    self.$activePrimaryNavBtns = self.$container.find('.nav-dropdown-toggle');
    self.$currentOpenNavBtn = false;

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



    if ( self.mode == 'mobile' ) {
      // do something
    }

    // function() { // this needs a debounce

    if ( $(window).width() <= 767 ) {
      self.initPrimaryNavBtns(false);
      self.initFooter(false);
    } else {
      self.initPrimaryNavBtns(true);
      self.initFooter(true);
    }
    // });

    self.isInitialized = true;
  };

  GlobalNav.prototype = {

    constructor: GlobalNav,

    initPrimaryNavBtns : function( isDesktop ) {
      var self = this;
      // console.log("initPrimaryNavBtns: " + isDesktop);

      // Set up primary nav buttons
      if (isDesktop){
        // Init Desktop Nav
        self.$activePrimaryNavBtns.each(function(){

          // init
          self.resetPrimaryNavBtn($(this));

          $(this).on('click', function() {
            // console.log("######CLICK######");
            var $thPrimaryNavBtn = $(this);
            var $thNavTarget = $("." + $thPrimaryNavBtn.data("target"));
            if (!$thPrimaryNavBtn.parent().hasClass("nav-li-selected")){
              // if this button isn't already activated, deactivate any others, and activate this one.
              // console.log("inactive button clicked");
              
              // if there's another button already activated, deactivate it first, and delay opening the new one.
              if (self.$currentOpenNavBtn != false ){
                // console.log("old nav was open - close it now." );
                self.resetPrimaryNavBtn(self.$currentOpenNavBtn);

                var $oldNavTarget = $("." + self.$currentOpenNavBtn.data("target"));

                if ($oldNavTarget.hasClass("navtray-w")){
                  // if the open target was a navtray, delay opening the new one until the old tray has a chance to close.
                  setTimeout(function(){
                    self.setActivePrimaryNavBtn($thPrimaryNavBtn);
                  },350)
                } else {
                  // update the Nav button & open the new tray after just a short delay for the old menu to fade out.
                  setTimeout(function(){
                    self.setActivePrimaryNavBtn($thPrimaryNavBtn);
                  },150)
                }

              } else {
                // update the Nav button & open the new tray immediately
                self.setActivePrimaryNavBtn($thPrimaryNavBtn);
              }
              

            } else {
              // if this tray was already visible, hide/reset it.
              // console.log("this is already open - close it now." );
              self.resetPrimaryNavBtn(self.$currentOpenNavBtn);
              self.$currentOpenNavBtn = false;
            }
          });
        });
      } else {
        // Init Mobile Nav
        console.log("init mobile nav");
        
        var mobileNavIScroll = null,
          mobileNavVisible = false;

        $("#btn-mobile-nav").on(self.tapOrClick,function(){
          // if the nav is hidden, show it.
          if (!mobileNavVisible){

            if (!mobileNavIScroll){
              // mobileNavIScroll = new iScroll('nav-outer-container', { hScroll: false, hScrollbar: false, vScrollbar: false });
            }

            $("#page-wrap-inner").addClass("show-mobile-menu");
            
          } else {
            $("#page-wrap-inner").removeClass("show-mobile-menu");
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
      // console.log("resetPrimaryNavBtn: " + $oldNavBtn.attr("class"));

      // reset this button
      $oldNavBtn.removeClass("active").parent().removeClass("nav-li-selected");

      // if there's a navTray/navMenu, reset it
      if ($oldNavBtn.data("target").length){
        var $thNavTarget = $("." + $oldNavBtn.data("target"));

        if ($thNavTarget.hasClass("navtray-w")){
          self.slideNavTray($thNavTarget,false);
        } else {
          $(".navmenu-w-visible").removeClass("navmenu-w-visible");
        }
      }
    },

    slideNavTray: function( $navTray, opening ){
      var self = this, 
        startHeight, 
        endHeight,
        expandedHeight = $navTray.outerHeight();

      $navTray.data("expandedHeight",expandedHeight);

      if (opening){
        startHeight = "1px";
        endHeight = expandedHeight;
      } else {
        startHeight = expandedHeight;
        endHeight = "1px";
      }

      $navTray
        .data("expandedHeight",startHeight)
        .css("height", startHeight)
        .find(".navtray")
          .addClass("navtray-absolute")
          .css("height",expandedHeight);

      setTimeout(function(){ // wait just a moment to make sure the height is applied
        $navTray
          .removeClass("no-transition")

        setTimeout(function(){ // wait just a moment to make sure the height is applied
          $navTray
            .css("height",endHeight)
            .one(self.transitionEnd, onNavTrayComplete);

            if (opening){
              $navTray.addClass("navtray-w-visible");
            } else {
              $navTray.removeClass("navtray-w-visible");
            }

        },1);
      },1);

      function onNavTrayComplete(){
        // prepare the tray for browser resize - even though it's offscreen, we still need to get its natural height next time we need to expand it.
        self.setNavTrayContentNaturalFlow($navTray);
      }
    },

    setNavTrayContentNaturalFlow: function($navTray){
      $navTray
        .css("height","")
        .addClass("no-transition")
        .find(".navtray")
          .removeClass("navtray-absolute")
          .css("height","");      
    },

    activatePrimaryNavBtn : function ($newNavBtn) {
      var self = this;
      // console.log("activatePrimaryNavBtn: " + $newNavBtn.attr("class"));
      
      $newNavBtn.addClass("active").parent().addClass("nav-li-selected");

      // if there's a navTray/navMenu, reset it
      if ($newNavBtn.data("target").length){
        var $thNavTarget = $("." + $newNavBtn.data("target"));
        // figure out if this is a tray or menu.
        if ($thNavTarget.hasClass("navtray-w")){
          // Tray-style
          // first get the tray's natural height, which it should have offscreen.
          // expand the tray. When it's done, set it to position:relative and natural heights.
          self.slideNavTray($thNavTarget, true);
        } else {
          // Menu-style - show the menu. 
          $thNavTarget.addClass("navmenu-w-visible")

          // just the search menu, needs to be positioned with js. This way it can be in the flow at the top of the page, so it's in place for mobile.
          if ($thNavTarget.hasClass("navmenu-w-search")){
            // Line it up with the right edge of the search button.
            var btnRightEdge = $newNavBtn.parent().position().left + parseInt($newNavBtn.css("marginLeft")) + $newNavBtn.innerWidth();
            var leftPos = btnRightEdge - $thNavTarget.innerWidth();
            $thNavTarget.css({"right":"auto","left":leftPos+"px"});
          }
        }
      }
    },

    initFooter : function( isDesktop ) {
      console.log("initFooter");
      $('#country-selector').on('hover',function(){

        var pageContainerWidth = $(this).closest('.grid-footer').width();
        console.log("pageContainerWidth: " + pageContainerWidth);
        console.log($(this).find('.dropdown-hover-menu-lists-w'));
        $(this).find('.dropdown-hover-menu-lists-w').width(pageContainerWidth);
      })
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

}(jQuery, Modernizr, window));



$(".nav-wrapper").globalNav();


