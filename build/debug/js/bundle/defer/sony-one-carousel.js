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

    var SonyOneCarousel = function( element , options ){

      var self = this,
          i;

      $.extend( self , $.fn.sonyOneCarousel.defaults , options , $.fn.sonyOneCarousel.settings );

      // feature detection, some ideas taken from Modernizr
      var tempStyle = document.createElement('div').style,
          vendors   = [ 'webkit','Moz','ms','O' ],
          vendor    = '',
          lastTime  = 0,
          tempV;

      for (i = 0; i < vendors.length; i++ ) {
        tempV = vendors[i];
        if ( !vendor && (tempV + 'Transform') in tempStyle ) {
            vendor = tempV;
        }
        tempV = tempV.toLowerCase();
      }

      var bT = vendor + ( vendor ? 'T' : 't' );

      self.useCSS3Transitions = Modernizr.csstransforms && Modernizr.csstransitions;

      // 3D Transform test in Modernizr returns a false negative in Chrome, so we need this for now.
      if( self.useCSS3Transitions ) {
          self.use3dTransform = ( vendor + ( vendor ? 'P' : 'p'  ) + 'erspective' ) in tempStyle;
      }

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
      self.currentId             = 0;
      self.animationSpeed        = 700; //ms
      self.currentContainerWidth = 0;
      self.sPosition             = 0;
      self.accelerationPos       = 0;
      self.prefixed              = Modernizr.prefixed;
      self.transitionName        = self.prefixed('transition');

      // Get transitionend event name
      var transEndEventNames = {
          'WebkitTransition' : 'webkitTransitionEnd',
          'MozTransition'    : 'transitionend',
          'OTransition'      : 'oTransitionEnd',
          'msTransition'     : 'MSTransitionEnd',
          'transition'       : 'transitionend'
      };

      self.transitionEndName     = transEndEventNames[ self.transitionName ];
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
        $(this).find('.soc-item').each(function(j){
          $(this).data('slideGroupId', i);
        });
      });

      //figure out what events to use
      if( Modernizr.touch ) {
        self.hasTouch = true;
        self.downEvent = 'touchstart.soc';
        self.moveEvent = 'touchmove.soc';
        self.upEvent = 'touchend.soc';
        self.cancelEvent = 'touchcancel.soc';
        self.lastItemFriction = 0.5;
      } else {
        self.hasTouch = false;
        self.lastItemFriction = 0.2;
        self.downEvent = 'mousedown.soc';
        self.moveEvent = 'mousemove.soc';
        self.upEvent = 'mouseup.soc';
        self.clickEvent = 'click.soc';
        self.cancelEvent = 'mouseup.soc';
      }

      if( self.useCSS3Transitions ) {

        self.yProp = self.xProp = Modernizr.prefixed('transform');

        if( self.use3dTransform ) {
          self.tPref1 = 'translate3d(';
          self.tPref2 = 'px, ';
          self.tPref3 = 'px, 0px)';
        } else {
          self.tPref1 = 'translate(';
          self.tPref2 = 'px, ';
          self.tPref3 = 'px)';
        }

        self.$container[ Modernizr.prefixed('transitionProperty') ] = Modernizr.prefixed('transform');

      } else {
        self.xProp = 'left';
        self.yProp = 'top';
      }

      window.SONY.on('global:resizeDebounced.soc', function(){
        self.checkForBreakPoint();
        self.update();
        self.updateSlides();
      });

      self.tapOrClick = function(){
        return self.hasTouch ? 'touchend' : 'click';
      };

      if( self.numSlides > 1 ){
        self.$containerInner.on(self.downEvent, function(e) { self.onDragStart(e); });
      }

      self.setupLinkClicks();
      self.createNavigation();
      self.setupPaddles();

      window.SONY.trigger('global:resizeDebounced.soc');
    };

    SonyOneCarousel.prototype = {
      constructor: SonyOneCarousel,

      setupLinkClicks: function(){

        var self = this;

        self.$container.find('.soc-item').on(self.clickEvent, function(e){

          var $this = $(this),
              defaultLink = $this.find('.headline a').attr('href'),
              closestLink = $(e.target).closest('a').attr('href'),
              destination, point, distanceMoved;

          if ( self.hasTouch ) {
            point = e.originalEvent.touches[0];
          } else {
            point = e;
          }

          // To prevent drags from being misinterpreted as clicks, we only redirect the user
          // if their interaction time and movements are below certain thresholds.

          if ( self.startInteractionTime && self.startInteractionPointX ) {

            distanceMoved = Math.abs(point.pageX - self.startInteractionPointX);

            if ((new Date().getTime()) - self.startInteractionTime < 250 && distanceMoved < 25 ) {

              if ( closestLink && closestLink !== defaultLink ) {
                destination = closestLink;
              } else {
                destination = defaultLink;
              }

              window.location = destination;
            }
          }
        });

        self.$container.find('a').on(self.clickEvent, function(e){
          e.preventDefault();
        });
      },

      onDragStart : function(e){

        var self = this,
            point;

        if ( self.hasTouch ) {
          var touches = e.originalEvent.touches;
          if ( touches && touches.length > 0 ) {
            point = touches[0];
          } else {
            return;
          }
        } else {
          point = e;
          e.preventDefault();
          if(e.which !== 1){
            return;
          }
        }

        self.isDragging = true;

        self.$doc.on( self.moveEvent , $.proxy( self.dragMove , self ) ).on( self.upEvent , $.proxy( self.dragRelease , self ) );

        self.hasMoved = false;
        self.pageX = point.pageX;
        self.pageY = point.pageY;

        self.startDragX = point.pageX;

        self.startPagePos = self.accelerationPos =  point.pageX;

        self.horDir = 0;

        self.currRenderPosition = self.sPosition;

        self.startTime = self.startInteractionTime = new Date().getTime();
        self.startInteractionPointX = point.pageX;

        if(self.hasTouch) {
          self.$container.on(self.cancelEvent, function(e) { self.dragRelease(e, false); });
        }

        //self.moveTo();

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
        self.renderMoveTime = 0;

        window.cancelAnimationFrame(self.animFrame);

        //stop listening on the document for movement
        self.$doc.off( self.moveEvent ).off( self.upEvent );

        if( self.hasTouch ) {
          self.$container.off( self.cancelEvent );
        }

        var orient = true;

        if(!self.hasMoved) {
            return;
        }

        function returnToCurrent(isSlow, v0) {

          var newPos = -self.currentId * self.currentContainerWidth,
              newDist = Math.abs( self.sPosition  - newPos );

          self.currAnimSpeed = newDist / v0;

          if(isSlow) {
            self.currAnimSpeed += 250;
          }
          self.currAnimSpeed = SONY.Utilities.constrain( self.currAnimSpeed, 100, 500 );

          self.moveTo();
        }

        var snapDist   = self.minSlideOffset,
            point      = self.hasTouch ? e.originalEvent.changedTouches[0] : e,
            pPos       = point.pageX,
            sPos       = self.startPagePos,
            axPos      = self.accelerationPos,
            axCurrItem = self.currSlideId,
            axNumItems = self.numSlides,
            dir        = self.horDir,
            loop       = self.loop,
            changeHash = false,
            distOffset = 0,
            dragDirection,

        //This makes sure depending on mode we use the right slide collection!
        $currSlides = (self.isDesktopMode ? self.$desktopSlides :
                      self.isTabletMode ? self.$tabletSlides : self.$mobileSlides);

        totalMoveDist = Math.abs(pPos - sPos);

        dragDirection = self.startDragX > pPos ? 1 : 0;

        accDist = pPos - axPos;

        duration = (new Date().getTime()) - self.startTime;
        v0 = Math.abs(accDist) / duration;

        if( totalMoveDist > self.hasTouch ? Math.abs(self.currentContainerWidth * 0.25) : Math.abs(self.currentContainerWidth * 0.5) ){

          if(dragDirection === 1){
            self.currentId ++;
            if(self.currentId >= $currSlides.length){
              self.currentId = $currSlides.length - 1;
            }
          } else {
            self.currentId --;
           if(self.currentId < 0){
            self.currentId = 0;
           }
          }
          self.moveTo(false,v0);
        }else{
          //return to current
          returnToCurrent(true, v0);
        }
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
              self.$container.css(Modernizr.prefixed('transitionDuration'), '0s');
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

        e.preventDefault();
        self.renderMoveTime = new Date().getTime();
        self.renderMoveEvent = point;

      },
      renderMovement: function(point , isThumbs){
        var self = this,
            timeStamp = self.renderMoveTime,
            deltaX = point.pageX - self.pageX,
            deltaY = point.pageY - self.pageY,
            newX = self.currRenderPosition + deltaX,
            newY = self.currRenderPosition + deltaY,
            isHorizontal = true,
            newPos = isHorizontal ? newX : newY;

        self.hasMoved = true;
        self.pageX = point.pageX;
        self.pageY = point.pageY;

        var pointPos = self.pageX;

        self.horDir = deltaX > 0 ? 1 : -1;

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

        self.setPosition(self.currRenderPosition);
      },

      setPosition: function(posi) {
        window.iQ.update();

        var self = this,
            pos  = self.sPosition = posi;

        if(self.useCSS3Transitions) {
          var animObj = {};
          animObj[ Modernizr.prefixed('transitionDuration') ] = 0 + 'ms';
          animObj[ self.xProp ] = self.tPref1 + (pos + self.tPref2 + 0) + self.tPref3;
          self.$containerInner.css(animObj);

        } else {
          self.$containerInner.css(self.xProp, pos);
        }
      },

      moveTo: function(force , velocity){
        var self = this,
            newPos = -self.currentId * self.currentContainerWidth,
            $contentWrappers = self.$el.find('.soc-content'),
            animObj = {},
            newDist = Math.abs(self.sPosition  - newPos);


        function getCorrectSpeed(newSpeed) {
            if(newSpeed < 100) {
                return 100;
            } else if(newSpeed > 500) {
                return 500;
            }
            return newSpeed;
        }

        self.currAnimSpeed = getCorrectSpeed( newDist / velocity );

        if( isNaN(self.currAnimSpeed) ){
          self.currAnimSpeed = self.animationSpeed;
        }

        //$contentWrappers.css('z-index', '');
        ///$contentWrappers.eq(self.currentId).css('z-index', 100);

        if( self.currentId !== 0 ){
          self.$gridW = self.$el.find('.soc-grid' ).eq(0);
          newPos -= (window.SONY.Settings.GUTTER_WIDTH_SLIM * self.$gridW.width()) * self.currentId;
        }

        if( self.isMobileMode === true ){
          var delta = ($contentWrappers.eq(0).width() - self.$el.find('.soc-item').eq(0).width()) / 2;
          newPos += delta - (self.currentId * 10);
        }

        if( !self.useCSS3Transitions ) {

          //jQuery fallback
          animObj[ self.xProp ] = newPos + 'px';
          self.$containerInner.animate(animObj, (force === true ? 10 : self.currAnimSpeed));

        } else {



          //css3 transition
          animObj[ Modernizr.prefixed('transitionDuration') ] = (force === true ? 10 : self.currAnimSpeed) + 'ms';

          //animObj[ Modernizr.prefixed('transitionTimingFunction') ] = $.socCSS3Easing.easeOutBack;

          if(self.currAnimSpeed === self.animationSpeed){
            animObj[ (self.vendorPrefix + self.TTF) ] = $.socCSS3Easing.easeOutBack; //default to normal
          }else{
            animObj[ (self.vendorPrefix + self.TTF) ] = 'cubic-bezier(0.33,0.66,0.66,1)';
          }

          //self.$containerInner.css( animObj );

          animObj[ self.xProp ] = self.tPref1 + (( newPos ) + self.tPref2 + 0) + self.tPref3;

          self.$containerInner.css( animObj );

          //IQ Update
          self.$containerInner.one(self.transitionEndName, function(){
            window.iQ.update();
            self.ev.trigger('socOnUpdateNav');
          });
        }

        //update the overall position
        self.sPosition = self.currRenderPosition = newPos;


      },

      update: function(){
        var self = this,
            cw = self.currentContainerWidth = self.$el.find( '.soc-grid' ).eq(0).width(),
            newH = Math.floor(self.resizeRatio * cw) +  'px',
            $currSlides = (self.isDesktopMode ? self.$desktopSlides : self.isTabletMode ? self.$tabletSlides : self.$mobileSlides);

        if(self.isDesktopMode || self.isTabletMode){
          self.$container.css( 'height' , newH );
          $currSlides.css( 'height' ,  newH );
        }else{
          newH = Math.floor($('.soc-item').eq(0).height());
          self.$container.css( 'height' ,  newH  + 'px' );
        }
      },

      shuffleClasses: function(){
        var self = this,
            mode = self.currentMode.toLowerCase(),
            allSpans = 'span4 span6 span8 span12',
            itemSelector = '.soc-item',
            oneUp = '.soc-1up',
            twoUp = '.soc-2up',
            threeUp = '.soc-3up';

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
            if(self.isDesktopMode){ return; }
            self.isMobileMode = self.isTabletMode = false;
            self.isDesktopMode = true;
            self.currentMode = view;

            self.resizeRatio = 0.423345746645;
            self.createDesktopSlides(lastView);
            self.shuffleClasses();

          break;

          case 'tablet':
            if(self.isTabletMode){ return; }
            self.isMobileMode = self.isDesktopMode = false;
            self.isTabletMode = true;
            self.currentMode = view;

            self.resizeRatio = 0.64615384615385;
            self.createTableSlides(lastView);
            self.shuffleClasses();

          break;

          case 'mobile':
            if(self.isMobileMode){ return; }
            self.isTabletMode = self.isDesktopMode = false;
            self.isMobileMode = true;
            self.currentMode = view;

            self.resizeRatio = 1.33574007220217;
            self.createMobileSlides(lastView);
            self.shuffleClasses();

          break;
        }
      },

      createDesktopSlides: function(lastView){
        var self = this,
            $lastItem = null;

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
        self.$galleryItems = self.$el.find('.soc-item').detach();

        //2. remove the slides from desktop / mobile
        self.$tabletSlides.remove();
        self.$mobileSlides.remove();

        var slideCount = 0;

        var processItem = function(j){
          var $item = $(this);

          if( $item.data('slideGroupId') === i ){
            $item.appendTo($gridDiv);
          }
        };

        for (var i = 0; i < self.originalSlideCount; i ++) {

          var $contentDiv = $('<div class="soc-content" />'),
              $gridDiv = $('<div class="soc-grid slimgrid" />'),
              $item = null;

          self.$galleryItems.each(processItem);

          $gridDiv.appendTo($contentDiv);
          $contentDiv.appendTo(self.$containerInner);
        }

        self.$desktopSlides = self.$container.find('.soc-content');
        self.numSlides = self.$desktopSlides.length;
        self.createNavigation();
        self.currentId = self.getCurrentSlideByItemId($lastItem);
        window.SONY.trigger('global:resizeDebounced.soc');
      },

      createTableSlides: function(lastView){
        var self = this,
            $lastItem = null;

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
        self.$galleryItems = self.$el.find('.soc-item').detach();

        //2. remove the slides from desktop / mobile
        self.$desktopSlides.remove();
        self.$mobileSlides.remove();

        var slideCount = 0,
        galLen = self.$galleryItems.length;

        var createSlide = function(i,orphaned){

          var $contentDiv = $('<div class="soc-content" />'),
              $gridDiv = $('<div class="soc-grid slimgrid" />'),
              $item1 = self.$galleryItems.eq(i-1),
              $item2 = self.$galleryItems.eq(i);

          if( orphaned === true ){
            $item1 = self.$galleryItems.eq(i);
            $item2 = $();
          }

          $gridDiv.appendTo($contentDiv);

          if( $item1.length > 0 ) {
            $item1.appendTo($gridDiv);
          }

          if( $item2.length > 0 ) {
            $item2.appendTo($gridDiv);
          }

          $contentDiv.appendTo(self.$containerInner);
          slideCount++;
        };

        for (var i = 0; i < galLen; i ++) {

          if ( i % 2 ) {
            createSlide(i,false);
          }

          if (i === galLen - 1 && galLen > slideCount * 2) {
            createSlide(i, true);
          }
        }

        self.$tabletSlides = self.$container.find('.soc-content');
        self.numSlides = self.$tabletSlides.length;
        self.createNavigation();
        self.currentId = self.getCurrentSlideByItemId($lastItem);
        window.SONY.trigger('global:resizeDebounced.soc');
      },

      createMobileSlides: function(lastView){
        var self = this,
            $lastItem = null;

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
        self.$galleryItems = self.$el.find('.soc-item').detach();

        //2. remove the slides from desktop / tablet
        self.$desktopSlides.remove();
        self.$tabletSlides.remove();

        for (var i = 0; i < self.$galleryItems.length; i ++) {

          var $contentDiv = $('<div class="soc-content" />'),
              $gridDiv    = $('<div class="soc-grid slimgrid" />'),
              $item       = self.$galleryItems.eq(i);

          $item.appendTo($contentDiv);
          $contentDiv.appendTo(self.$containerInner);
        }


        self.$mobileSlides = self.$container.find('.soc-content');
        self.numSlides = self.$mobileSlides.length;
        self.createNavigation();
        self.currentId = self.getCurrentSlideByItemId($lastItem);
        window.SONY.trigger('global:resizeDebounced.soc');
      },

      createNavigation: function (){

        var self = this;

        if ( self.$dotnav ) {
          self.$dotnav.sonyNavDots('reset', {
            'buttonCount': self.numSlides
          });
          return;
        }

        self.$dotnav = self.$el.find('.soc-dot-nav').sonyNavDots({
          'buttonCount': self.numSlides
        });

        self.$dotnav.on('SonyNavDots:clicked', function(e, a){
          self.currentId = a;
          self.moveTo();
        });

        self.ev.on( 'socOnUpdateNav', $.debounce(500, function() {
          self.$dotnav.sonyNavDots('reset', {
            'activeButton': self.currentId
          });
        }));
      },
      setupPaddles: function(){

        var self = this,
            itemHTML = '<div class="paddle"><i class=fonticon-10-chevron></i></div>',
            $container = self.$el.closest('.container'),
            out = '<div class="soc-nav soc-paddles">';

        if ( self.hasTouch ) {
          return;
        }

        self.paddlesEnabled = true;

        for ( var i = 0; i < 2; i++ ) {
          out += itemHTML;
        }

        out += '</div>';
        out = $(out);

        self.$el.append(out);

        self.$paddles     = self.$el.find('.paddle');
        self.$leftPaddle  = self.$paddles.eq(0).addClass('left');
        self.$rightPaddle = self.$paddles.eq(1).addClass('right');

        self.$paddles.on(self.tapOrClick() , function(){

          if ( $(this).hasClass('left') ){

            self.currentId--;
            if(self.currentId < 0){
              self.currentId = 0;
            }

            self.moveTo();

          } else {

            self.currentId++;

            if(self.currentId >= self.$slides.length){
              self.currentId = self.$slides.length - 1;
            }

            self.moveTo();
          }
        });

        self.onPaddleNavUpdate();

        self.ev.on('socOnUpdateNav', $.proxy(self.onPaddleNavUpdate , self));
      },

      onPaddleNavUpdate: function(){
        var self = this;

        //check for the left paddle compatibility
        if(self.currentId === 0){
          self.$leftPaddle.stop(true,true).fadeOut(100);
        }else{
          self.$leftPaddle.stop(true,true).fadeIn(200);
        }

        //check for right paddle compatiblity
        if(self.currentId === self.numSlides - 1){
          self.$rightPaddle.stop(true,true).fadeOut(100);
        }else{
          self.$rightPaddle.stop(true,true).fadeIn(200);
        }
      },

      getCurrentSlideByItemId: function($socItem){
        var self = this,
            $slide = null;

        $slide = $socItem.closest('.soc-content');
        return $slide.index();
      },

      updateSlides: function(){

        var self = this,
            cw = 0,
            animObj = {},
            mobileGutter = 10,
            gutterWidth = 0;

        if(self.isDesktopMode === true){

          self.$gridW = self.$el.find( '.soc-grid' ).eq(0);

          self.$desktopSlides.each(function(i){
            cw = self.$gridW.width();
            gutterWidth = window.SONY.Settings.GUTTER_WIDTH_SLIM * cw;
            if(i > 0){
              cw += gutterWidth;
            }

            $(this).css({
              'left': Math.floor(i * cw) + 'px'
            });
          });
        }

        if(self.isTabletMode === true){
          self.$gridW = self.$el.find( '.soc-grid' ).eq(0);

          self.$tabletSlides.each(function(i){
            cw = self.$gridW.width();
            gutterWidth = window.SONY.Settings.GUTTER_WIDTH_SLIM * cw;

            if( i > 0 ){
              cw += gutterWidth;
            }

            $(this).css({
              'left': Math.floor(i * cw) + 'px',
              'height' : Math.floor(self.$el.find('.soc-item').eq(0).height())  + 'px'
            });

            $(this).find('.soc-item').css({
              'position': '',
              'top' : '',
              'left' : ''
            });
          });
        }

        if(self.isMobileMode === true){
          cw = self.currentContainerWidth = self.$el.find('.soc-item').eq(0).width();
          self.$mobileSlides.each(function(i){
            $(this).css({
              'left': Math.floor(i * (cw + mobileGutter)) + 'px',
              'height' : 317  + 'px' //TODO: this is not calculating correctly -->  $('.soc-item').eq(0).height();
            });
          });
        }

        //make sure it updates position based on current slide index
        self.moveTo(true);
      },

      m: function(xpos){
        var self = this,
            animObj = {};

        animObj[ Modernizr.prefixed('transitionDuration') ] = self.animationSpeed + 'ms';
        animObj[ Modernizr.prefixed('transitionTimingFunction') ] = $.socCSS3Easing.easeOutBack;
        self.$containerInner.css( animObj );

        animObj[ self.xProp ] = self.tPref1 + ( ( xpos ) + self.tPref2 + 0 ) + self.tPref3;
        self.$containerInner.css( animObj );
      }
    };

    $.socCSS3Easing = {
      easeOutSine: 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
      easeInOutSine: 'cubic-bezier(0.445, 0.050, 0.550, 0.950)',
      easeOutBack: 'cubic-bezier(0.595, -0.160, 0.255, 1.140)'
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

    $.fn.sonyOneCarousel.defaults = {
    };

    $.fn.sonyOneCarousel.settings = {
      throttleTime: 250
    };

    window.SONY.on('global:ready', function(){
      $('.sony-one-carousel').sonyOneCarousel({}).data('sonyOneCarousel');
    });

 })( jQuery, Modernizr, window, undefined );
