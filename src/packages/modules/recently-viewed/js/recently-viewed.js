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
    iQ = require('iQ');
    bootstrap = require('bootstrap'),
    Settings = require('require/sony-global-settings');
    Environment = require('require/sony-global-environment');
    scroller = require('secondary/sony-scroller');
    evenHeights = require('secondary/sony-evenheights');
    sonyPaddles = require('secondary/sony-paddles');
    sonyNavDots = require('secondary/sony-navigationdots');

    self = {
      'init': function() {
        $('.recently-views-products').recentlyViewed();
      }
    };

    //Related Products Definition
    RecentlyViewed = function(element, options){
      self           = this,
      transEndEventNames = {
        'WebkitTransition' : 'webkitTransitionEnd',
        'MozTransition'    : 'transitionend',
        'OTransition'      : 'oTransitionEnd',
        'msTransition'     : 'MSTransitionEnd',
        'transition'       : 'transitionend'};
      
      //Extend Recently Viewed instance with defaults and options
      $.extend(self , $.fn.recentlyViewed.defaults , options);

      //Debug mode for logging
      self.DEBUG                  = false;

      self.$doc                   = Settings.$document;
      self.$win                   = Settings.$window;
      self.$html                  = Settings.$html;

      self.$bulletNav             = $();
      self.$el                    = $(element);
      self.$galleryItems          = self.$el.find('.gallery-item');
      
      self.$container             = self.$el.find('.rp-container').eq(0);
      self.$containerProduct      = self.$el.parent().parent();
      self.$slimGrid              = self.$el.parent();

      self.mode                   = self.$el.data('mode').toLowerCase(); //Determine the mode of the module
      self.variation              = self.$el.data('variation').split('-')[2]; //Determine the variaion of the module

      self.colWidth               = { 'default' : 127/846, '1200' : 150/1020, '980' : 127/846, '768' : 140/650, 'mobile' : 220/598 };
      self.gutterWidth            = { 'default' : 18/846,  '1200' : 24/1020,  '980' : 18/846,  '768' : 22/650 , 'mobile' : 24/598 };
      self.containerWidthPct      = (92.1875 / 100) * (91.80791 / 100);

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

      self.useCSS3Transitions     = Modernizr.csstransitions; //Detect if we can use CSS3 transitions
      self.hasMediaQueries        = Modernizr.mediaqueries;
      self.mq                     = Modernizr.mq;
      self.oldIE                  = self.$html.hasClass('lt-ie8');
      self.isIE7orIE8             = self.$html.hasClass('lt-ie9');
      self.inited                 = false;
      self.isResponsive           = !self.isIE7orIE8 && !self.$html.hasClass('lt-ie8') && self.hasMediaQueries;
      
      self.LANDSCAPE_BREAKPOINT   = 980;
      self.MOBILE_BREAKPOINT      = 567;
      
      //Startup
      self.init();

    };

    //Related Products protoype object definition
    RecentlyViewed.prototype = {

      //Inital setup of module
      init: function(){

        self = this;

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
        else if ( self.mq('(min-width: 768px)') ) {

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

          }else if ( self.mq('(min-width: 768px)') ) 
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


