// ------------ Sony One Carousel ------------
// Module: Sony One Carousel
// Version: 1.0
// Modified: 2012-12-20 by Tyler Madison
// Dependencies: jQuery 1.7+, Modernizr
// -------------------------------------------------------------------------
//TODO: when breaking apart slides store the first object in the current slide
//and figure out which starting slide to animate to after remanipulating the DOM
;( function( $, Modernizr, window, undefined ) {
    
    'use strict';

    if( !$.socModules ) {
      $.socModules = {}; //used for plugins
    }

    var console = window.console;

    var SonyOneCarousel = function( element , options ){
      var self      = this,
      ua            = navigator.userAgent.toLowerCase(),
      i,
      browser       = $.browser,
      isWebkit      = browser.webkit,
      isAndroid     = ua.indexOf( 'android' ) > -1,
      resizeTimer   = null;
    
      $.extend( self , $.fn.sonyOneCarousel.defaults , options , $.fn.sonyOneCarousel.settings );

      // feature detection, some ideas taken from Modernizr
      var tempStyle = document.createElement('div').style,
      vendors       = [ 'webkit','Moz','ms','O' ],
      vendor        = '',
      lastTime      = 0,
      tempV;

      for (i = 0; i < vendors.length; i++ ) {
        tempV = vendors[i];
        if ( !vendor && (tempV + 'Transform') in tempStyle ) {
            vendor = tempV;
        }
        tempV = tempV.toLowerCase();
        
        if( !window.requestAnimationFrame ) {
          window.requestAnimationFrame = window[ tempV+'RequestAnimationFrame' ];
          window.cancelAnimationFrame = window[ tempV+'CancelAnimationFrame' ] || window[ tempV+'CancelRequestAnimationFrame' ];
        }
      }

      // requestAnimationFrame polyfill by Erik Möller
      // fixes from Paul Irish and Tino Zijdel
      if ( !window.requestAnimationFrame ) {
        window.requestAnimationFrame = function( callback, element ) {
          var currTime = new Date().getTime(),
          timeToCall   = Math.max(0, 16 - ( currTime - lastTime )),
          id           = window.setTimeout( function() { callback(currTime + timeToCall); }, timeToCall );
          
          lastTime = currTime + timeToCall;
          
          return id;
        };
      }

      if (!window.cancelAnimationFrame){
        window.cancelAnimationFrame = function(id) { clearTimeout(id); };
      }

      var bT = vendor + ( vendor ? 'T' : 't' );
      
      self.useCSS3Transitions = ( ( bT + 'ransform' ) in tempStyle ) && ( ( bT + 'ransition' ) in tempStyle );
      
      if( self.useCSS3Transitions ) {
          self.use3dTransform = ( vendor + ( vendor ? 'P' : 'p'  ) + 'erspective' ) in tempStyle;
      }
        
      vendor = vendor.toLowerCase();

      self.vendorPrefix = '-' + vendor + '-';

      //jquery cached objects
      self.$el                   = $( element );
      self.$win                  = $( window );
      self.$doc                  = $( document );
      self.$container            = self.$el.find( '.soc-container' );
      self.$containerInner       = self.$el.find( '.soc-container-inner' );
      self.$slides               = self.$el.find( '.soc-content' );
      self.$gridW                = self.$el.find( '.soc-grid' ).eq(0);

      self.ev                    = $( {} ); //event object
      self.resizeRatio           = 0.4120689655;
      self.numSlides             = self.$slides.length;
      self.previousId            = -1;
      self.currentId             = 0;
      self.slidePosition         = 0;
      self.animationSpeed        = 700; //ms
      self.slideCount            = 0;
      self.currentContainerWidth = 0;
      self.newSlideId            = 0;
      self.sPosition             = 0;
      self.accelerationPos       = 0;

      //view mode variables set by breakpoint resize listener
      self.isDesktopMode = true; //we start off in this mode by default
      self.isTabletMode  = false;
      self.isMobileMode  = false;
      self.currentMode   = 'desktop'; //default

      //slide collections change as window modes change
      self.$desktopSlides = $();
      self.$tabletSlides = $();
      self.$mobileSlides = $();

      self.$desktopSlides = self.$slides;
      self.originalSlideCount = self.$desktopSlides.length;

      //store a referece to the orginal slide
      self.$slides.each(function(i){
        var $this = $(this),
        $item     = null; 

        $this.find('.soc-item').each(function(j){
          $item = $(this);
          $item.data('slideGroupId' , i);
        });
      
      });

      //figure out what events to use
      if('ontouchstart' in window || 'createTouch' in document) {
        self.hasTouch = true;
        self.downEvent = 'touchstart.soc';
        self.moveEvent = 'touchmove.soc';
        self.upEvent = 'touchend.soc';
        self.cancelEvent = 'touchcancel.soc';
        self.lastItemFriction = 0.5;        
      }else{
        self.hasTouch = false;
        self.lastItemFriction = 0.2;
        self.downEvent = 'mousedown.soc';
        self.moveEvent = 'mousemove.soc';
        self.upEvent = 'mouseup.soc';
        self.cancelEvent = 'mouseup.soc';
      }

      if( self.useCSS3Transitions ) {

        // some constants for CSS3
        self.TP = 'transition-property';
        self.TD = 'transition-duration';
        self.TTF = 'transition-timing-function';

        self.yProp = self.xProp = self.vendorPrefix + 'transform';

        if( self.use3dTransform ) {
          if( isWebkit ) {
              self.$el.addClass( 'soc-webkit3d' );
          }
          self.tPref1 = 'translate3d(';
          self.tPref2 = 'px, ';
          self.tPref3 = 'px, 0px)';
        } else {
          self.tPref1 = 'translate(';
          self.tPref2 = 'px, ';
          self.tPref3 = 'px)';
        }

        self.$container[ ( self.vendorPrefix + self.TP ) ] = ( self.vendorPrefix + 'transform' );
                  
      } else {
        self.xProp = 'left';
        self.yProp = 'top';
      }

      self.$win.on( 'resize.soc', function() {  
        if( resizeTimer ) {
          clearTimeout( resizeTimer );          
        }
        resizeTimer = setTimeout( function() { 
          self.checkForBreakPoint();
          self.update();
          self.updateSlides();
          //do other stuff on window resize
        }, self.throttleTime );          
      });

      self.tapOrClick = function(){
        return self.hasTouch ? 'touchend' : 'click'; 
      };

      self.ev.on( 'socOnUpdateNav', function() {
        var id = self.currentId,
        currItem,
        prevItem;

        if(self.prevNavItem) {
          self.prevNavItem.removeClass('soc-nav-selected');
        }
        currItem = $(self.controlNavItems[id]);

        currItem.addClass('soc-nav-selected');
        self.prevNavItem = currItem;
        
      } );

      self.$containerInner.on(self.downEvent, function(e) { self.onDragStart(e); });


      self.createNavigation();

      self.$win.trigger( 'resize.soc' );

      window.slideId = self.getCurrentSlideByItemId;

      //self.checkForBreakPoint();
    };

    SonyOneCarousel.prototype = {
      constructor: SonyOneCarousel,

      onDragStart : function(e){
        var self = this,
        point;

        self.dragSuccess = false;

        if(self.hasTouch){
          var touches = e.originalEvent.touches;
          if(touches && touches.length > 0){
            point = touches[0];
            if(touches.length > 1){
              self.multipleTouches = true; //not sure why we would care
            }
          }else{
            return;
          }
        }else{
          point = e;
          e.preventDefault();
        }

        self.isDragging = true;

        self.$doc.on( self.moveEvent , $.proxy( self.dragMove , self ) ).on( self.upEvent , $.proxy( self.dragRelease , self ) );

        self.currMoveAxis = '';
        self.hasMoved = false;
        self.pageX = point.pageX;
        self.pageY = point.pageY;

        self.startDragX = point.pageX;

        self.startPagePos = self.accelerationPos =  point.pageX;

        self.horDir = 0;

        self.currRenderPosition = self.sPosition;

        self.startTime = new Date().getTime();

        if(self.hasTouch) {
          self.$container.on(self.cancelEvent, function(e) { self.dragRelease(e, false); });
        }

        self.moveTo();

      },
      dragRelease: function(e){
        var self = this,
            totalMoveDist,
            accDist,
            duration,
            v0,
            newPos,
            newDist,
            newDuration,
            blockLink;

        self.renderMoveEvent = null;
        self.isDragging = false;
        self.lockAxis = false;
        self.checkedAxis = false;
        self.renderMoveTime = 0;

        window.cancelAnimationFrame(self.animFrame);

        //stop listening on the document for movement
        self.$doc.off( self.moveEvent ).off( self.upEvent );

        if( self.hasTouch ) {
          self.$container.off( self.cancelEvent );
        }

        //t.dragSuccess = true;
        self.currMoveAxis = '';

        //t.setGrabCursor(); // remove grabbing hand
        var orient = true;

        if(!self.hasMoved) {
            return;
        }

        self.dragSuccess = true;
        self.currMoveAxis = '';

        function getCorrectSpeed(newSpeed) {
            if(newSpeed < 100) {
                return 100;
            } else if(newSpeed > 500) {
                return 500;
            } 
            return newSpeed;
        }
        function returnToCurrent(isSlow, v0) {
          var newPos         = -self.currentId * self.currentContainerWidth,
          newDist            = Math.abs( self.sPosition  - newPos );
          
          self.currAnimSpeed = newDist / v0;

          if(isSlow) {
            self.currAnimSpeed += 250; 
          }
          self.currAnimSpeed = getCorrectSpeed( self.currAnimSpeed );
          
          self.moveTo();
        }

        var snapDist = self.minSlideOffset,
        point        = self.hasTouch ? e.originalEvent.changedTouches[0] : e,
        pPos         = point.pageX,
        sPos         = self.startPagePos,
        axPos        = self.accelerationPos,
        axCurrItem   = self.currSlideId,
        axNumItems   = self.numSlides,
        dir          = self.horDir,
        loop         = self.loop,
        changeHash   = false,
        distOffset   = 0,
        dragDirection,
        //This makes sure depending on mode we use the right slide collection!
        $currSlides = (self.isDesktopMode ? self.$desktopSlides :
                      self.isTabletMode ? self.$tabletSlides : self.$mobileSlides);
        
        totalMoveDist = Math.abs(pPos - sPos);

        dragDirection = self.startDragX > pPos ? 1 : 0;

        accDist = pPos - axPos;

        duration = (new Date().getTime()) - self.startTime;
        v0 = Math.abs(accDist) / duration;

        console.log('MoveDst:' , totalMoveDist , self.currentContainerWidth * 0.5);

        if( totalMoveDist > self.hasTouch ? Math.abs(self.currentContainerWidth * 0.25) : Math.abs(self.currentContainerWidth * 0.5) ){
         
          if(dragDirection === 1){
            self.currentId ++;
            console.log('snap to next slide');
            if(self.currentId >= $currSlides.length){
              self.currentId = $currSlides.length - 1;
            }
          }else{
            self.currentId --;
            console.log('snap to previous slide');
           if(self.currentId < 0){
            self.currentId = 0;
           }         
          }
          self.moveTo();
        }else{
          console.log('return to current slide');
          //return to current
          returnToCurrent(true, v0);
        }

        console.log('drag relase - ' , -self.currentId * self.currentContainerWidth , ' || ' , self.currRenderPosition);

      },

      dragMove: function( e ){
        var self = this,
        point;

        if( self.hasTouch ) {
          if( self.lockAxis ) {
              return;
          }   
          var touches = e.originalEvent.touches;
          if( touches ) {
              if( touches.length > 1 ) {
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

        if( !self.hasMoved ) {
          if( self.useCSS3Transitions ) {
              self.$container.css((self.vendorPrefix + self.TD), '0s');
          }
          (function animloop(){
            if( self.isDragging ) {
              self.animFrame = window.requestAnimationFrame(animloop);
              if(self.renderMoveEvent){
                self.renderMovement(self.renderMoveEvent);
              }
            }
          })();
        }
            
        if( !self.checkedAxis ) {
          
          var dir = true,
          diff    = (Math.abs(point.pageX - self.pageX) - Math.abs(point.pageY - self.pageY) ) - (dir ? -7 : 7);

          if(diff > 7) {
            // hor movement
            if(dir) {
              e.preventDefault();
              self.currMoveAxis = 'x';
            } else if(self.hasTouch) {
              //t.completeGesture();
              return;
            } 
            self.checkedAxis = true;
          } else if(diff < -7) {
            // ver movement
            if(!dir) {
              e.preventDefault();
              self.currMoveAxis = 'y';
            } else if(self.hasTouch) {
              //t.completeGesture();
              return;
            }      
            self.checkedAxis = true;
          }
          return;
        }
        
        e.preventDefault(); 
        self.renderMoveTime = new Date().getTime();
        self.renderMoveEvent = point;

        //console.log( new Date() ,t ,  ' t.ondragmove');
      },
      renderMovement: function(point , isThumbs){
        var self = this;
        if(self.checkedAxis) {

          var timeStamp = self.renderMoveTime,
              deltaX = point.pageX - self.pageX,
              deltaY = point.pageY - self.pageY,
              newX = self.currRenderPosition + deltaX,
              newY = self.currRenderPosition + deltaY,
              isHorizontal = true,
              newPos = isHorizontal ? newX : newY,
              mAxis = self.currMoveAxis;

          self.hasMoved = true;
          self.pageX = point.pageX;
          self.pageY = point.pageY;

          //console.log( 'renderMovement' , newX );

          var pointPos = self.pageX;

          if(mAxis === 'x' && deltaX !== 0) {
              self.horDir = deltaX > 0 ? 1 : -1;
          } else if(mAxis === 'y' && deltaY !== 0) {
              self.verDir = deltaY > 0 ? 1 : -1;
          }
            
          var deltaPos = isHorizontal ? deltaX : deltaY;
          
          if(!self.loop) {
            if(self.currSlideId <= 0) {
              if(pointPos - self.startPagePos > 0) {
                newPos = self.currRenderPosition + deltaPos * self.lastItemFriction;
              }
            }
            if(self.currSlideId >= self.numSlides - 1) {
              if(pointPos - self.startPagePos < 0) {
                newPos = self.currRenderPosition + deltaPos * self.lastItemFriction ;
              }
            }
          }
           
          self.currRenderPosition = newPos;

          if ( timeStamp - self.startTime > 200 ) {
            self.startTime = timeStamp;
            self.accelerationPos = pointPos;
          }

          //animate?
          self.setPosition(self.currRenderPosition);
        }
      },

      setPosition: function(posi) {

        window.iQ.update();

        var self = this,
        pos      = self.sPosition = posi;

        if(self.useCSS3Transitions) {
          var animObj = {};
          animObj[ (self.vendorPrefix + self.TD) ] = 0 + 'ms';
          animObj[ self.xProp] = self.tPref1 + (pos + self.tPref2 + 0) + self.tPref3;
          self.$containerInner.css(animObj);

        } else {
          self.$containerInner.css(self.xProp, pos);
        }
      },
      
      moveTo: function(force){
        var self = this,
        newPos   = -self.currentId * self.currentContainerWidth,
        diff,
        newId,
        animObj  = {};
        
        if(self.currentId !== 0){
          self.$gridW = self.$el.find('.soc-grid' ).eq(0);
          newPos -= (window.Exports.GUTTER_WIDTH_SLIM * self.$gridW.width()) * self.currentId;
        }

            
        if(self.isMobileMode === true){
          var delta = (self.$el.find('.soc-content').eq(0).width() - self.$el.find('.soc-item').eq(0).width()) / 2;
          newPos += delta - (self.currentId * 10);
        }

        if( !self.useCSS3Transitions ) {
          
          //jQuery fallback
          animObj[ self.xProp ] = newPos + 'px';
          self.$containerInner.animate(animObj, (force === true ? 10 : self.animationSpeed), 'easeInOutSine');

        }else{

          //css3 transition
          animObj[ (self.vendorPrefix + self.TD) ] = (force === true ? 10 : self.animationSpeed) + 'ms';
          animObj[ (self.vendorPrefix + self.TTF) ] = $.socCSS3Easing.easeInOutSine;
          
          self.$containerInner.css( animObj );

          animObj[ self.xProp ] = self.tPref1 + (( newPos ) + self.tPref2 + 0) + self.tPref3;
  
          self.$containerInner.css( animObj );

          //IQ Update
          self.$containerInner.one($.support.transition.end , function(){
            window.iQ.update();
          });

        }

        //update the overall position
        self.sPosition = self.currRenderPosition = newPos;

        self.ev.trigger('socOnUpdateNav');
      },

      update: function(){
        var self = this,
        cw       = self.currentContainerWidth = self.$gridW.width(),
        newH     = self.resizeRatio * cw + 'px',
        $currSlides = (self.isDesktopMode ? self.$desktopSlides : self.isTabletMode ? self.$tabletSlides : self.$mobileSlides);

        if(self.isDesktopMode || self.isTabletMode){
          self.$container.css( 'height' , newH );
          $currSlides.css( 'height' ,  newH );
        }else{ 
          newH = $('.soc-item').eq(0).height();
          self.$container.css( 'height' ,  newH  + 'px' );
        }
        //console.log("Updating 'soc-container'.height to »",newH );
      },

      shuffleClasses: function(){
        var self     = this,
        mode         = self.currentMode.toLowerCase(),
        allSpans     = 'span4 span6 span8 span12',
        itemSelector = '.soc-item',
        oneUp        = '.soc-1up',
        twoUp        = '.soc-2up',
        threeUp      = '.soc-3up';

        //console.log("Current Mode »", mode);

        switch(mode){
          case 'desktop':

            self.$desktopSlides
            .find(itemSelector)
            .removeClass(allSpans)
            .filter(oneUp).addClass('span4')
            .end()
            .filter(twoUp).addClass('span6')
            .end()
            .filter(threeUp).addClass('span8');
            
          break;

          case 'tablet':
            //get all the spans off and add
            self.$tabletSlides
            .find(itemSelector)
            .removeClass(allSpans)
            .filter(oneUp).addClass('span6')
            .end()
            .filter(twoUp).addClass('span6')
            .end()
            .filter(threeUp).addClass('span6');

          break;

          case 'mobile':
            //something entirely different here
            self.$mobileSlides
            .find(itemSelector)
            .removeClass(allSpans)
            .addClass('span12');
          break;

        }

      },

      checkForBreakPoint: function(){
        var self = this,
        wW = self.$win.width(),
        view = wW > 769 ? 'desktop' : wW > 481 ? 'tablet' : 'mobile',
        lastView = self.currentMode;

        switch(view){
          case 'desktop':
            //handle desktop
            if(self.isDesktopMode){ return; }
            self.isMobileMode = self.isTabletMode = false;
            self.isDesktopMode = true;
            self.currentMode = view;

            self.resizeRatio = 0.4120689655;
            self.createDesktopSlides(lastView);
            self.shuffleClasses();

          break;

          case 'tablet':
            //handle tablet
            if(self.isTabletMode){ return; }
            self.isMobileMode = self.isDesktopMode = false;
            self.isTabletMode = true;
            self.currentMode = view;

            self.resizeRatio = 0.64615384615385;
            self.createTableSlides(lastView);
            self.shuffleClasses();

          break;

          case 'mobile':
            //handle mobile
            if(self.isMobileMode){ return; }
            self.isTabletMode = self.isDesktopMode = false;
            self.isMobileMode = true;
            self.currentMode = view;

            self.resizeRatio = 1.33574007220217;
            self.createMobileSlides(lastView);
            self.shuffleClasses();
          
          break;
        }

        //do other stuff here
      },

      createDesktopSlides: function(lastView){
        var self = this;

        var $lastItem = null;

        switch(lastView){
          case 'desktop':
            $lastItem = self.$desktopSlides.eq(self.currentId).find('.soc-item').first();
          break;

          case 'tablet':
            $lastItem = self.$tabletSlides.eq(self.currentId).find('.soc-item').first();
          break;

          case 'mobile':
            $lastItem = self.$mobileSlides.eq(self.currentId).find('.soc-item').first();
          break;

        }

        // 1. grab all of the gallery items
        self.$galleryItems = $('.soc-item').detach();

        //2. remove the slides from desktop / mobile
        self.$tabletSlides.remove();
        self.$mobileSlides.remove();

        var slideCount = 0;

        var processItem = function(j){
          var $item = $(this);

          if($item.data('slideGroupId') === i){
            $item.appendTo($gridDiv);
          }

        };

        for (var i = 0; i < self.originalSlideCount; i ++) {
          
            var $contentDiv = $('<div class="soc-content" />'),
            $gridDiv        = $('<div class="soc-grid slimgrid" />'),
            $item           = null;

            self.$galleryItems.each(processItem);
            
            $gridDiv.appendTo($contentDiv);
            $contentDiv.appendTo(self.$containerInner);
        }

        self.$desktopSlides = self.$container.find('.soc-content');

        self.numSlides = self.$desktopSlides.length;

        self.createNavigation();
        self.currentId = self.getCurrentSlideByItemId($lastItem);
        self.$win.trigger('resize.soc');

        //console.log("Modile Slides are now cached up »" , self.numSlides);
      },

      createTableSlides: function(lastView){
        var self = this;

        var $lastItem = null;

        switch(lastView){
          case 'desktop':
            $lastItem = self.$desktopSlides.eq(self.currentId).find('.soc-item').first();
          break;

          case 'tablet':
            $lastItem = self.$tabletSlides.eq(self.currentId).find('.soc-item').first();
          break;

          case 'mobile':
            $lastItem = self.$mobileSlides.eq(self.currentId).find('.soc-item').first();
          break;

        }

        // 1. grab all of the gallery items
        self.$galleryItems = $('.soc-item').detach();

        //2. remove the slides from desktop / mobile
        self.$desktopSlides.remove();
        self.$mobileSlides.remove();
  
        var slideCount = 0,
        galLen = self.$galleryItems.length;
          
        var createSlide = function(i,orphaned){
          var $contentDiv = $('<div class="soc-content" />'),
          $gridDiv        = $('<div class="soc-grid slimgrid" />'),
          $item1          = self.$galleryItems.eq(i-1),
          $item2          = self.$galleryItems.eq(i);

          if(orphaned === true){
            $item1 = self.$galleryItems.eq(i);
            $item2 = $();
          }

          $gridDiv.appendTo($contentDiv);

          if($item1.length > 0){
            $item1.appendTo($gridDiv);
          }
          
          if($item2.length > 0){
            $item2.appendTo($gridDiv);
          }

          $contentDiv.appendTo(self.$containerInner);

          slideCount++;
        };

        for (var i = 0; i < galLen; i ++) {

          if(i%2){
            createSlide(i,false);
          }

          if(i === galLen - 1 && galLen > slideCount * 2){
            //console.log("You have an orphaned element that needs a slide by itself");
            createSlide(i,true);
          }
        }

        self.$tabletSlides = self.$container.find('.soc-content');

        self.numSlides = self.$tabletSlides.length;

        self.createNavigation();

        self.currentId = self.getCurrentSlideByItemId($lastItem);

        self.$win.trigger('resize.soc');

        //console.log("Modile Slides are now cached up »" , self.numSlides);
      },
      
      createMobileSlides: function(lastView){
        var self = this;

        var $lastItem = null;

        switch(lastView){
          case 'desktop':
            $lastItem = self.$desktopSlides.eq(self.currentId).find('.soc-item').first();
          break;

          case 'tablet':
            $lastItem = self.$tabletSlides.eq(self.currentId).find('.soc-item').first();
          break;

          case 'mobile':
            $lastItem = self.$mobileSlides.eq(self.currentId).find('.soc-item').first();
          break;

        }

        // 1. grab the gallery items
        self.$galleryItems = $('.soc-item').detach();
        
        //2. remove the slides from desktop / tablet
        self.$desktopSlides.remove();
        self.$tabletSlides.remove();

        for (var i = 0; i < self.$galleryItems.length; i ++) {
          var $contentDiv = $('<div class="soc-content" />'),
          $gridDiv        = $('<div class="soc-grid slimgrid" />'),
          $item           = self.$galleryItems.eq(i);

          //$gridDiv.appendTo($contentDiv);
          $item.appendTo($contentDiv);

          $contentDiv.appendTo(self.$containerInner);
        }

        
        self.$mobileSlides = self.$container.find('.soc-content');

        self.numSlides = self.$mobileSlides.length;

        self.createNavigation();
        self.currentId = self.getCurrentSlideByItemId($lastItem);
        self.$win.trigger('resize.soc');

        //console.log("Modile Slides are now cached up »" , self.numSlides);

      },

      createNavigation: function (){
        var self = this,
        itemHTML = '<div class="soc-nav-item soc-bullet"></div>',
        out          = '<div class="soc-nav soc-bullets">';
        
        //remove other references
        $('.soc-nav.soc-bullets').remove();

        //reset current slide id
        self.currentId = 0;

        //self.controlNavEnabled = true;
        //self.$container.addClass('ssWithBullets');
        for(var i = 0; i < self.numSlides; i++) {
          out += itemHTML;
        }
        out += '</div>';
        out = $( out );
        self.controlNav = out;
        self.controlNavItems = out.children();
        self.$el.append( out );

        self.controlNav.on( self.tapOrClick() , function( e ) {
          var item = $(e.target).closest( '.soc-nav-item' );
          if( item.length ) {
            self.currentId = item.index();
            self.moveTo();
            //console.log("Current Slide ID # »",self.currentId);
          }
        } );

        self.ev.trigger( 'socOnUpdateNav' );

      },

      getCurrentSlideByItemId: function($socItem){
        var self = this,
            $slide = null;

        $slide = $socItem.closest('.soc-content');

        console.log('Slide Index »',$slide.index());

        if(self.isDesktopMode){
          //




        }else if(self.isTabletMode){
          //


        }else if(self.isMobileMode){
          //


        }

        return $slide.index();

      },

      updateSlides: function(){
        var self = this,
        cw       = 0,
        animObj  = {},
        mobileGutter = 10,
        gutterWidth = 0;

        if(self.isDesktopMode === true){
          //console.log(" »",);
          self.$gridW = self.$el.find( '.soc-grid' ).eq(0);
          
          self.$desktopSlides.each(function(i){
            cw = self.$gridW.width();
            gutterWidth = window.Exports.GUTTER_WIDTH_SLIM * cw;
            if(i > 0){
              cw += gutterWidth;
            // console.log('New Gutter for slide »',gutterWidth);
            }

            $(this).css( { 'left': i * cw + 'px', 'z-index' : i } );
          });
        }

        if(self.isTabletMode === true){
          self.$gridW = self.$el.find( '.soc-grid' ).eq(0);
          
          self.$tabletSlides.each(function(i){
            cw = self.$gridW.width();
            gutterWidth = window.Exports.GUTTER_WIDTH_SLIM * cw;
            
            if(i > 0){
              cw += gutterWidth;
              console.log('New Gutter for slide »',self.$gridW.width() , gutterWidth);
            }

            $(this).css({
              'left': i * cw + 'px',
              'height' : $('.soc-item').eq(0).height()  + 'px',
              'z-index' : i
            });

            $(this).find('.soc-item').css({
              'position': '',
              'top' : '',
              'left' : ''
            });
          });

          //console.log("updating slides in tbalet mode »");

        }

        if(self.isMobileMode === true){
          //console.log("Starting - Placing items for mobile mode »");
          cw = self.currentContainerWidth = $('.soc-item').eq(0).width();
          self.$mobileSlides.each(function(i){
            //$(this).css( { 'left': (i * 286) + (i === 0 ? 10 : 0) + 'px', 'z-index' : i } );
            $(this).css( {
              'left': i * (cw + mobileGutter) + 'px',
              'height' : 370  + 'px', //TODO: this is not calculating correctly -->  $('.soc-item').eq(0).height();
              'z-index' : i
            } );

            var delta = ($('.soc-content').eq(0).width() - $('.soc-item').eq(0).width()) / 2;

            $(this).find('.soc-item').css({
              'position': 'absolute',
              'top' : '0',
              //  'left' : ($('.soc-content').eq(0).width() - $('.soc-item').eq(0).width()) - delta + 'px',
              'left' : '0'
            });
          });

          //console.log("Finished - Placing items for mobile mode »" , $('.soc-item').eq(0).height());
        }


        //make sure it updates position based on current slide index
        self.moveTo(true);

       //set containers over all position based on current slide
        /*        animObj[ ( self.vendorPrefix + self.TD ) ] = self.animationSpeed * 0.25 + 'ms';
        animObj[ ( self.vendorPrefix + self.TTF ) ] = $.socCSS3Easing[ 'easeInOutSine' ];
        animObj[ self.xProp ] = self.tPref1 + ( ( -self.currentId * cw ) + self.tPref2 + 0 ) + self.tPref3;
        self.$containerInner.css( animObj );*/
      },

      gotoSlide: function(slideIndx){
        var self = this;

        self.currentId = slideIndx;
        self.moveTo();

        return slideIndx;
      },

      m: function(xpos){
        var self = this,
        animObj  = {};

        animObj[ ( self.vendorPrefix + self.TD ) ] = self.animationSpeed + 'ms';
        animObj[ ( self.vendorPrefix + self.TTF ) ] = $.socCSS3Easing.easeInOutSine;
        self.$containerInner.css( animObj );
        animObj[ self.xProp ] = self.tPref1 + ( ( xpos ) + self.tPref2 + 0 ) + self.tPref3;
        self.$containerInner.css( animObj );
      }
    };

    $.socCSS3Easing = {
        //add additional ease types here
        easeOutSine: 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
        easeInOutSine: 'cubic-bezier(0.445, 0.050, 0.550, 0.950)'
    };

    $.fn.sonyOneCarousel = function( options ) {
      var args = Array.prototype.slice.call( arguments, 1 );
      return this.each( function() {
        var self   = $(this),
        moduleName = self.data( 'sonyOneCarousel' );
    
        // If we don't have a stored sonyOneCarousel, make a new one and save it
        if ( !moduleName ) {
            moduleName = new SonyOneCarousel( self, options );
            self.data( 'sonyOneCarousel', moduleName );
        }
    
        if ( typeof options === 'string' ) {
          moduleName[ options ].apply( moduleName, args );
        }
      } );
    };

    //defaults for the related products
    $.fn.sonyOneCarousel.defaults = {
      throttleTime: 10,
      slideSpacing: 100 //space in between slides
    };

    $.fn.sonyOneCarousel.settings = {
      //must haves
    };

    $( function(){
      var c = window.c = $('.sony-one-carousel').sonyOneCarousel({}).data('sonyOneCarousel');
    } );

 })( jQuery, Modernizr, window, undefined );


