// ------------ Tertiary Content Container Module ------------
// Module: Tertiary Content Container Module
// Version: 1.0
// Modified: 2012-12-19 by Telly Koosis
// Dependencies: jQuery 1.7+, Modernizr, scrollermodule.1.0.js, iscroll.4.2.5.js
// -------------------------------------------------------------------------

$(document).ready(function(){

  var $scroller = $(".scroller"),
      $scrollerMod = null,
      mobileBreakpoint = 480;
 
  // if there's a scroller to be had... 
  if ($scroller.length > 0) {
    console.log("We have a scroller module! »", $scroller);

    var $win = $(window),
        resizeEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize',
        resizeThrottle = function(){
          console.log("resize called »");
          handleTccResize();
        };

    // listener for window resize // debounce so as not to overwhelm
    $win.on(resizeEvent + '.tcc', $.debounce(100, resizeThrottle));

    // if we're in phone breakpoint
    if ( Modernizr.mq('(max-width:'+ mobileBreakpoint+'px)') ) {
      console.log(" We're in mobile breakpoint on load, init scroller »");
      
      $scrollerMod = initScrollerModule();
      
    }else{
      console.log("don't init scroller yet »");
    }
    
    function initScrollerModule(){
      console.group("initScrollerModule");
      
      
      // init scroller module
      var scroller =  $scroller.scrollerModule({
        contentSelector: '.tcc-body',
        itemElementSelector: '.tcc-content-module',
        mode: 'paginate'
        //snap: true
      });
      
      console.groupEnd();

      return scroller;
    };

    function destroy(){
      $scrollerMod.scrollerModule('destroy');
      $scrollerMod = null;
      $(".tcc-content-module, .tcc-body, .tcc-body-wrapper").removeAttr("style");
    }

    // define event function
    function handleTccResize(){
      console.group("handleScroller");
             
      var isScrollerModule = $scrollerMod != null ? true : false; // check here if there's a scroller module

      console.log("isScrollerModule »",isScrollerModule);

      if ( Modernizr.mq('(max-width:'+ mobileBreakpoint+'px)') ) { // Phone
       
       console.log("on mobile");
       
       // if there's a scroller module
       if(!isScrollerModule){
          console.log("there is NOT a scroller module set-up, init it »");
          $scrollerMod = initScrollerModule();
       }else{
          console.log("there IS a scroller module set-up, we're good »", $scroller);
       }

      }else{
        console.log("on desktop/tablet");
        
        if(isScrollerModule){
          console.log("there's a scroller module, kill it »", $scrollerMod);
          destroy();
        }else{
          console.log("there isn't a scroller module initalized, do nothing »");
        }
      }

      console.groupEnd();
    }
  
  }

});

// DESTROY

// $scroller.scrollerModule({
//   contentSelector: '.tcc-body',
//   itemElementSelector: '.tcc-content-module',
//   mode:"paginate"
//   // snap: false,
//   // momentum: true, 
//   // hScrollbar: false,
//   // vScrollbar: false
// });




// tablet 
// else if ( Modernizr.mq('(min-width: 768px) and (max-width: 979px)') ) {

   // setupCarousel : function() {
   //    var self = this;

   //    self.$navPrev.hide();
   //    self.$navNext.hide();

   //    self.$tabsContainer.scrollerModule({
   //      contentSelector: '.tabs',
   //      itemElementSelector: '.tab',
   //      mode: 'paginate',
   //      lastPageCenter: false,
   //      extraSpacing: 0,

   //      iscrollProps: {
   //        snap: true,
   //        hScroll: true,
   //        vScroll: false,
   //        hScrollbar: false,
   //        vScrollbar: false,
   //        momentum: true,
   //        bounce: true,
   //        onScrollEnd: null,
   //        onAnimationEnd: function() {
   //          var iscroll = this;
   //          // Hide show prev button depending on where we are
   //          if ( iscroll.currPageX === 0 ) {
   //            self.$navPrev.hide();
   //          } else {
   //            self.$navPrev.show();
   //          }

   //          // Hide show next button depending on where we are
   //          if ( iscroll.currPageX === iscroll.pagesX.length - 1 ) {
   //            self.$navNext.hide();
   //          } else {
   //            self.$navNext.show();
   //          }
   //        }
   //      }
   //    });
