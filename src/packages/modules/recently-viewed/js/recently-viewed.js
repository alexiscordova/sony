// Recently Viewed (RecentlyViewed) Module
// --------------------------------------------
//
// * **Class:** RecentlyViewed
// * **Version:** 1.0
// * **Modified:** 02/22/2013
// * **Author:** Tyler Madison, Glen Cheney, George Pantazis
// * **Dependencies:** jQuery 1.7+ , Modernizr
//
// *Notes:*
//
// *Example Usage:*
//
//      $('.recently-views-products').recentlyViewed();
//
//
define(function(require){

    //'use strict';

    $ = require('jquery');
    carousel = require('secondary/sony-carousel');
    iQ = require('iQ');
    Settings = require('require/sony-global-settings');

    self = {
      'init': function() {
        $('.recently-viewed').recentlyViewed();
      }
    };

    //Related Products Definition
    RecentlyViewed = function(element, options){
      self           = this;
      transEndEventNames = {
        'WebkitTransition' : 'webkitTransitionEnd',
        'MozTransition'    : 'transitionend',
        'OTransition'      : 'oTransitionEnd',
        'msTransition'     : 'MSTransitionEnd',
        'transition'       : 'transitionend'};
      
      //Extend Recently Viewed instance with defaults and options
      $.extend(self , $.fn.recentlyViewed.defaults , options);

      //var
      self.carousel               = null;
      self.breakPoint             = "1200";
      self.colWidth               = { 'default' : 127/846, '1200' : 150/1020, '980' : 127/846, '768' : 140/627, 'mobile' : 220/464 };
      self.gutterWidth            = { 'default' : 18/846,  '1200' : 24/1020,  '980' : 18/846,  '768' : 22/627 , 'mobile' : 24/464 };
      self.containerWidthPct      = (92.1875 / 100) * (91.80791 / 100);
      self.paddleHeight           = 52;
      self.classgrid              = "span2";
      self.wWindow                = $(window).width();

      self.useCSS3Transitions     = Modernizr.csstransitions; //Detect if we can use CSS3 transitions
      self.hasMediaQueries        = Modernizr.mediaqueries;
      self.mq                     = Modernizr.mq;
      self.isInit                 = false;
      self.isOSCStyle             = false;

      //$
      self.$doc                   = Settings.$document;
      self.$win                   = Settings.$window;
      self.$html                  = Settings.$html;

      self.$el                    = $(element);
      self.$carousel              = self.$el.find(".carousel");
      self.$slides                = self.$el.find(".sony-carousel-slide"); 
      self.$items                 = self.$el.find(".sony-carousel-slide-children");
      self.$slidesContainer       = self.$el.find('.sony-carousel');
      self.$carouselWrapper       = self.$el.find('.sony-carousel-wrapper');
      self.$container             = self.$carousel.parent(); //parent of the .carousel, span12
      self.$paddles               = null; // has to be created and given to the sony-carousel
      self.$paginationPaddles     = null;

      /*

      //Debug mode for logging
      self.DEBUG                  = false;

      self.$galleryItems          = self.$el.find('.gallery-item');

      
      self.$bulletNav             = $();
      self.$el                    = $(element);
      self.$galleryItems          = self.$el.find('.gallery-item');
      
      self.$container             = self.$el.find('.rp-container').eq(0);
      self.$containerProduct      = self.$el.parent().parent();
      self.$slimGrid              = self.$el.parent();

      //self.mode                   = self.$el.data('mode').toLowerCase(); //Determine the mode of the module
      //self.variation              = self.$el.data('variation').split('-')[2]; //Determine the variaion of the module


      self.scrollerModule         = null;
      self.nbPages                = 1;

      self.prefixed               = Modernizr.prefixed;
      self.transitionName         = self.prefixed('transition');
      self.transitionEndName      = transEndEventNames[ self.transitionName ];
      self.TP                     = 'transitionProperty';
      self.TD                     = 'transitionDuration';
      self.TTF                    = 'transitionTimingFunction';
      self.yProp                  = self.xProp = self.prefixed ( 'transform' );
      self.tPref1                 = 'translate3d(';
      self.tPref2                 = 'px, ';
      self.tPref3                 = 'px, 0px)';

      
      self.oldIE                  = self.$html.hasClass('lt-ie8');
      self.isIE7orIE8             = self.$html.hasClass('lt-ie9');
      self.inited                 = false;
      self.isResponsive           = !self.isIE7orIE8 && !self.$html.hasClass('lt-ie8') && self.hasMediaQueries;
      
      self.LANDSCAPE_BREAKPOINT   = 980;
      self.MOBILE_BREAKPOINT      = 567;
      */
      
      //Startup
      self.init();

    };

    //Related Products protoype object definition
    RecentlyViewed.prototype = {

      //Inital setup of module
      init: function(){

        self = this;

        self.setupBreakPoint();

        self.createPaddles();

        self.setupItemsSlides();

        self.setupCarousel();

        self.setupGlobalEvent();

        //self.animationInit();

        /*

        //Initialize media queries detection
        self.mqFix();

        //Initialize animation properties
        self.initAnimationProps();

        //Define easing equations
        self.setupEasing();

        //Inialize events
        self.initEvents();

        //Store gallery items parent slide
        self.storeGalleryItemParentSlides();

        //Setup link clicks
        self.setupLinkClicks();

        //Setup Strip Mode
        self.setupStripMode();
        */


      },
      getNbSlides : function(){

        self = this;
        numColumns     = 6;

        if ( Modernizr.mediaqueries && self.mq('(min-width: 1200px)') && ! self.$html.hasClass('lt-ie10') )
        {
          self.isOSCStyle = false;
          self.classgrid = "span2";
          numColumns     = 6;
        }
        else if ( !Modernizr.mediaqueries || self.mq('(min-width: 981px)') || self.$html.hasClass('lt-ie10') ) 
        {
          self.isOSCStyle = false;
          self.classgrid = "span2";
          numColumns     = 6;

        } 
        else if ( self.mq('(min-width: 770px)') ) 
        {

          self.isOSCStyle = true;
          self.classgrid = "span3";
          numColumns     = 4;

        }else 
        {

          self.isOSCStyle = true;
          self.classgrid = "span6";
          numColumns     = 2;

        }

        self.wWindow = $(window).width();

        return numColumns;

      },
      setupBreakPoint : function(){

        self = this;

        if ( Modernizr.mediaqueries && self.mq('(min-width: 1200px)') && ! self.$html.hasClass('lt-ie10') )
        {
          self.breakPoint     = "1200";
        }
        else if ( !Modernizr.mediaqueries || self.mq('(min-width: 981px)') || self.$html.hasClass('lt-ie10') ) 
        {

          self.breakPoint     = "980";

        } 
        else if ( self.mq('(min-width: 770px)') ) {

          self.breakPoint     = "769";

        }else {

          self.breakPoint     = "mobile";

        }

      },
      setupItemsSlides : function(oscStyle){

       
        nbItemsPerSlides = self.getNbSlides();
        oscS = oscStyle || self.isOSCStyle;

        //Extract items
        aSlides = [];
        aItemForHtml = [];
        isO = 0;

        $.each( self.$items, function(i)
        {

          //remove span
          $(this).find("a.gallery-item").removeClass("m-span3").removeClass("span2");

          if( i % nbItemsPerSlides == isO )
          {
            if( aItemForHtml.length > 0 )
            {
              aSlides.push( aItemForHtml.slice(0) );
            }

            aItemForHtml = []; 
          }
          
          aItemForHtml[i % nbItemsPerSlides] = $(this);

          if( i == self.$items.length - 1 )
          {
            aSlides.push( aItemForHtml.slice(0) );
          }
          
        });

        //Generate HTML

        htmlSlide = "";
        for( i = 0; i < aSlides.length; i++)
        {

          htmlSlide += '<div class="sony-carousel-slide">';

          for( j = 0; j < aSlides[i].length; j++)
          {
            htmlSlide += '<div class="sony-carousel-slide-children">' + aSlides[i][j].html() + '</div>';
          }

          htmlSlide += '</div>';

        } 

        //reset + append
        self.$slidesContainer.empty().append(htmlSlide);

        self.$slides = self.$el.find(".sony-carousel-slide"); 
        self.$items  = self.$el.find(".sony-carousel-slide-children");

        if(!self.isInit)
        {
          //self.$items.css({width:1});  //No scrollbar or scrollbar all the time, depending of the final page
          self.isInit = true;
        }

        //updateItems
        self.udpateItems();

        //resetSlides
        self.resetSlides();

        //update top paddles
        self.topPaddles();

        if( oscS != self.isOSCStyle ) //because if the OSC style
        {
          self.createCarousel();
        }
        

      },
      udpateItems : function(){

        self = this;
        containerWidth = Math.floor( self.$carousel.width() );
        gutterWidth    = self.gutterWidth['default'] * containerWidth;
        colWidth       = self.colWidth['default']    * containerWidth;
        extraMarging   = 1;
        slimGridW      = 0;
        margeSlimGrid  = 0;
        extraPct       = 1;
        heightContainer     = 55 + 17 + 30;
        marginLeftContainer = 0;
        numColumns     = 6;


        //reset
        self.$carouselWrapper.removeAttr('style');

        if ( Modernizr.mediaqueries && self.mq('(min-width: 1200px)') && ! self.$html.hasClass('lt-ie10') )
        {

          self.$slides.removeClass("slimgrid");
          
          if(self.breakPoint != "1200")
          {
            self.breakPoint = "1200";
            self.setupItemsSlides(false);
            return false;
          }

          self.$carousel.removeClass("o-visible");
          self.$slides.addClass("no-osc");

          self.classgrid = "span2";
          self.isOSCStyle = false;
          self.breakPoint = "1200";

          //self.$container.removeClass('full-bleed-no-max');

          gutterWidth    = Math.floor( self.gutterWidth['1200'] * containerWidth );
          colWidth       = Math.floor( self.colWidth['1200'] * containerWidth );
          numColumns     = 6;
        }
        else if ( !Modernizr.mediaqueries || self.mq('(min-width: 981px)') || self.$html.hasClass('lt-ie10') ) {

          self.$slides.removeClass("slimgrid");

          if(self.breakPoint != "980")
          {
            self.breakPoint = "980";
            self.setupItemsSlides(false);
            return false;
          }

          self.$carousel.removeClass("o-visible");
          self.$slides.addClass("no-osc");

          self.classgrid = "span2";
          self.isOSCStyle = false;
          self.breakPoint = "980";

          //self.$container.removeClass('full-bleed-no-max');

          gutterWidth    = Math.floor( self.gutterWidth['default'] * containerWidth );
          colWidth       = Math.floor( self.colWidth['default'] * containerWidth ) ;
          numColumns     = 6;

        } 
        else if ( self.mq('(min-width: 770px)') ) {

          self.$slides.addClass("slimgrid");

          if(self.breakPoint != "769")
          {
            self.breakPoint = "769";
            self.setupItemsSlides(true);
            return false;
          }

          self.$carousel.addClass("o-visible");
          self.$slides.removeClass("no-osc");

          self.classgrid = "span3";
          self.isOSCStyle = true;
          self.breakPoint = "769";

         
          /*

          self.$container.addClass('full-bleed-no-max');

          //Width container : remove the slimgrid style
          slimGridW = $(window).width() * self.containerWidthPct;
          margeSlimGrid = ( $(window).width() - slimGridW ) / 2;
          slimGridW += margeSlimGrid;
          self.$carousel.css( { 'width' : slimGridW, 'margin' : '0 0 0 '+ margeSlimGrid +'px' } );
          */

          //extraPct       = 1.1;
          //containerWidth = $(window).width() * self.containerWidthPct * extraPct; //110%
          //gutterWidth    = Math.floor( self.gutterWidth['768'] * $(window).width() * self.containerWidthPct);
          //colWidth       = Math.floor( self.colWidth['768']    * $(window).width() * self.containerWidthPct);
          gutterWidth    = Math.floor( self.gutterWidth['768'] * containerWidth );
          colWidth       = Math.floor( self.colWidth['768'] * containerWidth ) ;
          //extraMarging   = containerWidth - ( $(window).width() * self.containerWidthPct ) + gutterWidth;
          numColumns     = 4;

        }else {

           self.$slides.addClass("slimgrid");

          if(self.breakPoint != "mobile")
          {
            self.breakPoint = "mobile";
            self.setupItemsSlides(true);
            return false;
          }

          self.$carousel.addClass("o-visible");
          self.$slides.removeClass("no-osc");

          self.classgrid = "span6";
          self.isOSCStyle = true;
          self.breakPoint = "mobile";

          //self.$container.addClass('full-bleed-no-max');

          //extraPct       = 1.1525;
          //containerWidth = $(window).width() * self.containerWidthPct * extraPct; //110%
          //gutterWidth    = Math.floor( self.gutterWidth.mobile * $(window).width() * self.containerWidthPct);
          //colWidth       = Math.floor( self.colWidth.mobile    * $(window).width() * self.containerWidthPct);
          gutterWidth    = Math.floor( self.gutterWidth.mobile * containerWidth );
          colWidth       = Math.floor( self.colWidth.mobile * containerWidth ) ;
          //extraMarging   = containerWidth - ( $(window).width() * self.containerWidthPct ) + gutterWidth;
          numColumns     = 2;

        }

        

        // /marginLeftContainer = gutterWidth;

        //pctColWidth    = (colWidth / containerWidth) * 100;
        //pctGutterWidth = (gutterWidth / containerWidth) * 100;


//.not( self.$items.first() )

//console.log("before carousel w", Math.floor( self.$carousel.width() ));


        /*
        self.$items.css({
          //'width'       : colWidth,
          'width'       : colWidth,
          'margin'      : 0,
          'margin-left' : gutterWidth
        });
      */


        self.$items.addClass(self.classgrid);


        //height wrapper 
        /*
        heightWrapper = 'auto';
        if( self.breakPoint != "mobile" )
        {
          heightWrapper = self.$items.first().height();
        }



        
        self.$carouselWrapper.css({
          'height'   : heightWrapper,
          'overflow' : 'hidden'
        });
        */

        /*
        $.each( self.$slides.eq(0), function(i){

            $(this).find(".sony-carousel-slide-children").css({
              'width'  : colWidth,
              'margin-left' : 0
            });

          });

        */

        //console.log("after carousel w", Math.floor( self.$carousel.width() ));

        //last : fix
        /*
        $.each( self.$slides.not( self.$slides.last() ).find(".sony-carousel-slide-children:first"), function(i){

            $(this).css({
              'width'  : colWidth,
              'margin-left' : 0
            });

          });
*/

/*
        self.$items.first().css({
          'width'  : colWidth,
          'margin' : 0
        });
*/

        //Fix
        /*
        containerWidth = Math.floor( self.$carousel.width() );

        if( numColumns * colWidth + ( (numColumns - 1) * gutterWidth ) >= containerWidth)
        {

          diff = Math.ceil (  ( numColumns * colWidth + ( (numColumns - 1) * gutterWidth ) - containerWidth ) / 2 );

          $.each( self.$slides.find(".sony-carousel-slide-children:last"), function(i){

            $(this).css({
              'width'  : colWidth - diff,
              'margin-left' : gutterWidth - diff - 1 //secure
            });

          });
            
        }
        */


      },
      setupCarousel : function(){

        self = this;

        //self.resetSlides();
        self.createCarousel();
        

        iQ.update(true);

      },
      createCarousel : function(){

        if( self.carousel ){

          self.$slidesContainer.sonyCarousel("destroy");

          self.$el.find(".sony-dot-nav").remove();
        }

        self.carousel = self.$slidesContainer.sonyCarousel({
          wrapper: '.sony-carousel-wrapper',
          slides: '.sony-carousel-slide',
          slideChildren: '.sony-carousel-slide-children',
          useCSS3: true,
          paddles: true,
          $paddleWrapper : self.$paddles,
          pagination: true
        });

        self.$paginationPaddles = $(".pagination-paddle");

        self.topPaddles();

        self.setupEvents();

      },
      setupGlobalEvent : function(){

        self = this;

        //Resize
        self.$win.on('resize.rp', $.debounce(50 , function() {

          self.udpateItems();

          iQ.update(true);

        }));

        self.$container.on("mouseenter", function(e){
          self.$el.find(".pagination-paddles").addClass("show-paddles");
        });

        self.$container.on("mouseleave", function(e){
          self.$el.find(".pagination-paddles").removeClass("show-paddles");
        });

      },
      setupEvents : function(){

        //Bind nav
        self.$el.find(".pagination-paddles").off("click").on("click", function(e){
          iQ.update(true);
        });

        self.$el.find(".sony-dot-nav").off("click").on("click", function(e){
          iQ.update(true);
        });

      },
      resetSlides : function(){

        if(self.carousel)
        {
          self.$slidesContainer.sonyCarousel("resetSlides");

          self.setupEvents();
        }

      },

      /* Paddles */

      createPaddles : function(){

        self.$paddles = $('<div class="wrapper-pagination-paddles"></div>');
        self.$carousel.append(self.$paddles);

      },
      topPaddles : function(){

        if (self.$paginationPaddles)
        {
          self.$paginationPaddles.css({
            'top'    : ( ( self.$el.height() - self.$carousel.height() ) / 2 ) + ( self.$carousel.height()  / 2 ) - ( self.paddleHeight / 2 ),
            'margin' : 0
          });  
        }
        
      },

      //Fixes a bug in IE when media queries aren't available
      mqFix: function(){
        self = this;
        
        if( !self.hasMediaQueries && self.isIE7orIE8 || self.oldIE){
          self.mq = function(){
            return false;
          };
        }

      },
      initAnimationProps: function(){
        self = this;

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
      setupEasing: function(){
        self = this;

        //Define easing equations
        self.css3Easing = {
            easeOutSine     : 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
            easeInOutSine   : 'cubic-bezier(0.445, 0.050, 0.550, 0.950)',
            easeOutBack     : 'cubic-bezier(0.595, -0.160, 0.255, 1.140)',
            sonyScrollEase  : 'cubic-bezier(0.33,0.66,0.66,1)'
        };
      },
      initEvents: function(){
        self = this;
        
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
        self = this;

        self.$galleryItems.each(function(){
          $item = $(this);
          $item.data('slide' , $item.parent());
        });
      },

      //Set up outbound links to not interfere with dragging between slides
      setupLinkClicks: function(){

        self = this;

        self.$galleryItems.on( self.tapOrClick() , function(e){
          $item   = $(this),
          destination = $item.attr('href'),
          point, distanceMoved;

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
              window.location = destination;
            }
          }
        });

        self.$galleryItems.on( self.tapOrClick() , function(e){
          e.preventDefault();
        });
      },
      setupStripMode: function(){


        self       = this;
        containerWidth = self.$el.width();
        gutterWidth    = self.gutterWidth['default'] * containerWidth;
        colWidth       = self.colWidth['default']    * containerWidth;
        extraMarging   = 0;
        slimGridW      = 0;
        margeSlimGrid  = 0;
        extraPct       = 1;
        heightContainer     = 55 + 17 + 30;
        marginLeftContainer = 0;
        numColumns     = 6;

        //reset
        self.$slimGrid.removeAttr('style');

        if ( Modernizr.mediaqueries && self.mq('(min-width: 1200px)') && ! self.$html.hasClass('lt-ie10') )
        {

          self.$containerProduct.removeClass('full-bleed-no-max');

          //gutterWidth    = Settings.GUTTER_WIDTH_320 * containerWidth;
          gutterWidth    = self.gutterWidth['1200'] * containerWidth;
          //colWidth       = ( Settings.COLUMN_WIDTH_320 * ( containerWidth ) );
          colWidth       = self.colWidth['1200'] * containerWidth;
          numColumns     = 6;
        }
        else if ( !Modernizr.mediaqueries || self.mq('(min-width: 981px)') || self.$html.hasClass('lt-ie10') ) {

          self.$containerProduct.removeClass('full-bleed-no-max');

          //gutterWidth    = Settings.GUTTER_WIDTH_320 * containerWidth;
          gutterWidth    = self.gutterWidth['default'] * containerWidth;
          //colWidth       = ( Settings.COLUMN_WIDTH_320 * ( containerWidth ) );
          colWidth       = self.colWidth['default'] * containerWidth  ;
          numColumns     = 6;

        } 
        else if ( self.mq('(min-width: 770px)') ) {

          self.$containerProduct.addClass('full-bleed-no-max');

          //SlimGrid
          slimGridW = $(window).width() * self.containerWidthPct;
          margeSlimGrid = ( $(window).width() - slimGridW ) / 2;
          slimGridW += margeSlimGrid;
          self.$slimGrid.css( { 'width' : slimGridW, 'margin' : '0 0 0 '+ margeSlimGrid +'px' } );

          extraPct       = 1.1;
          //containerWidth = self.$el.width() * extraPct;
          containerWidth = $(window).width() * self.containerWidthPct * extraPct; //110%
          gutterWidth    = self.gutterWidth['768'] * $(window).width() * self.containerWidthPct;
          colWidth       = self.colWidth['768']    * $(window).width() * self.containerWidthPct;
          extraMarging   = containerWidth - ( $(window).width() * self.containerWidthPct ) + gutterWidth;
          numColumns     = 5;

        }else {

          self.$containerProduct.addClass('full-bleed-no-max');

          //SlimGrid
          slimGridW      = $(window).width() * self.containerWidthPct;
          margeSlimGrid  = ( $(window).width() - slimGridW ) / 2;
          slimGridW += margeSlimGrid;
          self.$slimGrid.css( { 'width' : slimGridW, 'margin' : '0 0 0 '+ margeSlimGrid +'px' } );

          extraPct       = 1.1525;
          //containerWidth = self.$el.width() * extraPct;
          containerWidth = $(window).width() * self.containerWidthPct * extraPct; //110%
          gutterWidth    = self.gutterWidth.mobile * $(window).width() * self.containerWidthPct;
          colWidth       = self.colWidth.mobile    * $(window).width() * self.containerWidthPct;
          extraMarging   = containerWidth - ( $(window).width() * self.containerWidthPct ) + gutterWidth;
          numColumns     = 3;

        }

        //clear out the position style on the gallery items
        self.$galleryItems.removeAttr('style');

        $galleryItemsFirst = self.$galleryItems.first();

        if( self.$galleryItems.length <= numColumns)
        {
          marginLeftContainer = gutterWidth;
        }

        self.$galleryItems.not($galleryItemsFirst).css({
          'width'       : colWidth,
          'margin'      : 0,
          'margin-left' : marginLeftContainer,
          'margin-top'  : 0
        });

        $galleryItemsFirst.css({
          'width'  : colWidth,
          'margin' : 0
        });
        /*
        self.$container.css({
          'display': 'block'
        }).animate({

        })
        */

        // Animation Init
        self.animationInit();

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
            extraMarging        : extraMarging,
            fitPerPage          : numColumns,
            gutterWidth         : gutterWidth,
            iscrollProps: {
              snap       : true,
              momentum   : false,
              hScrollbar : false,
              vScrollbar : false
            }

          }).data('scrollerModule');

          self.nbPages = Math.ceil( Math.round( self.$galleryItems.length * extraPct) / numColumns);
          self.scrollerModule._generatePagination( self.nbPages );

          self.$galleryItems.find('.product-name').evenHeights();

          self.$el.find('.rp-overflow').on("update.sm", function(e){
             self.scrollerModule._generatePagination( self.nbPages );
             //window.iQ.update();
          });

          self.$win.trigger('resize.rp');

          //window.iQ.update();

        }, 50);


        self.$win.on('resize.rp', $.debounce(50 , function() {

          containerWidth = self.$el.width();
          gutterWidth        = self.gutterWidth['default'] * containerWidth;
          colWidth           = self.colWidth['default'] * containerWidth;
          extraMarging       = 0;
          slimGridW          = 0;
          margeSlimGrid      = 0;
          extraPct           = 1;
          heightContainer    = 55 + 17 + 30;
          marginLeftContainer  = 0;
          numColumns         = 6;

          //reset
          self.$slimGrid.removeAttr('style');

          if ( Modernizr.mediaqueries && self.mq('(min-width: 1200px)') && ! self.$html.hasClass('lt-ie10') )
          {

            self.$containerProduct.removeClass('full-bleed-no-max');

            gutterWidth    = self.gutterWidth['1200'] * containerWidth;
            colWidth       = self.colWidth['1200'] * containerWidth;
            numColumns     = 6;

          }
          else if ( !Modernizr.mediaqueries || self.mq('(min-width: 981px)') || self.$html.hasClass('lt-ie10') ) 
          {

            self.$containerProduct.removeClass('full-bleed-no-max');
            

            gutterWidth    = self.gutterWidth['default'] * containerWidth;
            colWidth       = self.colWidth['default'] * containerWidth;
            numColumns     = 6;

          }else if ( self.mq('(min-width: 770px)') ) 
          {

            self.$containerProduct.addClass('full-bleed-no-max');

            //heightContainer
            heightContainer = 40;

            //SlimGrid
            slimGridW = $(window).width() * self.containerWidthPct;
            margeSlimGrid = ( $(window).width() - slimGridW ) / 2;
            slimGridW += margeSlimGrid;
            self.$slimGrid.css( { 'width' : slimGridW, 'margin' : '0 0 0 '+ margeSlimGrid +'px' } );

            extraPct       = 1.1;
            containerWidth = $(window).width() * self.containerWidthPct * extraPct; //110%
            gutterWidth    = self.gutterWidth['768'] * $(window).width() * self.containerWidthPct;
            colWidth       = self.colWidth['768']    * $(window).width() * self.containerWidthPct;
            extraMarging   = containerWidth - ( $(window).width() * self.containerWidthPct ) + gutterWidth;
            numColumns     = 5;

          }else {

            self.$containerProduct.addClass('full-bleed-no-max');

            //heightContainer
            heightContainer = 40;

            //SlimGrid
            slimGridW = $(window).width() * self.containerWidthPct;
            margeSlimGrid = ( $(window).width() - slimGridW ) / 2;
            slimGridW += margeSlimGrid;
            self.$slimGrid.css( { 'width' : slimGridW, 'margin' : '0 0 0 '+ margeSlimGrid +'px' } );

            extraPct       = 1.1525;
            containerWidth = $(window).width() * self.containerWidthPct * extraPct; //110%
            gutterWidth    = self.gutterWidth.mobile * $(window).width() * self.containerWidthPct;
            colWidth       = self.colWidth.mobile    * $(window).width() * self.containerWidthPct;
            extraMarging   = containerWidth - ( $(window).width() * self.containerWidthPct ) + gutterWidth;
            numColumns     = 3;

          }

          self.nbPages = Math.ceil( Math.round( self.$galleryItems.length * extraPct) / numColumns);

          self.scrollerModule.setGutterWidth(gutterWidth);
          self.scrollerModule.setFitPerPage(numColumns);
          self.scrollerModule.setExtraMarging(extraMarging);

          if( self.$galleryItems.length <= numColumns)
          {
            marginLeftContainer = gutterWidth;
          }

          self.$galleryItems.not($galleryItemsFirst).css({
            'width'       : colWidth,
            'margin'      : 0,
            'margin-left' : marginLeftContainer,
            'margin-top'  : 0
          });

          $galleryItemsFirst.css({
            'width'   : colWidth,
            'margin'  : 0
          }); 

          newContainerHeight = self.$el.find('.gallery-item.medium').first().height() + heightContainer + 'px';

          self.$el.css({
            'height'     : newContainerHeight,
            'max-height' : newContainerHeight,
            'min-height' : newContainerHeight
            //'min-width'  : 550 + 'px'
          });

          //window.iQ.update();

        }));

        self.$win.trigger('resize.rp');

      },

      animationInit : function(){
        self    = this;
        animObj = {};

        self.$container             = self.$carousel.parent();

        //if( !self.useCSS3Transitions ) {

          //jquery fallback
          animObj.opacity = 1;
          self.$container.removeClass("hide").animate(animObj, 700);

        /*}else {
          
          animObj[ self.prefixed( self.TD ) ] = 700 + 'ms';
          animObj[ self.prefixed( self.TTF ) ] = self.css3Easing.easeOutBack;
          console.log("animObj", animObj);
          //animObj.display = 'block';
          //animObj.opacity = 1;
          self.$container.css( animObj );
          //self.$container.removeClass("hide").addClass("in");
        }
        */
        
      },

      tapOrClick: function(){
        self = this;
        return self.hasTouch ? self.upEvent : self.clickEvent ;
      },

      toString: function(){
        return '[ object RecentlyViewed ]';
      },

      _onScrollerModuleUpdate: function(e){
        
        self = this;
        self.scrollerModule._generatePagination( self.nbPages );
      }


    };

    //Recently Viewed definition on jQuery
    $.fn.recentlyViewed = function(options) {
      args = arguments;
      return this.each(function(){
        self = $(this);
        if (options instanceof Object ||  !options) {
          if( !self.data('recentlyViewed') ) {
            self.data('recentlyViewed', new RecentlyViewed(self, options));
          }
        } else {
          recentlyViewed = self.data('recentlyViewed');
          if (recentlyViewed && recentlyViewed[options]) {
              return recentlyViewed[options].apply(recentlyViewed, Array.prototype.slice.call(args, 1));
          }
        }
      });
    };

    //defaults for the related products
    $.fn.recentlyViewed.defaults = {
      throttleTime: 50,
      autoScaleContainer: true,
      minSlideOffset: 10,
      navigationControl: 'bullets'
    };

    return self;

});


