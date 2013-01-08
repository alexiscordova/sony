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
    sony.ev = sony.ev || $('<div />'); // events object
})(window);

(function($, Modernizr, window, undefined) {
    
    'use strict';

    if(!$.rpModules) {
        $.rpModules = {};
    }

    var PX_REGEX            = /px/gi,
        GALLERY_TILE_RATIOS = {
          large: 1.20172413793103,
          promo: 0.6053412462908,
          normal: 0.6053412462908
        }

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
      t.$galleryItems = $('.gallery-item');
      t.$galleryItems.each(function(){
        var $item = $(this);
        $item.data('slide' , $item.parent());
//        console.log("My Slide Parent »",$item);
      });
   

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
      t.win = $(window);
      t.newSlideId = 0;
      t.sPosition = 0;

      t.shuffleSpeed = 250;
      t.shuffleEasing = 'ease-out';

      //modes
      t.isMobileMode = false;
      t.isDesktopMode = false;
      t.isTabletMode = false;
      
      t.accelerationPos = 0;
      t.maxWidth = parseInt(t.sliderOverflow.parent().css('maxWidth'), 10);
      t.maxHeight = parseInt(t.sliderOverflow.parent().css('maxHeight'), 10);
      t.resizeRatio = t.maxHeight / t.maxWidth; //target resize ratio
      t.markup = t.$container.html();


      //init plugins
      $.each($.rpModules, function (helper, opts) {
          opts.call(t);
      });


      //TODO: remove this
      //$('body').css( { 'backgroundColor' : '#2e2e2e' } );


      console.log('Related Products - ' , t.numSlides , 'Max Width: ' , ( t.maxHeight / t.maxWidth) * 980);

      if(Modernizr.touch) {

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

      //init dragging , slideshow
      //t.$container.on(t.downEvent, function(e) { t.onDragStart(e); });   

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
            t.checkForBreakpoints();
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
        createPaddles();
      }


      function createPaddles(){

        var itemHTML = '<div class="paddle"></div>';
        
        t.paddlesEnabled = true;
        var out = '<div class="rpNav rpPaddles">';
        for(var i = 0; i < 2; i++) {
          out += itemHTML;
        }
        out += '</div>';
        out = $(out);

        $('.rpGrid').append(out);

        t.$paddles = $('.rpGrid').find('.paddle');
        t.$leftPaddle = t.$paddles.eq(0).addClass('left');
        t.$rightPaddle = t.$paddles.eq(1).addClass('right');

        t.$paddles.on(t.tapOrClick() , function(){
          var p = $(this);

          if(p.hasClass('left')){
            console.log('Left paddle click');

            t.currentId --;
            if(t.currentId < 0){
              t.currentId = 0;
            }

            t.moveTo();

          }else{
            console.log('Right paddle click');

            t.currentId ++;

            if(t.currentId >= t.$slides.length){
              t.currentId = t.$slides.length - 1;
            }

            t.moveTo();
          }

        });

/*        t.controlNav = out;
        t.controlNavItems = out.children();*/
        //

/*        t.controlNav.on( t.tapOrClick() , function(e) {
          var item = $(e.target).closest('.rpNavItem');
          if(item.length) {
            t.currentId = item.index();
            t.moveTo();
          }
        }); */


       // t.onNavUpdate(); 
       // t.ev.on('rpOnUpdateNav' , $.proxy(t.onNavUpdate , t));     
      }

      //need to call this first before updating slide(s) positions
/*      t.updateSliderSize();  
      t.updateSlides();  */ 

      

      var self = t;


      //loading
      //self.$grid.on('loading.shuffle', $.proxy( self.onShuffleLoading, self ));
      //self.$grid.on('done.shuffle', $.proxy( self.onShuffleDone, self ));

      // instantiate shuffle


      t.shuffleColumns = function( containerWidth ) {
          var column;

          console.log("Shuffle columns »", containerWidth + 'px');

          // Large desktop ( 6 columns )
/*          if ( Modernizr.mq('(min-width: 1200px)') ) {
            column = Exports.COLUMN_WIDTH_1200 * containerWidth;

          // Landscape tablet + desktop ( 5 columns )
          } else */
          if ( Modernizr.mq('(min-width: 980px)') ) {
            column = Exports.COLUMN_WIDTH * containerWidth; // ~18% of container width

          // Portrait Tablet ( 4 columns )
          // } else if ( Modernizr.mq('(min-width: 768px)') ) {
          //   column = Exports.COLUMN_WIDTH_768 * containerWidth;

          // Between Portrait tablet and phone ( 3 columns )
          } else if ( Modernizr.mq('(min-width: 481px)') ) {
            column = Exports.COLUMN_WIDTH_768 * containerWidth;

          // Phone ( 2 columns )
          } else {
            column = 0.48 * containerWidth; // 48% of container width
          }

          return column;
      };

      t.shuffleGutters = function( containerWidth ) {
        var gutter,
            numColumns = 0;

        // Large desktop ( 6 columns )
/*        if ( Modernizr.mq('(min-width: 1200px)') ) {
          gutter = Exports.GUTTER_WIDTH_1200 * containerWidth;
          numColumns = 5;

        // Landscape tablet + desktop ( 5 columns )
        } else*/

        if ( Modernizr.mq('(min-width: 980px)') ) {
          gutter = Exports.GUTTER_WIDTH * containerWidth;
          numColumns = 5;

        // // Portrait Tablet ( 4 columns ) - masonry
        } else if ( Modernizr.mq('(min-width: 768px)') ) {
          numColumns = 4;
          gutter = Exports.GUTTER_WIDTH_768 * containerWidth;

        // Between Portrait tablet and phone ( 3 columns )
        } else if ( Modernizr.mq('(min-width: 481px)') ) {
          gutter = Exports.GUTTER_WIDTH_768 * containerWidth;
          numColumns = 3;


        // Phone ( 2 columns )
        } else {
          gutter = 0.02 * containerWidth; // 2% of container width
          numColumns = 2;
        }

        self.setColumns(numColumns);

        return gutter;
      };

    t.shuffle = self.$slides.shuffle({
        itemSelector: '.gallery-item',
        speed: self.shuffleSpeed,
        easing: self.shuffleEasing,
        columnWidth: self.shuffleColumns,
        gutterWidth: self.shuffleGutters,
        showInitialTransition: true,
        buffer: 5
      }).data('shuffle');

      $(window).trigger('resize');

/*      $('.paddle').hide();
      $('.rpNav').hide();*/

      //TODO: dont actually do this
      $('.color-swatches').remove();

    };

    RelatedProducts.prototype = {

      setColumns : function( numColumns ) {

        return;

        var self = this,
            allSpans = 'span1 span2 span3 span4 span6',
            shuffleDash = 'shuffle-',
            gridClasses = [ shuffleDash+3, shuffleDash+4, shuffleDash+5, shuffleDash+6, 'grid-small' ].join(' '),
            itemSelector = '.gallery-item',
            grid5 = 'grid5',
            span = 'span',
            large = '.large',
            promo = '.promo',
            medium = '.medium',
            largeAndPromoAndMedium = large + ',' + promo + ',' + medium;

        // Large desktop ( 6 columns )
        if ( numColumns === 6 ) {
          if ( !self.$slides.hasClass(shuffleDash+6) ) {

            // add .grid5
            self.$slides
              .removeClass(gridClasses)
              .addClass(shuffleDash+6)
              .parent()
              .removeClass(grid5);


            self.$slides.children(itemSelector)
              .removeClass(allSpans) // Remove current grid span
              .filter(large) // Select large tiles
              .addClass(span+6) // Make them 6/12 width
              .end() // Go back to all items
              .filter(promo) // Select promo tiles
              .addClass(span+4) // Make them 4/12 width
              .end() // Go back to all items
              .not(largeAndPromoAndMedium) // Select tiles not large nor promo
              .addClass(span+2); // Make them 2/12 width
          }

        // Landscape tablet + desktop ( 5 columns )
        } else if ( numColumns === 5 ) {
          if ( !self.$slides.hasClass(shuffleDash+5) ) {

            // add .grid5
            self.$slides
              .removeClass(gridClasses)
              .addClass(shuffleDash+5)
              .parent()
              .addClass(grid5);


            self.$slides.children(itemSelector)
              .removeClass(allSpans) // Remove current grid span
              .filter(large) // Select large tiles
              .addClass(span+3) // Make them 3/5 width
              .end() // Go back to all items
              .filter(promo) // Select promo tiles
              .addClass(span+2) // Make them 2/5 width
              .end() // Go back to all items
              .not(largeAndPromoAndMedium) // Select tiles not large nor promo
              .addClass(span+1); // Make them 1/5 width
          }

        // Portrait Tablet ( 4 columns ) - masonry
        } else if ( numColumns === 4 ) {
          if ( !self.$slides.hasClass(shuffleDash+4) ) {

            // Remove .grid5
            self.$slides
              .removeClass(gridClasses)
              .addClass(shuffleDash+4)
              .parent()
              .removeClass(grid5);


            self.$slides.children(itemSelector)
              .removeClass(allSpans) // Remove current grid span
              .filter(largeAndPromoAndMedium) // Select large and promo tiles
              .addClass(span+6) // Make them half width
              .end() // Go back to all items
              .not(largeAndPromoAndMedium) // Select tiles not large nor promo
              .addClass(span+3); // Make them quarter width
          }

        // Between Portrait tablet and phone ( 3 columns )
        } else if ( numColumns === 3 ) {
          if ( !self.$slides.hasClass(shuffleDash+3) ) {

            // Remove .grid5, add .grid-small
            self.$slides
              .removeClass(gridClasses)
              .addClass(shuffleDash+3 + ' grid-small')
              .parent()
              .removeClass(grid5);

            // Remove current grid span
            self.$slides.children(itemSelector)
              .removeClass(allSpans)
              .addClass(span+4);
          }


        // Phone ( 2 columns )
        } else if ( numColumns === 2 ) {
          if ( !self.$slides.parent().hasClass(grid5) ) {

            // add .grid5
            self.$slides
              .removeClass(gridClasses)
              .parent()
              .addClass(grid5);
          }
        }
        return self;
      },      
/*      onShuffleLoading : function() {
        var $div = $('<div>', { 'class' : 'gallery-loader text-center' }),
            $img = $('<img>', { src: this.loadingGif });
        $div.append($img);
        $div.insertBefore(this.$grid);
      },

      onShuffleDone : function() {
        var self = this;
        setTimeout(function() {
          self.$container.find('.gallery-loader').remove();
          self.$container.addClass('in');
        }, 250);
      },*/
      checkForBreakpoints: function(){
        var t = this,
            wW = t.win.width(),
            view = wW > 768 ? 'desktop' : wW > 480 ? 'tablet' : 'mobile';

            switch(view){
              case 'desktop':
                t.isTabletMode = t.isMobileMode = false;

                t.$el.removeClass('rpTablet rpMobile')
                        .addClass('rpDesktop');

                t.goBackToDesktop();

                t.isDesktopMode = true;

                t.ev.trigger('ondesktopbreakpoint.rp');

              break;

              case 'tablet':

                if(t.isTabletMode === true){
                  return;
                }

                console.log("Are we in tablet mode? »", t.isTabletMode);

                t.isMobileMode = t.isDesktopMode = false;

                t.$el.removeClass('rpDesktop rpMobile')
                        .addClass('rpTablet');

                t.ev.trigger('ontabletbreakpoint.rp');

              break;

              case 'mobile':
                


                if(t.isMobileMode === true){
                  return;
                }

                

                t.isTabletMode = t.isDesktopMode = false;

                t.$el.removeClass('rpTablet rpDesktop')
                        .addClass('rpMobile');

                t.isMobileMode = true;

                t.ev.trigger('onmobilebreakpoint.rp');

              break;
            }
      },

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
        
        //handle resize for various layouts


        if(t.isTabletMode === true){

          //ratio based on comp around 768/922
          t.$el.css('height' , 1.2005208333 * t.$el.width());

          return;
        }


        t.$el.css('height' , (0.4977817214) * t.$el.width());
        
        if($(window).width() < 1085 && $(window).width() > 930){
          t.$el.css('height' , (0.4977817214 + 0.06) * t.$el.width());
        }else if($(window).width() < 930) {
          t.$el.css('height' , (0.4977817214 + 0.1) * t.$el.width());
        }

        //t.isTabletMode = true;

  
        //t.$el.css('height' , (0.80) * t.$el.width());

        return;

        if(t.autoScaleContainer === true){

          console.log('setting new height on container: ' , t.resizeRatio * t.$el.width() < 365);

          if(t.resizeRatio * t.$el.width() < 365 === true || t.isMobileMode === true){
              console.log('sorry max height reached');
               t.$el.css('height' , 365 + 'px');
              return;
          }
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

        iQ.update();

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
            pPos = point.pageX,
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

        dragDirection = t.startDragX > pPos ? 1 : 0;

        //TODO: touch is not generating the point.x on release
        //console.log(point);
        //console.log('When I started dragging I was here -->' , t.startDragX , 'Now I am here -->' , point.x  , dragDirection);

        accDist = pPos - axPos;

        duration = (new Date().getTime()) - t.startTime;
        v0 = Math.abs(accDist) / duration;

        console.log('MoveDst:' , totalMoveDist , t.currentContainerWidth * 0.5);

        if( totalMoveDist > t.hasTouch ? Math.abs(t.currentContainerWidth * 0.25) : Math.abs(t.currentContainerWidth * 0.5) ){
          
          //alert( totalMoveDist + ',' + t.hasTouch ? t.swipeThreshold : Math.abs(t.currentContainerWidth * 0.5));
         
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
          $(this).css({
            'left': i * cw + 'px',
            'z-index' : i
          });  

          //console.log("My new z-index »",$(this).css('zIndex'));
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

          //IQ Update
          t.$container.one($.support.transition.end , function(){
            window.iQ.update();
          });

        }

        //update the overall position
        t.sPosition = t.currRenderPosition = newPos;

        t.ev.trigger('rpOnUpdateNav');


        //console.log(t.ev , ' <---- events object');
      },

      goBackToDesktop: function(){
        var t = this;
        if(t.isDesktopMode === false){
          t.isDesktopMode = true;
          //t.$container.html(t.markup);
          //iQ.update();

/*          setTimeout(function(){
            $(window).trigger('resize');
            
          } , 1000);*/
            
          //t.scroller.destroy();  
          
          //t.scroller.disable();

          $('.container').removeClass('grid4').addClass('grid5');

          t.$galleryItems.each(function(){
            var item = $(this).removeClass('small-size'),
                slide = item.data('slide');

                item.appendTo(slide);
          });

          t.$container.css( 'width' , '' );
          t.$container.append(t.$slides);
          
          //t.$container.off('.rp');
          //restart listener for slideshow
          //t.$container.on(t.downEvent, function(e) { t.onDragStart(e); });
        

          $('.paddle').show();
          
          console.log('go back to desktop?');
        }
      }

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
            t.data('relatedProducts', new RelatedProducts(t, options));
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
      throttleTime: 10,
      autoScaleContainer: true,
      minSlideOffset: 10,
      navigationControl: 'bullets'  
    };

    $(function(){
      $('.related-products').relatedProducts({});
    });

 })(jQuery, Modernizr, window,undefined);

//Related Products Plugin/s / modes
//t.ev.on( 'onmobilebreakpoint.rp' , handleBreakpoint );


(function($, Modernizr, window, undefined) {
    
    'use strict';

    $.extend($.rpProto, {
      
      _initMobileBreakpoint: function(){
        var t = this;

        function handleBreakpoint(){


          
          console.log("OPERATE ON ME! I am in tablet / Mobile view.... »",true);

          // 1. step one  - cancel touch events for the 'slideshow'
          t.$container.off('.rp');

          // 2. hide paddles 
          $('.paddle').hide();

          $('.rpNav').hide();

          // 3. gather gallery items and save local reference - may need to set on t
          var galleryItems = $('.gallery-item').detach().addClass('small-size ');
          
          // 4. remove the slides
          t.$slides.detach();

          //5 . put the item back into the container
          galleryItems.appendTo(t.$container);
            
          // 6. set width of the container before initing the scroller module
          //t.$container.css( 'width' , 4750 + 'px' );

          // 7. init the scroller module
          setTimeout(function(){

            $('.rpOverflow').scrollerModule({
              contentSelector: '.rpContainer',
              itemElementSelector: '.gallery-item',
              mode: 'free',
              lastPageCenter: false,
              extraSpacing: 0
            }).data('scrollerModule');

            //t.scroller.enable();
            //iQ.update();

          }, 500);

          return;

          if(!!t.isMobileMode){ console.log("ALREADY IN MOBILE VIEW »", t.scroller); return false; } //if we are already in mobile exit

          t.isMobileMode = true;

          //do mobile stuff
          console.log('handling mobile view for the first time: ' , t.scroller === undefined);

          //$('.rpContainer').wrap('<div class="scroller" id="scrollerrp" />');

          //creat scroller instance / cache on parent of later toggle // :) !
            
          t.$container.off('.rp');

          $('.rpNav').hide();

          //unwrap HTML

          var items = $('.gallery-item').detach().addClass('small-size');
          
          $('.product-img' ).css('height' , '');

          items.css('height' , '').addClass('small-size');

          $('[class*="rpSlide"]').remove();

          items.appendTo(t.$container);

          //var $cache = $('.rpContainer').html();

          //cols.removeClass().appendTo(t.$container).addClass('whoa'); //insert these back in and add class for diff display

          //console.log("HOW MANY PRODUCTS WERE THERE? »", cols.length);

          //t.scroller.update(); //update item

          //updat container size based on now what is inside
          //t.$container.css( 'width' , (items.eq(0).outerWidth(true) * items.length) + 4750px + 'px' );
          t.$container.css( 'width' , 4750 + 'px' );

          console.log(t.$container.width());

/*          setTimeout(function(){
              t.scroller = $('.rpOverflow').scrollerModule({
              contentSelector: '.rpContainer',
              itemElementSelector: '.gallery-item',
              mode: 'free',
              snap: false,
              momentum: true,
              bounce: true
            }).data('scrollerModule');

            console.log("Scroller instance that was created »" , t.scroller);     
          } , 1000);*/

         $('.rpOverflow').scrollerModule({});


          //idea here is that we want to put the stuff back in as it was orginally
/*          t.ev.one('ondesktopbreakpoint.rp' , function(){

            setTimeout(function(){
              t.scroller.destroy();
              t.scroller = null;
              t.scroller = undefined;
              
              t.$container.css('width' , '100%');
              t.$container.html('');
              t.$container.html(t.markup); 
              t.$slides = t.$el.find('.rpSlide');
              t.$container.on(t.downEvent, function(e) { t.onDragStart(e); });

              $('.rpNav').show();

              //fire a resize event to reposition slides?
              $(window).trigger('resize');

              t.isMobileMode = false;

              //update container width
            }, 250);

          });*/

          //TODO: destroy this instance - t.iscroll.destroy();
          //t.iscroll = null;

/*          var myScroll = new iScroll('wrapper', {
            snap: true,
            momentum: false,
            hScrollbar: false,
            vScrollbar: true,
            onScrollEnd: function () {
              document.querySelector('#indicator > li.active').className = '';
              document.querySelector('#indicator > li:nth-child(' + (this.currPageX+1) + ')').className = 'active';
            }
           });*/
        }

        t.ev.on( 'onmobilebreakpoint.rp' , handleBreakpoint );
            
      }


    });

    $.rpModules.mobileBreakpoint = $.rpProto._initMobileBreakpoint;


 })(jQuery, Modernizr, window,undefined);


//
(function($, Modernizr, window, undefined) {

    'use strict';

    $.extend($.rpProto, {
      _initTabletBreakpoint: function(){
        var t = this;
        function handleBreakpoint() {

          console.log("RP Tablet breakpoint »");

          if(!!t.isTabletMode){ console.log("Already In Tablet VIEW »"); return false; } //if we are already in tablet exit

          t.isTabletMode = true;

          //hide paddles
          $('.paddle').hide();

          $('.container').removeClass('grid5').addClass('grid4');

          //unwrap HTML

          var items = $('.gallery-item')/*.detach()*/.addClass('tablet-size');
          
         /*$('.product-img' ).css('height' , '');
          items.css('height' , '').addClass('small-size');
          $('[class*="rpSlide"]').remove();
          items.appendTo(t.$container);*/

        }

        t.ev.on( 'ontabletbreakpoint.rp' , handleBreakpoint );
      }

    });
    $.rpModules.tabletBreakpoint = $.rpProto._initTabletBreakpoint;
  })(jQuery, Modernizr, window,undefined);


