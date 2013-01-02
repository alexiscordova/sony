
if ( !Exports ) {
  var Exports = {
    Modules : {}
  };
}

// Five columns
Exports.fiveColumns = 5;
Exports.twelveColumns = 12;
Exports.col5Width = 204;
Exports.gut5Width = 23;
Exports.fullWidth = (Exports.fiveColumns * Exports.col5Width) + (Exports.gut5Width * (Exports.fiveColumns - 1));
Exports.COLUMN_WIDTH = Exports.col5Width / Exports.fullWidth;
Exports.GUTTER_WIDTH = Exports.gut5Width / Exports.fullWidth;
Exports.GALLERY_ITEM_HEIGHT = 337;
Exports.GALLERY_RATIOS = {
  normal: Exports.col5Width / Exports.GALLERY_ITEM_HEIGHT,
  promo: ((Exports.col5Width * 2) + Exports.gut5Width) / Exports.GALLERY_ITEM_HEIGHT,
  large: ((Exports.col5Width * 3) + (Exports.gut5Width * 2)) / ((Exports.GALLERY_ITEM_HEIGHT * 2) + Exports.gut5Width)
};

// Twelve columns @ 768
Exports.colWidth768 = 34;
Exports.gutWidth768 = 22;
Exports.fullWidth768 = (Exports.twelveColumns * Exports.colWidth768) + (Exports.gutWidth768 * (Exports.twelveColumns - 1));
Exports.COLUMN_WIDTH_768 = Exports.colWidth768 / Exports.fullWidth768;
Exports.GUTTER_WIDTH_768 = Exports.gutWidth768 / Exports.fullWidth768;

// Twelve columns @ 980
Exports.colWidth980 = 43;
Exports.gutWidth980 = 30;
Exports.fullWidth980 = (Exports.twelveColumns * Exports.colWidth980) + (Exports.gutWidth980 * (Exports.twelveColumns - 1));
Exports.COLUMN_WIDTH_980 = Exports.colWidth980 / Exports.fullWidth980;
Exports.GUTTER_WIDTH_980 = Exports.gutWidth980 / Exports.fullWidth980;

// Twelve columns @ 1200
Exports.colWidth1200 = 52;
Exports.gutWidth1200 = 36;
Exports.fullWidth1200 = (Exports.twelveColumns * Exports.colWidth1200) + (Exports.gutWidth1200 * (Exports.twelveColumns - 1));
Exports.COLUMN_WIDTH_1200 = Exports.colWidth1200 / Exports.fullWidth1200;
Exports.GUTTER_WIDTH_1200 = Exports.gutWidth1200 / Exports.fullWidth1200;

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
  initialTabWidth = 0,
  tabWidth = 0,
  tabsWidth = 0,
  windowWidth = 0,
  windowHeight = 0,
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
    console.log('initialTabWidth', initialTabWidth);

    // New tab shown event
    $tabs.on('shown', _tabShown);

    // Window resize
    $window.on('resize.tabs', _onResize);

    // Decide which tabs to make
    if ( Modernizr.mq('(max-width: 767px)') ) {
      // _setupStickyTabs();
    } else if ( Modernizr.mq('(min-width: 768px) and (max-width: 979px)') ) {
      _setTabCarouselVars();
      _setupTabCarousel();
    }
  },

  _tabShown = function() {
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
        // _setupStickyTabs();
      }

      // _animateTab();

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

  };

  return {
    init: _init
  };
}(jQuery, Modernizr, window));

$(document).ready(function() {

  if ( $('.gallery').length > 0 ) {
    Exports.Modules.Gallery.init();
    // Exports.Modules.Tabs.init();

    $('.tab-strip').stickyTabs();

    // Hide other tabs
    $('.tab-pane:not(.active)').addClass('off-screen');

    // // Should be called after everything is initialized
    $(window).trigger('hashchange');

    // debug, show second tab
    // $('[data-target="overhead"]').tab('show');
  }
});