// ------------ Sony Tertiary Content Container (Tertiary) Module ------------
// Module: Tertiary Module
// Version: 0.1
// Modified: 01/10/2013
// Dependencies: jQuery 1.7+, Modernizr, sony-iscroll.js, sony-scroller.js
// -------------------------------------------------------------------------

(function($, Modernizr, window, undefined) {
    
    'use strict';

    // Start module
    var TertiaryModule = function(element, options){
      var self                = this;
      
      $.extend(self, {}, $.fn.tertiaryModule.defaults, options, $.fn.tertiaryModule.settings);
      
      self.$el                = $( element );
      self.$win               = $( window );
      self.$doc               = $( document );
      
      self.$tccBodyWrapper    = self.$el.find(".tcc-body-wrapper");
      self.$tccBody           = self.$tccBodyWrapper.find(".tcc-body");
      self.$contentModules    = self.$el.find(".tcc-content-module");
      self.$scrollerInstance  = null;
      
      self.resizeEvent        = 'onorientationchange' in window ? 'orientationchange' : 'resize';
      self.resizeThrottle     = function(){self.handleResize()};

      self.sequencerSpeed      = 100;  // default
      self.debounceSpeed       = 100; // default
      
      self.mobileBreakpoint   = 479;
      //self.isMobileBreakpoint = self.checkMobileBreakpoint

      // set scroller & iscroll options
      self.setScrollerOptions(); 

      // resize listener
      self.$win.on(self.resizeEvent + '.tcc', $.debounce(self.debounceSpeed, self.resizeThrottle)); 
      
      // build navigation (default hidden)
      self.createNavigation();
  
      // go
      self.init(element); 
    }

    TertiaryModule.prototype = {
      constructor: TertiaryModule,

      init : function( element ) {
        console.group("init");

        var self           = this,
        isMobileBreakpoint = self.checkMobileBreakpoint();

        console.log( 'self »' , self);
        console.log( 'isMobileBreakpoint »' , isMobileBreakpoint );

        // @ mobile breakpoint?
        if(isMobileBreakpoint){
          console.log("is mobile (init) »");
          self.setupScroller();
        }

        console.groupEnd();
      },

      setupScroller : function(){
        console.group( '««« setupScroller »»»' );
        var self      = this,
        setupSequence = new Sequencer;

        setupSequence.add(self,self.setContentModuleSizes,self.sequencerSpeed); // set content module sizes
        setupSequence.add(self,self.createScroller,self.sequencerSpeed); // create scroller instance
        setupSequence.add(self,self.showNavigation,self.sequencerSpeed); // show bullets 
        setupSequence.start();

        console.groupEnd();
      },

      teardownScroller : function(){
        console.group( '««« teardownScroller »»»' );

        var self         = this,
        teardownSequence = new Sequencer;
        
        teardownSequence.add( self, self.hideNavigation, self.sequencerSpeed ); // hide bullets
        teardownSequence.add( self, self.destroyScroller, self.sequencerSpeed ); // destroy scroller instance
        teardownSequence.add( self, self.removeStyleAttr, self.sequencerSpeed ); // remove scroller-specific style attributes
      
        teardownSequence.start();

        console.groupEnd();
      },      

      createScroller : function(){
        console.group( '««« createScroller »»»' );
        
        var self=this;
        
        self.scrollerInstance = self.$el.scrollerModule( self.scrollerOptions );

        console.groupEnd();
      },

      destroyScroller : function(){
        console.group('««« destroyScroller »»»');
        var self  = this;
      
        self.scrollerInstance.scrollerModule('destroy');
        self.scrollerInstance = null;       
      
        console.groupEnd();
      },

      removeStyleAttr : function(){
        console.group('««« removeStyleAttr »»»');
        var self  = this,
        $elements = self.$tccBodyWrapper.add(self.$tccBody).add(self.$contentModules);
      
        // TODO: is this needed, causing display problems?
        $elements.removeAttr('style'); 
      
        console.groupEnd();
      },

      setScrollerOptions : function(){
        console.group('««« setOptions »»»');
        
        var self = this;
      
        self.scrollerOptions = {
          contentSelector: '.tcc-body',
          itemElementSelector: '.tcc-content-module',
          mode: 'paginate',
          fitPerPage:1,

          iscrollProps: {
            snap: true,
            momentum: true,
            bounce: true,
            hScroll: true,
            vScroll: false,
            hScrollbar: false,
            vScrollbar: false,   
            onScrollEnd: null,
            lockDirection:true,
            onBeforeScrollStart:null,
          }
        };
      
        console.groupEnd();
      },

      setContentModuleSizes : function(){
        console.group('««« setContentModuleSizes »»»');
      
        var self      = this,
        containerSize = Math.round(self.$el.outerWidth());
       
        self.$contentModules.each(function() {
          $(this).outerWidth(containerSize);
        });
     
        console.groupEnd();
      },

      createNavigation : function(){
        console.group('««« createNavigation »»» TODO');
        var self = this;
          
        // default hidden

       //    itemHTML = '<div class="soc-nav-item soc-bullet"></div>',
       //    out          = '<div class="soc-nav soc-bullets">';
          
       //    //remove other references 
       //    $('.soc-nav.soc-bullets').remove();

       //    //reset current slide id 
       //    self.currentId = 0;

       //    //self.controlNavEnabled = true;
       //    //self.$container.addClass('ssWithBullets');
       //    for(var i = 0; i < self.numSlides; i++) {
       //      out += itemHTML;
       //    }
       //    out += '</div>';
       //    out = $( out );
       //    self.controlNav = out;
       //    self.controlNavItems = out.children();
       //    self.$el.append( out );

       //    self.controlNav.on( self.tapOrClick() , function( e ) {
       //      var item = $(e.target).closest( '.soc-nav-item' );
       //      if( item.length ) {
       //        self.currentId = item.index();
       //        self.moveTo();
       //        console.log("Current Slide ID # »",self.currentId);
       //      }
       //    } );

       //    self.ev.trigger( 'socOnUpdateNav' );


        console.groupEnd();
      },

      showNavigation : function(){
        console.group('««« showNavigation »»» TODO');
        var self = this;
        console.groupEnd();
      },

      hideNavigation : function(){
        console.group( '««« hideNavigation »»» TODO' );
        var self = this;
        console.groupEnd();
      },

      handleResize : function(){
        console.group( '««« handleResize »»»' );
        
        var self           = this,
        isMobileBreakpoint = self.checkMobileBreakpoint();

        console.log('isMobileBreakpoint »', isMobileBreakpoint);

        // @ mobile breakpoint?
        if( isMobileBreakpoint ){
          console.log("in mobile (resize) »");
          var resizeSequencer = new Sequencer;
          resizeSequencer.add( self, self.teardownScroller, self.sequencerSpeed ); // teardown
          resizeSequencer.add( self, self.setupScroller, self.sequencerSpeed + 100 ); // setup
          resizeSequencer.start();
          
        }else{
          console.log( 'in desktop (resize) »' );

          if( self.scrollerInstance != null ){
            console.log( "there was a scrollerInstance »" , self.scrollerInstance );
          
            self.teardownScroller(); // teardown

            console.log( 'it should now be destroyed »' , self.scrollerInstance );
          }

        }

        console.groupEnd();
      },

      checkMobileBreakpoint : function(  ){
        console.group( '««« checkMobileBreakpoint »»»' );
        var self = this;
        
        console.groupEnd();
        
        return Modernizr.mq('(max-width:'+ self.mobileBreakpoint+'px)') ? true : false; // bool
      }

    };

    // Plugin definition
    $.fn.tertiaryModule = function( options ) {
      var args = Array.prototype.slice.call( arguments, 1 );
      return this.each(function() {
        var self = $(this),
          tertiaryModule = self.data('tertiaryModule');
    
        // If we don't have a stored tertiaryModule, make a new one and save it
        if ( !tertiaryModule ) {
            tertiaryModule = new TertiaryModule( self, options );
            self.data( 'tertiaryModule', tertiaryModule );
        }
    
        if ( typeof options === 'string' ) {
          tertiaryModule[ options ].apply( tertiaryModule, args );
        }
      });
    };

    // Defaults options for your module
    $.fn.tertiaryModule.defaults = { 
      sampleOption: 0
    };

    // Non override-able settings
    $.fn.tertiaryModule.settings = { 
      isTouch: !!( 'ontouchstart' in window ),
      isInitialized: false
    };

    $( function(){
      // if there isn't a .tcc-scroller on the page, nothing will happen...
      var tertiaryContainer = $('.tcc-scroller').tertiaryModule({}).data('tertiaryModule');
    } );

 })(jQuery, Modernizr, window, undefined);
