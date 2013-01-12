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
      var self               = this;
      
      $.extend(self, {}, $.fn.tertiaryModule.defaults, options, $.fn.tertiaryModule.settings);
      
      self.$el               = $( element );
      self.$win              = $( window );
      self.$doc              = $( document );
      self.ev                = $( {} ); //event object
      
      self.$tccBodyWrapper   = self.$el; //self.$el.find(".tcc-body-wrapper");
      self.$tccBody          = self.$tccBodyWrapper.find(".tcc-body");
      self.$contentModules   = self.$el.find(".tcc-content-module");
      self.$scrollerInstance = null;
      self.numPages          = self.$contentModules.length;
      
      self.outerNavClasses = new Array ( "tcc-nav", "tcc-bullets" );
      self.innerNavClasses = new Array ( "tcc-nav-item", "tcc-bullet" );

      self.navSelectedClass  = "tcc-nav-selected";
      
      self.resizeEvent       = 'onorientationchange' in window ? 'orientationchange' : 'resize';
      self.resizeThrottle    = function(){self.handleResize()};
      
      
      self.hasTouch          = 'ontouchstart' in window || 'createTouch' in document ? true : false;
      self.tapOrClick        = function(){return self.hasTouch ? 'touchend' : 'click';}
      
      self.sequencerSpeed    = 300;  // default
      self.debounceSpeed     = 100; // default
      self.scrollDuration    = 400; // default
      
      self.mobileBreakpoint  = 479;

      // resize listener
      self.$win.on(self.resizeEvent + '.tcc', $.debounce(self.debounceSpeed, self.resizeThrottle)); 
      
      // nav update listener
      self.ev.on( 'tccOnNavUpdate', function(){
        console.group( '««« updateNavigation »»»' );       
        console.log( 'self »' , self);

        self.updateNavigation();

        console.log( '« end »');      
        console.groupEnd();
      });

      self.ev.on( 'onPaginationComplete.sm', function(){
        console.log( 'onPaginationComplete.sm »');
      });

      // go
      self.init(element); 
    }

    TertiaryModule.prototype = {
      constructor: TertiaryModule,

      init : function( element ) {
        console.group("init");

        var self           = this,
        isMobileBreakpoint = self.checkMobileBreakpoint();

        // console.log( 'self »' , self);
        // console.log( 'isMobileBreakpoint »' , isMobileBreakpoint );

        // @ mobile breakpoint?
        if(isMobileBreakpoint){
          //console.log("is mobile (init) »");
          self.setup();
        }
       
        console.log( '« end (init) »');
        console.groupEnd();
      },

      setup : function(){
        console.group( '««« setup »»»' );
        var self      = this,
        setupSequence = new Sequencer;

        setupSequence.add( self, self.setScrollerOptions, self.sequencerSpeed ); // set scroller & iscroll options
        setupSequence.add( self, self.setContentModuleSizes, self.sequencerSpeed ); // set content module sizes
        setupSequence.add( self, self.createScroller, self.sequencerSpeed ); // create scroller instance
        setupSequence.add( self, self.createNavigation, self.sequencerSpeed); // create bullet nav
        
        setupSequence.start();

        console.log( '« end »');
        console.groupEnd();
      },

      teardown : function(){
        console.group( '««« teardown »»»' );

        var self         = this,
        teardownSequence = new Sequencer;
        
        teardownSequence.add( self, self.removeStyleAttr, self.sequencerSpeed ); // remove scroller-specific style attributes
        teardownSequence.add( self, self.destroyNavigation, self.sequencerSpeed ); // hide bullets
        teardownSequence.add( self, self.destroyScroller, self.sequencerSpeed ); // destroy scroller instance
      
        teardownSequence.start();

        console.log( '« end »');
        console.groupEnd();
      },      

      createScroller : function(){
        console.group( '««« createScroller »»»' );
        
        var self=this;
        
        self.$scrollerInstance = self.$el.scrollerModule( self.scrollerOptions );

        // console.log( 'self.$scrollerInstance  »' , self.$scrollerInstance);

        console.log( '« end »');
        console.groupEnd();
      },

      destroyScroller : function(){
        console.group('««« destroyScroller »»»');
        var self  = this;
      
        self.$scrollerInstance.scrollerModule('destroy');
        self.$scrollerInstance = null;       
      
        console.log( '« end »');
        console.groupEnd();
      },

      removeStyleAttr : function(){
        console.group('««« removeStyleAttr »»»');
        var self  = this,
        $elements = self.$tccBodyWrapper.add(self.$tccBody).add(self.$contentModules);
      
        // TODO: is this needed, causing display problems?
        $elements.removeAttr('style'); 
      
        console.log( '« end »');
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
            momentum: false,
            bounce: true,
            hScroll: true,
            vScroll: false,
            hScrollbar: false,
            vScrollbar: false,   
            onScrollEnd: null,
            lockDirection:true,
            onBeforeScrollStart:null,
            onAnimationEnd: function(iscrollObj){
              console.group( '««« onAnimationEnd »»»' );

              if (self.controlNavItems) {
                console.log( 'iscrollObj »' , iscrollObj);

                self.updateCurrentId(iscrollObj.currPageX);
                self.updateNavigation();  
              };
              
              console.log( '« end »');
              console.groupEnd();
            },
          }
        };
      
        console.log( '« end »');
        console.groupEnd();
      },

      setContentModuleSizes : function(){
        console.group('««« setContentModuleSizes »»»');
      
        var self      = this,
        containerSize = Math.round(self.$el.outerWidth());
       
        self.$contentModules.each(function() {
          $(this).outerWidth(containerSize);
        });
     
        console.log( '« end »');
        console.groupEnd();
      },

      createNavigation : function(){
        console.group('««« createNavigation »»» ');

        // TODO default hidden

        var self     = this,      
        itemHTML     = '<div class="' + self.innerNavClasses.join(" ") + '"></div>',
        out          = '<div class="' + self.outerNavClasses.join(" ") + '">';
          
        if(self.controlNav){
          console.log( 'destroying existing nav first »', self.controlNav );
          self.destroyNavigation(); // remove any existing 
        }
        
        //reset current slide id 
        self.currentId = 0;

        for(var i = 0; i < self.numPages; i++) {
          out += itemHTML;
        }
        
        out += '</div>';
        out = $( out );
        self.controlNav = out;
        self.controlNavItems = out.children();
        self.$el.append( out );

        // if nav bullet is selected (instead of a swipe)       
        self.controlNav.on( self.tapOrClick() , function( e ) {
          self.handleNavClick(e);
        });

        self.ev.trigger( 'tccOnNavUpdate' );

        console.log( '« end »');
        console.groupEnd();
      },

      destroyNavigation : function(){
        console.group( '««« destroyNavigation »»»' );
        var self = this;
      
        // remove references 
        $( '.' + self.outerNavClasses.join(".") ).remove();
      
        console.groupEnd();
      },

      updateNavigation : function(){
        console.group( '««« updateNavigation »»»' );
        var self = this;
      
        var id = self.currentId,
            currItem,
            prevItem;

        if(self.prevNavItem) {
          self.prevNavItem.removeClass(self.navSelectedClass);
        }

        currItem = $(self.controlNavItems[id]);
        currItem.addClass(self.navSelectedClass);

        self.prevNavItem = currItem;       
        
        console.log( '« end »');
        console.groupEnd();
      },

      handleNavClick : function( e ){
        console.group( '««« handleNavClick »»»' );
        var self = this,
            item = $(e.target).closest( '.' + self.innerNavClasses.join(".") );

        if( item.length ) {          
          self.updateCurrentId(item.index());

          // tell sony-iscroll what page to go to         
          self.$scrollerInstance.scrollerModule('goto',( self.currentId ));

          self.ev.trigger( 'tccOnNavUpdate' );
        }
      
        console.log( '« end »');
        console.groupEnd();
      },

      updateCurrentId : function(index){
        console.group( '««« updateCurrentId »»»' );
        var self = this;
        
        console.log( 'self.currentId was »' , self.currentId);

        self.currentId = index;

        console.log( 'self.currentId is now »' , self.currentId);

        console.log( '« end »');
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
          if( self.$scrollerInstance != null ) {
            resizeSequencer.add( self, self.teardown, self.sequencerSpeed ); // teardown 
          }

          resizeSequencer.add( self, self.setup, self.sequencerSpeed + 100 ); // setup
          resizeSequencer.start();
          
        }else{
          console.log( 'in desktop (resize) »' );

          if( self.$scrollerInstance != null ){
            console.log( "there was a scrollerInstance »" , self.$scrollerInstance );
          
            self.teardown(); // teardown

            console.log( 'it should now be destroyed »' , self.$scrollerInstance );
          }

        }

        console.log( '« end »');
        console.groupEnd();
      },

      checkMobileBreakpoint : function(  ){
        console.group( '««« checkMobileBreakpoint »»»' );

        var self = this;

        console.log( '« end »');
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
      var tertiaryContainer = window.tcc = $('.tcc-scroller').tertiaryModule({}).data('tertiaryModule');
    } );

 })(jQuery, Modernizr, window, undefined);
