// E13 Editorial Carousel (EditorialCarouselE13) Module
// --------------------------------------------
//
// * **Class:** EditorialCarouselE13
// * **Version:** 1.0
// * **Modified:** 02/22/2013
// * **Author:** Arnaud Tanielian
// * **Dependencies:** jQuery 1.7+ , Modernizr
//
// *Notes:*
//
// *Example Usage:*
//
//      $('.editorial-carousel-e13').editorialCarouselE13();
//
//
define(function(require){

    'use strict';

    var $ = require('jquery'),
      carousel = require('secondary/sony-carousel'),
      iQ = require('iQ'),
      Settings = require('require/sony-global-settings');

    var module = {
      'init': function() {
        $('.editorial-carousel-e13').editorialCarouselE13();
      }
    };

    //EditorialCarouselE13 Definition
    var EditorialCarouselE13 = function(element, options){

      var self = this;

      //Extend E13 Editorial Carousel instance with defaults and options
      $.extend(self , $.fn.editorialCarouselE13.defaults , options);

      //var
      self.carousel               = null;
      self.breakPoint             = '1200';
      self.paddleHeight           = 43;
      self.classgrid              = 'span3';

      self.useCSS3Transitions     = Modernizr.csstransitions; //Detect if we can use CSS3 transitions
      self.hasMediaQueries        = Modernizr.mediaqueries;
      self.mq                     = Modernizr.mq;
      self.isOSCStyle             = false;

      //$
      self.$doc                   = Settings.$document;
      self.$win                   = Settings.$window;
      self.$html                  = Settings.$html;

      self.$el                    = $(element);
      self.$RVtitle               = self.$el.find('.e13-title');
      self.$RVcarousel            = self.$el.find('.e13-carousel');
      self.$carousel              = self.$el.find('.carousel');
      self.$slides                = self.$el.find('.sony-carousel-slide');
      self.$items                 = self.$el.find('.sony-carousel-slide-children');
      self.$slidesContainer       = self.$el.find('.sony-carousel');
      self.$carouselWrapper       = self.$el.find('.sony-carousel-wrapper');
      self.$container             = self.$carousel.parent(); //parent of the .carousel, span12
      self.$paddles               = null; // has to be created and given to the sony-carousel
      self.$paginationPaddles     = null;

      //Startup
      self.init();

    };

    //Related Products protoype object definition
    EditorialCarouselE13.prototype = {

      //Inital setup of module
      init: function(){

        var self = this;

        //Setup Breakpoint
        self.setupBreakPoint();

        //Create custom paddles
        self.createPaddles();

        //Setup slides
        self.setupItemsSlides();

        //Setup Carousel
        self.setupCarousel();

        //Setup Global events
        self.setupGlobalEvent();

      },
      getNbSlides : function(){

        var self = this,
        numColumns     = 6;

        if ( Modernizr.mediaqueries && self.mq('(min-width: 1200px)') && ! self.$html.hasClass('lt-ie10') )
        {
          self.isOSCStyle = false;
          self.classgrid = 'span3';
          numColumns     = 4;
        }
        else if ( !Modernizr.mediaqueries || self.mq('(min-width: 981px)') || self.$html.hasClass('lt-ie10') )
        {
          self.isOSCStyle = false;
          self.classgrid = 'span3';
          numColumns     = 4;

        }
        else if ( self.mq('(min-width: 770px)') )
        {

          self.isOSCStyle = true;
          self.classgrid = 'span4';
          numColumns     = 3;

        }else
        {

          self.isOSCStyle = true;
          self.classgrid = 'span6';
          numColumns     = 2;

        }


        return numColumns;

      },
      setupBreakPoint : function(){

        var self = this;

        if ( Modernizr.mediaqueries && self.mq('(min-width: 1200px)') && ! self.$html.hasClass('lt-ie10') )
        {
          self.breakPoint     = '1200';
        }
        else if ( !Modernizr.mediaqueries || self.mq('(min-width: 981px)') || self.$html.hasClass('lt-ie10') )
        {

          self.breakPoint     = '980';

        }
        else if ( self.mq('(min-width: 770px)') ) {

          self.breakPoint     = '769';

        }else {

          self.breakPoint     = 'mobile';

        }

      },

      setupItemsSlides : function(oscStyle) {
        var self = this,
            nbItemsPerSlides = self.getNbSlides(),
            oscS = oscStyle || self.isOSCStyle,
            //Extract items
            aSlides = [],
            aItemForHtml = [],
            isO = 0,
            htmlSlide = '',
            i;

        $.each( self.$items, function(i)
        {

          //remove span
          $(this).find('a.gallery-item').removeClass('m-span3').removeClass('span2');

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
        for( i = 0; i < aSlides.length; i++)
        {

          htmlSlide += '<div class="sony-carousel-slide">';

          for( var j = 0; j < aSlides[i].length; j++)
          {
            htmlSlide += '<div class="sony-carousel-slide-children">' + aSlides[i][j].html() + '</div>';
          }

          htmlSlide += '</div>';

        }

        //reset + append
        self.$slidesContainer.empty().append(htmlSlide);

        self.$slides = self.$el.find('.sony-carousel-slide');
        self.$items  = self.$el.find('.sony-carousel-slide-children');


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
        var self = this,
            containerWidth = Math.floor( self.$carousel.width() ),
            extraMarging   = 1,
            slimGridW      = 0,
            margeSlimGrid  = 0,
            extraPct       = 1,
            heightContainer = 55 + 17 + 30,
            marginLeftContainer = 0,
            numColumns = 6;


        //reset
        self.$carouselWrapper.removeAttr('style');

        if ( Modernizr.mediaqueries && self.mq('(min-width: 1200px)') && ! self.$html.hasClass('lt-ie10') )
        {

          self.$slides.removeClass('slimgrid');

          if(self.breakPoint != '1200')
          {
            self.breakPoint = '1200';
            self.setupItemsSlides(false);
            return false;
          }

          self.$carousel.removeClass('o-visible');
          self.$slides.addClass('no-osc');

          self.classgrid = 'span3';
          self.isOSCStyle = false;
          self.breakPoint = '1200';

        }
        else if ( !Modernizr.mediaqueries || self.mq('(min-width: 981px)') || self.$html.hasClass('lt-ie10') ) {

          self.$slides.removeClass('slimgrid');

          if(self.breakPoint != '980')
          {
            self.breakPoint = '980';
            self.setupItemsSlides(false);
            return false;
          }

          self.$carousel.removeClass('o-visible');
          self.$slides.addClass('no-osc');

          self.classgrid = 'span3';
          self.isOSCStyle = false;
          self.breakPoint = '980';


        }
        else if ( self.mq('(min-width: 770px)') ) {

          self.$slides.addClass('slimgrid');

          if(self.breakPoint != '769')
          {
            self.breakPoint = '769';
            self.setupItemsSlides(false);
            return false;
          }

          self.$carousel.removeClass('o-visible');
          self.$slides.addClass('no-osc');

          self.classgrid = 'span4';
          self.isOSCStyle = true;
          self.breakPoint = '769';


        }else {

           self.$slides.addClass('slimgrid');

          if(self.breakPoint != 'mobile')
          {
            self.breakPoint = 'mobile';
            self.setupItemsSlides(true);
            return false;
          }

          self.$carousel.addClass('o-visible');
          self.$slides.removeClass('no-osc');

          self.classgrid = 'span6';
          self.isOSCStyle = true;
          self.breakPoint = 'mobile';

        }


        //Finally, apply the good class
        self.$items.addClass(self.classgrid);


      },
      setupCarousel : function(){

        var self = this;

        self.createCarousel();

        iQ.update(true);

      },
      createCarousel : function(){
        var self = this;
        if( self.carousel ){

          self.$slidesContainer.sonyCarousel('destroy');

          self.$el.find('.sony-dot-nav').remove();
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

        self.$paginationPaddles = $('.pagination-paddle');

        self.topPaddles();

        self.setupEvents();

      },
      setupGlobalEvent : function(){

        var self = this;

        //Resize
        self.$win.on('resize.rp', $.debounce(50 , function() {

          self.udpateItems();

          iQ.update(true);

        }));

        self.$container.on('mouseenter', function(e){
          self.$el.find('.pagination-paddles').addClass('show-paddles');
        });

        self.$container.on('mouseleave', function(e){
          self.$el.find('.pagination-paddles').removeClass('show-paddles');
        });

      },
      setupEvents : function(){
        var self = this;
        //Bind nav
        self.$el.find('.pagination-paddles').off('click').on('click', function(e){
          iQ.update(true);
        });

        self.$el.find('.sony-dot-nav').off('click').on('click', function(e){
          iQ.update(true);
        });

      },
      resetSlides : function(){
        var self = this;
        if(self.carousel)
        {
          self.$slidesContainer.sonyCarousel('resetSlides');

          self.setupEvents();
        }

      },

      /* Paddles */

      createPaddles : function(){
        var self = this;
        self.$paddles = $('<div class="wrapper-pagination-paddles"></div>');
        self.$carousel.append(self.$paddles);

      },
      topPaddles : function(){
        var self = this,
            heightRVCarousel;

        if (self.$paginationPaddles)
        {
          heightRVCarousel = self.$RVtitle.height() +  parseInt(self.$RVcarousel.css('marginTop'), 10) + ( ( self.$items.find('.wrapper-image').first().height() / 2) - ( self.paddleHeight / 2 ) );
          self.$paginationPaddles.css({
            'top'    : heightRVCarousel,
            'margin' : 0
          });
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
      setupEasing: function(){
        var self = this;

        //Define easing equations
        self.css3Easing = {
            easeOutSine     : 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
            easeInOutSine   : 'cubic-bezier(0.445, 0.050, 0.550, 0.950)',
            easeOutBack     : 'cubic-bezier(0.595, -0.160, 0.255, 1.140)',
            sonyScrollEase  : 'cubic-bezier(0.33,0.66,0.66,1)'
        };
      },
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
          point,
          distanceMoved;

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


        var self       = this,
        containerWidth = self.$el.width(),
        gutterWidth    = self.gutterWidth['default'] * containerWidth,
        colWidth       = self.colWidth['default']    * containerWidth,
        extraMarging   = 0,
        slimGridW      = 0,
        margeSlimGrid  = 0,
        extraPct       = 1,
        heightContainer     = 55 + 17 + 30,
        marginLeftContainer = 0,
        numColumns     = 4,
        $galleryItemsFirst,
        newContainerHeight;

        //reset
        self.$slimGrid.removeAttr('style');

        if ( !Modernizr.mediaqueries || self.mq('(min-width: 981px)') || self.$html.hasClass('lt-ie10') ) {

          self.$containerProduct.removeClass('full-bleed-no-max');

          //gutterWidth    = Settings.GUTTER_WIDTH_320 * containerWidth;
          gutterWidth    = self.gutterWidth['default'] * containerWidth;
          //colWidth       = ( Settings.COLUMN_WIDTH_320 * ( containerWidth ) );
          colWidth       = self.colWidth['default'] * containerWidth  ;
          numColumns     = 4;

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
          numColumns     = 3;

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

          //self.$el.bind('update.sm', self._onScrollerModuleUpdate );

          self.$pagination = $('.nav-paddles');

          self.nbPages = Math.ceil( Math.round( self.$galleryItems.length * extraPct) / numColumns);
          self.scrollerModule._generatePagination( self.nbPages );

          self.$galleryItems.find('.product-name').evenHeights();

          self.$el.find('.rp-overflow').on('update.sm', $.proxy( self._onScrollerModuleUpdate, self ) );

          self.$win.trigger('resize.rp');

          setTimeout(function(){ self.$win.trigger('resize.rp'); }, 1000);
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
          numColumns         = 4;

          //reset
          self.$slimGrid.removeAttr('style');

          if ( !Modernizr.mediaqueries || self.mq('(min-width: 981px)') || self.$html.hasClass('lt-ie10') )
          {

            self.$containerProduct.removeClass('full-bleed-no-max');


            gutterWidth    = self.gutterWidth['default'] * containerWidth;
            colWidth       = self.colWidth['default'] * containerWidth;
            numColumns     = 4;

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
            numColumns     = 3;

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
            self.$pagination.hide();
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
        var self    = this,
            animObj = {};

        //if( !self.useCSS3Transitions ) {

          //jquery fallback
          animObj.opacity = 1;
          self.$container.removeClass('hide').animate(animObj, 700);

        /*}else {

          animObj[ self.prefixed( self.TD ) ] = 700 + 'ms';
          animObj[ self.prefixed( self.TTF ) ] = self.css3Easing.easeOutBack;
          console.log('animObj', animObj);
          //animObj.display = 'block';
          //animObj.opacity = 1;
          self.$container.css( animObj );
          //self.$container.removeClass('hide').addClass('in');
        }
        */

      },

      tapOrClick: function(){
        var self = this;
        return self.hasTouch ? self.upEvent : self.clickEvent ;
      },

      toString: function(){
        return '[ object EditorialCarouselE13 ]';
      },

      _onScrollerModuleUpdate: function(e){

        var self = this,
            numColumns = self.getNbSlides();

        // console.log('_onScrollerModuleUpdate');

        if(!self.scrollerModule)
        {
          return false;
        }

        self.scrollerModule._generatePagination( self.nbPages );

        if ( ( !Modernizr.mediaqueries || self.mq('(min-width: 981px)') || self.$html.hasClass('lt-ie10') ) &&  self.$galleryItems.length <= numColumns )
        {
          self.$galleryItems.css({position:'relative', left : 0, top : 0});
        }
      }


    };

    //E13 Editorial Carousel definition on jQuery
    $.fn.editorialCarouselE13 = function(options) {
      var args = arguments;
      return this.each(function(){
        var self = $(this);
        if (options instanceof Object || !options) {
          if( !self.data('editorialCarouselE13') ) {
            self.data('editorialCarouselE13', new EditorialCarouselE13(self, options));
          }
        } else {
          var editorialCarouselE13 = self.data('editorialCarouselE13');
          if (editorialCarouselE13 && editorialCarouselE13[options]) {
              return editorialCarouselE13[options].apply(editorialCarouselE13, Array.prototype.slice.call(args, 1));
          }
        }
      });
    };

    //defaults for the related products
    $.fn.editorialCarouselE13.defaults = {
      throttleTime: 50,
      autoScaleContainer: true,
      minSlideOffset: 10,
      navigationControl: 'bullets'
    };

    return module;

});