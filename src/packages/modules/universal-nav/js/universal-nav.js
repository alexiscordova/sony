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
    firstLoad,
    xUp,
    uNavColWidth,
    uNavRowHeight,
    uNavOuterHeight,
    _cssTransitions,

  _init = function($_triggerLink, $_pageWrapInner, $_pageWrapOuter){

    $triggerLink = $_triggerLink;
    $pageWrapInner = $_pageWrapInner;
    $pageWrapOuter = $_pageWrapOuter;
    $uNav = $('#universal-nav');
    $uNavPrimary = $uNav.find('.u-nav-primary');
    $firstChild = $uNavPrimary.children().first();
    $closeBtn = $('#u-nav-close-btn');
    firstLoad = true;
    xUp = $uNavPrimary.children().length;
    _cssTransitions = _browserCssTransitionDetect();


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

    if ($firstChild.find('.u-nav-primary-img').height() > 0){
      console.log("has height");
      // if the image has a height, use it.

    } else {
      console.log("no height");
      // if the image doesn't have a height, do the math.
      var twoHighRatio = 0.8915,
          twoWideRatio = 0.4202,
          halfHighRatio = 0.344;

      uNavColWidth = $firstChild.outerWidth();

      if (xUp === 3){
        uNavRowHeight = (uNavColWidth * twoWideRatio) + $firstChild.find('.u-nav-primary-caption').outerHeight(true);
      } else if (xUp === 6){
        uNavRowHeight = (((uNavColWidth * halfHighRatio) + $firstChild.find('.u-nav-primary-caption').outerHeight(true)) * 2) + 36;
      } else {
        uNavRowHeight = (uNavColWidth * twoHighRatio) + $firstChild.find('.u-nav-primary-caption').outerHeight(true);
      }
    }
    console.log("uNavRowHeight: " + uNavRowHeight);

    // So we don't have to download the images before we can figure out how high the module will be,
    // we need to figure out the height the image should be at this width, based on current browser width.
    // So based on the image aspect ratio, what height should the image be at this width?
    
    // uNavRowHeight = uNav2highImgHeight + $firstChild.find('.u-nav-primary-caption').last().outerHeight(true); // use last in case it's a 6up & there are 2. We just want the bottom one.

    $uNavPrimary.height(uNavRowHeight + "px");
    // now that we set the height of the images container, we can grab the height of the entire u-nav for our js.

    setTimeout(function(){
      uNavOuterHeight = $uNav.outerHeight();
      // once we have the outerheight, clear the custom height from the $uNavPrimary so it's back to the natural flow.
      // delays just to make sure the new heights are set before the next step.
      $uNavPrimary.css('height','');
      // set the height to make sure there aren't rounding errors, where 'top' and 'height' are 1px off, and you can see a little of the 
      $uNav.css('top','-' + uNavOuterHeight + 'px');
      if ($pageWrapOuter.hasClass('unav-open')){
        $pageWrapInner.css('margin-top', uNavOuterHeight + 'px');
      }
    },1);
  },



  _openUNav = function(){
    // console.log("_openUNav");

    _setUpPrimaryLinks($uNavPrimary.children().length);

    setTimeout(function() {
      $pageWrapOuter.addClass('unav-open unav-open-until-transition-end');
      if (_cssTransitions){
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
    if (_cssTransitions){

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

