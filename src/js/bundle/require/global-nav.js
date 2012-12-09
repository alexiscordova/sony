
(function($, window, undefined) {

  var GlobalNav = function( $container, options ) {
    var th = this;
    th.searchMenu = {};

    $.extend(th, $.fn.globalNav.options, options, $.fn.globalNav.settings);

    th.$container = $container;
    th.$activePrimaryNavBtns = th.$container.find('.nav-dropdown-toggle');
    th.$currentOpenNavBtn = false;

    if ( th.mode == 'mobile' ) {
      // do something
    }

    if ( $(window).width() <= 767 ) {
      th.initPrimaryNavBtns(false);
    } else {
      th.initPrimaryNavBtns(true);
    }

    $(window).on('resize.globalNav', function() {
      if ( $(window).width() <= 767 ) {
        th.initPrimaryNavBtns(false);
      } else {
        th.initPrimaryNavBtns(true);
      }
    });

    th.isInitialized = true;

    // this should be moved so it doesn't get inited until the search menu is opened.
    th.initSearchMenu();
  };

  GlobalNav.prototype = {

    constructor: GlobalNav,

    initPrimaryNavBtns : function(isDesktop) {
      var th = this;
      console.log("initPrimaryNavBtns: " + isDesktop);

      // Set up primary nav buttons
      if (isDesktop){
        // Init Desktop Nav
        th.$activePrimaryNavBtns.on('click', function() {
          console.log("######CLICK######");
          var $thPrimaryNavBtn = $(this);
          var $thNavTray = $("." + $thPrimaryNavBtn.data("target"));
          if (!$thPrimaryNavBtn.parent().hasClass("nav-li-selected")){
            // if this button isn't already activated, deactivate any others, and activate this one.
            console.log("inactive button clicked");
            
            // if there's another button already activated, deactivate it.
            if (th.$currentOpenNavBtn != false ){
              console.log("old nav was open - close it now." );
              th.resetPrimaryNavBtn(th.$currentOpenNavBtn);
            }
            
            // update the Nav button & open the new tray.
            th.activatePrimaryNavBtn($thPrimaryNavBtn);
            th.$currentOpenNavBtn = $thPrimaryNavBtn;

          } else{
            // if this tray was already visible, hide/reset it.
            console.log("this is already open - close it now." );
            th.resetPrimaryNavBtn(th.$currentOpenNavBtn);
            th.$currentOpenNavBtn = false;
          }
        });
      } else {
        // Init Mobile Nav
      }
    },

    resetPrimaryNavBtn : function ($oldNavBtn) {
      console.log("resetPrimaryNavBtn: " + $oldNavBtn.attr("class"));
      $oldNavBtn.removeClass("active").parent().removeClass("nav-li-selected");
      var $thNavTray = $("." + $oldNavBtn.data("target"));
      $thNavTray.removeClass("navtray-wrapper-visible").css("height", "");
    },

    activatePrimaryNavBtn : function ($newNavBtn) {
      console.log("activatePrimaryNavBtn: " + $newNavBtn.attr("class"));
      $newNavBtn.addClass("active").parent().addClass("nav-li-selected");
      var $thNavTray = $("." + $newNavBtn.data("target"));
      // show the tray.
      expandedHeight = $thNavTray.height(); // the tray should currently be off-screen, but expanded to its natural height.
      $thNavTray.height("1px"); // it has to have a height to animate from.
      setTimeout(function(){ // wait just a moment to make sure the height is applied and the old currentOpenNavBtn has been reset.
        $thNavTray.addClass("navtray-wrapper-visible").css("height", expandedHeight);
      },1);
    },

    initSearchMenu: function(){
      var th = this, sm = th.searchMenu;
      sm.$root = $("#nav-li-search"),
      sm.$input = $("#navSearch"),
      sm.$clearBtn = sm.$root.find(".btn-clear-search-input"),
      sm.$searchIcon = $(".sprite-mini-nav-search-input");
      sm.watermarkText = sm.$input.val();

      sm.$input.focus(function(){
        // clear watermarkText on focus
        if (sm.$input.val() == sm.watermarkText){
          sm.$input.val("");
          sm.$searchIcon.hide();
        };
      }).blur(function(){
        if (sm.$input.val() == ""){
          sm.$input.val(sm.watermarkText);
          sm.$searchIcon.show();
        };
      });

      sm.$searchIcon.on("click",function(){
        sm.$input.focus();
      });

      sm.$clearBtn.on("click",function(){
        th.clearSearchResults();
        sm.$input.focus();
      });
    },

    clearSearchResults: function(){
      var th = this, sm = th.searchMenu;
      sm.$input.val("");
      sm.$searchIcon.hide();
    },

    resetSearchMenu: function(){
      var th = this, sm = th.searchMenu;
      th.clearSearchResults();
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
        globalNav = new GlobalNav( $this, opts );
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

}(jQuery, window));



$(".nav-wrapper").globalNav();
