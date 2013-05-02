/* Universal Nav - Functions as a stand-alone module. */

// ------------ Sony Universal Nav ------------
// Module: Universal Nav
// Version: 1.0
// Modified: 2013-04-26 by Christopher Mischler
// Dependencies: jQuery 1.4+
// -------------------------------------------------------------------------

var UNAV = ( function( window, document, $, undefined ){
  
  'use strict';

  var $triggerLink,
    $pageWrapInner,
    $pageWrapOuter,
    $uNav,
    $uNavPrimary,
    $firstChild,
    $closeBtn,
    imagesInited,
    imagesLoaded,
    xUp,
    minBreakpoint,
    uNavColWidth,
    uNavRowHeight,
    uNavOuterHeight,
    isHighRes,
    hasCssTransitions,

  _init = function($_triggerLink, $_pageWrapInner, $_pageWrapOuter, _minBreakpoint){

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

    // -----------------------------
    // EVENT LISTENERS
    // -----------------------------
    // At least jQuery 1.7 is needed to use $.on() - if using an older version, change them to $.bind().
    // This will allow versions older than 1.7 to work without using depreciated functions in version 1.7+
    if ($.isFunction($.fn.on)){
      $triggerLink.on('click',function(e){
        e.preventDefault();
        if ( _minBreakpointMet() ){
          if ($pageWrapOuter.hasClass('unav-open')){
            _closeUNav();
          } else {
            _openUNav();
          }
        }
      });

      $closeBtn.on('click',function(e){
        e.preventDefault();
        _closeUNav();
      });
    } else {
      $triggerLink.bind('click',function(e){
        e.preventDefault();
        
        if ( _minBreakpointMet() ){
          if ($pageWrapOuter.hasClass('unav-open')){
            _closeUNav();
          } else {
            _openUNav();
          }
        }
      });

      $closeBtn.bind('click',function(e){
        e.preventDefault();
        _closeUNav();
      });      
    }


    // Rolling our own quick & dirrty throttle.
    // Using a somewhat arbitrary delay in an attempt to avoid firing at the same time as anything else that might be throttled.
    var throttleTimeout = null;
    $(window).resize( function(){
      if (!throttleTimeout){
        throttleTimeout = setTimeout(function(){
          throttleTimeout = null;
          _resizeEvent();
        }, 283);
      }
    });

    if ( _minBreakpointMet() ){
      _setUpPrimaryLinks();
    }
  },



  _setUpPrimaryLinks = function(){

    if (imagesLoaded){
      // if images are loaded, use their natural height
      uNavRowHeight = $uNavPrimary.outerHeight();
    } else {
      // So we don't have to download the images before we can figure out how high the module will be,
      // we need to figure out the height the image should be at this width, which is based on current browser width.
      // So based on the image aspect ratio, what height should the images, & the whole uPrimaryNav be at this width?
      var x5upRatio = 0.8915,
          x3upRatio = 0.4205,
          x6upRatio = 0.3455;

      uNavColWidth = $('.u-nav-primary-row1').first().outerWidth();

      if (xUp === 3){

        uNavRowHeight = ($firstChild.outerWidth() * x3upRatio) + $firstChild.find('.u-nav-primary-caption').outerHeight(true);
      } else if (xUp === 6){
        uNavRowHeight = (((uNavColWidth * x6upRatio) + $firstChild.find('.u-nav-primary-caption').outerHeight(true)) * 2) + 36;
      } else {
        uNavRowHeight = (uNavColWidth * x5upRatio) + $firstChild.find('.u-nav-primary-caption').outerHeight(true);
      }
      // anything with a "row1" or "row2" is a half-height
      $('.u-nav-primary-row1 .u-nav-primary-img-wrap, .u-nav-primary-row2 .u-nav-primary-img-wrap').height(uNavColWidth * x6upRatio);
      $('.u-nav-primary-col1.u-nav-primary-2high .u-nav-primary-img-wrap').height(uNavColWidth * x5upRatio);
      $('.u-nav-primary-col1.u-nav-primary-2wide .u-nav-primary-img-wrap').height($firstChild.outerWidth() * x3upRatio);
    }
    
    $uNavPrimary.height(uNavRowHeight + "px");
    // now that we set the height of the images container, we can grab the height of the entire u-nav for our js.

    setTimeout(function(){
      uNavOuterHeight = $uNav.outerHeight();
      // once we have the outerheight, clear the custom height from the $uNavPrimary so it's back to the natural flow.
      // delays just to make sure the new heights are set before the next step.
      if ($firstChild.find('.u-nav-primary-img').height() > 0){
        $uNavPrimary.css('height','');
      }
      // set the height to make sure there aren't rounding errors, where 'top' and 'height' are 1px off, and you can see a little of the 
      $uNav.css('top','-' + uNavOuterHeight + 'px');
      if ($pageWrapOuter.hasClass('unav-open')){
        $pageWrapInner.css('margin-top', uNavOuterHeight + 'px');
      }
    },1);
  },

  _initialLoadImages = function(){
    imagesInited = true;

    setTimeout(function(){

      // load the close btn icon first.
      var $closeBtnImg = $('#u-nav-close-btn .u-nav-close-btn-img'),
      closeBtnImgSrcStr = $closeBtnImg.attr('data-src');
      if (isHighRes){
        closeBtnImgSrcStr = closeBtnImgSrcStr.replace(".","@2x.");
      }
      $closeBtnImg.attr('src', closeBtnImgSrcStr);


      var $uNavPrimaryImages = $uNavPrimary.find('img[data-src]'),
        imagesLoadedCount = 0;

      $uNavPrimaryImages.each(function(){
        var $thImg = $(this),
          srcStr = $thImg.attr('data-src');
        if (isHighRes){
          srcStr = srcStr.replace(".","@2x.");
        }

        $thImg.attr('src', srcStr);
        $thImg.bind('load', function() {
          imagesLoadedCount++;
          // now that the image is loaded, clear out the custom height on the image wrapper
          $thImg.addClass('opacity1').parent().css('height',"");
          setTimeout(function(){
            $thImg.parent().css('background-image','none');
          },300); // wait til the image is faded in before pulling off the preloader graphic (which needs to be hidden because it would show through on hover)
          if (imagesLoadedCount === $uNavPrimaryImages.length){
            imagesLoaded = true;
          }
        });
      });
    },500); // leave at 0 unless testing.
  },


  _openUNav = function(){
    !imagesInited && _initialLoadImages();
    _setUpPrimaryLinks($uNavPrimary.children().length);

    setTimeout(function() {
      $pageWrapOuter.addClass('unav-open unav-open-until-transition-end');
      if (hasCssTransitions){
        $pageWrapInner.css('margin-top', uNavOuterHeight + 'px');
      } else {
        $pageWrapInner.animate({ 'marginTop': uNavOuterHeight + 'px'}, 400);
      }

      $triggerLink.blur();
    }, 1);
  },

  _closeUNav = function(){
    $pageWrapOuter.removeClass('unav-open');
    if (hasCssTransitions){

      $pageWrapInner.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend', function() {
        $pageWrapOuter.removeClass('unav-open-until-transition-end');
        $triggerLink.add($closeBtn).blur();
      });

      $pageWrapInner.css('margin-top', '0px');
    } else {
      $pageWrapInner.animate({ 'marginTop': '0px'}, 400,  function(){
        $pageWrapOuter.removeClass('unav-open-until-transition-end');
        $triggerLink.add($closeBtn).blur();
      });
    }
  },

  // in case Modernizr isn't available, let's do our own check for css transitions.
  // via http://stackoverflow.com/questions/7264899/detect-css-transitions-using-javascript-and-without-modernizr
  _browserCssTransitionDetect = function(){
    var s = document.createElement('p').style;
    return 'transition' in s || 'WebkitTransition' in s || 'MozTransition' in s || 'msTransition' in s || 'OTransition' in s;
  },

  // in case Modernizr isn't available, figure out if this is a high-rez display
  // https://github.com/imulus/retinajs/blob/master/src/retina.js
  _isRetina = function(){ 
    var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),(min--moz-device-pixel-ratio: 1.5),(-o-min-device-pixel-ratio: 3/2),(min-resolution: 1.5dppx)";
    var root = (typeof exports == 'undefined' ? window : exports);
    if (root.devicePixelRatio > 1){
      return true;
    }

    if (_matchMedia(mediaQuery).matches){
      return true;
    }

    return false;
  },
  // needed for _isRetina to work
  // https://github.com/paulirish/matchMedia.js
  _matchMedia = function(){ 
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

    return function(q){
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

  _minBreakpointMet = function(){
    return minBreakpoint <= parseInt($(window).width(),10);
  },

  _resizeEvent = function(){
    if ( _minBreakpointMet() ){
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
$(function(){
  if ($('#universal-nav').length){
    UNAV.init($('#nav-li-link-universal'), $('#page-wrap-inner'), $('#page-wrap-outer'), 768);
  }
});

