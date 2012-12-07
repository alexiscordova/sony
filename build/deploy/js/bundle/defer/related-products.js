// ------------ Related Products Module ------------
// Module: HotSpot Explorer
// Version: 1.0
// Modified: 2012-11-26 by Tyler Madison, Glen Cheney
// Dependencies: jQuery 1.7+, Modernizr
// -------------------------------------------------------------------------

(function(window){
    'use strict';
    var sony = window.sony = window.sony || {};
    sony.modules = sony.modules || {};
})(window);

(function($, Modernizr, window, undefined) {
    
    'use strict';

    if(!$.rpModules) {
        $.rpModules = {};
    }

    var PX_REGEX = /px/gi;

    //start module
    var RelatedProducts = function(element, options){
      var t = this,
          ua = navigator.userAgent.toLowerCase(),
          i,
          browser = $.browser,
          isWebkit = browser.webkit,
          isAndroid = ua.indexOf('android') > -1;

          $.extend(t , $.fn.relatedProducts.defaults , options);

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
      t.$el = $(element);
      t.$slides = t.$el.find('.rpSlide');
      t.numSlides = t.$slides.length;
      t.$container = t.$el.find('.rpContainer').eq(0);
      t.sliderOverflow = t.$el.find('.rpOverflow').eq(0);
      t.previousId = -1;
      t.currentId = 0;
      t.slidePosition = 0;
      t.animationSpeed = 400; //ms
      t.slides = []; 
      t.slideCount = 0;
      t.isFreeDrag = false; //MODE: TODO
      t.currentContainerWidth = 0;
      t.doc = $(document);
      t.newSlideId = 0;
      t.sPosition = 0;
      t.accelerationPos = 0;
      t.maxWidth = parseInt(t.sliderOverflow.parent().css('maxWidth').replace(/px/gi , '') , 10);
      t.maxHeight = parseInt(t.sliderOverflow.parent().css('maxHeight').replace(/px/gi , '') , 10);
      t.resizeRatio = t.maxHeight / t.maxWidth; //target resize ratio


      //init plugins
      $.each($.rpModules, function (helper, opts) {
          opts.call(t);
      });

      console.log('Related Products - ' , t.numSlides , 'Max Width: ' , ( t.maxHeight / t.maxWidth) * 980);

      if('ontouchstart' in window || 'createTouch' in document) {
          t.hasTouch = true;
          t.downEvent = 'touchstart.rp';
          t.moveEvent = 'touchmove.rp';
          t.upEvent = 'touchend.rp';
          t.cancelEvent = 'touchcancel.rp';
          t.lastItemFriction = 0.5;
      } else {
          t.hasTouch = false;
          t.lastItemFriction = 0.2;
          
          //do we need this?
          if (browser.msie || browser.opera) {
              t.grabCursor = t.grabbingCursor = "move";
          } else if(browser.mozilla) {
              t.grabCursor = "-moz-grab";
              t.grabbingCursor = "-moz-grabbing";
          } else if(isWebkit && (navigator.platform.indexOf("Mac")!=-1)) {
              t.grabCursor = "-webkit-grab";
              t.grabbingCursor = "-webkit-grabbing";
          }
          
          //t.setGrabCursor(); //TODO: figure out cursor stuff on drag / touch
          
          t.downEvent = 'mousedown.rp';
          t.moveEvent = 'mousemove.rp';
          t.upEvent = 'mouseup.rp';
          t.cancelEvent = 'mouseup.rp';
      }

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

      t.$container.on(t.downEvent, function(e) { t.onDragStart(e); });   

      t.tapOrClick = function(){
        return t.hasTouch ? 'touchend' : 'click'; 
      }

      // resize // manual throttle / debounce
      var resizeTimer;
      $(window).on('resize', function() {  
          if(resizeTimer) {
              clearTimeout(resizeTimer);          
          }
          resizeTimer = setTimeout(function() { 
            t.updateSliderSize();
            t.updateSlides();
          }, t.throttleTime);          
      });

      //bind arrows 

      $('.rpArrow').on(t.tapOrClick() , function(){
        
        if($(this).hasClass('right')){
          console.log('clicked - right');
          t.currentId ++;
          if(t.currentId >= t.$slides.length){
            t.currentId = t.$slides.length - 1;
          }    
        }else{
          console.log('clicked - left');
           t.currentId --;

           if(t.currentId < 0){
            t.currentId = 0;
           }
        }

        t.moveTo();

      });

     function createNavigation(){
        var itemHTML = '<div class="rpNavItem rpBullet"></div>';
        
        t.controlNavEnabled = true;
        t.$container.addClass('rpWithBullets');
        var out = '<div class="rpNav rpBullets">';
        for(var i = 0; i < t.numSlides; i++) {
          out += itemHTML;
        }
        out += '</div>';
        out = $(out);
        t.controlNav = out;
        t.controlNavItems = out.children();
        t.$el.append(out);

        t.controlNav.on( t.tapOrClick() , function(e) {
          var item = $(e.target).closest('.rpNavItem');
          if(item.length) {
            t.currentId = item.index();
            t.moveTo();
          }
        }); 


        t.onNavUpdate(); 
        t.ev.on('rpOnUpdateNav' , $.proxy(t.onNavUpdate , t));     
      }

      if(t.navigationControl.toLowerCase() === 'bullets'){
        createNavigation();
      }

      //need to call this first before updating slide(s) positions
      t.updateSliderSize();  
      t.updateSlides();   


    };

    RelatedProducts.prototype = {
      onNavUpdate: function(){
        var t = this,
            currItem;

        if(t.prevNavItem) {
          t.prevNavItem.removeClass('rpNavSelected');
        }

        currItem = $(t.controlNavItems[t.currentId]);
        currItem.addClass('rpNavSelected');
        t.prevNavItem = currItem;
  
      },

      setGrabCursor:function() {     
          var t = this;
          if(!t.hasTouch) {
              if(t.grabbingCursor) {
                  t.sliderOverflow.css('cursor', t.grabbingCursor);
              } else {
                  t.sliderOverflow.removeClass('grab-cursor');
                  t.sliderOverflow.addClass('grabbing-cursor');   
              }   
          }
      },

      updateSliderSize: function(){
        var t = this;
        if(t.autoScaleContainer === true){
          t.$el.css('height' , t.resizeRatio * t.$el.width());
        }
      },

      onDragStart : function(e){
        var t = this,
            point;

        t.dragSuccess = false;

        console.log('drag start' , e.type);

        if(t.hasTouch){
          var touches = e.originalEvent.touches;
          if(touches && touches.length > 0){
            point = touches[0];
            if(touches.length > 1){
              t.multipleTouches = true; //not sure why we would care
            }
          }else{
            return;
          }
        }else{
          point = e;
          e.preventDefault();
          //console.log(point);
        }

        t.isDragging = true;

        t.doc.on(t.moveEvent , $.proxy(t.dragMove , t)).on(t.upEvent , $.proxy(t.dragRelease , t));

        t.currMoveAxis = '';
        t.hasMoved = false;
        t.pageX = point.pageX;
        t.pageY = point.pageY;

        t.startDragX = point.pageX;//

        t.startPagePos = t.accelerationPos =  point.pageX;

        t.horDir = 0;
        t.verDir = 0;

        t.currRenderPosition = t.sPosition;

        t.startTime = new Date().getTime();

        if(t.hasTouch) {
          t.sliderOverflow.on(t.cancelEvent, function(e) { t.dragRelease(e, isThumbs); });  
        }

        t.moveTo();


      },

      //%renderMovement
      renderMovement: function(point , isThumbs){
        var t = this;
        if(t.checkedAxis) {

          var timeStamp = t.renderMoveTime,
              deltaX = point.pageX - t.pageX,
              deltaY = point.pageY - t.pageY,
              newX = t.currRenderPosition + deltaX,
              newY = t.currRenderPosition + deltaY,
              isHorizontal = true,
              newPos = isHorizontal ? newX : newY,
              mAxis = t.currMoveAxis;

          t.hasMoved = true;
          t.pageX = point.pageX;
          t.pageY = point.pageY;

          //console.log( 'renderMovement' , newX );

          var pointPos = isHorizontal ? t.pageX : t.pageY;

          if(mAxis === 'x' && deltaX !== 0) {
              t.horDir = deltaX > 0 ? 1 : -1;
          } else if(mAxis === 'y' && deltaY !== 0) {
              t.verDir = deltaY > 0 ? 1 : -1;
          }
            
          var deltaPos = isHorizontal ? deltaX : deltaY;
          
          if(!t.loop) {
            if(t.currSlideId <= 0) {
              if(pointPos - t.startPagePos > 0) {
                  newPos = t.currRenderPosition + deltaPos * t.lastItemFriction;
              }
            }
            if(t.currSlideId >= t.numSlides - 1) {
              if(pointPos - t.startPagePos < 0) {
                  newPos = t.currRenderPosition + deltaPos * t.lastItemFriction ;
              }
            }
          }
           
          t.currRenderPosition = newPos;

          if (timeStamp - t.startTime > 200) {
            t.startTime = timeStamp;
            t.accelerationPos = pointPos;                       
          }

          //animate?
          t.setPosition(t.currRenderPosition);
        }        
      },

      setPosition: function(pos) {
        var t = this;
        var pos = t.sPosition = pos;

        if(t.useCSS3Transitions) {
          var animObj = {};
          animObj[ (t.vendorPrefix + t.TD) ] = 0 + 'ms';
          animObj[ t.xProp] = t.tPref1 + (pos + t.tPref2 + 0) + t.tPref3;
          t.$container.css(animObj);        

        } else {
          t.$container.css(t.xProp, pos);
        }
      },

      dragRelease: function(e, isThumbs){
        var t = this,
            totalMoveDist,
            accDist,
            duration,
            v0,
            newPos,
            newDist,
            newDuration,
            blockLink,
            point = {};


        t.renderMoveEvent = null;
        t.isDragging = false;
        t.lockAxis = false;
        t.checkedAxis = false;
        t.renderMoveTime = 0;

        cancelAnimationFrame(t.animFrame);

        //stop listening on the document for movement
        t.doc.off(t.moveEvent).off(t.upEvent);

        if(t.hasTouch) {
            t.sliderOverflow.off(t.cancelEvent);    
        }

        //t.dragSuccess = true;
        t.currMoveAxis = '';

        //t.setGrabCursor(); // remove grabbing hand
        var orient = true;

        if(!t.hasMoved) {
            return;
        }

        t.dragSuccess = true;
        t.currMoveAxis = '';

        function getCorrectSpeed(newSpeed) {
            if(newSpeed < 100) {
                return 100;
            } else if(newSpeed > 500) {
                return 500;
            } 
            return newSpeed;
        }
        function returnToCurrent(isSlow, v0) {
          var newPos = -t.currentId * t.currentContainerWidth,
          newDist = Math.abs(t.sPosition  - newPos);
          t.currAnimSpeed = newDist / v0;

          if(isSlow) {
              t.currAnimSpeed += 250; 
          }
          t.currAnimSpeed = getCorrectSpeed(t.currAnimSpeed);
          
          t.moveTo();
        }

        var snapDist = t.minSlideOffset,
            point = t.hasTouch ? e.originalEvent.changedTouches[0] : e,
            pPos = orient ? point.pageX : point.pageY,
            sPos = t.startPagePos,
            axPos = t.accelerationPos,
            axCurrItem = t.currSlideId,
            axNumItems = t.numSlides,
            dir = t.horDir,
            loop = t.loop,
            changeHash = false,
            distOffset = 0,
            dragDirection;
        
        totalMoveDist = Math.abs(pPos - sPos);

        dragDirection = t.startDragX > point.x ? 1 : 0;

        //TODO: touch is not generating the point.x on release
        //console.log(point);
        //console.log('When I started dragging I was here -->' , t.startDragX , 'Now I am here -->' , point.x  , dragDirection);

        accDist = pPos - axPos;

        duration = (new Date().getTime()) - t.startTime;
        v0 = Math.abs(accDist) / duration;

        console.log('MoveDst:' , totalMoveDist);

        if( totalMoveDist > Math.abs(t.currentContainerWidth * 0.5) ){
          
          if(dragDirection === 1){
            t.currentId ++;
            console.log('snap to next slide');
            if(t.currentId >= t.$slides.length){
              t.currentId = t.$slides.length - 1;
            } 
          }else{
            t.currentId --;
            console.log('snap to previous slide');
           if(t.currentId < 0){
            t.currentId = 0;
           }         
          }
          t.moveTo();
        }else{
          console.log('return to current slide');
          //return to current
          returnToCurrent(true, v0);
        }

        console.log('drag relase - ' , -t.currentId * t.currentContainerWidth , ' || ' , t.currRenderPosition);
      },  

      dragMove: function(e , isThumbs){
        var t = this,
            point;

        if(t.hasTouch) {
          if(t.lockAxis) {
              return;
          }   
          var touches = e.originalEvent.touches;
          if(touches) {
              if(touches.length > 1) {
                return;
              } else {
                point = touches[0]; 
              }
          } else {
            return;
          }
        } else {
          point = e;
        }

        if(!t.hasMoved) {
          if(t.useCSS3Transitions) {
              t.$container.css((t.vendorPrefix + t.TD), '0s');
          }
          (function animloop(){
            if(t.isDragging) {
              t.animFrame = requestAnimationFrame(animloop);
              if(t.renderMoveEvent){

                t.renderMovement(t.renderMoveEvent, isThumbs);
              }
                  
            }
              
          })();
        }
            
        if(!t.checkedAxis) {
          
          var dir = true,
              diff = (Math.abs(point.pageX - t.pageX) - Math.abs(point.pageY - t.pageY) ) - (dir ? -7 : 7);

          if(diff > 7) {
            // hor movement
            if(dir) {
              e.preventDefault();
              t.currMoveAxis = 'x';
            } else if(t.hasTouch) {
              //t.completeGesture();
              return;
            } 
            t.checkedAxis = true;
          } else if(diff < -7) {
            // ver movement
            if(!dir) {
              e.preventDefault();
              t.currMoveAxis = 'y';
            } else if(t.hasTouch) {
              //t.completeGesture();
              return;
            } 
            t.checkedAxis = true;
          }
          return;
        }
        
        e.preventDefault(); 
        t.renderMoveTime = new Date().getTime();
        t.renderMoveEvent = point;

        //console.log( new Date() ,t ,  ' t.ondragmove');
      },

      updateSlides: function(){
        var t = this,
            cw = t.currentContainerWidth = t.$container.outerWidth(),
            animObj = {};

        t.$slides.each(function(i){
          $(this).css('left', i * cw + 'px');  
        });

        //set containers over all position based on current slide
        //t.$container.css('' : '');
        animObj[ (t.vendorPrefix + t.TD) ] = t.animationSpeed * 0.25 + 'ms';
        animObj[ (t.vendorPrefix + t.TTF) ] = $.rpCSS3Easing[ 'easeInOutSine' ];
        animObj[ t.xProp ] = t.tPref1 + ((-t.currentId * cw) + t.tPref2 + 0) + t.tPref3;

        t.$container.css( animObj );  
      },

      moveTo: function(type,  speed, inOutEasing, userAction, fromSwipe){
        var t = this,
            newPos = -t.currentId * t.currentContainerWidth,
            diff,
            newId,
            animObj = {};

        if( !t.useCSS3Transitions ) {
          
          //jQuery fallback
          animObj[ t.xProp ] = newPos + 'px';
          t.$container.animate(animObj, t.animationSpeed, 'easeInOutSine');

        }else{

          //css3 transition
          animObj[ (t.vendorPrefix + t.TD) ] = t.animationSpeed + 'ms';
          animObj[ (t.vendorPrefix + t.TTF) ] = $.rpCSS3Easing[ 'easeInOutSine' ];
          
          t.$container.css( animObj );

          animObj[ t.xProp ] = t.tPref1 + (( newPos ) + t.tPref2 + 0) + t.tPref3;
  
          t.$container.css( animObj );  

        }

        //update the overall position
        t.sPosition = t.currRenderPosition = newPos;

        t.ev.trigger('rpOnUpdateNav');
      },

    };

    $.rpCSS3Easing = {
        //add additional ease types here
        easeOutSine: 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
        easeInOutSine: 'cubic-bezier(0.445, 0.050, 0.550, 0.950)'
    };

    //Usage: var tallest = $('div').maxHeight(); // Returns the height of the tallest div.
    $.fn.maxHeight = function(){
      var max = 0;
      this.each(function() {
        max = Math.max(max, $(this).height());
      });
      return max;
    };
    
    $.rpProto = RelatedProducts.prototype;

    //plugin definition
    $.fn.relatedProducts = function(options) {      
      var args = arguments;
      return this.each(function(){
        var t = $(this);
        if (typeof options === "object" ||  !options) {
          if( !t.data('relatedProducts') ) {
            sony.modules.m = new RelatedProducts(t, options);
            t.data('relatedProducts', sony.modules.m);
          }
        } else {
          var relatedProducts = t.data('relatedProducts');
          if (relatedProducts && relatedProducts[options]) {
              return relatedProducts[options].apply(relatedProducts, Array.prototype.slice.call(args, 1));
          }
        }
      });
    };

    //defaults for the related products    
    $.fn.relatedProducts.defaults = {
      throttleTime: 25,
      autoScaleContainer: true,
      minSlideOffset: 10,
      navigationControl: 'bullets'
    };

    $(function(){
      $('.related-products').relatedProducts({});
    });

 })(jQuery, Modernizr, window,undefined);

//Related Products Plugin/s / modes
(function($, Modernizr, window, undefined) {
    
    'use strict';

    $.extend($.rpProto, {
      _initPluginName: function(){
        var t = this;

      }
    });

    $.rpModules.pluginName = $.rpProto._initPluginName;

 })(jQuery, Modernizr, window,undefined);




// height: 445.40816326530614

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GLENS work
//
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/*
if ( !Exports ) {
  var Exports = {
    Modules : {}
  };
}


(function($, window, undefined) {

    var MasonryOverflow = function( $container, options ) {
        var self = this;

        $.extend(self, $.fn.masonryOverflow.options, options, $.fn.masonryOverflow.settings);

        self.$container = $container;
        self.originalWidth = self.$container.width();
        console.log( self.type );

        self.$container.width( self.getContainerWidth() );

        // 3610

        // var width = 0,
        //     colYs = [];
        // $container.children().each(function() {
        //   var $item = $(this),
        //   width += $item.outerWidth(true),

        //   //how many columns does this brick span
        //   colSpan = Math.ceil( width / self.shuffleColumns );
        //   console.log( colSpan );

        //   if ( colSpan === 1 ) {
        //       // if brick spans only one column, just like singleMode
        //       self._placeItem( $this, self.colYs, fn );
        //   } else {
        //       // brick spans more than one column
        //       // how many different places could this brick fit horizontally
        //       var groupCount = self.cols + 1 - colSpan,
        //           groupY = [],
        //           groupColY,
        //           i;

        //       // for each group potential horizontal position
        //       for ( i = 0; i < groupCount; i++ ) {
        //           // make an array of colY values for that one group
        //           groupColY = self.colYs.slice( i, i + colSpan );
        //           // and get the max value of the array
        //           groupY[i] = Math.max.apply( Math, groupColY );
        //       }

        //       self._placeItem( $this, groupY, fn );
        //   }
        // });

        // var width = 0;
        // $container.children().each(function() {
        //   var $item = $(this),
        //   itemWidth = $item.outerWidth(true);
        //   width += (itemWidth + 23);
        //   console.log(itemWidth, width);
        // });

        // width -= 23;

        // console.log( width / 2);

        // $container.width( width / 2 );

        self.shuffle = self.$container.shuffle({
          speed: self.shuffleSpeed,
          easing: self.shuffleEasing,
          columnWidth: self.shuffleColumns,
          gutterWidth: self.shuffleGutters
        }).data('shuffle');

        // Check to see how everything went.
        var lastCol = 0;
        for ( var i = 0, len = self.shuffle.colYs.length; i < len; i++) {
          var colY = self.shuffle.colYs[ i ];
          // if the previous column is bigger than the next, and we're not on the final column
          if ( lastCol > colY && i < len - 2 ) {
            // Columns don't line up perfectly
            self.extraSpace = (self.shuffle.columnWidth * (i + 1)) / 2;
            console.log('they dont line up', self.extraSpace, self.shuffle.colYs);
            self.$container.width( self.getContainerWidth() );
            self.shuffle.resized();
            break;
          }
          lastCol = colY;
        }

        self.isInitialized = true;
    };

    MasonryOverflow.prototype = {

        constructor: MasonryOverflow,

        getContainerWidth : function() {
          var self = this;
          return (self.originalWidth * self.slides) + ((self.slides - 1) * self.shuffleGutters) + self.extraSpace;
        }

    };

    // Plugin definition
    $.fn.masonryOverflow = function( opts ) {
        var args = Array.prototype.slice.apply( arguments );
        return this.each(function() {
            var $this = $(this),
                masonryOverflow = $this.data('masonryOverflow');

            // If we don't have a stored masonryOverflow, make a new one and save it
            if ( !masonryOverflow ) {
                masonryOverflow = new MasonryOverflow( $this, opts );
                $this.data( 'masonryOverflow', masonryOverflow );
            }

            if ( typeof opts === 'string' ) {
                masonryOverflow[ opts ].apply( masonryOverflow, args.slice(1) );
            }
        });
    };


    // Overrideable options
    $.fn.masonryOverflow.options = {
      slides: 2,
      shuffleSpeed: 400,
      shuffleEasing: 'cubic-bezier(0.165, 0.840, 0.440, 1.000)', // easeOutQuart
      shuffleColumns: {
        1470: 56,
        1112: 56,
        940: 60,
        724: 42
      },
      shuffleGutters: {
        1470: 40,
        1112: 40,
        940: 20,
        724: 20
      }
    };

    // Not overrideable
    $.fn.masonryOverflow.settings = {
      isInitialized: false,
      extraSpace: 0
    };

}(jQuery, window));

*/

/*
Exports.Modules.RelatedProducts = (function($) {

  var $container,


  _init = function() {
    $container = $('.rpSlide');
    
    $container.each(function() {
      var $this = $(this),
          data = $container.data();
      
      // Count up width of all items (+ margins?)

      // Divide by 2, add margins to each depending on number of elements?

      // Init shuffle
      $container.masonryOverflow({
        slides: 3,
        type: data.type,
        shuffleColumns: 204,
        shuffleGutters: 23
      });
      
    });

  };

  return {
    init: _init
  }; 

}(jQuery));

*/

/*$(document).ready(function() {

  if ( $('body').hasClass('related-products-module') ) {
    Exports.Modules.RelatedProducts.init();
  }
});*/