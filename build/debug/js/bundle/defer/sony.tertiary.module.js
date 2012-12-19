// ------------ Tertiary Content Container Module ------------
// Module: Tertiary Content Container Module
// Version: 1.0
// Modified: 2012-12-19 by Telly Koosis
// Dependencies: jQuery 1.7+, Modernizr, scrollermodule.1.0.js, iscroll.4.2.5.js
// -------------------------------------------------------------------------

(function(window){
    'use strict';
    var sony = window.sony = window.sony || {};
    sony.modules = sony.modules || {};
    sony.ev = sony.ev || $('<div />'); // events object
})(window);

$(document).ready(function(){
  var $scroller = $(".tertiary-wrapper").eq(0); // TODO: allow init of more than one scroller on a page

  if ($scroller.length > 0) {
    console.log("initilizing scroller »", $scroller);
    var scrollerOpts = {
      contentSelector: '.tertiary',
      itemElementSelector: '.content-block',
      mode:"paginate"
    }
    
    $scroller.scrollerModule(scrollerOpts);    
  }

});

