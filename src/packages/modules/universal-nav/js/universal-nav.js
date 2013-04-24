/* Universal Nav - Functions as a stand-alone module. */

// ------------ Sony Universal Nav ------------
// Module: Universal Nav
// Version: 1.0
// Modified: 2013-04-24 by Christopher Mischler
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
    uNavColWidth,
    uNav2highImgHeight,
    uNavColHeight,
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
    _cssTransitions = _browserCssTransitionDetect();


    // -----------------------------
    // EVENT LISTENERS
    // -----------------------------
    // Since I don't know what version of jQuery will be used on all sites, this will allow versions older than 1.7 
    // to work, without using depreciated functions in version 1.7+ 
    // At least jQuery 1.7 is needed to use $.on() - if using an older version, change them to $.bind().
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
    if ($.isFunction($.throttle)){
      // console.log("$.throttle is available");
      $(window).resize( $.throttle( 500, _resizeEvent ) );
    } else {
      // console.log("$.throttle NOT available");
      var throttleTimeout = null;
      $(window).resize( function(){
        if (!throttleTimeout){
          throttleTimeout = setTimeout(function(){
            throttleTimeout = null;
            _resizeEvent();
          }, 500);
        }
      });
    }

    _setUpElements();
  },




  _setUpElements = function(){

    // So we don't have to download the images before we can figure out how high the module will be,
    // we need to figure out the height the image should be at this width, based on current browser width.
    // So based on the image aspect ratio, what height should the image be at this width?
    uNavColWidth = $firstChild.outerWidth();
    uNav2highImgHeight = uNavColWidth * 0.887538;
    uNavColHeight = uNav2highImgHeight + $firstChild.find('.u-nav-primary-caption').outerHeight(true);

    $firstChild.height(uNavColHeight + "px");
    // now they we set the height of the images container, we can grab the height of the entire u-nav for our js.
    setTimeout(function(){
      uNavOuterHeight = $uNav.outerHeight();
      // console.log("uNavOuterHeight: " + uNavOuterHeight);
      setTimeout(function(){
        // once we have the outerheight, clear the custom height from the $firstChild so it's back to the natural flow.
        // delays just to make sure the new heights are set before the next step.
        $firstChild.css('height','');
        // set the height to make sure there aren't rounding errors, where 'top' and 'height' are 1px off, and you can see a little of the 
        $uNav.css('top','-' + uNavOuterHeight + 'px');
        if ($pageWrapOuter.hasClass('unav-open')){
          $pageWrapInner.css('margin-top', uNavOuterHeight + 'px');
        }
      },5);
    },5);
  },



  _openUNav = function(){
    // console.log("_openUNav");

    _setUpElements();

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
    _setUpElements();
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

