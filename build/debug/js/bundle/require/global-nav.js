// ------------ Sony Global Nav ------------
// Module: Global Nav
// Version: 1.0
// Modified: 2012-12-17 by Christopher Mischler
// Dependencies: jQuery 1.7+, Modernizr
// Optional: jQuery throttle-debounce (only used on window resize)
// -------------------------------------------------------------------------


(function($, Modernizr, window, undefined) {

  var GlobalNav = function( $container ) {
    var t = this;
    t.searchMenu = {};
    t.$container = $container;
    t.$activePrimaryNavBtns = t.$container.find('.nav-dropdown-toggle');
    t.$currentOpenNavBtn = false;

    // we should make a bunch of this stuff global.
    transEndEventNames = {
        'WebkitTransition' : 'webkitTransitionEnd',
        'MozTransition'    : 'transitionend',
        'OTransition'      : 'oTransitionEnd',
        'msTransition'     : 'MSTransitionEnd',
        'transition'       : 'transitionend'
    };

    // Get the right prefixed names e.g. WebkitTransitionDuration
    t.tapOrClick = t.hasTouch ? 'touchstart' : 'click';
    t.transformName = Modernizr.prefixed('transform'); // css version
    t.transitionName = Modernizr.prefixed('transition');
    t.transitionProperty = Modernizr.prefixed('transitionProperty');
    t.transitionDuration = Modernizr.prefixed('transitionDuration');
    t.transitionEasing = Modernizr.prefixed('transitionTimingFunction');
    t.transitionEnd = transEndEventNames[t.transitionName];



    if ( t.mode == 'mobile' ) {
      // do something
    }

    // function() { // this needs a debounce

    if ( $(window).width() <= 767 ) {
      t.initPrimaryNavBtns(false);
    } else {
      t.initPrimaryNavBtns(true);
    }
    // });

    t.isInitialized = true;

    // this should be moved so it doesn't get inited until the search menu is opened.
    t.initSearchMenu();
  };

  GlobalNav.prototype = {

    constructor: GlobalNav,

    initPrimaryNavBtns : function(isDesktop) {
      var t = this;
      // console.log("initPrimaryNavBtns: " + isDesktop);

      // Set up primary nav buttons
      if (isDesktop){
        // Init Desktop Nav
        t.$activePrimaryNavBtns.each(function(){

          // init
          t.resetPrimaryNavBtn($(this));

          $(this).on('click', function() {
            // console.log("######CLICK######");
            var $thPrimaryNavBtn = $(this);
            var $thNavTarget = $("." + $thPrimaryNavBtn.data("target"));
            if (!$thPrimaryNavBtn.parent().hasClass("nav-li-selected")){
              // if this button isn't already activated, deactivate any others, and activate this one.
              // console.log("inactive button clicked");
              
              // if there's another button already activated, deactivate it first, and delay opening the new one.
              if (t.$currentOpenNavBtn != false ){
                // console.log("old nav was open - close it now." );
                t.resetPrimaryNavBtn(t.$currentOpenNavBtn);

                var $oldNavTarget = $("." + t.$currentOpenNavBtn.data("target"));

                if ($oldNavTarget.hasClass("navtray-w")){
                  // if the open target was a navtray, delay opening the new one until the old tray has a chance to close.
                  setTimeout(function(){
                    t.setActivePrimaryNavBtn($thPrimaryNavBtn);
                  },350)
                } else {
                  // update the Nav button & open the new tray after just a short delay for the old menu to fade out.
                  setTimeout(function(){
                    t.setActivePrimaryNavBtn($thPrimaryNavBtn);
                  },150)
                }

              } else {
                // update the Nav button & open the new tray immediately
                t.setActivePrimaryNavBtn($thPrimaryNavBtn);
              }
              

            } else {
              // if this tray was already visible, hide/reset it.
              // console.log("this is already open - close it now." );
              t.resetPrimaryNavBtn(t.$currentOpenNavBtn);
              t.$currentOpenNavBtn = false;
            }
          });
        });
      } else {
        // Init Mobile Nav
      }
    },

    setActivePrimaryNavBtn: function($btn){
      var t = this;
      t.activatePrimaryNavBtn($btn);
      t.$currentOpenNavBtn = $btn;
    },

    resetPrimaryNavBtn : function ($oldNavBtn) {
      var t = this;
      // console.log("resetPrimaryNavBtn: " + $oldNavBtn.attr("class"));

      // reset this button
      $oldNavBtn.removeClass("active").parent().removeClass("nav-li-selected");

      // if there's a navTray/navMenu, reset it
      if ($oldNavBtn.data("target").length){
        var $thNavTarget = $("." + $oldNavBtn.data("target"));

        if ($thNavTarget.hasClass("navtray-w")){
          t.slideNavTray($thNavTarget,false);
        } else {
          $(".navmenu-w-visible").removeClass("navmenu-w-visible");
        }
      }
    },

    slideNavTray: function($navTray, opening){
      var t = this, 
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
            .one(t.transitionEnd, onNavTrayComplete);

            if (opening){
              $navTray.addClass("navtray-w-visible");
            } else {
              $navTray.removeClass("navtray-w-visible");
            }

        },1);
      },1);

      function onNavTrayComplete(){
        // prepare the tray for browser resize - even though it's offscreen, we still need to get its natural height next time we need to expand it.
        t.setNavTrayNaturalFlow($navTray);
      }
    },

    setNavTrayNaturalFlow: function($navTray){
      $navTray
        .css("height","")
        .addClass("no-transition")
        .find(".navtray")
          .removeClass("navtray-absolute")
          .css("height","");      
    },

    activatePrimaryNavBtn : function ($newNavBtn) {
      var t = this;
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
          t.slideNavTray($thNavTarget, true);
        } else {
          // Menu-style - show the menu -- all done in css!
        }
      }
    },

    // ***********************************
    // SEARCH MENU
    // ***********************************
    initSearchMenu: function(){
      var t = this;
      t.$root = $("#nav-li-search"),
      t.$wrapper = t.$root.find(".navmenu-w-search");
      t.$input = $("#navSearch"),
      t.$clearBtn = t.$root.find(".btn-clear-search-input"),
      t.$searchIcon = $(".sprite-mini-nav-search-input");
      t.watermarkText = t.$input.val();
      t.clearBtnClicked = false;

      t.$input.on("focus", function(){
        // clear watermarkText on focus
        if (t.$input.val() == t.watermarkText){
          t.$input.val("");
          t.$searchIcon.hide();
        };
      }).on("blur", function(){
        if (t.$input.val() == ""){
          t.$input.val(t.watermarkText);
          t.$searchIcon.show();
        };
      }).on('mouseup keyup change cut paste', function(){
        console.log("X");
        if (!t.$wrapper.hasClass("searching")){
          if (!(t.$input.val() == "" || t.$input.val() == t.watermarkText)){
            t.$wrapper.addClass("searching");
            t.doSearch();
          }
        } else if (t.$input.val() == ""){
          t.resetSearchResults();
        } else {
          t.doSearch();
        }
      });

      t.$searchIcon.on("click",function(){
        t.$input.focus();
      });

      t.$clearBtn.on("click",function(){
        t.clearBtnClicked = true;
        t.clearSearchResults();
        t.$input.focus();
      }).on("mouseleave",function(){
        t.clearBtnClicked = false; // just make sure it's cleared
      });
    },

    doSearch: function(){
      var t = this;
      t.queryStr = t.$input.val();
      console.log("t.queryStr: " + t.queryStr);
    },

    clearSearchResults: function(){
      var t = this;
      t.$input.val("");
      t.$wrapper.removeClass("searching");
      t.$searchIcon.hide();
    },

    // this just resets the actual results, for instance, when the search term is blank.
    resetSearchResults: function(){
      var t = this;
      t.$wrapper.removeClass("searching");      
    },

    resetSearchMenu: function(){
      var t = this;
      t.clearSearchResults();
    }
  };

  // Plugin definition
  $.fn.globalNav = function( opts ) {
    var args = Array.prototype.slice.apply( arguments );
    return this.each(function() {
      var $this = $(this),
        globalNav = $this.data('globalNav');

      // If we don't have a stored globalNav, make a new one and save it
      if ( !globalNav ) {
        globalNav = new GlobalNav( $this );
        $this.data( 'globalNav', globalNav );
      }

      if ( typeof opts === 'string' ) {
        globalNav[ opts ].apply( globalNav, args.slice(1) );
      }
    });
  };


  // Overrideable options
  $.fn.globalNav.options = {
  };

  // Not overrideable
  $.fn.globalNav.settings = {
    isInitialized: false
  };

}(jQuery, Modernizr, window));



$(".nav-wrapper").globalNav();


