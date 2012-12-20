// ------------ Sony One Carousel ------------
// Module: Sony One Carousel
// Version: 1.0
// Modified: 2012-12-19 by Tyler Madison
// Dependencies: jQuery 1.7+, Modernizr
// -------------------------------------------------------------------------

(function(window){
    'use strict';
    var sony = window.sony = window.sony || {};
    sony.modules = sony.modules || {};
    sony.ev = sony.ev || $('<div />'); // events object
})(window);

(function($, Modernizr, window, undefined) {
    
    'use strict';

    if(!$.socModules) {
        $.socModules = {};
    }

    var SonyOneCarousel = function(element, options){
      var t = this,
          ua = navigator.userAgent.toLowerCase(),
          i,
          browser = $.browser,
          isWebkit = browser.webkit,
          isAndroid = ua.indexOf('android') > -1,
          resizeTimer = null;

          $.extend(t , $.fn.sonyOneCarousel.defaults , options);

      t.isIPAD = ua.match(/(ipad)/);
      t.isIPHONE = ua.match(/(iphone)/); 

      // feature detection, some ideas taken from Modernizr
      var tempStyle = document.createElement('div').style,
          vendors = ['webkit','Moz','ms','O'],
          vendor = '',
          lastTime = 0,
          tempV;

      for (i = 0; i < vendors.length; i++ ) {
          tempV = vendors[i];
          if (!vendor && (tempV + 'Transform') in tempStyle ) {
              vendor = tempV;
          }
          tempV = tempV.toLowerCase();
          
          if(!window.requestAnimationFrame) {
              window.requestAnimationFrame = window[tempV+'RequestAnimationFrame'];
              window.cancelAnimationFrame = window[tempV+'CancelAnimationFrame'] 
                                 || window[tempV+'CancelRequestAnimationFrame'];
          }
      }

      // requestAnimationFrame polyfill by Erik Möller
      // fixes from Paul Irish and Tino Zijdel
      if (!window.requestAnimationFrame) {
          window.requestAnimationFrame = function(callback, element) {
              var currTime = new Date().getTime(),
                  timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                  id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
              lastTime = currTime + timeToCall;
              return id;
          };
      }

      if (!window.cancelAnimationFrame){
        window.cancelAnimationFrame = function(id) { clearTimeout(id); };
      }

      var bT = vendor + (vendor ? 'T' : 't' );
      
      t.useCSS3Transitions = ( (bT + 'ransform') in tempStyle ) && ( (bT + 'ransition') in tempStyle );
      
      if(t.useCSS3Transitions) {
          t.use3dTransform = (vendor + (vendor ? 'P' : 'p'  ) + 'erspective') in tempStyle;
      }
        
      vendor = vendor.toLowerCase();

      t.vendorPrefix = '-' + vendor + '-';

      t.ev = $({}); //event object
      t.resizeRatio = 0.4120689655;
      t.$el = $(element);
      t.$win = $(window);
      t.$container = t.$el.find('.ssContainer');
      t.$containerInner = t.$el.find('.ssContainer-inner');
      t.$slides = t.$el.find('.ssContent');
      t.$gridW = t.$el.find('.ss-grid').eq(0);

      t.numSlides  = t.$slides;
      t.previousId = -1;
      t.currentId = 0;
      t.slidePosition = 0;
      t.animationSpeed = 400; //ms
      t.slideCount = 0;
      t.isFreeDrag = false; //MODE: TODO
      t.currentContainerWidth = 0;
      t.newSlideId = 0;
      t.sPosition = 0;
      t.accelerationPos = 0;

      if(t.useCSS3Transitions) {

          // some constants for CSS3
          t.TP = 'transition-property';
          t.TD = 'transition-duration';
          t.TTF = 'transition-timing-function';

          t.yProp = t.xProp = t.vendorPrefix +'transform';

          if(t.use3dTransform) {
              if(isWebkit) {
                  t.$el.addClass('rpWebkit3d');
              }
              t.tPref1 = 'translate3d(';
              t.tPref2 = 'px, ';
              t.tPref3 = 'px, 0px)';
          } else {
              t.tPref1 = 'translate(';
              t.tPref2 = 'px, ';
              t.tPref3 = 'px)';
          }

          t.$container[(t.vendorPrefix + t.TP)] = (t.vendorPrefix + 'transform');
                  
      } else {
          t.xProp = 'left';
          t.yProp = 'top';
      }

      t.$win.on('resize.soc', function() {  
          if(resizeTimer) {
              clearTimeout(resizeTimer);          
          }
          resizeTimer = setTimeout(function() { 
              t._update();
              t._updateSlides();
              //do other stuff on window resize

          }, t.throttleTime);          
      });

      //set initial heights
      t.$win.trigger('resize.soc');
    }//

    SonyOneCarousel.prototype = {
      _update: function(){
        var t = this,
            cw = t.currentContainerWidth = t.$gridW.width(),
            newH = t.resizeRatio * cw + 'px';

        t.$container.css('height' , newH );
        t.$slides.css( 'height' ,  newH );

        console.log("Container set height »", t.$container.length , newH);
      },

      _updateSlides: function(){
        var t = this,
            cw = t.$gridW.width(),
            animObj = {};

        t.$slides.each(function(i){
          $(this).css({
            'left': i * cw + 'px',
            'z-index' : i
          });  

        });

       //set containers over all position based on current slide
        //t.$container.css('' : '');
        animObj[ (t.vendorPrefix + t.TD) ] = t.animationSpeed * 0.25 + 'ms';
        animObj[ (t.vendorPrefix + t.TTF) ] = $.rpCSS3Easing[ 'easeInOutSine' ];
        animObj[ t.xProp ] = t.tPref1 + ((-t.currentId * cw) + t.tPref2 + 0) + t.tPref3;

        t.$containerInner.css( animObj );
      },

      gotoSlide: function(slideIndx){
        var t = this;

        t.currentId = slideIndx;
        t.moveTo();

        return slideIndx;
      },

      m: function(xpos){
        var t = this,
            animObj = {};


        animObj[ (t.vendorPrefix + t.TD) ] = t.animationSpeed + 'ms';
        animObj[ (t.vendorPrefix + t.TTF) ] = $.rpCSS3Easing[ 'easeInOutSine' ];
        
        t.$containerInner.css( animObj );

        animObj[ t.xProp ] = t.tPref1 + (( xpos ) + t.tPref2 + 0) + t.tPref3;

        t.$containerInner.css( animObj );        
      },

      moveTo: function(type,  speed, inOutEasing, userAction, fromSwipe){
        var t = this,
            newPos = -t.currentId * t.$gridW.width(),
            diff,
            newId,
            animObj = {};

        if( !t.useCSS3Transitions ) {
          
          //jQuery fallback
          animObj[ t.xProp ] = newPos + 'px';
          t.$containerInner.animate(animObj, t.animationSpeed, 'easeInOutSine');

        }else{

          //css3 transition
          animObj[ (t.vendorPrefix + t.TD) ] = t.animationSpeed + 'ms';
          animObj[ (t.vendorPrefix + t.TTF) ] = $.rpCSS3Easing[ 'easeInOutSine' ];
          
          t.$containerInner.css( animObj );

          animObj[ t.xProp ] = t.tPref1 + (( newPos ) + t.tPref2 + 0) + t.tPref3;
  
          t.$containerInner.css( animObj );  

          console.log("MOVING? »", animObj);

          //IQ Update
          t.$containerInner.one($.support.transition.end , function(){
            window.iQ.update();
          });

        }

        //update the overall position
        t.sPosition = t.currRenderPosition = newPos;

        //t.ev.trigger('rpOnUpdateNav');


        //console.log(t.ev , ' <---- events object');
      },



    };


    $.fn.sonyOneCarousel = function(options) {      
      var args = arguments;
      return this.each(function(){
        var t = $(this);
        if (typeof options === "object" ||  !options) {
          if( !t.data('sonyOneCarousel') ) {
            t.data('sonyOneCarousel', new SonyOneCarousel(t, options));
          }
        } else {
          var sonyOneCarousel = t.data('sonyOneCarousel');
          if (sonyOneCarousel && sonyOneCarousel[options]) {
              return sonyOneCarousel[options].apply(sonyOneCarousel, Array.prototype.slice.call(args, 1));
          }
        }
      });
    };

    //defaults for the related products    
    $.fn.sonyOneCarousel.defaults = { 
      throttleTime: 10
    };



    $(function(){
      var c = window.c = $('.sony-one-carousel').sonyOneCarousel({}).data('sonyOneCarousel');



    });


 })(jQuery, Modernizr, window, undefined);


