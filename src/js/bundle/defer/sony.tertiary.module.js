// ------------ Tertiary Content Container Module ------------
// Module: Tertiary Content Container Module
// Version: 1.0
// Modified: 2012-12-19 by Telly Koosis
// Dependencies: jQuery 1.7+, Modernizr, scrollermodule.1.0.js, iscroll.4.2.5.js
// -------------------------------------------------------------------------

$(document).ready(function(){

  var $scroller = $(".tcc-body-wrapper");

  // if we're in phone breakpoint
  if ( Modernizr.mq('(max-width: 480px)') ) {
    
    // if there's a scroller to be had... 
    if ($scroller.length > 0) {
      console.log("initilizing scroller »", $scroller);

      //init
      // $scroller.scrollerModule({
      //   contentSelector: '.tcc-body',
      //   itemElementSelector: '.tcc-content-module',
      //   mode:"paginate"
      //   // snap: false,
      //   // momentum: true, 
      //   // hScrollbar: false,
      //   // vScrollbar: false
      // });

      $scroller.scrollerModule({
        contentSelector: '.tcc-body',
        itemElementSelector: '.tcc-content-module',
        mode: 'paginate',

        iscrollProps: {
          snap: true,
          hScroll: true,
          vScroll: false,
          hScrollbar: false,
          vScrollbar: false,
          momentum: true,
          bounce: true,
        }
      });



      // setup listener
      //$scroller.on('update.sm',handleScroller);

      // define event function
      function handleScroller(){
        console.group("handleScroller");
        
        
        var isScrollerModule = true; // check here if there's a scroller module


        // if ( Modernizr.mq('(max-width: 480px)') ) { // Phone
        //   console.log("on mobile, is there a scroller module? »",isScrollerModule);
        //   // yes: do nothing
        //   // no: enable 
        //   $scroller.scrollerModule.destroy();          
        //   $scroller.scrollerModule();

        // } else { // Desktop

        //   console.log("on desktop, is there a scroller module? »",isScrollerModule);
        //   // is there a scroller module?
        //   // yes: destroy
        //   // no: do nothing
        //   // $scroller.scrollerModule();
        //   $scroller.scrollerModule.destroy();
        // }

        console.groupEnd();
      }
  
    } 

  }

});


// reinit scroller
// if(self.scrollerModule != null){

//   self.scrollerModule.destroy();
//   self.scrollerModule = null;
// }





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
