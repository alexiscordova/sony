// Related Products (RelatedProducts) Module
// --------------------------------------------
//
// * **Class:** RelatedProducts
// * **Version:** 1.0
// * **Modified:** 02/22/2013
// * **Author:** Tyler Madison, Glen Cheney, George Pantazis
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

    //Related Products Definition
    var RelatedProducts = function(element, options){
      var self           = this,
      transEndEventNames = {
        'WebkitTransition' : 'webkitTransitionEnd',
        'MozTransition'    : 'transitionend',
        'OTransition'      : 'oTransitionEnd',
        'msTransition'     : 'MSTransitionEnd',
        'transition'       : 'transitionend'};
      
      //Extend Related Products instance with defaults and options
      $.extend(self , $.fn.relatedProducts.defaults , options);

      //Debug mode for logging
      self.DEBUG                  = true;
      
      self.LANDSCAPE_BREAKPOINT   = 980;
      self.MOBILE_BREAKPOINT      = 568;
      
      //Cache common jQuery objects
      self.$paddles               = $({});

      self.$el                    = $(element);
      self.$slides                = self.$el.find('.rp-slide');
      self.$currentSlide          = null;
      self.$shuffleContainers     = self.$slides.find('.shuffle-container');
      self.$galleryItems          = self.$el.find('.gallery-item');
      self.$plate                 = self.$slides.eq(0).find('.gallery-item.plate').first();
      self.$container             = self.$el.find('.rp-container').eq(0);
      self.$favorites             = self.$el.find('.js-favorite');
      self.$tabbedContainer       = self.$el.parent();
      self.$bulletNav             = $();
      self.$doc                   = SONY.$document;
      self.$win                   = SONY.$window;
      self.$html                  = SONY.$html;
      
      self.ev                     = $({}); //event object
      self.prefixed               = Modernizr.prefixed;
      self.transitionName         = self.prefixed('transition');
      self.isTabbedContainer      = self.$tabbedContainer.length > 0 && self.$tabbedContainer.hasClass('rp-container-tabbed');
      self.transitionEndName      = transEndEventNames[ self.transitionName ];
      self.mode                   = self.$el.data('mode').toLowerCase(); //Determine the mode of the module
      self.variation              = self.$el.data('variation').split('-')[2]; //Determine the variaion of the module
      self.numSlides              = self.$slides.length;
      self.sliderOverflow         = self.$el.find('.rp-overflow').eq(0);
      self.previousId             = -1;
      self.currentId              = 0;
      self.slidePosition          = 0;
      self.animationSpeed         = 700;
      self.slides                 = [];
      self.slideCount             = self.$slides.length;
      self.currentContainerWidth  = 0;
      self.sPosition              = 0;
      self.scrollerModule         = null;
      self.shuffle                = null;
      self.shuffleSpeed           = 250;
      self.shuffleEasing          = 'ease-out';
      self.paddlesEnabled         = false;
      self.resizeTimeout          = null;
      self.startInteractionPointX = null;
      self.isTransitioning        = true;
      self.lastTouch              = null;
      self.handleStartPosition    = null;
      self.dragThreshold          = 50;
      self.useCSS3Transitions     = Modernizr.csstransitions; //Detect if we can use CSS3 transitions
      self.hasMediaQueries        = Modernizr.mediaqueries;
      self.mq                     = Modernizr.mq;
      self.oldIE                  = self.$html.hasClass('lt-ie10');
      self.isIE7orIE8             = self.$html.hasClass('lt-ie10');
      self.inited                 = false;
      self.isResponsive           = !self.isIE7orIE8 && !self.$html.hasClass('lt-ie10') && self.hasMediaQueries;
      
      //Modes
      self.isMobileMode    = false;
      self.isDesktopMode   = false;
      self.isTabletMode    = false;
      self.accelerationPos = 0;



      //Startup
      self.init();



    };

    //Related Products protoype object definition
    RelatedProducts.prototype = {

      //Inital setup of module
      init: function(){
        var self = this;

        self.mqFix();

        //Initialize animation properties
        self.initAnimationProps();

        //Define easing equations
        self.setupEasing();

        //Inialize events
        self.initEvents();

        //Setup shuffle functions
        self.initShuffleFns();

        //Store gallery items parent slide
        self.storeGalleryItemParentSlides();

        //Setup link clicks
        self.setupLinkClicks();

        //Initialize tooltips
        self.initTooltips();

        self.log('Related Poducts init...');

        // Don't do this for modes other than 3,4 and 5up
        if(self.variation === '3up' ||
           self.variation === '4up' ||
           self.variation === '5up'){
            self.setSortPriorities();
            self.log(self.variation , true);
        }

        if(self.$slides.length > 1){
          self.createNavigation();
          if(!self.hasTouch){
            self.createPaddles();
          }
          if(self.mode != 'strip'){
            self.$container.on(self.downEvent, function(e) { self.onDragStart(e); });
          }
        }else{
          self.$pagination = $({});
        }

        if(self.mode != 'strip'){
          self.setSortPriorities();
          self.setupResizeListener();
          self.$win.trigger('resize');
        }else {
          self.setupStripMode();
          self.log('setting up strip mode...');
        }
      },

      //Fixes a bug in IE when media queries aren't available
      mqFix: function(){
        var self = this;
        
        if( !self.hasMediaQueries && self.isIE7orIE8 || self.oldIE){
          self.mq = function(){
            return false;
          };
        }

      },

      initAnimationProps: function(){
        var self = this;

        if(self.useCSS3Transitions) {
            self.use3dTransform = Modernizr.csstransforms3d;
        }

        if(self.useCSS3Transitions) {
          // some constants for CSS3
          self.TP     = 'transitionProperty';
          self.TD     = 'transitionDuration';
          self.TTF    = 'transitionTimingFunction';
          self.yProp  = self.xProp = self.prefixed ( 'transform' );

          if(self.use3dTransform) {
            self.tPref1 = 'translate3d(';
            self.tPref2 = 'px, ';
            self.tPref3 = 'px, 0px)';
          } else {
            self.tPref1 = 'translate(';
            self.tPref2 = 'px, ';
            self.tPref3 = 'px)';
          }

          self.$container[ self.prefixed( self.TP ) ] = self.prefixed ( 'transform' );

        } else {
          self.xProp = 'left';
          self.yProp = 'top';
        }

      },

      //Setup events
      initEvents: function(){
        var self = this;
        
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
            self.downEvent   = 'mousedown.rp';
            self.moveEvent   = 'mousemove.rp';
            self.upEvent     = 'mouseup.rp';
            self.cancelEvent = 'mouseup.rp';
            self.clickEvent  = 'click.rp';
        }
      },

      //Store gallery items orginal parent slide for teardown and rebuild
      storeGalleryItemParentSlides: function(){
        var self = this;

        self.$galleryItems.each(function(){
          var $item = $(this);
          $item.data('slide' , $item.parent());
        });
      },

      //Set up outbound links to not interfere with dragging between slides
      setupLinkClicks: function(){
        var self = this;
        self.$galleryItems.on( self.tapOrClick() , function(e){
          var $item   = $(this),
          destination = $item.attr('href'),
          point, distanceMoved;

          if ( self.hasTouch ) {
            point = e.originalEvent.touches[0] || { pageX: 0 } ;
          } else {
            point = e;
          }

          // To prevent drags from being misinterpreted as clicks, we only redirect the user
          // if their interaction time and movements are below certain thresholds.

          if ( self.startInteractionTime && self.startInteractionPointX ) {

            distanceMoved = Math.abs(point.pageX - self.startInteractionPointX);

            if ((new Date().getTime()) - self.startInteractionTime < 250 && distanceMoved < 25 ) {
              window.location = destination;
            }
          }
        });

        self.$galleryItems.on( self.tapOrClick() , function(e){
          e.preventDefault();
        });
      },

      toString: function(){
        return '[ object RelatedProducts ]';
      },

      onFavorite : function( evt ) {
        var self = this,
            $jsFavorite = $(evt.delegateTarget),
            isAdding = !$jsFavorite.hasClass('active'),
            content = self.getFavoriteContent( $jsFavorite, isAdding );
        $jsFavorite.toggleClass('active');

        $('.gallery-tooltip .tooltip-inner')
          .html( content )
          .tooltip('show');

        // Stop event from bubbling to <a> tag
        evt.preventDefault();
        evt.stopPropagation();
      },

      getFavoriteContent : function( $jsFavorite, isActive ) {
        return isActive ?
              $jsFavorite.data('activeTitle') + '<i class="fonticon-10-sm-bold-check"></i>' :
              $jsFavorite.data('defaultTitle');
      },

      initTooltips : function() {
        var self = this;

        // Favorite Heart
        self.$favorites.on('click', $.proxy( self.onFavorite, self ));

        self.$container.find('.js-favorite').tooltip({
          placement: 'offsettop',
          title: function() {
            var $jsFavorite = $(this);
            return self.getFavoriteContent( $jsFavorite, $jsFavorite.hasClass('active') );
          },
          template: '<div class="tooltip gallery-tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
        });
      },

      //These functions are used by the jquery.shuffle plugin
      initShuffleFns: function(){
        var self = this;

        self.shuffleGutters = function (containerWidth){
          var gutter = 0,
              numColumns = 0;

          if ( !Modernizr.mediaqueries || self.mq('(min-width: 981px)') || self.$html.hasClass('lt-ie10') ) {
            gutter = SONY.Settings.GUTTER_WIDTH_SLIM_5 * containerWidth;
            numColumns = 5;

          // // Portrait Tablet ( 4 columns ) - masonry
          } else if ( self.mq('(min-width: 569px)') ) {
            numColumns = 4;
            gutter = SONY.Settings.GUTTER_WIDTH_SLIM * containerWidth;
          }

          self.setColumns(numColumns);

          if(gutter < 0){
            gutter = 0;
          }

          return gutter;
        };

        self.shuffleColumns = function(containerWidth){
            var column = 0;

            if ( !Modernizr.mediaqueries || self.mq('(min-width: 981px)') || self.$html.hasClass('lt-ie10') ) {
              column = SONY.Settings.COLUMN_WIDTH_SLIM_5 * containerWidth; // ~18% of container width
            // Between Portrait tablet and phone ( 3 columns )
            } else if ( self.mq('(min-width: 569px)') ) {
              column = SONY.Settings.COLUMN_WIDTH_SLIM * containerWidth;
            // Default
            }else{
              column = containerWidth;
            }

            if(column === 0){
              column = 0.001; // fixes a bug with shuffle that crashes when column width is returned as 0
            }

            return column;
        };

      },

      setupResizeListener: function(){
        var self      = this,
        resizeTimeout = null,

        //Some value constants
        VISIBLE       = 'visible',
        HIDDEN        = 'hidden',
        BLANK         = '.blank',
        REDRAWING     = 'redrawing';

        if(self.mode !== 'suggested' && !self.oldIE){
         self.$win.on('resize', function(){
          if(!self.isMobileMode && self.$win.width() > self.MOBILE_BREAKPOINT) {

            self.$galleryItems.css({
              visibility : HIDDEN,
              opacity    : 0
            });
            self.$pagination.hide();
            self.$el.addClass( REDRAWING );

           }else{

            self.$el.css({
              opacity : 1,
              visibility : VISIBLE
            });

            self.$galleryItems.not(BLANK).css({
              visibility : VISIBLE,
              opacity : 1
            });

            if(!self.isMobileMode){
              self.$pagination.show();
            }

            self.$el.removeClass( REDRAWING );
           }
          });

        } else {
          self.$el.css({
            opacity : 1,
            visibility : VISIBLE
          });
           self.$galleryItems.not(BLANK).css({
           visibility : VISIBLE,
            opacity : 1
          });
          self.$el.removeClass( REDRAWING );

          if(!self.isMobileMode){
            self.$pagination.show();
          }
          
        }

        self.$pagination.hide();

        self.log('setting up resize listener...');

        self.$win.on( 'resize', $.debounce( 500 , $.proxy(self.handleResize , self)) );

      },

      handleResize:function() {
        var self = this;

        if( self.oldIE && self.inited ){
          self.updateSlides();
          return;
        }

        if( !self.inited ){
          self.inited = true;
        }

        self.checkForBreakpoints();
        self.updateSliderSize();
        self.updateSlides();
        self.updatePaddles();

        if(self.mode === 'suggested'){
          return;
        }

        //Needed a way to kill this timer if multiple resizes happen
        clearTimeout( self.resizeTimeout );
        self.resizeTimeout = setTimeout(function(){

          self.$shuffleContainers.each(function(){
            var shfflInst = $(this).data('shuffle');

            if(shfflInst === undefined){
              return;
            }

            setTimeout(function(){
              self.updateSliderSize();
              
              if(self.oldIE){
                self.$galleryItems.each(function(){

                  var $item        = $(this),
                  $itemImg         = $item.find('.product-img'),
                  tileHeight       = 285,
                  galItemWidth     = 219,
                  galImageHeight   = 190,
                  medGalImgWidth   = 462,
                  medGalImgHeight  = 495,
                  medGalItemHeight = 600;
                  
                  $item.css({
                    height : tileHeight
                  });

                  if($item.hasClass('plate')){
                    $item.css({

                    });
                    $itemImg.css({
                      height : tileHeight
                    });
                  }else if( $item.hasClass('medium') ){
                    $item.css({

                      height : medGalItemHeight
                    });
                    $itemImg.css({
                      height : medGalImgHeight
                    });

                  }else if( $item.hasClass('normal') ){

                    $itemImg.css({
                      height : galImageHeight
                    });
                  }

                });

                shfflInst.update();
                self.updateSlides();
              }

              if(!self.oldIE){
                self.updateTiles();
                shfflInst.update();
                self.animateTiles();

              }

            } , 50);

          });
        } , 10);
      },

      log : function (){

        var self = this,
        strOut   = '';

        for (var i = 0 ; i < arguments.length ; i ++){
          strOut += arguments[i];
          strOut += i > 0 ? ' , ' : ' ';
        }

        if(self.oldIE && self.DEBUG){
          if(window.alert){
            //window.alert(strOut);
          }
        }else if(self.DEBUG) {
          if(window.console){
           window.console.log(strOut);
          }
        }
      },

      setupStripMode: function(){
        var self       = this,
        containerWidth = self.$el.width(),
        gutterWidth    = SONY.Settings.GUTTER_WIDTH_SLIM_5 * containerWidth,
        colWidth       = ( SONY.Settings.COLUMN_WIDTH_SLIM_5 * ( containerWidth ) );

        //clear out the position style on the gallery items
        self.$galleryItems.removeAttr('style');

        self.$galleryItems.not(self.$galleryItems.first()).css({
          'width'       : colWidth,
          'margin'      : 0,
          'margin-left' : 0,
          'margin-top'  : 0
        });

        self.$galleryItems.first().css({
          'width'  : colWidth,
          'margin' : 0
        });

        //Create the sony-scroller instance
        setTimeout(function(){

          if(self.scrollerModule !== null){
            self.scrollerModule.destroy();
            self.scrollerModule = null;
          }

          self.scrollerModule = self.$el.find('.rp-overflow').scrollerModule({
            contentSelector     : '.rp-container',
            itemElementSelector : '.gallery-item',
            mode                : 'paginate',
            generatePagination  : true,
            generateNav         : true,
            centerItems         : false,
            autoGutters         : false,
            gutterWidth         : gutterWidth,
            iscrollProps: {
              snap       : true,
              momentum   : false,
              hScrollbar : false,
              vScrollbar : false
            }

          }).data('scrollerModule');

          self.$galleryItems.find('.product-name').evenHeights();

          window.iQ.update();

        }, 50);

        self.$win.on('resize.rp', $.debounce(50 , function() {

          var containerWidth = self.$el.width(),
          gutterWidth        = SONY.Settings.GUTTER_WIDTH_SLIM_5 * containerWidth,
          colWidth           = ( SONY.Settings.COLUMN_WIDTH_SLIM_5 * (containerWidth ) );

          self.scrollerModule.setGutterWidth(gutterWidth);

          self.$galleryItems.not(self.$galleryItems.first()).css({
            'width'       : colWidth,
            'margin'      : 0,
            'margin-left' : 0,
            'margin-top'  : '20px'
          });

          self.$galleryItems.first().css({
            'width'   : colWidth,
            'margin'  : 0,
            'margin-top' : '20px'
          });

          var newContainerHeight = self.$el.find('.gallery-item.normal').first().outerHeight(true)  + 'px';

          self.$el.css({
            'height'     : newContainerHeight,
            'max-height' : newContainerHeight,
            'min-height' : newContainerHeight
            /*'min-width'  : 550 + 'px'*/
          });

        }));

        self.$win.trigger('resize.rp');

      },

      tapOrClick: function(){
        var self = this;
        return self.hasTouch ? self.upEvent : self.clickEvent ;
      },

      createNavigation: function(){

        var self = this;

        if ( !$.fn.sonyNavDots ) {
          return;
        }

        if ( self.$pagination ) {
          self.$pagination.sonyNavDots('reset', {
            'buttonCount' : self.numSlides
          });
          return;
        }

        self.$pagination = $('<div/>', { 'class' : 'navigation-container' });

        self.$el.append( self.$pagination );

        self.$pagination.sonyNavDots({
          'buttonCount': self.numSlides
        });

        self.$pagination.on('SonyNavDots:clicked', function(e, a){
          self.currentId = a;
          self.moveTo();
        });

        self.ev.on( 'rpOnUpdateNav', $.debounce(500, function() {
          self.$pagination.sonyNavDots('reset', {
            'activeButton': self.currentId
          });
        }));
      },


      createPaddles: function(){

        var self = this;

        self.log('creating paddles...');

        self.$el.sonyPaddles();

        self.$el.on('sonyPaddles:clickLeft', function(){
          self.currentId --;
          if(self.currentId < 0){
            self.currentId = 0;
          }

          self.moveTo();
        });

        self.$el.on('sonyPaddles:clickRight', function(){
          self.currentId ++;

          if(self.currentId >= self.$slides.length){
            self.currentId = self.$slides.length - 1;
          }

          self.moveTo();
        });
  
        self.onPaddleNavUpdate();
        self.ev.on('rpOnUpdateNav' , $.proxy(self.onPaddleNavUpdate , self));

      },



      onPaddleNavUpdate: function(){
        var self = this;

        self.$el.sonyPaddles('showPaddle', 'right');
        self.$el.sonyPaddles('showPaddle', 'left');

        //check for the left paddle compatibility
        if(self.currentId === 0){
          self.$el.sonyPaddles('hidePaddle', 'left');
        }

        //check for right paddle compatiblity
        if(self.currentId === self.numSlides - 1){
          self.$el.sonyPaddles('hidePaddle', 'right');
        }

      },

      togglePaddles: function (turnOn){
        var self = this;

        if(turnOn){
          self.$el.find('.pagination-paddles').show();
        }else{
          self.$el.find('.pagination-paddles').hide();
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

        self.toggleShuffles();

      },

      //Stops processing of jQuery.shuffle instances that are not currently active
      toggleShuffles: function(){
        var self = this;

        self.$shuffleContainers.each(function(i){
          var $shfflContainer = $(this),
            sfflInst = $shfflContainer.data('shuffle');
            if(i === self.currentId ){
              sfflInst.enable();
            }else{
              sfflInst.enable();
            }
        });
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

        }
        return self;
      },

      setSortPriorities: function(){
        var self = this;

        self.$slides.each(function(){

          var $slide     = $(this),
          $items         = $slide.find('.gallery-item'),
          slideVariation = $slide.data('variation').split('-')[2],
          hitNormalYet      = false,

          //Priority constants
          PRIORITY = 'priority',
          MEDIUM   = 'medium',
          NORMAL   = 'normal',
          BLANK    = 'blank',
          ONE      = 1,
          TWO      = 2,
          THREE    = 3,
          FOUR     = 4,
          FIVE     = 5;

          $items.each(function(){
            var $item = $(this);
            //covers off on sorting blank tiles
            if(slideVariation === '4up'){
              if($item.hasClass( MEDIUM )){
                $item.data( PRIORITY , FIVE );
              }else if($item.hasClass( NORMAL ) && !hitNormalYet){
                $item.data( PRIORITY , TWO );
                hitNormalYet = true;
              }else if($item.hasClass( BLANK )){
                $item.data( PRIORITY , THREE );
              }
              else if($item.hasClass( NORMAL ) && hitNormalYet === true){
                $item.data( PRIORITY , FOUR );
              }
            }else if ( slideVariation === '3up' ){
              if($item.hasClass( MEDIUM )){
                $item.data(PRIORITY , TWO );
              }else if($item.hasClass( NORMAL )){
                $item.data(PRIORITY , THREE );
              }
              if($item.hasClass( BLANK )){
                 $item.data(PRIORITY , 100);
              }
            }
          });
        });
      },

      sortByPriority : function() {
        var self = this,
            isTablet = self.mq('(min-width: 569px) and (max-width: 980px)');

        if ( isTablet && !self.sorted ) {

          self.$shuffleContainers.each(function(){

            var $shuffleContainer = $(this),
            slideVariation = $shuffleContainer.parent().data('variation').split('-')[2];

            $shuffleContainer.shuffle('sort', {
              by: function($el) {
                var priority = $el.hasClass('plate') ? 1 : $el.hasClass('medium') ? 2 : 3;

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
        view     = wW > self.LANDSCAPE_BREAKPOINT ? 'desktop' : wW > self.MOBILE_BREAKPOINT ? 'tablet' : 'mobile',
        wasMobile = false;

        //if the browser doesnt support media queries...IE default to desktop
        if(!Modernizr.mediaqueries || self.$html.hasClass('lt-ie10')){
          view = 'desktop';
        }

        self.log('checking for breakpoints...');

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
              wasMobile = true;
              self.returnToFullView();

              self.log('was mobile');
            }

            self.isTabletMode = self.isMobileMode = false;

            if(self.isDesktopMode === true){
               self.log('already desktop');
              //return;
            }

            self.isDesktopMode = true;

            self.$el.removeClass('rp-tablet rp-mobile')
                                    .addClass('rp-desktop');

            if(self.scrollerModule !== null || wasMobile){
              self.log('destroying scroller');
              self.scrollerModule.destroy();
              self.scrollerModule = null;

            }

            if(self.shuffle === null || wasMobile){
              self.log('creating shuffle');
              self.$container.css('width' , '100%');
              self.createShuffle();

              
            }

            self.sortByPriority();

            window.iQ.update();

            if(!self.hasTouch){
              self.togglePaddles(true);
            }


          break;

          case 'tablet':

            wasMobile = self.isMobileMode;

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

            if(!self.hasTouch){
              self.togglePaddles(true);
            }

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

            //Destroy the shuffle instance
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

            self.shuffle = null;

            //Hide the bullet navigation
            self.$bulletNav.hide();

            window.iQ.update();

            if(self.scrollerModule !== null){
              self.scrollerModule.destroy();
              self.scrollerModule = null;
            }

            self.initMobileBreakpoint();

            self.log('initing mobile');

            self.togglePaddles(false);

          break;
        }


        //do we need this in ALL modes?

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
        var self = this,
        newHeight = $('.shuffle-container').eq(0).height();

        //handle stuff for old IE
        if( self.oldIE ){
          self.$el.css( 'height' , 660 + 'px' );
          return;
        }

        if(self.mode === 'suggested'){
          return;
        }

        //handle resize for various layouts
        if(self.isTabletMode === true){
          if( newHeight === 0 ){
            newHeight = Math.ceil( $('.shuffle-container').eq(0).width() * 0.984615385 );
            self.log('using alternate height calculatio >>> TABLET' , newHeight);
          }
          
         self.$el.css( 'height' , newHeight + 62 + 'px' );

          if(!!self.isTabbedContainer){
            self.$tabbedContainer.css('height' , $('.shuffle-container').eq(0).height() + 62 + 'px');
          }
          return;
        }

        if(self.isMobileMode === true){
          self.$el.css('height' , 290);
          if(!!self.isTabbedContainer){
            self.$tabbedContainer.css('height' , 290);
          }
          return;
        }

        if( newHeight === 0 ){
          newHeight = Math.ceil( $('.shuffle-container').eq(0).width() * 0.509803922 );
           self.log('using alternate height calculation >>> Desktop' , newHeight);
        }

        if(self.$win.width() < 1120){
          newHeight += 20;
        }

        self.$el.css( 'height' , newHeight + 0 + 'px' );

        if(!!self.isTabbedContainer){
          self.$tabbedContainer.css('height' , newHeight + 0 + 'px');
        }
      },

      getPagePosition: function(e) {

        var self = this;

        if ( !e.pageX && !e.originalEvent ) {
          return;
        }

        self.lastTouch = self.lastTouch || {};

        // Cache position for touchmove/touchstart, as touchend doesn't provide it.
        if ( e.type === 'touchmove' || e.type === 'touchstart' ) {
          self.lastTouch = e.originalEvent.touches[0];
        }

        return {
          'x': (e.pageX || self.lastTouch.pageX),
          'y': (e.pageY || self.lastTouch.pageY)
        };
      },

      /*
      'scrubbingThreshold': function(e) {

        var self = this,
            distX = self.getPagePosition(e).x - self.handleStartPosition.x,
            distY = self.getPagePosition(e).y - self.handleStartPosition.y;

        // If you're not on touch, or if you didn't pass in a threshold setting, go ahead and scrub.

        if ( !Modernizr.touch || !self.dragThreshold || self.isScrubbing ) {
          self.isScrubbing = true;
          self.onScrubbing(e, distX, distY);
          return;
        }

        // If you've gone past the threshold, simply do nothing for this interaction.

        if ( self.hasPassedThreshold ) { return; }

        if ( Math.abs(distX) > self.dragThreshold ) {
          self.isScrubbing = true;
          self.onScrubbing(e, distX, distY);
          return;
        }

        if ( Math.abs(distY) > self.dragThreshold ) {
          self.hasPassedThreshold = true;
          return;
        }
      },*/

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
        self.startInteractionPointX = point.pageX;
        self.handleStartPosition = self.getPagePosition(e);

        if(self.hasTouch) {
          self.sliderOverflow.on(self.cancelEvent, function(e) { self.dragRelease(e, false); });
        }

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

        var self = this,
        pos      = self.sPosition = posi;

        //using transforms
        if(self.useCSS3Transitions) {
          var animObj                       = {};
          animObj[ self.prefixed(self.TD) ] = 0 + 'ms';
          animObj[ self.xProp ]             = self.tPref1 + (pos + self.tPref2 + 0) + self.tPref3;
          self.$container.css(animObj);

        } else {
          //using left
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
          self.moveTo(v0);
        }else{
          //return to current
          returnToCurrent(true, v0);
        }

      },

      dragMove: function(e , isThumbs){
        var self = this,
            distX = self.getPagePosition(e).x - self.handleStartPosition.x,
            distY = self.getPagePosition(e).y - self.handleStartPosition.y,
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
            self.$container.css( self.prefixed( self.TD ) , '0s' );
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


        if ( Math.abs(distY) > self.dragThreshold ) {
          self.hasPassedThreshold = true;
          return;
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
        var self        = this,
        cw              = self.currentContainerWidth = self.$container.outerWidth(),
        animObj         = {},
        newPos          = (-self.currentId * cw),
        widthDifference = (self.$win.width() - self.$el.find('.rp-slide').eq(0).outerWidth(true)) * (0.5);

        if( widthDifference > 0 && !self.isIE7orIE8 ){
          newPos += Math.ceil(widthDifference);
        }

        if( self.isIE7orIE8 && self.$win.width() <= 1190 ){
          cw = 1190;
          newPos = ( -self.currentId * cw );
          newPos -= (1190 - self.$win.width() ) * 0.5;
        }else if( self.isIE7orIE8 ){
          newPos += Math.ceil(widthDifference);
        }

        if(self.mode === 'suggested'){
          return;
        }

        self.$slides.each(function(i){
      
          $(this).css({
            'left'    : i * cw + 'px',
            'z-index' : i
          });

        });


        if( !self.useCSS3Transitions ) {

          //jquery fallback
          animObj[ self.xProp ] = newPos;
          self.$container.animate(animObj, 0);
        }else {
          if( self.isMobileMode ){
            return;
          }
          animObj[ self.prefixed( self.TD ) ] = 0 + 'ms';
          animObj[ self.prefixed( self.TTF ) ] = self.css3Easing.easeOutBack;
          animObj[ self.xProp ] = self.tPref1 + ( newPos + self.tPref2 + 0) + self.tPref3;
          self.$container.css( animObj );
        }
      },

      moveTo: function( velocity ){
        var self        = this,
        newPos          = -self.currentId * self.currentContainerWidth,
        animObj         = {},
        newDist         = Math.abs(self.sPosition  - newPos),
        widthDifference = ( self.$win.width() - $('.rp-slide').eq(0).outerWidth(true) ) * ( 0.5 );

        function getCorrectSpeed( newSpeed ) {
            if( newSpeed < 100 ) {
                return 100;
            } else if( newSpeed > 500 ) {
                return 500;
            }
            return newSpeed;
        }

        if( self.isIE7orIE8 && self.$win.width() <= 1190 ){
          newPos =  -self.currentId * 1190 ;
          newPos -= (1190 - self.$win.width() ) * 0.5;
          newDist = Math.abs(self.sPosition  - newPos);
        }else if( self.isIE7orIE8 ){
          newPos += Math.ceil(widthDifference);
        }

        self.currAnimSpeed = getCorrectSpeed( newDist / velocity );

        if( isNaN(self.currAnimSpeed) ){
          self.currAnimSpeed = self.animationSpeed;
        }

        if( widthDifference > 0 && !self.isIE7orIE8 ){
          newPos += Math.ceil( widthDifference );
        }

        //Shuffle optimization
        self.toggleShuffles();

        //jQuery animation fallback
        if( !self.useCSS3Transitions ) {
          animObj[ self.xProp ] = newPos;
          self.$container.animate( animObj, self.currAnimSpeed );
        }else{
          //css3 transition
          animObj[ self.prefixed( self.TD ) ]  = self.currAnimSpeed + 'ms';

          if(self.currAnimSpeed === self.animationSpeed){
            animObj[ self.prefixed( self.TTF )  ] = self.css3Easing.easeOutBack;
          }else{
            animObj[ self.prefixed( self.TTF ) ] = self.css3Easing.sonyScrollEase;
          }

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

        self.isTransitioning = true;

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

          if(!self.hasTouch){
            self.$paddles.show();
          }
          
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
            wW = self.$win.width(),
            px = 'px';

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
            right: (spaceAvail / 4) - (parseInt(self.$rightPaddle.width() , 10) / 2) + px
          });

          self.$leftPaddle.css({
            top :  plateHeight,
            left: (spaceAvail / 4) - ( parseInt(self.$leftPaddle.width() , 10) ) + 10 + px
          });
        }else if(self.mq('(min-width: 569px)') && hasPlate){

          self.$rightPaddle.css({
            top :  plateHeight + 130,
            right: (spaceAvail / 4) - (parseInt(self.$rightPaddle.width() , 10) / 2) + 20 + px

          });

          self.$leftPaddle.css({
            top :  plateHeight + 130,
            left: (spaceAvail / 4) - ( parseInt(self.$leftPaddle.width() , 10) ) + 35 + px
          });
        }

      },

      updateTiles: function(){
        var self = this,
        isFullView = self.mq('(min-width: 981px)'),
        $mediumTile = null,
        $normalTile = null,
        newHeight = 0,
        slideVariation = '',
        radix = 10;

        if(self.isMobileMode){
          $mediumTile = self.$slides.find('.gallery-item.medium .product-img').first();
          $mediumTile.css('height' , '');

          return;
        }

        self.$slides.each(function(){
          var $slide = $(this);

          slideVariation = $slide.data('variation').split('-')[2].toLowerCase();

          $mediumTile = $slide.find('.gallery-item.medium .product-img').first();
          $normalTile = $slide.find('.gallery-item.normal').first();

          var tileHeight = $slide.find('.gallery-item.plate').first().height() +  ( self.mq('(max-width: 769px)') ? 26 : 0 ),
              testHeight = $('.gallery-item.normal').first().find('.product-content').outerWidth(true);

          if(slideVariation !== '3up'){
            $slide.find( '.gallery-item.normal').css({
              'max-height' : tileHeight,
              'height'     : tileHeight
            });
/*
            if( slideVariation === '4up' && self.mq( '(min-width: 567px) and (max-width: 768px)' ) ){
              $slide.find( '.gallery-item.normal').each(function(){
                var $item = $(this);

                self.log( $item.outerHeight(true) , $slide.find('.gallery-item.plate').first().height() );

                if ( $item.outerHeight( true ) >  $slide.find('.gallery-item.plate').first().height() ) {
                  $slide.find('.gallery-item.plate').first().css({
                    'max-height' : $item.outerHeight(true),
                    'height'     : $item.outerHeight(true)
                  });
                }
              });
            }
            self.log( 'Setting new tile height on gallery items, ' , $slide.find('.gallery-item.plate').first().height(), tileHeight  , self.mq('(min-width: 769px)'));*/
          }

          switch( slideVariation ){
            case '5up':
              if(isFullView){
                newHeight = $normalTile.outerHeight(true) + $normalTile.find('.product-img').height();
                $mediumTile.css({
                  'height' : newHeight + 'px'
                });
              }else{
                newHeight = $slide.find('.plate').height() + $normalTile.find('.product-img').height() + parseInt( $normalTile.css('marginTop'), radix );
                $mediumTile.css({
                  'height' : newHeight + 'px'
                });
              }
            break;

            case '4up':
              if(isFullView){
                newHeight = $slide.find('.plate').height() + $normalTile.find('.product-img').height() + parseInt( $normalTile.css('marginTop'), radix );
                $mediumTile.css({
                  'height' : newHeight + 'px'
                });
              }else{
                newHeight = $normalTile.outerHeight(true) + $normalTile.find('.product-img').height();
                $mediumTile.css('height' , newHeight);
              }
            break;

            case '3up':
              if(isFullView){
                newHeight = $slide.find('.plate').height() + $normalTile.find('.product-img').height() + parseInt( $normalTile.css('marginTop'), radix );
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
        } , 250);

      },

      animateTiles: function(){
        var self = this,
        totalAnimationDelay = 0;

        self.$el.removeClass('redrawing');

        if(self.oldIE){
          return;
        }

        self.$galleryItems.not('.blank').each(function(){

          var $item = $(this),
          animationDelay = 0;

          $item.css({
            visibility : 'visible'
          });

          animationDelay = $item.hasClass('plate') ? 0 : $item.hasClass('medium') ? 25 : 2000;

          if($item.hasClass('plate') === true){
            animationDelay = 0;
          }else if($item.hasClass('medium') === true){
             animationDelay = 150;
          }else{
             animationDelay = 250 + Math.floor(Math.random() * 500);
          }

          totalAnimationDelay += animationDelay;

          $item.stop(true,true).delay(animationDelay).animate({ opacity: 1 },{ duration: 250 , complete: function(){}});

        });

        totalAnimationDelay = Math.min( 750 , totalAnimationDelay );

        if( totalAnimationDelay > 0 ){
          setTimeout( function(){
            self.$pagination.stop(true,true).fadeIn(250);
          }, totalAnimationDelay );
        }else{
           self.$pagination.stop(true,true).fadeIn(250);
        }

      },

      initMobileBreakpoint: function(){
        var self = this;

        //Cancel touch events for the 'slideshow'
        self.$container.off(self.downEvent);

        //hide paddles and nav
        self.$paddles.hide();

        //hide navigation dots
        self.$pagination.hide();

        //attemp to place the title plates in the first position before detaching
        self.$slides.each(function(){
          var $s = $(this),
          $plate = $s.find('.plate').eq(0);

          //put the title plate at the beginning
          $s.prepend($plate);
        });

        //gather gallery items and save local reference - may need to set on self
        self.$galleryItems.detach().addClass('small-size');

        //remove the slides
        self.$slides.detach();

        //clear out the position style on the gallery items
        self.$galleryItems.removeAttr('style');

        self.$galleryItems.addClass('mobile-item').first().removeClass('mobile-item');

        //put the item back into the container / make sure to not include blanks
        self.$galleryItems.not('.blank').appendTo(self.$container);

        self.$el.find('.gallery-item.medium').css('height' , '');
        self.$el.find('.gallery-item.medium .product-img').css('height' , '');

        //init the scroller module
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

          self.$galleryItems.find('.product-name').evenHeights();
          self.$el.find('.gallery-item.medium').css('height' , '');
          self.$el.find('.gallery-item.medium .product-img').css('height' , '');

          window.iQ.update();
        }, 100);
        
      },

      setNameHeights : function( $container ) {
        var nameMaxHeight = 0;

        //Set the height of the product name + model because the text can wrap and make it taller
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
      },

      setupEasing: function(){
        var self = this;

        //Define easing equations
        self.css3Easing = {
            easeOutSine     : 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
            easeInOutSine   : 'cubic-bezier(0.445, 0.050, 0.550, 0.950)',
            easeOutBack     : 'cubic-bezier(0.595, -0.160, 0.255, 1.140)',
            sonyScrollEase  : 'cubic-bezier(0.33,0.66,0.66,1)'
        };
      }
    };

    //Related Products definition on jQuery
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

    //Defaults for the related products
    $.fn.relatedProducts.defaults = {
      throttleTime: 50,
      autoScaleContainer: true,
      minSlideOffset: 10,
      navigationControl: 'bullets'
    };
    
    //Listen for global sony ready event
    SONY.on('global:ready', function(){
      $('.related-products').relatedProducts();
    });

 })(SONY,jQuery, Modernizr, window,undefined , window.console);


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
    $('.rp-tabs').hide();
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

    $tabs.on(window.Modernizr.touch ? 'touchend' : 'click' , handleTabClick);
  }

});


