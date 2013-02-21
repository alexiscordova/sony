// Related Products (RelatedProducts) Module
// --------------------------------------------
//
// * **Class:** RelatedProducts
// * **Version:** 0.1
// * **Modified:** 02/08/2013
// * **Author:** Tyler Madison , Glen Cheney
// * **Dependencies:** jQuery 1.7+ , Modernizr
//
// *Notes:*
//
// *Example Usage:*
//
//      $('.related-products').relatedProducts();
//
//
;(function(SONY , $, Modernizr, window, undefined , console) {

    'use strict';

    if(!$.rpModules) {
        $.rpModules = {};
    }

    //start module
    var RelatedProducts = function(element, options){
      var self      = this,
      ua            = navigator.userAgent.toLowerCase();

      $.extend(self , $.fn.relatedProducts.defaults , options);

      // feature detection, some ideas taken from Modernizr
      var tempStyle = document.createElement('div').style,
      vendors       = ['webkit','Moz','ms','O'],
      vendor        = '',
      lastTime      = 0,
      tempV         = '';

      for (var i = 0; i < vendors.length; i++ ) {
        tempV = vendors[i];
        if (!vendor && (tempV + 'Transform') in tempStyle ) {
            vendor = tempV;
        }
        tempV = tempV.toLowerCase();
      }

      var bT = vendor + (vendor ? 'T' : 't' ),
      transEndEventNames = {
          'WebkitTransition' : 'webkitTransitionEnd',
          'MozTransition'    : 'transitionend',
          'OTransition'      : 'oTransitionEnd',
          'msTransition'     : 'MSTransitionEnd',
          'transition'       : 'transitionend'
      };

      self.useCSS3Transitions = Modernizr.csstransitions;

      if(self.useCSS3Transitions) {
          self.use3dTransform = Modernizr.csstransforms3d;
      }

      self.$paddles              = $({});
      self.$el                   = $(element);
      self.$slides               = self.$el.find('.rp-slide');
      self.$currentSlide         = null;
      self.$shuffleContainers    = self.$slides.find('.shuffle-container');
      self.$galleryItems         = self.$el.find('.gallery-item');
      self.$container            = self.$el.find('.rp-container').eq(0);
      self.$tabbedContainer      = self.$el.parent();
      self.$bulletNav            = $();
      self.$doc                  = $(document);
      self.$win                  = $(window);
      self.$html                 = $('html');

      self.vendorPrefix          = '-' + vendor.toLowerCase() + '-';
      self.ev                    = $({}); //event object
      self.prefixed              = Modernizr.prefixed;
      self.transitionName        = self.prefixed('transition');
      self.isTabbedContainer     = self.$tabbedContainer.length > 0 && self.$tabbedContainer.hasClass('rp-container-tabbed');
      self.transitionEndName     = transEndEventNames[ self.transitionName ];
      self.mode                  = self.$el.data('mode').toLowerCase();
      self.variation             = self.$el.data('variation');
      self.numSlides             = self.$slides.length;
      self.sliderOverflow        = self.$el.find('.rp-overflow').eq(0);
      self.previousId            = -1;
      self.currentId             = 0;
      self.slidePosition         = 0;
      self.animationSpeed        = 1000;
      self.slides                = [];
      self.slideCount            = self.$slides.length;
      self.currentContainerWidth = 0;
      self.sPosition             = 0;
      self.scrollerModule        = null;
      self.shuffle               = null;
      self.shuffleSpeed          = 250;
      self.shuffleEasing         = 'ease-out';
      self.paddlesEnabled        = false;
      self.hasMediaQueries       = Modernizr.mediaqueries;
      self.mq                    = Modernizr.mq;
      self.oldIE                 = self.$html.hasClass('lt-ie8');

      if( !self.hasMediaQueries && $('html').hasClass('lt-ie9') ){
        self.mq = function(){
          return false;
        };
      }

      if(self.variation !== undefined){
        self.variation = self.variation.split('-')[2];
      }

      //modes
      self.isMobileMode          = false;
      self.isDesktopMode         = false;
      self.isTabletMode          = false;
      self.accelerationPos       = 0;

      //init plugins
      $.each($.rpModules, function (helper, opts) {
          opts.call(self);
      });

      self.$galleryItems.each(function(){
        var $item = $(this);
        $item.data('slide' , $item.parent());
      });

      if(Modernizr.touch) {
          self.hasTouch         = true;
          self.downEvent        = 'touchstart.rp';
          self.moveEvent        = 'touchmove.rp';
          self.upEvent          = 'touchend.rp';
          self.cancelEvent      = 'touchcancel.rp';
          self.lastItemFriction = 0.5;
      } else {
          self.hasTouch = false;
          self.lastItemFriction = 0.2;

/*          if (browser.msie || browser.opera) {
            self.grabCursor = self.grabbingCursor = "move";
          } else if(browser.mozilla) {
            self.grabCursor     = "-moz-grab";
            self.grabbingCursor = "-moz-grabbing";
          } else if(isWebkit && (navigator.platform.indexOf("Mac")!=-1)) {
            self.grabCursor     = "-webkit-grab";
            self.grabbingCursor = "-webkit-grabbing";
          }*/

          self.downEvent   = 'mousedown.rp';
          self.moveEvent   = 'mousemove.rp';
          self.upEvent     = 'mouseup.rp';
          self.cancelEvent = 'mouseup.rp';
          self.clickEvent  = 'click.rp';
      }

      if(self.useCSS3Transitions) {

        // some constants for CSS3
        self.TP     = 'transition-property';
        self.TD     = 'transition-duration';
        self.TTF    = 'transition-timing-function';
        self.yProp  = self.xProp = self.vendorPrefix +'transform';

        if(self.use3dTransform) {
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

      self.shuffleGutters = function (containerWidth){
        var gutter = 0,
            numColumns = 0;

        if ( !Modernizr.mediaqueries || self.mq('(min-width: 981px)') || $('html').hasClass('lt-ie10') ) {
          gutter = window.Exports.GUTTER_WIDTH_SLIM_5 * containerWidth;
          numColumns = 5;

        // // Portrait Tablet ( 4 columns ) - masonry
        } else if ( self.mq('(min-width: 567px)') ) {
          numColumns = 4;
          gutter = window.Exports.GUTTER_WIDTH_SLIM * containerWidth;
        // Between Portrait tablet and phone ( 3 columns )
        }

        self.setColumns(numColumns);

        if(gutter < 0){
          gutter = 0;
        }

        return gutter;
      };

      self.shuffleColumns = function(containerWidth){
          var column = 0;

          if ( !Modernizr.mediaqueries || self.mq('(min-width: 981px)') || $('html').hasClass('lt-ie10')) {
            column = window.Exports.COLUMN_WIDTH_SLIM_5 * containerWidth; // ~18% of container width

          // Between Portrait tablet and phone ( 3 columns )
          } else if ( self.mq('(min-width: 567px)') ) {
            column = window.Exports.COLUMN_WIDTH_SLIM * containerWidth;
          }else{
            column = containerWidth;
          }

          if(column === 0){
            column = 0.001;
          }

          return column;
      };
      //start her off
      self.init();

    };

    RelatedProducts.prototype = {
      setupLinkClicks: function(){

        var self = this;

        self.$galleryItems.on( self.clickEvent , function(e){

          var $this = $(this),
              destination = $this.attr('href');

          if ( self.startInteractionTime ) {
            if ((new Date().getTime()) - self.startInteractionTime < 250) {
              window.location = destination;
            }
          }
        });

        self.$galleryItems.on( self.clickEvent, function(e){
          e.preventDefault();
        });
      },

      toString: function(){
        return '[ object RelatedProducts ]';
      },

      init: function(){
        var self = this;

        self.$paddles.hide();
        self.setupLinkClicks();

        // Don't do this for modes other than 3 and 4 up
        if(self.variation === '3up' || self.variation === '4up' || self.variation === '5up'){
          self.setSortPriorities();
        }

        if(self.$slides.length > 1){
          self.createNavigation();
          if(!self.hasTouch){
            self.setupPaddles();
          }
          if(self.mode != 'strip'){
            self.$container.on(self.downEvent, function(e) { self.onDragStart(e); });
          }
        }
        if(self.mode != 'strip'){
          self.setSortPriorities();
          self.setupResizeListener();
          //self.log('rp - init');
          $(window).trigger('resize');
        }else {
          self.setupStripMode();
        }

      },
      setupResizeListener: function(){
        var self = this,
        resizeTimeout = null;

        if(self.mode !== 'suggested'){
          $(window).on('resize', function(){
            if(!self.isMobileMode && self.$win.width() > 567) {

             self.$galleryItems.css({
               'visibility' : 'hidden',
                'opacity' : 0
              });

             self.$el.addClass('redrawing');

           }else{
             self.$el.css({
              'opacity' : 1,
              'visibility' : 'visible'
              });
               self.$galleryItems.not('.blank').css({
               'visibility' : 'visible',
                'opacity' : 1
              });

              self.$el.removeClass('redrawing');
           }

          });
        }

    
      $(window).on('resize', $.debounce(200 , function() {
          self.checkForBreakpoints();
          self.updateSliderSize();
          self.updateSlides();
          self.updatePaddles();

          if(self.mode === 'suggested'){
            return;
          }

          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(function(){

            self.$shuffleContainers.each(function(){
              var shfflInst = $(this).data('shuffle');

              if(shfflInst === undefined){return;}

              setTimeout(function(){
                self.updateSliderSize();
                self.updateTiles();
                shfflInst.update();
                self.animateTiles();

               //self.log('done with resize');

               //some test vars



              } , 250);

            });
          } , 10);
        }));

      },

      log : function (){
        var strOut = '';

        for (var i = 0 ; i < arguments.length ; i ++){
          strOut += arguments[i];
          strOut += i > 0 ? ' , ' : '';
        }

        window.alert(strOut);

      },
      setupStripMode: function(){
        var self = this;

        //clear out the position style on the gallery items
        self.$galleryItems.removeAttr('style');

        //self.$galleryItems.addClass('mobile-item').first().removeClass('mobile-item');

        var containerWidth = self.$el.width();
        var gutterWidth = window.Exports.GUTTER_WIDTH_SLIM_5 * containerWidth;
        var colWidth = ( window.Exports.COLUMN_WIDTH_SLIM_5 * (containerWidth ) );

        self.$galleryItems.not(self.$galleryItems.first()).css({
          'width' : colWidth,
          'margin' : 0,
          'margin-left' : 0,
          'margin-top': 0
        });

        self.$galleryItems.first().css({
          'width' : colWidth,
          'margin' : 0
        });

        //self.$galleryItems.addClass('small-size');

        // 7. init the scroller module
        setTimeout(function(){

          if(self.scrollerModule !== null){
            self.scrollerModule.destroy();
            self.scrollerModule = null;
          }

          self.scrollerModule = self.$el.find('.rp-overflow').scrollerModule({
            contentSelector: '.rp-container',
            itemElementSelector: '.gallery-item',
            mode: 'paginate',
            generatePagination: true,
            centerItems: false,
            autoGutters: false,
            gutterWidth: gutterWidth,
            iscrollProps: {
              snap: true,
              momentum: false,
              hScrollbar: false,
              vScrollbar: false
            }

          }).data('scrollerModule');

          self.$galleryItems.find('.product-name').evenHeights();

          //self.scroller.enable();
          window.iQ.update();

          //$(window).trigger('resize.rp');

        }, 50);


        $(window).on('resize.rp', $.debounce(50 , function() {

        var containerWidth = self.$el.width();
        var gutterWidth = window.Exports.GUTTER_WIDTH_SLIM_5 * containerWidth;
        var colWidth = ( window.Exports.COLUMN_WIDTH_SLIM_5 * (containerWidth ) );

          self.scrollerModule.setGutterWidth(gutterWidth);


          self.$galleryItems.not(self.$galleryItems.first()).css({
            'width' : colWidth,
            'margin' : 0,
            'margin-left' : 0,
            'margin-top': 0
          });

          self.$galleryItems.first().css({
            'width' : colWidth,
            'margin' : 0
          });

        }));

      },


      tapOrClick: function(){
        var self = this;
        return self.hasTouch ? 'touchend' : 'click';
      },

      createNavigation: function(){

        var self = this;

        if ( !$.fn.sonyNavDots ) {
          return;
        }

        if ( self.$pagination ) {
          self.$pagination.sonyNavDots('reset', {
            'buttonCount': self.numSlides
          });
          return;
        }

        self.$pagination = $('<div/>', { 'class' : 'navigation-container' });

        self.$el.append( self.$pagination );

<<<<<<< HEAD
          if(item.length) {
            self.currentId = item.data('index');
            //console.log('clicked on ' , self.currentId);
            self.moveTo();
          }
=======
        self.$pagination.sonyNavDots({
          'buttonCount': self.numSlides
        });

        self.$pagination.on('SonyNavDots:clicked', function(e, a){
          self.gotopage(a);
>>>>>>> origin/master
        });

        self.ev.on( 'rpOnUpdateNav', $.debounce(500, function() {
          self.$pagination.sonyNavDots('reset', {
            'activeButton': self.currentId
          });
        }));
      },

      setupPaddles: function(){
        var self   = this,
        itemHTML   = '<div class="paddle"><i class=fonticon-10-chevron></i></div>',
        $container = self.$el.closest('.container');

        self.paddlesEnabled = true;
        var out = '<div class="rp-nav rp-paddles">';
        for(var i = 0; i < 2; i++) {
          out += itemHTML;
        }
        out += '</div>';
        out = $(out);

        //TODO: add paddles
        self.$el.append(out);

        self.$paddles     = self.$el.find('.paddle');
        self.$leftPaddle  = self.$paddles.eq(0).addClass('left');
        self.$rightPaddle = self.$paddles.eq(1).addClass('right');

        self.$paddles.on(self.tapOrClick() , function(){
          var p = $(this);

          if(p.hasClass('left')){

            self.currentId --;
            if(self.currentId < 0){
              self.currentId = 0;
            }

            self.moveTo();

          }else{

            self.currentId ++;

            if(self.currentId >= self.$slides.length){
              self.currentId = self.$slides.length - 1;
            }

            self.moveTo();
          }

        });

        self.onPaddleNavUpdate();

        self.ev.on('rpOnUpdateNav' , $.proxy(self.onPaddleNavUpdate , self));
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

      createShuffle: function(){
        var self = this;

        self.shuffle = self.$shuffleContainers.shuffle({
          itemSelector: '.gallery-item',
          speed: self.shuffleSpeed,
          easing: self.shuffleEasing,
          columnWidth: self.shuffleColumns,
          gutterWidth: self.shuffleGutters,
          showInitialTransition: false,
          useTransition: false,
          // buffer: 100
          buffer: 25
        }).first().data('shuffle');




      },

      setColumns : function( numColumns ) {
        var self               = this,
        allSpans               = 'span1 span2 span3 span4 span6',
        shuffleDash            = 'shuffle-',
        gridClasses            = [ shuffleDash + 3, shuffleDash + 4, shuffleDash + 5, 'grid-small' ].join(' '),
        itemSelector           = '.gallery-item',
        grid5                  = 'slimgrid5',
        slimgrid               = 'slimgrid',
        span                   = 'span',
        large                  = '.large',
        promo                  = '.promo',
        normal                 = '.normal',
        medium                 = '.medium',
        plate                  = '.plate',
        largeAndPromoAndMedium = large + ',' + promo + ',' + medium + ',' + plate;

        if ( numColumns === 5 ) {
          if ( !self.$container.hasClass( shuffleDash + 5 ) ) {



            self.$shuffleContainers.removeClass('slimgrid')
            .addClass('slimgrid5');

            self.$shuffleContainers.children(itemSelector)
              .removeClass(allSpans)// Remove current grid span
              .filter(medium)       // Select large tiles
              .addClass(span+2)     // Make them 3/5 width
              .end()                // Go back to all items
              .filter(plate)        // Select promo tiles
              .addClass(span+2)     // Make them 2/5 width
              .end()                // Go back to all items
              .filter(normal)       // Select tiles not large nor plate
              .addClass(span+1);    // Make them 1/5 width
          }

        // Portrait Tablet ( 4 columns ) - masonry
        } else if ( numColumns === 4 ) {

          if ( !self.$shuffleContainers.hasClass( shuffleDash + 4 ) ) {

            self.$shuffleContainers.removeClass('slimgrid5')
            .addClass('slimgrid');

            self.$shuffleContainers.children(itemSelector)
              .removeClass(allSpans)// Remove current grid span
              .filter(medium)       // Select large and promo tiles
              .addClass( span + 6 ) // Make them half width
              .end()
              .filter(plate)        // Go back to all items
              .addClass( span + 6 )
              .end()
              .filter(normal)       // Select tiles not large nor promo
              .addClass( span + 3 );// Make them quarter width
          }


          //Between Portrait tablet and phone ( 3 columns )
        }
        return self;
      },

      setSortPriorities: function(){
        var self = this;

        self.$slides.each(function(){

          var $slide     = $(this),
          $items         = $slide.find('.gallery-item'),
          slideVariation = $slide.data('variation').split('-')[2],
          hitNormal      = false;

          $items.each(function(){
            var $item = $(this);

            //covers off on sorting blank tiles
            if(slideVariation === '4up'){
              if($item.hasClass('medium')){

                $item.data('priority' , 5);

              }else if($item.hasClass('normal') && !hitNormal){

                $item.data('priority' , 2);

                hitNormal = true;
              }else if($item.hasClass('blank')){

                $item.data('priority' , 3);

              }
              else if($item.hasClass('normal') && hitNormal === true){

                $item.data('priority' , 4);
              }
            }else if (slideVariation === '3up'){
              if($item.hasClass('medium')){

                $item.data('priority' , 2);

              }else if($item.hasClass('normal')){

                $item.data('priority' , 3);
              }

              if($item.hasClass('blank')){

                 $item.data('priority' , 100);
              }

            }

          });

        });

      },

      sortByPriority : function() {
        var self = this,
            isTablet = self.mq('(min-width: 567px) and (max-width: 980px)');

        if ( isTablet && !self.sorted ) {

          self.$shuffleContainers.each(function(){

            var $shuffleContainer = $(this),
                slideVariation = $shuffleContainer.parent().data('variation').split('-')[2];

            $shuffleContainer.shuffle('sort', {
              by: function($el) {
                var priority = $el.hasClass('plate') ? 1 : $el.hasClass('medium') ? 2 : 3;

                //TODO: sort by priority with blanks
                if(slideVariation == '4up' || slideVariation == '3up'){
                  priority = $el.data('priority');

                }

                // Returning undefined to the sort plugin will cause it to revert to the original array
                return priority ? priority : undefined;
              }
            });
          });

          self.sorted = true;
        } else if ( !isTablet && self.sorted ) {
          self.$shuffleContainers.shuffle('sort', {});
          self.sorted = false;
        }

      },

      checkForBreakpoints: function(){
        var self = this,
        wW       = self.$win.width(),
        view     = wW > 980 ? 'desktop' : wW > 567 ? 'tablet' : 'mobile';


        //if the browser doesnt support media queries...IE default to desktop
        if(!Modernizr.mediaqueries || $('html').hasClass('lt-ie10')){
          view = 'desktop';
        }

        switch(view){
          case 'desktop':

            if(self.mode === 'suggested'){
              self.$el.find('.gallery-item').addClass('span6');
              self.$el.removeClass('grid')
              .addClass('slimgrid');

              self.sortTagLines2up();
              return;
            }

           //check if we are coming out of mobile
            if(self.isMobileMode === true){
              //checkmarkup();
              self.returnToFullView();
            }

            self.isTabletMode = self.isMobileMode = false;

            if(self.isDesktopMode === true){
              return;
            }

            self.isDesktopMode = true;
            self.$el.removeClass('rp-tablet rp-mobile')
                                    .addClass('rp-desktop');

            if(self.scrollerModule !== null){

              self.scrollerModule.destroy();
              self.scrollerModule = null;

            }

            if(self.shuffle === null){
              self.$container.css('width' , '100%');
              self.createShuffle();
            }

            self.sortByPriority();

            window.iQ.update();



            self.ev.trigger('ondesktopbreakpoint.rp');

          break;

          case 'tablet':

            var wasMobile = self.isMobileMode;

            //alert('tablet');

            if(self.mode === 'suggested'){
              self.$el.find('.gallery-item').addClass('span6');
              self.$el.removeClass('slimgrid')
              .addClass('grid');
              self.sortTagLines2up();
              return;
            }

            //check if we are coming out of mobile
            if(self.isMobileMode === true){
              self.returnToFullView();
            }

            if(self.isTabletMode === true){
              return;
            }

            self.isMobileMode = self.isDesktopMode = false;
            self.isTabletMode = true;

            self.$el.removeClass('rp-desktop rp-mobile')
                    .addClass('rp-tablet');

            if(self.scrollerModule !== null){

              self.scrollerModule.destroy();
              self.scrollerModule = null;

            }

            if(self.shuffle === null){
              self.$container.css('width' , '100%');
              self.createShuffle();
            }

            self.sortByPriority();

            window.iQ.update();

          break;

          case 'mobile':



            if(self.isMobileMode === true){
              return;
            }



            if(self.mode === 'suggested'){
              self.$el.find('.gallery-item').removeClass('span6');
              self.$el.removeClass('grid slimgrid');
              self.sortTagLines2up();
              return;
            }

            self.isTabletMode = self.isDesktopMode = false;
            self.isMobileMode = true;

            self.$el.removeClass('rp-tablet rp-desktop')
                    .addClass('rp-mobile');

            //destroy the shuffle instance
            if(self.shuffle !== null){
              self.shuffle.destroy();
              self.shuffle = null;
              self.sorted = false;

              self.$shuffleContainers.each(function(){
                var shfflInst = $(this).data('shuffle');


                if(shfflInst !== undefined){
                  shfflInst.destroy();
                  shfflInst = null;
                }

              });

            }

            //hide the bullet navigation
            self.$bulletNav.hide();

            window.iQ.update();

            if(self.scrollerModule !== null){

              self.scrollerModule.destroy();
              self.scrollerModule = null;

            }
            //is this where i break?

            self.ev.trigger('onmobilebreakpoint.rp');

          break;
        }

        self.setNameHeights(self.$shuffleContainers);

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

        //handle stuff for old IE
        if( self.oldIE ){

          self.$el.css( 'height' , 680 + 'px' );

          return;
        }


        if(self.mode === 'suggested'){
          return;
        }

        //handle resize for various layouts
        if(self.isTabletMode === true){
          //ratio based on comp around 768/922
          //self.$el.css('height' , 1.05 * self.$el.width());
          self.$el.css( 'height' , $('.shuffle-container').eq(0).height() + 40 + 'px' );

          if(!!self.isTabbedContainer){
            //self.$tabbedContainer.css('height' , ((0.524976) * self.$shuffleContainers.eq(0).width()) + 150);
            self.$tabbedContainer.css('height' , $('.shuffle-container').eq(0).height() + 40 + 'px');
          }
          return;
        }

        if(self.isMobileMode === true){

          self.$el.css('height' , 400);

          if(!!self.isTabbedContainer){
            self.$tabbedContainer.css('height' , 400);
          }
          return;
        }

        //self.$el.css( 'height' , ((0.524976) * self.$shuffleContainers.eq(0).width()) );
        self.$el.css( 'height' , $('.shuffle-container').eq(0).height() + 40 + 'px' );

        if(!!self.isTabbedContainer){
          //self.$tabbedContainer.css('height' , ((0.524976) * self.$shuffleContainers.eq(0).width()) + 150);
          self.$tabbedContainer.css('height' , $('.shuffle-container').eq(0).height() + 40 + 'px');
        }


      },

      onDragStart : function(e){
        var self = this,
            point;

        self.dragSuccess = false;

        //self.setGrabCursor();//toggle grabber

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

          if(e.which !== 1){
            return;
          }
        }

        self.isDragging         = true;
        self.$doc.on(self.moveEvent , $.proxy(self.dragMove , self)).on(self.upEvent , $.proxy(self.dragRelease , self));
        self.currMoveAxis       = '';
        self.hasMoved           = false;
        self.pageX              = point.pageX;
        self.pageY              = point.pageY;
        self.startDragX         = point.pageX;//
        self.startPagePos       = self.accelerationPos =  point.pageX;
        self.horDir             = 0;
        self.verDir             = 0;
        self.currRenderPosition = self.sPosition;
        //self.startTime          = new Date().getTime();
        self.startTime = self.startInteractionTime = new Date().getTime();

        if(self.hasTouch) {
          self.sliderOverflow.on(self.cancelEvent, function(e) { self.dragRelease(e, false); });
        }

        self.moveTo();

      },

      //%renderMovement
      renderMovement: function(point , isThumbs){
        var self = this;
        if(self.checkedAxis) {

          var timeStamp = self.renderMoveTime,
          deltaX        = point.pageX - self.pageX,
          deltaY        = point.pageY - self.pageY,
          newX          = self.currRenderPosition + deltaX,
          newY          = self.currRenderPosition + deltaY,
          isHorizontal  = true,
          newPos        = isHorizontal ? newX : newY,
          mAxis         = self.currMoveAxis;

          self.hasMoved = true;
          self.pageX    = point.pageX;
          self.pageY    = point.pageY;


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

      setPosition: function(posi) {

        window.iQ.update();

        var self = this,
            pos = self.sPosition = posi;

        if(self.useCSS3Transitions) {
          var animObj                              = {};
          animObj[ (self.vendorPrefix + self.TD) ] = 0 + 'ms';
          animObj[ self.xProp]                     = self.tPref1 + (pos + self.tPref2 + 0) + self.tPref3;
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
        blockLink;

        self.renderMoveEvent = null;
        self.isDragging      = false;
        self.lockAxis        = false;
        self.checkedAxis     = false;
        self.renderMoveTime  = 0;

        window.cancelAnimationFrame(self.animFrame);

        //stop listening on the document for movement
        self.$doc.off(self.moveEvent).off(self.upEvent);

        if(self.hasTouch) {
            self.sliderOverflow.off(self.cancelEvent);
        }

        self.currMoveAxis = '';

       // self.setGrabCursor(); // remove grabbing hand
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

        accDist = pPos - axPos;

        duration = (new Date().getTime()) - self.startTime;
        v0 = Math.abs(accDist) / duration;


        if( totalMoveDist > self.hasTouch ? Math.abs(self.currentContainerWidth * 0.25) : Math.abs(self.currentContainerWidth * 0.5) ){

          if(dragDirection === 1){
            self.currentId ++;
            if(self.currentId >= self.$slides.length){
              self.currentId = self.$slides.length - 1;
            }
          }else{
            self.currentId --;
           if(self.currentId < 0){
            self.currentId = 0;
           }
          }
          self.moveTo();
        }else{
          //return to current
          returnToCurrent(true, v0);
        }

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
              self.animFrame = window.requestAnimationFrame(animloop);
              if(self.renderMoveEvent){

                self.renderMovement(self.renderMoveEvent, isThumbs);
              }
            }
          })();
        }

        if(!self.checkedAxis) {

          var dir = true,
          diff    = (Math.abs(point.pageX - self.pageX) - Math.abs(point.pageY - self.pageY) ) - (dir ? -7 : 7);

          if(diff > 7) {
            // horizontal movement
            if(dir) {
              e.preventDefault();
              self.currMoveAxis = 'x';
            } else if(self.hasTouch) {
              //self.completeGesture();
              return;
            }
            self.checkedAxis = true;
          } else if(diff < -7) {
            // ver movement
            if(!dir) {
              e.preventDefault();
              self.currMoveAxis = 'y';
            } else if(self.hasTouch) {
              //self.completeGesture();
              return;
            }
            self.checkedAxis = true;
          }
          return;
        }

        e.preventDefault();
        self.renderMoveTime = new Date().getTime();
        self.renderMoveEvent = point;
      },

      updateSlides: function(){

        var self = this,
            cw = self.currentContainerWidth = self.$container.outerWidth(),
            animObj = {},
            newPos = (-self.currentId * cw);

            var a = ($(window).width() - self.$el.find('.rp-slide').eq(0).outerWidth(true)) * (0.5);

            if(a > 0){
              newPos += Math.ceil(a);
            }

        if(self.mode === 'suggested'){
          return;
        }

        self.$slides.each(function(i){
          $(this).css({
            'left': i * cw + 'px',
            'z-index' : i
          });

        });

        animObj[ (self.vendorPrefix + self.TD) ] = 0 + 'ms';
        animObj[ (self.vendorPrefix + self.TTF) ] = $.rpCSS3Easing.easeOutBack;
        animObj[ self.xProp ] = self.tPref1 + ( newPos + self.tPref2 + 0) + self.tPref3;

        if( !self.useCSS3Transitions ) {
          //jquery fallback
          animObj[ self.xProp ] = newPos;
          self.$container.animate(animObj, 0);
        }else {

          if( self.isMobileMode ){
            return; // competing with son-scroller
          }

          self.$container.css( animObj );
        }

      },

      moveTo: function(type,  speed, inOutEasing, userAction, fromSwipe){
            var self = this,
            newPos   = -self.currentId * self.currentContainerWidth,
            diff,
            newId,
            animObj  = {};

            var a = ($(window).width() - $('.rp-slide').eq(0).outerWidth(true)) * (0.5);

            if(a > 0){
              newPos += Math.ceil(a);
            }

        if( !self.useCSS3Transitions ) {

          //jQuery fallback
          animObj[ self.xProp ] = newPos;

          self.$container.animate(animObj, self.animationSpeed);

        }else{

          //css3 transition
          animObj[ (self.vendorPrefix + self.TD) ]  = self.animationSpeed + 'ms';
          animObj[ (self.vendorPrefix + self.TTF) ] = $.rpCSS3Easing.easeOutBack;

          self.$container.css( animObj );
          animObj[ self.xProp ] = self.tPref1 + (( newPos ) + self.tPref2 + 0) + self.tPref3;
          self.$container.css( animObj );

          //IQ Update
          self.$container.one(self.transitionEndName , function(){
            window.iQ.update();
          });
        }

        //update the overall position
        self.sPosition = self.currRenderPosition = newPos;

        self.ev.trigger('rpOnUpdateNav');
      },

      returnToFullView: function(){
        var self = this;
        if(self.isDesktopMode === false){
          self.isDesktopMode = true;

          self.$galleryItems.each(function(){
            var item = $(this).removeClass('small-size mobile-item'),
                slide = item.data('slide');
                item.appendTo(slide);
          });

          self.$container.css( 'width' , '' );
          self.$container.append(self.$slides);

          self.$container.on(self.downEvent, function(e) { self.onDragStart(e); });

          self.$paddles.show();
          self.$el.find('.rp-nav').show();

        }
      },

      sortTagLines2up: function(){
        var self = this,
            $taglines = self.$el.find('.product-tagline');

        $taglines.each(function(){
          var $line = $(this);

          if( $line.height() / parseInt($line.css('line-height') , 10 ) > 1 ){
            $line.parent().addClass('two-line');
          }

        });
      },

      disableShuffle: function(){
        var self = this;

        self.$shuffleContainers.each(function(){
          var sffleInst = $(this).data('shuffle');

          if(sffleInst !== undefined || sffleInst !== null){
            if(sffleInst){
               sffleInst.disable();
            }
          }
        });
      },

      enableShuffle: function(){
        var self = this;

        self.$shuffleContainers.each(function(){
          var sffleInst = $(this).data('shuffle');
          if(sffleInst !== undefined || sffleInst !== null){
            if(sffleInst){
               sffleInst.enable();
            }

          }
        });
      },

      updatePaddles: function () {
        var self = this,
            wW = self.$win.width();

        if(!self.paddlesEnabled){
          return;
        }

        var $plate = self.$el.find('.plate'),
            hasPlate = $plate.length > 0,
            plateHeight = $plate.outerHeight(true),
            spaceAvail = wW - self.$el.find('.rp-slide').eq(0).width();

        if ( self.mq('(min-width: 981px)') && hasPlate) {

          self.$rightPaddle.css({
            top :  plateHeight,
            right: (spaceAvail / 4) - (parseInt(self.$rightPaddle.width() , 10) / 2) + 'px'

          });


          self.$leftPaddle.css({
            top :  plateHeight,
            left: (spaceAvail / 4) - ( parseInt(self.$leftPaddle.width() , 10) ) + 10 + 'px'
          });
        }else if(self.mq('(min-width: 567px)') && hasPlate){

          self.$rightPaddle.css({
            top :  plateHeight + 130,
            right: (spaceAvail / 4) - (parseInt(self.$rightPaddle.width() , 10) / 2) + 20 + 'px'

          });


          self.$leftPaddle.css({
            top :  plateHeight + 130,
            left: (spaceAvail / 4) - ( parseInt(self.$leftPaddle.width() , 10) ) + 35 + 'px'
          });
        }

      },



      updateTiles: function(){
        var self = this,
        isFullView = self.mq('(min-width: 981px)') ? true : false,
        $mediumTile = null,
        $normalTile = null,
        newHeight = 0,
        slideVariation = '';

        if(self.isMobileMode){
          $mediumTile = self.$slides.find('.gallery-item.medium .product-img').first();
          $mediumTile.css('height' , '');

          return;
        }

        self.$slides.each(function(){
          var $slide = $(this);

          slideVariation = $slide.data('variation').split('-')[2].toLowerCase();
          //REMOVE
          //$slide.css( 'background' , 'red' );

          $mediumTile = $slide.find('.gallery-item.medium .product-img').first();
          $normalTile = $slide.find('.gallery-item.normal').first();

          var tileHeight = $slide.find('.gallery-item.plate').first().height(),
              testHeight = $('.gallery-item.normal').first().find('.product-content').outerWidth(true);

/*          if(tileHeight < testHeight ){
            tileHeight = testHeight;
          }*/

          if(slideVariation !== '3up'){
            $slide.find( '.gallery-item.normal').css({
              'max-height' : tileHeight,
              'height'     : tileHeight
            });
          }


          switch( slideVariation ){
            case '5up':


              if(isFullView){
                newHeight = $normalTile.outerHeight(true) + $normalTile.find('.product-img').height();
                $mediumTile.css({
                  'height' : newHeight + 'px'
                });
              }else{
                newHeight = $slide.find('.plate').height() + $normalTile.find('.product-img').height() + parseInt($normalTile.css('marginTop'), 10);
                $mediumTile.css({
                  'height' : newHeight + 'px'
                });
              }


            break;

            case '4up':
              if(isFullView){
                newHeight = $slide.find('.plate').height() + $normalTile.find('.product-img').height() + parseInt($normalTile.css('marginTop'), 10);
                $mediumTile.css({
                  'height' : newHeight + 'px'
                });
              }else{
                newHeight = $normalTile.outerHeight(true) + $normalTile.find('.product-img').height();
                $mediumTile.css('height' , newHeight);


                //$mediumTile.closest('.gallery-item').css( 'max-height' , $mediumTile.height() + $mediumTile.closest('.gallery-item').find('.product-content').height() );

              }
            break;

            case '3up':
          if(isFullView){
              newHeight = $slide.find('.plate').height() + $normalTile.find('.product-img').height() + parseInt($normalTile.css('marginTop'), 10);
              $mediumTile.css({
                'height' : newHeight + 'px'
              });
            }else{
              $mediumTile.css('height' , '');
            }
            break;
          }
        });

        setTimeout( function () {
          self.updateSliderSize();
        } , 1000);

      },

      animateTiles: function(){
        var self = this;

        self.$el.removeClass('redrawing');

        self.$galleryItems.not('.blank').each(function(){

          var $item = $(this),
          animationDelay = 0;

          $item.css({
            'visibility' : 'visible'
          });

          animationDelay = $item.hasClass('plate') ? 0 : $item.hasClass('medium') ? 25 : 2000;

          if($item.hasClass('plate') === true){
            animationDelay = 0;
          }else if($item.hasClass('medium') === true){
             animationDelay = 150;
          }else{
             animationDelay = 250 + Math.floor(Math.random() * 500);
          }

          $item.stop(true,true).delay(animationDelay).animate({ opacity: 1 },{ duration: 250 , complete: function(){}});

        });

      },

      setNameHeights : function( $container ) {
        var nameMaxHeight = 0;

        // Set the height of the product name + model because the text can wrap and make it taller
        $container
          .find('.product-name-wrap')
          .css('height', '') // remove heights in case they've been set before
          .each(function() {
            var $this = $(this),
                height = parseFloat( $this.css('height') );

            if ( height > nameMaxHeight ) {
              nameMaxHeight = height;
            }
          })
          .css('height', nameMaxHeight);

        return this;
      }
    };

    //define easing equations
    $.rpCSS3Easing = {
        //add additional ease types here
        easeOutSine: 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
        easeInOutSine: 'cubic-bezier(0.445, 0.050, 0.550, 0.950)',
        easeOutBack: 'cubic-bezier(0.595, -0.160, 0.255, 1.140)'
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


    SONY.on('global:ready', function(){
      $('.related-products').relatedProducts({});
    });


 })(SONY,jQuery, Modernizr, window,undefined , window.console);

(function(SONY, $, Modernizr, window, undefined , console) {
    'use strict';
    $.extend($.rpProto, {

      _initMobileBreakpoint: function(){
        var self = this;

        function handleBreakpoint(){

          // 1. step one  - cancel touch events for the 'slideshow'
          self.$container.off(self.downEvent);

          // 2. hide paddles and nav
          self.$paddles.hide();
          self.$el.find('.rp-nav').hide();

          //attemp to place the title plates in the first position before detaching
          self.$slides.each(function(){
            var $s = $(this),
            $plate = $s.find('.plate').eq(0);

            //put the title plate at the beginning
            $s.prepend($plate);
          });

          // 3. gather gallery items and save local reference - may need to set on self
          var $galleryItems = self.$el.find('.gallery-item').detach().addClass('small-size');

          // 4. remove the slides
          self.$slides.detach();

          //clear out the position style on the gallery items
          $galleryItems.removeAttr('style');

          $galleryItems.addClass('mobile-item').first().removeClass('mobile-item');

          //5 . put the item back into the container / make sure to not include blanks
          $galleryItems.not('.blank').appendTo(self.$container);

          self.$el.find('.gallery-item.medium').css('height' , '');

          // 7. init the scroller module
          setTimeout(function(){

            if(self.scrollerModule !== null){

              self.scrollerModule.destroy();
              self.scrollerModule = null;

            }

            self.scrollerModule = self.$el.find('.rp-overflow').scrollerModule({
              contentSelector: '.rp-container',
              itemElementSelector: '.gallery-item',
              mode: 'free',
              lastPageCenter: false,
              extraSpacing: 0,

              iscrollProps: {
                snap: false,
                hScroll: true,
                vScroll: false,
                hScrollbar: false,
                vScrollbar: false,
                momentum: true,
                bounce: true,
                onScrollEnd: null,
                lockDirection:true,
                onBeforeScrollStart:null
              }

            }).data('scrollerModule');

            //text-promo-title

            $galleryItems.find('.product-name').evenHeights();
            /*$galleryItems.find('.product-img').evenHeights();*/


            //self.scroller.enable();
            window.iQ.update();
          }, 100);
          return;

        }
        self.ev.on( 'onmobilebreakpoint.rp' , handleBreakpoint );
      }
    });
    $.rpModules.mobileBreakpoint = $.rpProto._initMobileBreakpoint;

 })(SONY,jQuery, Modernizr, window, undefined , window.console);
//all done

/*
  Tab system for managing multiple
  instances of related products
*/
$(function(){
  /*
    figure out tabbed stuff here and let that
    module instantiate the related products that its bound to
  */

  if($('.rp-container-tabbed').length === 0){
    return;
  }

  // Get transitionend event name
  var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd',
      'MozTransition'    : 'transitionend',
      'OTransition'      : 'oTransitionEnd',
      'msTransition'     : 'MSTransitionEnd',
      'transition'       : 'transitionend'
  },
  transitionEndName;
  transitionEndName = transEndEventNames[ window.Modernizr.prefixed('transition') ];

  var $tabs = $('.rp-tabs').find('.rp-tab'),
      currentPanelId = 1,
      $currentPanel = $('.related-products[data-rp-panel-id=' + currentPanelId + ']'),
      $productPanels = $('.related-products[data-rp-panel-id]');


  $productPanels.not($currentPanel).css({
    'opacity' : 0,
    'z-index' : 0
  });

  $currentPanel.css({
    'z-index' : 1
  });




  $tabs.eq(0).addClass('active');

  if($tabs.length > 0){
    var handleTabClick = function(e){
      var $tab = $(this),
      visibleObj = function(visibleBool , zIndx){
        var cssO = {'visibility' : visibleBool === true ? 'visible' : 'hidden'};
        if(zIndx !== undefined){
          cssO.zIndex = zIndx;
        }
        return cssO;
      };

      e.preventDefault();
      $tabs.removeClass('active');
      $tab.addClass('active');

      newPanelId = $tab.data('rpPanelId');

      if(newPanelId === currentPanelId) {
        return;
      }
      $oldPanel = $currentPanel;
      currentPanelId = newPanelId;
      $currentPanel = $('.related-products[data-rp-panel-id='+ currentPanelId +']');

      $oldPanel.css(visibleObj(true, 1));
      $oldPanel.stop(true,true).animate({ opacity: 0 },{ duration: 500 , delay: 0 , complete: function(){
        $oldPanel.css(visibleObj(false, 0));
        $oldPanel.data('relatedProducts').disableShuffle();
      }});

      $currentPanel.css(visibleObj(true, 1));
      $currentPanel.data('relatedProducts').enableShuffle();
      $currentPanel.stop(true,true).animate({ opacity: 1 },{ duration: 500});


    };

    $tabs.on('click' , handleTabClick);
  }

});


