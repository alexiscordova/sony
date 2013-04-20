/* Universal Nav - Stand-Alone */

// ------------ Sony Universal Nav ------------
// Module: Universal Nav
// Version: 1.0
// Modified: 2013-04-19 by Christopher Mischler
// Dependencies: jQuery 1.7+
// -------------------------------------------------------------------------

var UNAV = ( function(window, document, $, undefined){
  
  'use strict';

  var _init = function(){

    // console.log("UNAV init");

    // var $uNav = $('#universal-nav'),
    //   $uNavPrimary = $uNav.find('.u-nav-primary'),
    //   $firstChild = $uNavPrimary.children().first(),
    //   uNavColWidth = $firstChild.outerWidth(),
    //   // So we don't have to download the images before we can figure out how high the module will be,
    //   // we need to figure out the height the image should be at this width, based on current browser width.
    //   // So based on the image aspect ratio, what height should the image be at this width?
    //   uNav2highImgHeight = uNavColWidth * 0.88753799392097,
    //   uNavColHeight = uNav2highImgHeight + $firstChild.find('.u-nav-primary-caption').outerHeight(true);
    //   $firstChild.height(uNavColHeight + "px");
    
  };

  return {
    init: _init
  };

})(window, document, jQuery);


// Document.ready call
$(function(){
  if ($('#universal-nav').length){
    UNAV.init();
  }
});

