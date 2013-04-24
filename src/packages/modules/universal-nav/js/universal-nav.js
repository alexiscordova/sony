/* Universal Nav - Stand-Alone */

// ------------ Sony Universal Nav ------------
// Module: Universal Nav
// Version: 1.0
// Modified: 2013-04-19 by Christopher Mischler
// Dependencies: jQuery 1.7+
// -------------------------------------------------------------------------

var UNAV = ( function(window, document, $, undefined){
  
  'use strict';

  var _init = function($triggerLink, $pageWrapInner, $pageWrapOuter){

    var self = this;

    // console.log("UNAV init");

    var _cssTransitions = _browserCssTransitionDetect(),
      $uNav = $('#universal-nav'),
      $uNavPrimary = $uNav.find('.u-nav-primary'),
      $firstChild = $uNavPrimary.children().first(),
      $closeBtn = $('#u-nav-close-btn'),
      uNavColWidth = $firstChild.outerWidth(),
      // So we don't have to download the images before we can figure out how high the module will be,
      // we need to figure out the height the image should be at this width, based on current browser width.
      // So based on the image aspect ratio, what height should the image be at this width?
      uNav2highImgHeight = uNavColWidth * 0.887538,
      uNavColHeight = uNav2highImgHeight + $firstChild.find('.u-nav-primary-caption').outerHeight(true),
      uNavOuterHeight;

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
      },5);
    },5);

    //- At least jQuery 1.7 is needed to use $.on() - if using an older version, changing these to $.bind() should work.
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



    function _openUNav(){
      // console.log("_openUNav");

      $pageWrapOuter.addClass('unav-open unav-open-until-transition-end');
      if (_cssTransitions){
        $pageWrapInner.css('margin-top', uNavOuterHeight + 'px');
      } else {
        $pageWrapInner.animate({ 'marginTop': uNavOuterHeight + 'px'}, 400);
      }

      setTimeout(function() {
        $triggerLink.blur();
      }, 1);
    }

    function _closeUNav(){
      // console.log("_closeUNav");

      $pageWrapInner.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend', function() {
        // console.log("$pageWrapInner transitionend");
        $pageWrapOuter.removeClass('unav-open-until-transition-end');
        $triggerLink.add($closeBtn).blur();
      });      

      $pageWrapOuter.removeClass('unav-open');
      if (_cssTransitions){
        $pageWrapInner.css('margin-top', '0px');
      } else {
        $pageWrapInner.animate({ 'marginTop': '0px'}, 400,  function(){
          $pageWrapOuter.removeClass('unav-open-until-transition-end');
          $triggerLink.add($closeBtn).blur();
        });
      }
    }

    // in case Modernizr isn't available, let's do our own check for css transitions.
    // via http://stackoverflow.com/questions/7264899/detect-css-transitions-using-javascript-and-without-modernizr
    function _browserCssTransitionDetect(){
      var s = document.createElement('p').style,
        supportsTransitions = 'transition' in s ||
                              'WebkitTransition' in s ||
                              'MozTransition' in s ||
                              'msTransition' in s ||
                              'OTransition' in s;
      return supportsTransitions;
    }

  }; // end _init


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

