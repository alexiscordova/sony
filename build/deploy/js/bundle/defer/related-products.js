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
      var self = this,
          ua = navigator.userAgent.toLowerCase(),
          i,
          browser = $.browser,
          isWebkit = browser.webkit,
          isAndroid = ua.indexOf('android') > -1;

          $.extend(self , $.fn.relatedProducts.defaults , options);

      self.isIPAD = ua.match(/(ipad)/);
      self.isIPHONE = ua.match(/(iphone)/);   

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
      
      self.useCSS3Transitions = ( (bT + 'ransform') in tempStyle ) && ( (bT + 'ransition') in tempStyle );
      
      if(self.useCSS3Transitions) {
          self.use3dTransform = (vendor + (vendor ? 'P' : 'p'  ) + 'erspective') in tempStyle;
      }
        
      vendor = vendor.toLowerCase();

      self.vendorPrefix = '-' + vendor + '-';
      self.ev = $({}); //event object
      self.$el = $(element);
      self.$slides = self.$el.find('.rpSlide');
      self.$galleryItems = $('.gallery-item');
      self.$galleryItems.each(function(){
        var $item = $(this);
        $item.data('slide' , $item.parent());
//        console.log("My Slide Parent »",$item);
      });
   

      self.numSlides = self.$slides.length;
      self.$container = self.$el.find('.rpContainer').eq(0);
      self.sliderOverflow = self.$el.find('.rpOverflow').eq(0);
      self.previousId = -1;
      self.currentId = 0;
      self.slidePosition = 0;
      self.animationSpeed = 400; //ms
      self.slides = []; 
      self.slideCount = 0;
      self.isFreeDrag = false; //MODE: TODO
      self.currentContainerWidth = 0;
      self.$doc = $(document);
      self.$win = $(window);
      self.newSlideId = 0;
      self.sPosition = 0;
      self.scrollerModule = null;

      self.shuffle = null; //start with null value, gets checked in checkforBreakpoints method

      self.shuffleSpeed = 250;
      self.shuffleEasing = 'ease-out';

      //modes
      self.isMobileMode = false;
      self.isDesktopMode = false;
      self.isTabletMode = false;
      
      self.accelerationPos = 0;
      self.maxWidth = parseInt(self.sliderOverflow.parent().css('maxWidth'), 10);
      self.maxHeight = parseInt(self.sliderOverflow.parent().css('maxHeight'), 10);
      self.resizeRatio = self.maxHeight / self.maxWidth; //target resize ratio
      self.markup = self.$container.html();


      //init plugins
      $.each($.rpModules, function (helper, opts) {
          opts.call(self);
      });


      //TODO: remove this
      //$('body').css( { 'backgroundColor' : '#2e2e2e' } );


      console.log('Related Products - ' , self.numSlides , 'Max Width: ' , ( self.maxHeight / self.maxWidth) * 980);

      if(Modernizr.touch) {

          self.hasTouch = true;
          self.downEvent = 'touchstart.rp';
          self.moveEvent = 'touchmove.rp';
          self.upEvent = 'touchend.rp';
          self.cancelEvent = 'touchcancel.rp';
          self.lastItemFriction = 0.5;
      } else {
          self.hasTouch = false;
          self.lastItemFriction = 0.2;
          
          //do we need this?
          if (browser.msie || browser.opera) {
              self.grabCursor = self.grabbingCursor = "move";
          } else if(browser.mozilla) {
              self.grabCursor = "-moz-grab";
              self.grabbingCursor = "-moz-grabbing";
          } else if(isWebkit && (navigator.platform.indexOf("Mac")!=-1)) {
              self.grabCursor = "-webkit-grab";
              self.grabbingCursor = "-webkit-grabbing";
          }
          
          //t.setGrabCursor(); //TODO: figure out cursor stuff on drag / touch
          
          self.downEvent = 'mousedown.rp';
          self.moveEvent = 'mousemove.rp';
          self.upEvent = 'mouseup.rp';
          self.cancelEvent = 'mouseup.rp';
      }

      if(self.useCSS3Transitions) {

          // some constants for CSS3
          self.TP = 'transition-property';
          self.TD = 'transition-duration';
          self.TTF = 'transition-timing-function';

          self.yProp = self.xProp = self.vendorPrefix +'transform';

          if(self.use3dTransform) {
              if(isWebkit) {
                  self.$el.addClass('rpWebkit3d');
              }
              self.tPref1 = 'translate3d(';
              self.tPref2 = 'px, ';
              self.tPref3 = 'px, 0px)';
          } else {
              self.tPref1 = 'translate(';
              self.tPref2 = 'px, ';
              self.tPref3 = 'px)';
          }

          self.$container[(self.vendorPrefix + self.TP)] = (self.vendorPrefix + 'transform');
                  
      } else {
          self.xProp = 'left';
          self.yProp = 'top';
      }

      //init dragging , slideshow
      self.$container.on(self.downEvent, function(e) { self.onDragStart(e); });   


      self.tapOrClick = function(){
        return self.hasTouch ? 'touchend' : 'click'; 
      }

      // resize // manual throttle / debounce
      var resizeTimer;
      $(window).on('resize', function() {  
          if(resizeTimer) {
              clearTimeout(resizeTimer);          
          }
          resizeTimer = setTimeout(function() { 
            self.checkForBreakpoints();
            self.updateSliderSize();
            self.updateSlides();

            $('.paddle').hide();

          }, self.throttleTime);          
      });

      //bind arrows 

      $('.rpArrow').on(self.tapOrClick() , function(){
        
        if($(this).hasClass('right')){
          console.log('clicked - right');
          self.currentId ++;
          if(self.currentId >= self.$slides.length){
            self.currentId = self.$slides.length - 1;
          }    
        }else{
          console.log('clicked - left');
           self.currentId --;

           if(self.currentId < 0){
            self.currentId = 0;
           }
        }

        self.moveTo();

      });

     function createNavigation(){
        var itemHTML = '<div class="rpNavItem rpBullet"><span></span></div>';
        
        self.controlNavEnabled = true;
        self.$container.addClass('rpWithBullets');
        var out = '<div class="rpNav rpBullets">';
        for(var i = 0; i < self.numSlides; i++) {
          out += itemHTML;
        }
        out += '</div>';
        out = $(out);
        self.controlNav = out;
        self.$bulletNav = $('.rpNav');
        self.controlNavItems = out.children();
        self.$el.append(out);

        self.controlNav.on( self.tapOrClick() , function(e) {
          var item = $(e.target).closest('.rpNavItem');
          if(item.length) {
            self.currentId = item.index();
            self.moveTo();
          }
        }); 


        self.onNavUpdate(); 
        self.ev.on('rpOnUpdateNav' , $.proxy(self.onNavUpdate , self));     
      }

      if(self.navigationControl.toLowerCase() === 'bullets'){
        createNavigation();
        createPaddles();
      }


      function createPaddles(){

        var itemHTML = '<div class="paddle"></div>';
        
        self.paddlesEnabled = true;
        var out = '<div class="rpNav rpPaddles">';
        for(var i = 0; i < 2; i++) {
          out += itemHTML;
        }
        out += '</div>';
        out = $(out);

        $('.rpGrid').append(out);

        self.$paddles = $('.rpGrid').find('.paddle');
        self.$leftPaddle = self.$paddles.eq(0).addClass('left');
        self.$rightPaddle = self.$paddles.eq(1).addClass('right');

        self.$paddles.on(self.tapOrClick() , function(){
          var p = $(this);

          if(p.hasClass('left')){
            console.log('Left paddle click');

            self.currentId --;
            if(self.currentId < 0){
              self.currentId = 0;
            }

            self.moveTo();

          }else{
            console.log('Right paddle click');

            self.currentId ++;

            if(self.currentId >= self.$slides.length){
              self.currentId = self.$slides.length - 1;
            }

            self.moveTo();
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

      //loading
      //self.$grid.on('loading.shuffle', $.proxy( self.onShuffleLoading, self ));
      //self.$grid.on('done.shuffle', $.proxy( self.onShuffleDone, self ));

      // instantiate shuffle


      self.shuffleColumns = function( containerWidth ) {
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
          } /*else {
            column = 0.48 * containerWidth; // 48% of container width
          }*/

          return column;
      };

     self.shuffleGutters = function( containerWidth ) {
        var gutter,
            numColumns = 0;

        // Large desktop ( 6 columns )
/*        if ( Modernizr.mq('(min-width: 1200px)') ) {
          gutter = Exports.GUTTER_WIDTH_1200 * containerWidth;
          numColumns = 5;

        // Landscape tablet + desktop ( 5 columns )
        } else*/

        //if ( Modernizr.mq('(min-width: 980px)') ) {
        if ( Modernizr.mq('(min-width: 980px)') ) { 
          gutter = Exports.GUTTER_WIDTH * containerWidth;
          numColumns = 5;

        // // Portrait Tablet ( 4 columns ) - masonry
        } else if ( Modernizr.mq('(min-width: 481px)') ) {
          numColumns = 4;
          gutter = Exports.GUTTER_WIDTH_768 * containerWidth;
        // Between Portrait tablet and phone ( 3 columns )
        } 

        console.log("Number of columns »",numColumns , gutter);

        self.setColumns(numColumns);

        return gutter;
      };

/*    self.shuffle = self.$slides.shuffle({
        itemSelector: '.gallery-item',
        speed: self.shuffleSpeed,
        easing: self.shuffleEasing,
        columnWidth: self.shuffleColumns,
        gutterWidth: self.shuffleGutters,
        showInitialTransition: false,
        buffer: 5
      }).data('shuffle');*/

      //self.createShuffle();


      $(window).trigger('resize');

      $('.paddle').hide();
      /*$('.rpNav').hide();*/

      //TODO: dont actually do this
      $('.color-swatches').remove();

    };

    RelatedProducts.prototype = {

      createShuffle: function(){
        var self = this;
        self.shuffle = self.$slides.shuffle({
          itemSelector: '.gallery-item',
          speed: self.shuffleSpeed,
          easing: self.shuffleEasing,
          columnWidth: self.shuffleColumns,
          gutterWidth: self.shuffleGutters,
          showInitialTransition: false,
          buffer: 100
        }).data('shuffle');

      },

      sortByPriority : function() {
        var self = this,
            isTablet = Modernizr.mq('(min-width: 481px) and (max-width: 979px)');
            console.log("Tony? »" );
        if ( isTablet && !self.sorted ) {
          console.log("Sorting... »");
          self.$slides.shuffle('sort', {
            by: function($el) {
              var priority = $el.hasClass('plate') ? 1 : $el.hasClass('medium') ? 2 : 3;

              // Returning undefined to the sort plugin will cause it to revert to the original array
              return priority ? priority : undefined;
            }
          });
          self.sorted = true;
        } else if ( !isTablet && self.sorted ) {
          self.$slides.shuffle('sort', {});
          console.log("Unsort... »");
          self.sorted = false;
        }
      },
      setColumns : function( numColumns ) {

        var self = this,
            allSpans = 'span1 span2 span3 span4 span6',
            shuffleDash = 'shuffle-',
            gridClasses = [ shuffleDash + 3, shuffleDash + 4, shuffleDash + 5, 'grid-small' ].join(' '),
            itemSelector = '.gallery-item',
            grid5 = 'grid5',
            span = 'span',
            large = '.large',
            promo = '.promo',
            normal = '.normal',
            medium = '.medium',
            plate = '.plate',
            largeAndPromoAndMedium = large + ',' + promo + ',' + medium + ',' + plate;

        // Large desktop ( 6 columns )
/*        if ( numColumns === 6 ) {
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
        } else */

        if ( numColumns === 5 ) {
          if ( !self.$container.hasClass(shuffleDash+5) ) {

            // add .grid5
            self.$container
              .removeClass(gridClasses)
              .addClass(shuffleDash+5)
              .closest('.container')
              .addClass(grid5);

            self.$slides.children(itemSelector)
              .removeClass(allSpans) // Remove current grid span
              .filter(medium) // Select large tiles
              .addClass(span+2) // Make them 3/5 width
              .end() // Go back to all items
              .filter(plate) // Select promo tiles
              .addClass(span+2) // Make them 2/5 width
              .end() // Go back to all items
              .filter(normal) // Select tiles not large nor plate
              .addClass(span+1); // Make them 1/5 width
          }

        // Portrait Tablet ( 4 columns ) - masonry
        } else if ( numColumns === 4 ) {
          if ( !self.$slides.hasClass(shuffleDash+4) ) {

            // Remove .grid5
            self.$container
              .removeClass(gridClasses)
              .addClass(shuffleDash+4)
              .closest('.container')
              .removeClass(grid5);


            self.$slides.children(itemSelector)
              .removeClass(allSpans) // Remove current grid span
              .filter(medium) // Select large and promo tiles
              .addClass( span + 6 ) // Make them half width
              .end()
              .filter(plate) // Go back to all items
              .addClass( span + 6 )
              .end()
              .filter(normal) // Select tiles not large nor promo
              .addClass( span + 3 ); // Make them quarter width
          }

        // Between Portrait tablet and phone ( 3 columns )
        }

        console.log("Number of columns »" , numColumns);

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
        var self = this,
            wW = self.$win.width(),
            view = wW > 980 ? 'desktop' : wW > 481 ? 'tablet' : 'mobile';

            switch(view){
              case 'desktop':

               //check if we are coming out of mobile
                if(self.isMobileMode === true){
                  //checkmarkup();
                  self.goBackToDesktop();
                }

                self.isTabletMode = self.isMobileMode = false;
                
                if(self.isDesktopMode === true){
                  return;
                }

                self.isDesktopMode = true;
                self.$el.removeClass('rpTablet rpMobile')
                                        .addClass('rpDesktop');

/*                self.$el.removeClass('rpTablet rpMobile')
                        .addClass('rpDesktop');*/
                //self.setColumns();
                //self.sortByPriority();

                if(self.shuffle === null){
                  self.createShuffle();
                }

              self.sortByPriority();
    /*            setTimeout(function(){
                  //self.sorted = true;
                  
                } , 100);*/
                

                iQ.update();

                self.ev.trigger('ondesktopbreakpoint.rp');

              break;

              case 'tablet':

                var wasMobile = self.isMobileMode;

                //check if we are coming out of mobile
                if(self.isMobileMode === true){
                  //checkmarkup();
                  self.goBackToDesktop();
                }

                if(self.isTabletMode === true){
                  return;
                }

                self.isMobileMode = self.isDesktopMode = false;

                self.isTabletMode = true;

                console.log(' I am in tablet mode according to this window width: ' , wW  , 'px');

                //self.setColumns();

                self.$el.removeClass('rpDesktop rpMobile')
                        .addClass('rpTablet');

                if(self.shuffle === null){
                  //alert('creating shuffle for first time...');
                  self.createShuffle();
                }

                if(wasMobile){
                  //self.sorted = false;
                }

                self.sortByPriority();

                iQ.update();

/*                console.log("Are we in tablet mode? »", self.isTabletMode);

                

                self.$el.removeClass('rpDesktop rpMobile')
                        .addClass('rpTablet');

                self.ev.trigger('ontabletbreakpoint.rp');*/

              break;

              case 'mobile':
                
                if(self.isMobileMode === true){
                  return;
                }

                self.isTabletMode = self.isDesktopMode = false;

                self.isMobileMode = true;

                self.$el.removeClass('rpTablet rpDesktop')
                        .addClass('rpMobile');


                //destroy the shuffle instance
                if(self.shuffle != null){
                  self.shuffle.destroy();
                  self.shuffle = null;
                  self.sorted = false;

                  console.log("Destroying shuffle instance »" , self.shuffle);
                }

                //hide the bullet navigation
                self.$bulletNav.hide();

                iQ.update();

                self.ev.trigger('onmobilebreakpoint.rp');
/*
                self.isTabletMode = self.isDesktopMode = false;

                self.$el.removeClass('rpTablet rpDesktop')
                        .addClass('rpMobile');

                self.isMobileMode = true;

                self.ev.trigger('onmobilebreakpoint.rp');*/

              break;
            }
      },

      onNavUpdate: function(){
        var self = this,
            currItem;

        if(self.prevNavItem) {
          self.prevNavItem.removeClass('rpNavSelected');
        }

        currItem = $(self.controlNavItems[self.currentId]);
        currItem.addClass('rpNavSelected');
        self.prevNavItem = currItem;
  
      },

      setGrabCursor:function() {     
          var self = this;
          if(!self.hasTouch) {
              if(self.grabbingCursor) {
                  self.sliderOverflow.css('cursor', self.grabbingCursor);
              } else {
                  self.sliderOverflow.removeClass('grab-cursor');
                  self.sliderOverflow.addClass('grabbing-cursor');   
              }   
          }
      },

      updateSliderSize: function(){
        var self = this;
        
        //handle resize for various layouts


        if(self.isTabletMode === true){

          //ratio based on comp around 768/922
          self.$el.css('height' , 1.05 * self.$el.width());

          return;
        }


        self.$el.css('height' , (0.4977817214) * self.$el.width());
        
        if($(window).width() < 1085 && $(window).width() > 930){
          self.$el.css('height' , (0.4977817214 + 0.06) * self.$el.width());
        }else if($(window).width() < 930) {
          self.$el.css('height' , (0.4977817214 + 0.1) * self.$el.width());
        }

        //t.isTabletMode = true;

  
        //t.$el.css('height' , (0.80) * t.$el.width());

        return;

        if(self.autoScaleContainer === true){

          console.log('setting new height on container: ' , self.resizeRatio * self.$el.width() < 365);

          if(self.resizeRatio * self.$el.width() < 365 === true || self.isMobileMode === true){
              console.log('sorry max height reached');
               self.$el.css('height' , 365 + 'px');
              return;
          }
          self.$el.css('height' , self.resizeRatio * self.$el.width());
        }
      },

      onDragStart : function(e){
        var self = this,
            point;

        self.dragSuccess = false;

        console.log('drag start' , e.type);

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
          //console.log(point);
        }

        self.isDragging = true;

        self.$doc.on(self.moveEvent , $.proxy(self.dragMove , self)).on(self.upEvent , $.proxy(self.dragRelease , self));

        self.currMoveAxis = '';
        self.hasMoved = false;
        self.pageX = point.pageX;
        self.pageY = point.pageY;

        self.startDragX = point.pageX;//

        self.startPagePos = self.accelerationPos =  point.pageX;

        self.horDir = 0;
        self.verDir = 0;

        self.currRenderPosition = self.sPosition;

        self.startTime = new Date().getTime();

        if(self.hasTouch) {
          self.sliderOverflow.on(self.cancelEvent, function(e) { self.dragRelease(e, isThumbs); });  
        }

        self.moveTo();


      },

      //%renderMovement
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

          var pointPos = isHorizontal ? self.pageX : self.pageY;

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

          if (timeStamp - self.startTime > 200) {
            self.startTime = timeStamp;
            self.accelerationPos = pointPos;                       
          }

          //animate?
          self.setPosition(self.currRenderPosition);
        }        
      },

      setPosition: function(pos) {

        iQ.update();

        var self = this;
        var pos = self.sPosition = pos;

        if(self.useCSS3Transitions) {
          var animObj = {};
          animObj[ (self.vendorPrefix + self.TD) ] = 0 + 'ms';
          animObj[ self.xProp] = self.tPref1 + (pos + self.tPref2 + 0) + self.tPref3;
          self.$container.css(animObj);        

        } else {
          self.$container.css(self.xProp, pos);
        }
      },

      dragRelease: function(e, isThumbs){
        var self = this,
            totalMoveDist,
            accDist,
            duration,
            v0,
            newPos,
            newDist,
            newDuration,
            blockLink,
            point = {};


        self.renderMoveEvent = null;
        self.isDragging = false;
        self.lockAxis = false;
        self.checkedAxis = false;
        self.renderMoveTime = 0;

        cancelAnimationFrame(self.animFrame);

        //stop listening on the document for movement
        self.$doc.off(self.moveEvent).off(self.upEvent);

        if(self.hasTouch) {
            self.sliderOverflow.off(self.cancelEvent);    
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
          var newPos = -self.currentId * self.currentContainerWidth,
          newDist = Math.abs(self.sPosition  - newPos);
          self.currAnimSpeed = newDist / v0;

          if(isSlow) {
              self.currAnimSpeed += 250; 
          }
          self.currAnimSpeed = getCorrectSpeed(self.currAnimSpeed);
          
          self.moveTo();
        }

        var snapDist = self.minSlideOffset,
            point = self.hasTouch ? e.originalEvent.changedTouches[0] : e,
            pPos = point.pageX,
            sPos = self.startPagePos,
            axPos = self.accelerationPos,
            axCurrItem = self.currSlideId,
            axNumItems = self.numSlides,
            dir = self.horDir,
            loop = self.loop,
            changeHash = false,
            distOffset = 0,
            dragDirection;
        
        totalMoveDist = Math.abs(pPos - sPos);

        dragDirection = self.startDragX > pPos ? 1 : 0;

        //TODO: touch is not generating the point.x on release
        //console.log(point);
        //console.log('When I started dragging I was here -->' , t.startDragX , 'Now I am here -->' , point.x  , dragDirection);

        accDist = pPos - axPos;

        duration = (new Date().getTime()) - self.startTime;
        v0 = Math.abs(accDist) / duration;

        console.log('MoveDst:' , totalMoveDist , self.currentContainerWidth * 0.5);

        if( totalMoveDist > self.hasTouch ? Math.abs(self.currentContainerWidth * 0.25) : Math.abs(self.currentContainerWidth * 0.5) ){
          
          //alert( totalMoveDist + ',' + t.hasTouch ? t.swipeThreshold : Math.abs(t.currentContainerWidth * 0.5));
         
          if(dragDirection === 1){
            self.currentId ++;
            console.log('snap to next slide');
            if(self.currentId >= self.$slides.length){
              self.currentId = self.$slides.length - 1;
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

      dragMove: function(e , isThumbs){



        var self = this,
            point;

        if(self.hasTouch) {
          if(self.lockAxis) {
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

        if(!self.hasMoved) {
          if(self.useCSS3Transitions) {
              self.$container.css((self.vendorPrefix + self.TD), '0s');
          }
          (function animloop(){
            if(self.isDragging) {
              self.animFrame = requestAnimationFrame(animloop);
              if(self.renderMoveEvent){

                self.renderMovement(self.renderMoveEvent, isThumbs);
              }
                  
            }
              
          })();
        }
            
        if(!self.checkedAxis) {
          
          var dir = true,
              diff = (Math.abs(point.pageX - self.pageX) - Math.abs(point.pageY - self.pageY) ) - (dir ? -7 : 7);

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

      updateSlides: function(){
        var self = this,
            cw = self.currentContainerWidth = self.$container.outerWidth(),
            animObj = {};

        self.$slides.each(function(i){
          $(this).css({
            'left': i * cw + 'px',
            'z-index' : i
          });  

          //TODO: add spacing between slides going to be tricky to try and animate to them with no extra spacing
          //- (self.currentId > 0 ? self.shuffleGutters(self.currentContainerWidth) : 0)

          //console.log("My new z-index »",$(this).css('zIndex'));
        });

        //set containers over all position based on current slide
        //self.$container.css('' : '');
        animObj[ (self.vendorPrefix + self.TD) ] = self.animationSpeed * 0.25 + 'ms';
        animObj[ (self.vendorPrefix + self.TTF) ] = $.rpCSS3Easing[ 'easeInOutSine' ];
        animObj[ self.xProp ] = self.tPref1 + ((-self.currentId * cw) + self.tPref2 + 0) + self.tPref3;

        self.$container.css( animObj );  
      },

      moveTo: function(type,  speed, inOutEasing, userAction, fromSwipe){
        var self = this,
            newPos = -self.currentId * self.currentContainerWidth,
            diff,
            newId,
            animObj = {};

        if( !self.useCSS3Transitions ) {
          
          //jQuery fallback
          animObj[ self.xProp ] = newPos + 'px';
          self.$container.animate(animObj, self.animationSpeed, 'easeInOutSine');

        }else{

          //css3 transition
          animObj[ (self.vendorPrefix + self.TD) ] = self.animationSpeed + 'ms';
          animObj[ (self.vendorPrefix + self.TTF) ] = $.rpCSS3Easing[ 'easeInOutSine' ];
          
          self.$container.css( animObj );

          animObj[ self.xProp ] = self.tPref1 + (( newPos ) + self.tPref2 + 0) + self.tPref3;
  
          self.$container.css( animObj );  

          //IQ Update
          self.$container.one($.support.transition.end , function(){
            window.iQ.update();
          });

        }

        //update the overall position
        self.sPosition = self.currRenderPosition = newPos;

        self.ev.trigger('rpOnUpdateNav');


        //console.log(t.ev , ' <---- events object');
      },

      goBackToDesktop: function(){
        var self = this;
        if(self.isDesktopMode === false){
          self.isDesktopMode = true;
          //self.$container.html(self.markup);
          //iQ.update();

/*          setTimeout(function(){
            $(window).trigger('resize');
            
          } , 1000);*/
            
          //t.scroller.destroy();  
          
          //t.scroller.disable();

         

          $('.container').removeClass('grid4').addClass('grid5');

          self.$galleryItems.each(function(){
            var item = $(this).removeClass('small-size'),
                slide = item.data('slide');

                item.appendTo(slide);
          });

          self.$container.css( 'width' , '' );
          self.$container.append(self.$slides);
          
          //t.$container.off('.rp');
          //restart listener for slideshow
          self.$container.on(self.downEvent, function(e) { self.onDragStart(e); });
        
          $('.paddle').show();
          $('.rpNav').show();
          
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
        var self = $(this);
        if (typeof options === "object" ||  !options) {
          if( !self.data('relatedProducts') ) {
            self.data('relatedProducts', new RelatedProducts(self, options));
          }
        } else {
          var relatedProducts = self.data('relatedProducts');
          if (relatedProducts && relatedProducts[options]) {
              return relatedProducts[options].apply(relatedProducts, Array.prototype.slice.call(args, 1));
          }
        }
      });
    };

    //defaults for the related products
    $.fn.relatedProducts.defaults = { 
      throttleTime: 50,
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
        var self = this;

        function handleBreakpoint(){

          console.log("OPERATE ON ME! I am in tablet / Mobile view.... »" , true);

          // 1. step one  - cancel touch events for the 'slideshow'
          self.$container.off('.rp');

          // 2. hide paddles 
          $('.paddle').hide();

          $('.rpNav').hide();

          //attemp to place the title plates in the first position before detaching
          self.$slides.each(function(){ 
            var $s = $(this),
                $plate = $s.find('.plate').eq(0);

                //put the title plate at the beginning
                $s.prepend($plate);
          });


          // 3. gather gallery items and save local reference - may need to set on t
          var $galleryItems = $('.gallery-item').detach().addClass('small-size');
          
          // 4. remove the slides
          self.$slides.detach();

          //clear out the position style on the gallery items
          $galleryItems.removeAttr('style');

          //5 . put the item back into the container
          $galleryItems.appendTo(self.$container);
          
          // 7. init the scroller module
          setTimeout(function(){

            if(self.scrollerModule != null){

              self.scrollerModule.destroy();
              self.scrollerModule = null;
            }

            self.scrollerModule = $('.rpOverflow').scrollerModule({
              contentSelector: '.rpContainer',
              itemElementSelector: '.gallery-item',
              mode: 'free',
              lastPageCenter: false,
              extraSpacing: 0
            }).data('scrollerModule');

            //self.scroller.enable();
            iQ.update();

            console.log("Instantiating scroller module »");

          }, 100); 



          return;

          // if(!!self.isMobileMode){ console.log("ALREADY IN MOBILE VIEW »", self.scroller); return false; } //if we are already in mobile exit

          // self.isMobileMode = true;

          // //do mobile stuff
          // console.log('handling mobile view for the first time: ' , self.scroller === undefined);

          //$('.rpContainer').wrap('<div class="scroller" id="scrollerrp" />');

          //creat scroller instance / cache on parent of later toggle // :) !
            
          // self.$container.off('.rp');

          // $('.rpNav').hide();

          //unwrap HTML

          // var items = $('.gallery-item').detach().addClass('small-size');
          
          // $('.product-img' ).css('height' , '');

          // items.css('height' , '').addClass('small-size');

          // $('[class*="rpSlide"]').remove();

          // items.appendTo(self.$container);

          //var $cache = $('.rpContainer').html();

          //cols.removeClass().appendTo(t.$container).addClass('whoa'); //insert these back in and add class for diff display

          //console.log("HOW MANY PRODUCTS WERE THERE? »", cols.length);

          //t.scroller.update(); //update item

          //updat container size based on now what is inside
          //t.$container.css( 'width' , (items.eq(0).outerWidth(true) * items.length) + 4750px + 'px' );
          // self.$container.css( 'width' , 4750 + 'px' );

          //console.log(self.$container.width());

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

         //$('.rpOverflow').scrollerModule({});


          //idea here is that we want to put the stuff back in as it was orginally
/*          t.ev.one('ondesktopbreakpoint.rp' , function(){

            setTimeout(function(){
              self.scroller.destroy();
              self.scroller = null;
              self.scroller = undefined;
              
              self.$container.css('width' , '100%');
              self.$container.html('');
              self.$container.html(self.markup); 
              self.$slides = self.$el.find('.rpSlide');
              self.$container.on(self.downEvent, function(e) { t.onDragStart(e); });

              $('.rpNav').show();

              //fire a resize event to reposition slides?
              $(window).trigger('resize');

              self.isMobileMode = false;

              //update container width
            }, 250);

          });*/

          //TODO: destroy this instance - t.iscroll.destroy();
          //self.iscroll = null;

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

        self.ev.on( 'onmobilebreakpoint.rp' , handleBreakpoint );
            
      }


    });

    $.rpModules.mobileBreakpoint = $.rpProto._initMobileBreakpoint;


 })(jQuery, Modernizr, window,undefined);


//
(function($, Modernizr, window, undefined) {

    'use strict';

    $.extend($.rpProto, {
      _initTabletBreakpoint: function(){
        var self = this;
        function handleBreakpoint() {

          console.log("RP Tablet breakpoint »");

          if(!!self.isTabletMode){ console.log("Already In Tablet VIEW »"); return false; } //if we are already in tablet exit

          self.isTabletMode = true;

          //hide paddles
          $('.paddle').hide();

          $('.container').removeClass('grid5').addClass('grid4');

          //unwrap HTML

          var items = $('.gallery-item')/*.detach()*/.addClass('tablet-size');
          
         /*$('.product-img' ).css('height' , '');
          items.css('height' , '').addClass('small-size');
          $('[class*="rpSlide"]').remove();
          items.appendTo(self.$container);*/

        }

        self.ev.on( 'ontabletbreakpoint.rp' , handleBreakpoint );
      }

    });
    $.rpModules.tabletBreakpoint = $.rpProto._initTabletBreakpoint;
  })(jQuery, Modernizr, window,undefined);


