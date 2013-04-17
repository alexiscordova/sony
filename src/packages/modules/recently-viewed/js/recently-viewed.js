// Recently Viewed (RecentlyViewed) Module
// --------------------------------------------
//
// * **Class:** RecentlyViewed
// * **Version:** 1.0
// * **Modified:** 02/22/2013
// * **Author:** Arnaud Tanielian
// * **Dependencies:** jQuery 1.7+ , Modernizr, sony-carousel
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
      self.paddleHeight           = 43;
      self.classgrid              = "span2";

      self.useCSS3Transitions     = Modernizr.csstransitions; //Detect if we can use CSS3 transitions
      self.hasMediaQueries        = Modernizr.mediaqueries;
      self.mq                     = Modernizr.mq;
      self.isOSCStyle             = false;

      //$
      self.$doc                   = Settings.$document;
      self.$win                   = Settings.$window;
      self.$html                  = Settings.$html;

      self.$el                    = $(element);
      self.$RVtitle               = self.$el.find(".rv-title");
      self.$RVcarousel            = self.$el.find(".rv-carousel");
      self.$carousel              = self.$el.find(".carousel");
      self.$slides                = self.$el.find(".sony-carousel-slide"); 
      self.$items                 = self.$el.find(".sony-carousel-slide-children");
      self.$slidesContainer       = self.$el.find('.sony-carousel');
      self.$carouselWrapper       = self.$el.find('.sony-carousel-wrapper');
      self.$container             = self.$carousel.parent(); //parent of the .carousel, span12
      self.$paddles               = null; // has to be created and given to the sony-carousel
      self.$paginationPaddles     = null;

      
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

        }


        //Finally, apply the good class
        self.$items.addClass(self.classgrid);


      },
      setupCarousel : function(){

        self = this;

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
          heightRVCarousel = self.$RVtitle.height() +  parseInt(self.$RVcarousel.css("marginTop"), 10) + ( ( self.$items.find(".product-img").first().height() / 2) - ( self.paddleHeight / 2 ) );
          self.$paginationPaddles.css({
            'top'    : heightRVCarousel,
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

      toString: function(){
        return '[ object RecentlyViewed ]';
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


    return self;

});


