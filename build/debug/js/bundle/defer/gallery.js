
if ( !Exports ) {
  var Exports = {
    Modules : {}
  };
}

/**
 * Constrains a value between a min and max value
 * @param  {Number} value number to be contstrained
 * @param  {Number} min   minimum
 * @param  {Number} max   max
 * @return {Number}
 */
Exports.constrain = function(value, min, max) {
    'use strict';

    value = parseFloat(value);

    return value < min ? min :
        value > max ? max :
        value;
};

Exports.Modules.Gallery = (function($) {

  var

  _init = function() {
    $('.gallery').each(function() {
      var $this = $(this),
      data = $this.data(),
      options = { mode : data.mode };

      $this.addClass('gallery-' + data.mode).gallery(options);
    });
  };

  return {
    init: _init
  };
}(jQuery));


Exports.Modules.Tabs = (function($, Modernizr, window, undefined) {
  'use strict';

  var $tabsWrap, // container for tabs,
  $tabs, // .tabs children
  $tabContent, // container for tab-panes
  $activeTab,
  $navNext,
  $navPrev,
  $window,
  $panes,
  tabOffset = 0,
  initialTabWidth = 0,
  tabWidth = 0,
  tabsWidth = 0,
  windowWidth = 0,
  windowHeight = 0,
  data = null,
  lastSL = null,
  isStickyTabs = false,
  isTabCarousel = false,
  pages = 0,
  page = 1,
  tabsPerPage = 0,
  toOffset = 0,

  _init = function() {
    $tabsWrap = $('.tabs');
    $tabs = $tabsWrap.children('.tab');

    // No tabs on the page
    if ( $tabs.length === 0 ) { return; }

    // Set variables
    $tabContent = $('.tab-content');
    $activeTab = $tabs.filter('.active');
    $window = $(window);
    $navNext = $('.tab-nav-next');
    $navPrev = $('.tab-nav-prev');
    $panes = $tabContent.find('.tab-pane');
    windowWidth = $window.width();
    windowHeight = $window.height();
    tabWidth = initialTabWidth = $tabs.outerWidth();

    // New tab shown event
    $tabs.on('shown', _tabShown);

    // Window resize
    $window.on('resize.tabs', _onResize);

    // Decide which tabs to make
    if ( Modernizr.mq('(max-width: 767px)') ) {
      _setupStickyTabs();
    } else if ( Modernizr.mq('(min-width: 768px) and (max-width: 979px)') ) {
      _setTabCarouselVars();
      _setupTabCarousel();
    }

    $panes.not('.active').addClass('off-screen');
  },

  _tabShown = function(evt) {
    var $tab = $(this);

    // Update iQ images
    window.iQ.update();

    // Save tab
    $activeTab = $tab;
    // Initialize new tab for sticky tabs
    if ( isStickyTabs ) {
      console.log('tab shown, removing style attribute of all tabs');
      $tabs.removeAttr('style');
      _initStickyTab();
    }
  },

  _onResize = function() {
    windowWidth = $window.width();
    windowHeight = $window.height();

    // Phone
    if ( Modernizr.mq('(max-width: 767px)') ) {
      if ( isTabCarousel ) {
        _teardownTabCarousel();
      }

      if ( !isStickyTabs ) {
        _setupStickyTabs();
      }

      _animateTab();

    // Tablet
    } else if ( Modernizr.mq('(min-width: 768px) and (max-width: 979px)') ) {
      if ( isStickyTabs ) {
        _teardownStickyTabs();
      }

      if ( !isTabCarousel && $tabs.length > tabsPerPage ) {
        _setTabCarouselVars();
        _setupTabCarousel();
      }


    // Desktop
    } else {
      if ( isTabCarousel ) {
        _teardownTabCarousel();
      }
    }
  },

  _setTabCarouselVars = function() {

    tabsWidth = $tabsWrap.parent().outerWidth();
    tabsPerPage = Math.floor( tabsWidth / tabWidth );

    // Make sure no tabs overflow
    tabWidth = tabsWidth / tabsPerPage;
    $tabs.width( tabWidth );

    toOffset = tabsPerPage * tabWidth;
    pages = Math.ceil( $tabs.length / tabsPerPage );
  },

  _setupTabCarousel = function() {

    // see if there's overflow
    if ( $tabs.length < tabsPerPage ) {
      return;
    }

    isTabCarousel = true;
    $tabsWrap.addClass('tab-carousel');

    _tabCarouselNavigated();

    // Setup events
    $navNext.on('click.tabs', function() {
      if ( page !== pages ) {
        page += 1;
        $tabsWrap.css('marginLeft', toOffset * -( page - 1 ));
        _tabCarouselNavigated();
      }
    });

    $navPrev.on('click.tabs', function() {
      if ( page !== 1 ) {
        page -= 1;
        $tabsWrap.css('marginLeft', toOffset * -( page - 1 ));
        _tabCarouselNavigated();
      }
    });

  },

  _teardownTabCarousel = function() {
    console.log('_teardownTabCarousel');
    isTabCarousel = false;
    $tabsWrap.removeClass('tab-carousel');
    page = 1;
    tabWidth = initialTabWidth;
    $navNext.add($navPrev).off('click.tabs');
    $tabs.removeAttr('style');
    $tabsWrap.css('marginLeft', '');
  },

  // Previous or next button clicked
  _tabCarouselNavigated = function() {
    if ( $tabs.length < tabsPerPage ) {
      return;
    }


    // Hide show prev button depending on where we are
    if ( page === 1 ) {
      $navPrev.hide();
    } else {
      $navPrev.show();
    }

    // Hide show next button depending on where we are
    if ( page === pages ) {
      $navNext.hide();
    } else {
      $navNext.show();
    }

  },

  // Initializes sticky tabs
  _setupStickyTabs = function() {
    console.log('_setupStickyTabs');
    isStickyTabs = true;
    $tabsWrap
      .on('scroll', _animateTab)
      .addClass('sticky')
      // .parent()
      // .scrollerModule({
      //   contentSelector: '.tabs',
      //   itemElementSelector: '.tab',
      //   mode: 'free',
      //   lastPageCenter: false,
      //   extraSpacing: 0,

      //   //iscroll props get mixed in
      //   iscrollProps: {
      //     snap: false,
      //     hScroll: true,
      //     vScroll: false,
      //     hScrollbar: false,
      //     vScrollbar: false,
      //     momentum: true,
      //     bounce: true,
      //     onScrollEnd: null
      //   }
      // });
    _initStickyTab();
  },

  // Removes sticky tabs
  _teardownStickyTabs = function() {
    console.log('_teardownStickyTabs');
    $tabsWrap.off('scroll').removeClass('sticky');
    $tabs.removeAttr('style');
    isStickyTabs = false;
  },

  _initStickyTab = function() {
    console.log('_initStickyTab');
    lastSL = $tabsWrap.scrollLeft();
    data = null;

    // Get offset from left side
    tabOffset = $activeTab.offset().left;

    // Set initail css on active tab
    $activeTab.css({
      position: 'absolute',
      left: _getBounded( tabOffset )
    });

    console.log('new sticky tab set', _getBounded( tabOffset ) );

    // Add a margin to the next (or previous if it's the last tab) tab because
    // the active one is positioned absolutely, taking up no space
    if ( !$activeTab.is(':last-child') ) {
      $activeTab.next().css('marginLeft', tabWidth);
    } else {
      $activeTab.prev().css('marginRight', tabWidth);
    }
  },

  _animateTab = function() {
    var sl = $tabsWrap.scrollLeft(),
        distance = lastSL - sl, // last scroll left - current scoll left = distance since last _animateTab call
        tmpX = data ? data.overlap + distance : tabOffset + distance,
        newX = _getBounded( tmpX ); // contrain the tab to 0 and the scrollwidth

    // If the value has been constrained, save the overlap
    if ( newX !== tmpX ) {
      data = {
        overlap: tmpX
      };
    } else {
      data = null;
    }

    lastSL = sl;
    tabOffset = newX;

    $activeTab.css('left', tabOffset);
  },

  _getBounded = function( value ) {
    return Exports.constrain( value, 0, windowWidth - tabWidth );
  };

  return {
    init: _init
  };
}(jQuery, Modernizr, window));

$(document).ready(function() {

  if ( $('.gallery').length > 0 ) {
    Exports.Modules.Gallery.init();
    Exports.Modules.Tabs.init();


    // // Should be called after everything is initialized
    $(window).trigger('hashchange');
  }
});