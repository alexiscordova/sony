// ------------ Sony Global Nav ------------
// Module: Global Nav
// Version: 1.0
// Modified: 2012-12-17 by Christopher Mischler
// Dependencies: jQuery 1.7+, Modernizr
// Optional: jQuery throttle-debounce (only used on window resize)
// -------------------------------------------------------------------------


(function($, Modernizr, window, undefined) {

  $(window).resize(function() {
    console.log("width: " + $(window).width());
  });

  var GlobalFooter = function( $container ) {
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
      // t.initPrimaryNavBtns(false);
    } else {
      // t.initPrimaryNavBtns(true);
    }
    // });

    t.isInitialized = true;

    // this should be moved so it doesn't get inited until the search menu is opened.
    // t.initSearchMenu();
  };

  GlobalFooter.prototype = {

    constructor: GlobalFooter,

    initPrimaryNavBtns : function(isDesktop) {
      var t = this;
      // console.log("initPrimaryNavBtns: " + isDesktop);

    }
  };

    

  // Plugin definition
  $.fn.globalFooter = function( opts ) {
    var args = Array.prototype.slice.apply( arguments );
    return this.each(function() {
      var $this = $(this),
        globalFooter = $this.data('globalFooter');

      // If we don't have a stored globalFooter, make a new one and save it
      if ( !globalFooter ) {
        globalFooter = new GlobalFooter( $this );
        $this.data( 'globalFooter', globalFooter );
      }

      if ( typeof opts === 'string' ) {
        globalFooter[ opts ].apply( globalFooter, args.slice(1) );
      }
    });
  };


  // Overrideable options
  $.fn.globalFooter.options = {
  };

  // Not overrideable
  $.fn.globalFooter.settings = {
    isInitialized: false
  };

}(jQuery, Modernizr, window));



$(".footer-wrapper").globalFooter();


