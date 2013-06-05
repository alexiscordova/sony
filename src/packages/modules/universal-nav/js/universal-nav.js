/* Universal Nav - Functions as a stand-alone module. */

// ------------ Sony Universal Nav ------------
// Module: Universal Nav
// Version: 1.0
// Modified: 2013-06-04 by Christopher Mischler
// Dependencies: jQuery 1.6+  
//              --- 1.6 is needed for $.is and at the moment nothing else, but that could have changed.
// -------------------------------------------------------------------------------------------------------------
// 
// Events broadcast on $(document): universal-nav-open, universal-nav-open-finished, universal-nav-close, universal-nav-close-finished
// 

var UNAV = ( function( window, document, $, undefined ) {

  'use strict';

  var $triggerLink,
    $pageWrapInner,
    $pageWrapOuter,
    $uNav,
    $uNavPrimary,
    $firstChild,
    $closeBtn,
    $tabableElements,
    $lastTabIndexElement,
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
    justTriggered,

    // At least jQuery 1.7 is needed to use $.on() - if using an older version, change them to $.bind().
    // This will allow versions older than 1.7 to work without using depreciated functions in version 1.7+
    ON = $.isFunction( $.fn.on ) ? 'on' : 'bind',
    OFF = $.isFunction( $.fn.off ) ? 'off' : 'unbind',

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
    $tabableElements = $uNav.find('[tabindex]');
    $lastTabIndexElement = $('#u-nav-last-tabindex');
    isHighRes = false;
    imagesInited = false;
    imagesLoaded = false;
    xUp = $uNavPrimary.children().length;
    isHighRes = _isRetina();
    hasCssTransitions = _browserCssTransitionDetect();
    justTriggered = false;

    $(document)[ ON ]("universal-nav-open",function(e){
      // console.log("universal-nav-open");
    });
    $(document)[ ON ]("universal-nav-open-finished",function(e){
      // console.log("universal-nav-open-finished");
    });
    $(document)[ ON ]("universal-nav-close",function(e){
      // console.log("universal-nav-close");
    });
    $(document)[ ON ]("universal-nav-close-finished",function(e){
      // console.log("universal-nav-close-finished");
    });

    // -----------------------------
    // EVENT LISTENERS
    // -----------------------------
    $triggerLink[ ON ]('click focus',function(e) {
      e.preventDefault();
      // console.log("$triggerLink[ ON ]('click focus')");

      if (!justTriggered){        
        // console.log("$triggerLink[ ON ]('click focus') - FIRE!");
        justTriggered = true;
        setTimeout( function(){ justTriggered = false; }, 100 );

        $triggerLink.addClass('unav-focused');

        if ( _minBreakpointMet()) {
          // console.log("##minBreakpointMet");
          if ($pageWrapOuter.hasClass('unav-open')) {
            // console.log("hasClass(unav-open)");
            _closeUNav();
          } else {
            // console.log("NOT hasClass(unav-open)");
            _openUNav();
          }
        }
      }
    });
    $triggerLink[ ON ]('blur',function(e) {
      e.preventDefault();
      // console.log("$triggerLink[ ON ]('blur')");
      $triggerLink.removeClass('unav-focused');
    });

    $tabableElements[ ON ]('focus',function(e) {
      e.preventDefault();
      // console.log("$tabableElements[ ON ]('focus')");

      $(e.target).addClass('unav-focused');

      if ($(e.target).attr('id') == "u-nav-last-tabindex"){
        if (!$pageWrapOuter.hasClass('unav-open') && _minBreakpointMet()){
          _openUNav();
        }
      }
    });

    $tabableElements[ ON ]('blur',function(e) {
      // console.log("$tabableElements[ ON ]('blur')");
      // console.log("$lastTabIndexElement: " + $lastTabIndexElement);

      $(e.target).removeClass('unav-focused');

      if ($(e.target).attr('id') == "u-nav-last-tabindex"){
        // give the focus a moment to add the focused class before checking to see if it exists.
        setTimeout(function(){
          // if you just tabbed off of the last-tabindex link, and nothing inside uNav has focus (cuz this one just got blurred), close the u-nav.
          if ($('.unav-focused').length < 1){
            // console.log("#### Tabbed past the end!");
            _closeUNav();
          }
        },25);
      }
    });

    $closeBtn[ ON ]('click',function(e) {
      e.preventDefault();
      _closeUNav();
    });


    // Rolling our own quick & dirrty throttle.
    var throttleTimeout = null;
    $window.resize( function() {
      if (!throttleTimeout) {
        throttleTimeout = setTimeout(function() {
          throttleTimeout = null;
          _resizeEvent();
        }, 283); // Using a somewhat arbitrary delay in an attempt to avoid firing at the same time as anything else that might be throttled.
      }
    });


    if ( _minBreakpointMet() ) {
      _setUpPrimaryLinks();
    }
    if ($('html').hasClass('lt-ie9')){
      _setUpCloseBtnOldIE();
    }
  },


  _openUNav = function() {

    $(document).trigger("universal-nav-open");

    !imagesInited && _initialLoadImages();
    _setUpPrimaryLinks();

    $pageWrapOuter.addClass('unav-open unav-open-until-transition-end');

    if (hasCssTransitions) {
      // console.log("??? uNavOuterHeight: " + uNavOuterHeight);

      // console.log("set pageWrapInner margin-top. uNavOuterHeight: " + uNavOuterHeight);

      $uNav.css('top', '-' + uNavOuterHeight + 'px');
      $pageWrapInner
      .css('margin-top', uNavOuterHeight + 'px')
      [ ON ]('transitionend webkitTransitionEnd oTransitionEnd otransitionend', function(e){
        // console.log("$(e.target): " , $(e.target), e.delegateTarget);

        // if ($(e.delegateTarget).is($(e.target)) && !triggered){
        if ($(e.target).is($pageWrapInner)){
          // triggered = true;
          $(document).trigger("universal-nav-open-finished");
          $pageWrapInner[ OFF ]('transitionend webkitTransitionEnd oTransitionEnd otransitionend');
        }
      });
    } else {
      // console.log("set pageWrapInner margin-top. uNavOuterHeight: " + uNavOuterHeight);

      $uNav.css({ 'top': '-'+uNavOuterHeight+'px'  ,  'height':uNavOuterHeight+'px' });
      $pageWrapInner.animate({ 'marginTop': uNavOuterHeight + 'px'}, 400, function() {
        $(document).trigger("universal-nav-open-finished");
      });
    }
  },

  _closeUNav = function() {
    $(document).trigger("universal-nav-close");
    // was working on scrolling to the top when the universal nav is collapsed. Turned out buggy & don't have time to clean it up.
    // var unavClose_ScrollToTop_int = setInterval(function(){
      // console.log("$('#nav-wrapper').offset().top: " + $('#nav-wrapper').offset().top);
      // console.log("$(document).scrollTop(): " + $(document).scrollTop());
      // var topOfNavOffset = $(document).scrollTop() - $('#nav-wrapper').offset().top;
      // console.log("topOfNavOffset: " + topOfNavOffset);
      // if (topOfNavOffset < 5){
      //   window.scrollTo(0, $('#nav-wrapper').offset().top);
      // }
    // },2);

    if (hasCssTransitions) {
      $pageWrapInner
      .css('margin-top', '0px')
      [ ON ]('transitionend webkitTransitionEnd oTransitionEnd otransitionend', function(e){
        // console.log("_closeUNav transitionend");
        // console.log("$(e.target): " , e.target);
        // console.log("$(e.delegateTarget): " , e.delegateTarget);

        // make sure that the event that just finished is $pageWrapInner; otherwise it may trigger a transitionend for something else inside of $pageWrapInner.
        if ($(e.target).is($pageWrapInner)){
          // console.log("$(e.delegateTarget).is($(e.target))");
          // triggered = true;
          // clearInterval(unavClose_ScrollToTop_int);
          $(document).trigger("universal-nav-close-finished");
          $pageWrapOuter.removeClass('unav-open unav-open-until-transition-end');
          $pageWrapInner.css('margin-top', '')[ OFF ]('transitionend webkitTransitionEnd oTransitionEnd otransitionend');
        } else {
          // console.log("NOT $(e.delegateTarget).is($(e.target))");
        }
      });
    } else {
      $pageWrapInner.animate({ 'marginTop': '0px'}, 400,  function() {
        // clearInterval(unavClose_ScrollToTop_int);
        $(document).trigger("universal-nav-close-finished");
        $pageWrapOuter.removeClass('unav-open-until-transition-end unav-open');
      });
    }
  },



  _setUpPrimaryLinks = function() {
    // console.log("_setUpPrimaryLinks");
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

    $uNavPrimary.css('height', uNavRowHeight + 'px');
    // now that we set the height of the images container, we can grab the height of the entire u-nav for our js.

    // setTimeout(function() {
      var primaryImgHeight = $firstChild.find('.u-nav-primary-img').height();
      uNavOuterHeight = $uNav.outerHeight();
      // console.log("_setUpPrimaryLinks. Set uNavOuterHeight: " + uNavOuterHeight);
      // once we have the outerheight, clear the custom height from the $uNavPrimary so it's back to the natural flow.
      // delays just to make sure the new heights are set before the next step.
      // if ( primaryImgHeight > 0 ) {
      //   $uNavPrimary.css( 'height', '' );
      // }
      // set the height to make sure there aren't rounding errors, where 'top' and 'height' are 1px or 1/2px off, and you can see a little bit when the u-nav is closed
      $uNav.css('top', '-' + uNavOuterHeight + 'px');
      if ( $pageWrapOuter.hasClass('unav-open') ) {
        $pageWrapInner.css('margin-top', uNavOuterHeight + 'px');
      }
    // }, 0);
  },

  _initialLoadImages = function() {
    imagesInited = true;

    setTimeout(function() {

      // load the close btn icon first.
      var $closeBtnImg = $('#u-nav-close-btn .u-nav-close-btn-img');
      var closeBtnImgSrcStr = $closeBtnImg.attr('data-src-desktop');
      if (isHighRes){
        closeBtnImgSrcStr = $closeBtnImg.attr('data-src-desktop-highres');
      }
      $closeBtnImg.attr('src', closeBtnImgSrcStr);

      var $uNavPrimaryImages = $uNavPrimary.find('.u-nav-primary-img'),
        imagesLoadedCount = 0;

      $uNavPrimaryImages.each(function() {
        var $thImg = $(this);
        var srcStr = $thImg.attr('data-src-desktop');
        if (isHighRes){
          srcStr = $thImg.attr('data-src-desktop-highres');
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
            uNavOuterHeight = $uNav.outerHeight();
            // once all the images are loaded, re-set up the primary links. ..is this needed?
            _setUpPrimaryLinks();
          }
        });
      });
    },0); // leave at 0 unless testing the image preloader.
  },


  _setUpCloseBtnOldIE = function() {
    // for lt-ie9, the button needs an explicit width or it breaks to 2 lines. Since we don't know how long the i11n text will be, we gotta do some math.
    // alert("_setUpCloseBtnOldIE");
    var $closeBtn = $('#u-nav-close-btn'),
      labelWidth = $closeBtn.find('.u-nav-close-btn-label').outerWidth(true),
      iconWidth = $closeBtn.find('.u-nav-close-btn-img-container').outerWidth(true),
      buttonWidth = labelWidth + iconWidth + 1;
    $closeBtn.width(buttonWidth);
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
      _setUpPrimaryLinks();
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

