
(function($, window, undefined) {

  var GlobalNav = function( $container, options ) {
    var th = this;

    $.extend(th, $.fn.globalNav.options, options, $.fn.globalNav.settings);

    th.$container = $container;
    th.$activePrimaryNavBtns = th.$container.find('.nav-dropdown-toggle');

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
          var $thPrimaryNavBtn = $(this);
          var $thNavTray = $("." + $thPrimaryNavBtn.data("target"));

          if (!$thNavTray.hasClass("navtray-wrapper-visible")){
            // if this tray isn't already visible, show it.
            
            th.$activePrimaryNavBtns.each(function(){
              $(this).parent().removeClass("nav-li-selected");
            });
            $thPrimaryNavBtn.parent().addClass("nav-li-selected");

            expandedHeight = $thNavTray.height();
            console.log("expandedHeight: " + expandedHeight);
            $thNavTray.height("10px");
            setTimeout(function(){
              $thNavTray.addClass("navtray-wrapper-visible").css("height", expandedHeight);
            },5);

          } else{
            // if this tray was already visible, hide/reset it.
            $thPrimaryNavBtn.parent().removeClass("nav-li-selected");
            $thNavTray.removeClass("navtray-wrapper-visible").css("height", "");
          }
        });
      } else {
        // Init Mobile Nav
      }
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
