// ------------ Tertiary Content Container Module ------------
// Module: Tertiary Content Container Module
// Version: 1.0
// Modified: 2012-12-19 by Telly Koosis
// Dependencies: jQuery 1.7+, Modernizr, scrollermodule.1.0.js, iscroll.4.2.5.js
// -------------------------------------------------------------------------

$(document).ready(function(){

  var $scroller = $(".scroller"),
      $contentModules = $scroller.find(".tcc-content-module"),
      $scrollerInstance = null,
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
      
      $scrollerInstance = initScrollerModule();
      
    }else{
      console.log("don't init scroller yet »");
    }
    
    function initScrollerModule(){
      console.group("initScrollerModule group");

      // TODO: optimize this if things are laggy as it happens on a (throttled) window resize in mobile only
      setContentModuleSize(); // things get a detailed >480 for content modules, size each based on wrapper width...

      console.groupEnd();

      // init scroller module
      return $scroller.scrollerModule({
        contentSelector: '.tcc-body',
        itemElementSelector: '.tcc-content-module',
        mode: 'paginate',
        fitPerPage:1,
        
        iscrollProps: {
          snap: true,
          momentum: true,
          bounce: true,
          lockDirection: false,
          hScroll: true,
          vScroll: false,
          hScrollbar: false,
          vScrollbar: false,   
          onScrollEnd: null,
        }
      });
      
      //return scroller;
    };

    function destroy(){
      $scrollerInstance.scrollerModule('destroy');
      $scrollerInstance = null;
      $(".tcc-content-module, .tcc-body, .tcc-body-wrapper").removeAttr("style");
    }

    function setContentModuleSize(){
      console.group("setContentModuleSize");
      
      var sizeTo = $scroller.outerWidth(false); // false, because we do not want margins
      
      console.log("sizeTo »",sizeTo);

     $contentModules.width(sizeTo); // just wait a sec before we init scroller instance

      console.groupEnd();
    }

    // define event function
    function handleTccResize(){
      console.group("handleScroller");
      console.log(" resizeEvent is »",resizeEvent);
             
      var isScrollerModule = $scrollerInstance != null ? true : false; // check here if there's a scroller module

      console.log("isScrollerModule »",isScrollerModule);

      if ( Modernizr.mq('(max-width:'+ mobileBreakpoint+'px)') ) { // Phone
       
       console.log("on mobile");
       
       // if there's a scroller module
       if(!isScrollerModule){
          console.log("there is NOT a scroller module set-up, init it »");
          $scrollerInstance = initScrollerModule();
       }else{
          console.log("there IS a scroller module set-up »", $scroller);

          // if orientation event happened set up a new scroller instance
          if(resizeEvent == "orientationchange"){            
              // destroy first
              destroy();

              // out of the ashes, create
              $scrollerInstance = initScrollerModule();
          }
       }

      }else{
        console.log("on desktop/tablet");
        
        if(isScrollerModule){
          console.log("there's a scroller module, kill it »", $scrollerInstance);
          destroy();
        }else{
          console.log("there isn't a scroller module initalized, do nothing »");
        }
      }

      console.groupEnd();
    }
  
  }

});