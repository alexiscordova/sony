/* Universal Nav - Functions as a stand-alone module. */

// ------------ Sony Universal Nav ------------
// Module: Universal Nav
// Version: 1.0
// Modified: 2013-04-26 by Christopher Mischler
// Dependencies: jQuery 1.4+
// -------------------------------------------------------------------------

var UNAV = ( function( window, document, $, undefined ) {

  'use strict';

  var $triggerLink,
    $pageWrapInner,
    $pageWrapOuter,
    $uNav,
    $uNavPrimary,
    $firstChild,
    $closeBtn,
    $window,
    imagesInited,
    imagesLoaded,
    xUp,
    minBreakpoint,
    uNavColWidth,
    uNavRowHeight,
    uNavOuterHeight,
    isHighRes,
    hasCssTransitions,

    // At least jQuery 1.7 is needed to use $.on() - if using an older version, change them to $.bind().
    // This will allow versions older than 1.7 to work without using depreciated functions in version 1.7+
    ON = $.isFunction( $.fn.on ) ? 'on' : 'bind',

  _init = function($_triggerLink, $_pageWrapInner, $_pageWrapOuter, _minBreakpoint) {

    $window = $( window );
    $triggerLink = $_triggerLink;
    $pageWrapInner = $_pageWrapInner;
    $pageWrapOuter = $_pageWrapOuter;
    minBreakpoint = _minBreakpoint;
    $uNav = $('#universal-nav');
    $uNavPrimary = $uNav.find('.u-nav-primary');
    $firstChild = $uNavPrimary.children().first();
    $closeBtn = $('#u-nav-close-btn');
    isHighRes = false;
    imagesInited = false;
    imagesLoaded = false;
    xUp = $uNavPrimary.children().length;
    isHighRes = _isRetina();
    hasCssTransitions = _browserCssTransitionDetect();

    $(document).on("universal-nav-open",function(e){
      console.log("universal-nav-open");
    });
    $(document).on("universal-nav-open-finished",function(e){
      console.log("universal-nav-open-finished");
    });
    $(document).on("universal-nav-close",function(e){
      console.log("universal-nav-close");
    });
    $(document).on("universal-nav-close-finished",function(e){
      console.log("universal-nav-close-finished");
    });

    // -----------------------------
    // EVENT LISTENERS
    // -----------------------------
    $triggerLink[ ON ]('click',function(e) {
      e.preventDefault();
      if ( _minBreakpointMet() ) {
        if ($pageWrapOuter.hasClass('unav-open')) {
          _closeUNav();
        } else {
          _openUNav();
        }
      }
    });
    $triggerLink[ ON ]('focus',function(e) {
      console.log("u-nav focus");
      e.preventDefault();
      if ( _minBreakpointMet() && !$pageWrapOuter.hasClass('unav-open')) {
        console.log("u-nav conditions met");
        _openUNav();
      }
    });

    $closeBtn[ ON ]('click',function(e) {
      e.preventDefault();
      _closeUNav();
    });


    // Rolling our own quick & dirrty throttle.
    // Using a somewhat arbitrary delay in an attempt to avoid firing at the same time as anything else that might be throttled.
    var throttleTimeout = null;
    $window.resize( function() {
      if (!throttleTimeout) {
        throttleTimeout = setTimeout(function() {
          throttleTimeout = null;
          _resizeEvent();
        }, 283);
      }
    });

    if ( _minBreakpointMet() ) {
      _setUpPrimaryLinks();
    }
  },



  _setUpPrimaryLinks = function() {
    var x5upRatio,
        x3upRatio,
        x6upRatio,
        uNavRowHeight,
        primaryCaptionHeight,
        firstChildWidth;

    if (imagesLoaded) {
      // if images are loaded, use their natural height
      uNavRowHeight = $uNavPrimary.outerHeight();
    } else {
      // So we don't have to download the images before we can figure out how high the module will be,
      // we need to figure out the height the image should be at this width, which is based on current browser width.
      // So based on the image aspect ratio, what height should the images, & the whole uPrimaryNav be at this width?
      x5upRatio = 0.8915;
      x3upRatio = 0.4205;
      x6upRatio = 0.3455;

      uNavColWidth = $('.u-nav-primary-row1').first().outerWidth();
      primaryCaptionHeight = $firstChild.find('.u-nav-primary-caption').outerHeight( true );
      firstChildWidth = $firstChild.outerWidth();

      if (xUp === 3) {
        uNavRowHeight = (firstChildWidth * x3upRatio) + primaryCaptionHeight;
      } else if (xUp === 6) {
        uNavRowHeight = (((uNavColWidth * x6upRatio) + primaryCaptionHeight) * 2) + 36;
      } else {
        uNavRowHeight = (uNavColWidth * x5upRatio) + primaryCaptionHeight;
      }

      // anything with a "row1" or "row2" is a half-height
      $('.u-nav-primary-row1 .u-nav-primary-img-wrap, .u-nav-primary-row2 .u-nav-primary-img-wrap').css( 'height', uNavColWidth * x6upRatio );
      $('.u-nav-primary-col1.u-nav-primary-2high .u-nav-primary-img-wrap').css( 'height', uNavColWidth * x5upRatio );
      $('.u-nav-primary-col1.u-nav-primary-2wide .u-nav-primary-img-wrap').css( 'height', firstChildWidth * x3upRatio );
    }

    $uNavPrimary.css(uNavRowHeight + 'px');
    // now that we set the height of the images container, we can grab the height of the entire u-nav for our js.

    setTimeout(function() {
      var primaryImgHeight = $firstChild.find('.u-nav-primary-img').height();
      uNavOuterHeight = $uNav.outerHeight();
      // once we have the outerheight, clear the custom height from the $uNavPrimary so it's back to the natural flow.
      // delays just to make sure the new heights are set before the next step.
      if ( primaryImgHeight > 0 ) {
        $uNavPrimary.css( 'height', '' );
      }
      // set the height to make sure there aren't rounding errors, where 'top' and 'height' are 1px off, and you can see a little of the
      $uNav.css('top', '-' + uNavOuterHeight + 'px');
      if ( $pageWrapOuter.hasClass('unav-open') ) {
        $pageWrapInner.css('margin-top', uNavOuterHeight + 'px');
      }
    }, 0);
  },

  _initialLoadImages = function() {
    imagesInited = true;

    setTimeout(function() {

      // load the close btn icon first.
      var $closeBtnImg = $('#u-nav-close-btn .u-nav-close-btn-img'),
      closeBtnImgSrcStr = $closeBtnImg.attr('data-src');
      if (isHighRes) {
        closeBtnImgSrcStr = closeBtnImgSrcStr.replace(".","@2x.");
      }
      $closeBtnImg.attr('src', closeBtnImgSrcStr);


      var $uNavPrimaryImages = $uNavPrimary.find('img[data-src]'),
        imagesLoadedCount = 0;

      $uNavPrimaryImages.each(function() {
        var $thImg = $(this),
          srcStr = $thImg.attr('data-src');
        if (isHighRes) {
          srcStr = srcStr.replace(".","@2x.");
        }

        $thImg.attr('src', srcStr);
        $thImg[ ON ]('load', function() {
          imagesLoadedCount++;
          // now that the image is loaded, clear out the custom height on the image wrapper
          $thImg.addClass('opacity1').parent().css('height',"");
          setTimeout(function() {
            $thImg.parent().css('background-image','none');
          },300); // wait til the image is faded in before pulling off the preloader graphic (which needs to be hidden because it would show through on hover)
          if (imagesLoadedCount === $uNavPrimaryImages.length) {
            imagesLoaded = true;
          }
        });
      });
    },0); // leave at 0 unless testing the image preloader.
  },


  _openUNav = function() {
    $(document).trigger("universal-nav-open");

    !imagesInited && _initialLoadImages();
    _setUpPrimaryLinks($uNavPrimary.children().length);

    $pageWrapOuter.addClass('unav-open unav-open-until-transition-end');
    var triggered = false;

    if (hasCssTransitions) {
      $pageWrapInner
        .css('margin-top', uNavOuterHeight + 'px')
        .one('transitionend webkitTransitionEnd oTransitionEnd otransitionend', function(e){
          // only trigger it for the page-wrap-inner transition ending, not any descendents.
          if (!triggered){
            $(document).trigger("universal-nav-open-finished");
            triggered = true;
          }
      });
    } else {
      $pageWrapInner.animate({ 'marginTop': uNavOuterHeight + 'px'}, 400, function() {
        $(document).trigger("universal-nav-open-finished");
      });
    }

    $triggerLink.blur();
  },

  _closeUNav = function() {
    $(document).trigger("universal-nav-close");
    $pageWrapOuter.removeClass('unav-open');
    if (hasCssTransitions) {
      $pageWrapInner.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend', function(e){
        // only trigger it for the page-wrap-inner transition ending, not any descendents.
        if ($(e.target).attr('id') == "page-wrap-inner"){
          $(document).trigger("universal-nav-close-finished");
          $pageWrapOuter.removeClass('unav-open-until-transition-end');
          $triggerLink.add($closeBtn).blur();
        }
      });

      $pageWrapInner.css('margin-top', '0px');
    } else {
      console.log("_closeUNav !hasCssTransitions");
      $pageWrapInner.animate({ 'marginTop': '0px'}, 400,  function() {
        $(document).trigger("universal-nav-close-finished");
        $pageWrapOuter.removeClass('unav-open-until-transition-end');
        $triggerLink.add($closeBtn).blur();
      });
    }
  },

  // in case Modernizr isn't available, let's do our own check for css transitions.
  // via http://stackoverflow.com/questions/7264899/detect-css-transitions-using-javascript-and-without-modernizr
  _browserCssTransitionDetect = function() {
    var s = document.createElement('p').style;
    return 'transition' in s || 'WebkitTransition' in s || 'MozTransition' in s || 'msTransition' in s || 'OTransition' in s;
  },

  // in case Modernizr isn't available, figure out if this is a high-rez display
  // https://github.com/imulus/retinajs/blob/master/src/retina.js
  _isRetina = function() {
    var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),(min--moz-device-pixel-ratio: 1.5),(-o-min-device-pixel-ratio: 3/2),(min-resolution: 1.5dppx)";
    var root = (typeof exports == 'undefined' ? window : exports);
    if (root.devicePixelRatio > 1) {
      return true;
    }

    if (_matchMedia(mediaQuery).matches) {
      return true;
    }

    return false;
  },
  // needed for _isRetina to work
  // https://github.com/paulirish/matchMedia.js
  _matchMedia = function() {
    var bool,
      doc = document,
      docElem = doc.documentElement,
      refNode = docElem.firstElementChild || docElem.firstChild,
      // fakeBody required for <FF4 when executed in <head>
      fakeBody = doc.createElement( "body" ),
      div = doc.createElement( "div" );

    div.id = "mq-test-1";
    div.style.cssText = "position:absolute;top:-100em";
    fakeBody.style.background = "none";
    fakeBody.appendChild(div);

    return function(q) {
      div.innerHTML = "&shy;<style media=\"" + q + "\"> #mq-test-1 { width: 42px; }</style>";
      docElem.insertBefore( fakeBody, refNode );
      bool = div.offsetWidth === 42;
      docElem.removeChild( fakeBody );

      return {
        matches: bool,
        media: q
      };
    };
  },

  _minBreakpointMet = function() {
    return minBreakpoint <= parseInt( $window.width(), 10 );
  },

  _resizeEvent = function() {
    if ( _minBreakpointMet() ) {
      _setUpPrimaryLinks($uNavPrimary.children().length);
    } else {
      // hide & reset!
      $pageWrapOuter.removeClass('unav-open unav-open-until-transition-end');
      $pageWrapInner.css('margin-top','');
    }
  };

  return {
    init: _init
  };

})(window, document, jQuery);


// Document.ready call
$(function() {
  if ($('#universal-nav').length) {
    UNAV.init($('#nav-li-link-universal'), $('#page-wrap-inner'), $('#page-wrap-outer'), 768);
  }
});

