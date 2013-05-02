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
    uNavColWidth,
    uNavRowHeight,
    uNavOuterHeight,
    isHighRes,
    hasCssTransitions,

  _init = function($_triggerLink, $_pageWrapInner, $_pageWrapOuter){

    $triggerLink = $_triggerLink;
    $pageWrapInner = $_pageWrapInner;
    $pageWrapOuter = $_pageWrapOuter;
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
        // console.log("$triggerLink");
        e.preventDefault();
        if ($pageWrapOuter.hasClass('unav-open')){
          // console.log("Nav is open.");
          _closeUNav();
        } else {
          // console.log("Nav is closed.");
          _openUNav();
        }
      });

      $closeBtn.on('click',function(e){
        e.preventDefault();
        _closeUNav();
      });
    } else {
      // console.log("$triggerLink: " + $triggerLink);
      $triggerLink.bind('click',function(e){
        // console.log("$triggerLink");
        e.preventDefault();
        if ($pageWrapOuter.hasClass('unav-open')){
          // console.log("Nav is open.");
          _closeUNav();
        } else {
          // console.log("Nav is closed.");
          _openUNav();
        }
      });

      $closeBtn.bind('click',function(e){
        e.preventDefault();
        _closeUNav();
      });      
    }


    // if $.throttle isn't available, we'll roll our own quick & dirrty one.
    // Using a somewhat arbitrary delay in an attempt to avoid firing at the same time as anything else that might be throttled.
    if ($.isFunction($.throttle)){
      // console.log("$.throttle is available");
      $(window).resize( $.throttle( 283, _resizeEvent ) );
    } else {
      // console.log("$.throttle NOT available");
      var throttleTimeout = null;
      $(window).resize( function(){
        if (!throttleTimeout){
          throttleTimeout = setTimeout(function(){
            throttleTimeout = null;
            _resizeEvent();
          }, 283);
        }
      });
    }

    // if the images are already cached, give them a chance to render so we can grab their heights.
    // setTimeout(function(){
      _setUpPrimaryLinks(true);
    // },50);
  },



  _setUpPrimaryLinks = function(isFirstTime){
    console.log("$firstChild.find('.u-nav-primary-img').height(): " + $firstChild.find('.u-nav-primary-img').height());

    if (imagesLoaded){
      console.log("images ARE loaded");
      uNavRowHeight = $uNavPrimary.outerHeight();
      // if the image has a height, use it.

    } else {
      console.log("images are NOT loaded");

      // So we don't have to download the images before we can figure out how high the module will be,
      // we need to figure out the height the image should be at this width, which is based on current browser width.
      // So based on the image aspect ratio, what height should the images, & the whole uPrimaryNav be at this width?
      var x5upRatio = 0.8915,
          x3upRatio = 0.4205,
          x6upRatio = 0.3455;

      uNavColWidth = $firstChild.outerWidth();

      if (xUp === 3){
        uNavRowHeight = (uNavColWidth * x3upRatio) + $firstChild.find('.u-nav-primary-caption').outerHeight(true);
        
      } else if (xUp === 6){
        uNavRowHeight = (((uNavColWidth * x6upRatio) + $firstChild.find('.u-nav-primary-caption').outerHeight(true)) * 2) + 36;
      } else {
        uNavRowHeight = (uNavColWidth * x5upRatio) + $firstChild.find('.u-nav-primary-caption').outerHeight(true);
      }
    }
    console.log("uNavRowHeight: " + uNavRowHeight);
    
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
      var $uNavPrimaryImages = $uNavPrimary.find('img[data-src]'),
        imagesLoadedCount = 0;

      $uNavPrimaryImages.each(function(){
        var $thImg = $(this),
          srcStr = $thImg.attr('data-src');
        if (isHighRes){
          srcStr = srcStr.replace(".","@2x.");
        }
        // $thImg.attr('src', srcStr);
        $thImg.bind('load', function() {
          imagesLoadedCount++;
          if (imagesLoadedCount === $uNavPrimaryImages.length){
            imagesLoaded = true;
            console.log("imagesLoaded: " + imagesLoaded);
          }
        });
      });
    },1000); // leave at 0 unless testing.
  },


  _openUNav = function(){
    // console.log("_openUNav");

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
    // console.log("_closeUNav");

    $pageWrapOuter.removeClass('unav-open');
    if (hasCssTransitions){

      $pageWrapInner.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend', function() {
        // console.log("$pageWrapInner transitionend");
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

  _resizeEvent = function(){
    _setUpPrimaryLinks($uNavPrimary.children().length);
  };

  return {
    init: _init
  };

})(window, document, jQuery);


// Document.ready call
$(function(){
  if ($('#universal-nav').length){
    UNAV.init($('#nav-li-link-universal'), $('#page-wrap-inner'), $('#page-wrap-outer'));
  }
});

