/*global jQuery, Modernizr, Sequencer*/

// ------------ Sony Tertiary Content Container (Tertiary) Module ------------
// Module: Tertiary Module
// Version: 0.1
// Modified: 01/16/2013, Telly Koosis
// Dependencies:
//     jQuery 1.7+, Modernizr, sony-iscroll.js, sony-scroller.js, sony-sequencer.js
// -------------------------------------------------------------------------

(function($, Modernizr, window, undefined) {
    
    'use strict';

    // Start module
    var TertiaryModule = function(element, options){
      var self                 = this;
      
      $.extend(self, {}, $.fn.tertiaryModule.defaults, options, $.fn.tertiaryModule.settings);
      
      self.$el                 = $( element );
      self.$win                = $( window );
      self.$doc                = $( window.document );
      self.ev                  = $( {} ); //event object
      
      self.mode                = null;
      
      self.$tccBodyWrapper     = self.$el;
      self.$tccBody            = self.$tccBodyWrapper.find('.tcc-body');
      self.$contentModules     = self.$el.find('.tcc-content-module');
      self.$scrollerInstance   = null;

      // bullet pagination
      //self.outerNavClasses     = new Array ( 'tcc-nav', 'pagination-bullets' );
      //self.innerNavClasses     = new Array ( 'tcc-nav-item', 'pagination-bullet' );
      self.outerNavClasses     = new Array ( 'pagination-bullets' );
      self.innerNavClasses     = new Array ( 'pagination-bullet' );      
      self.bulletPaginationOn  = 'pagination-bullets-on';
      self.navSelectedClass    = 'bullet-selected';
      
      self.resizeEvent         = 'onorientationchange' in window ? 'orientationchange' : 'resize';
      self.resizeThrottle      = function(){self.handleResize();};
      
      self.hasTouch            = 'ontouchstart' in window || 'createTouch' in self.$doc ? true : false;
      self.tapOrClick          = function(){return self.hasTouch ? 'touchend' : 'click';};
      
      self.sequencerSpeed      = 50;  // default
      self.debounceSpeed       = 300; // default
      self.scrollDuration      = 400; // default
      
      self.phoneBreakpoint     = 479;
      self.tabletBreakpointMin = self.phoneBreakpoint + 1;
      self.tabletBreakpointMax = 768;

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

      // go
      self.init();
    };

    TertiaryModule.prototype = {
      constructor: TertiaryModule,

      init : function() {
        console.group('init');

        var self = this;

        self.setMode();
     
        // @ mobile breakpoint?
        if(self.mode !== 'desktop'){
          console.log( 'is mobile mode »' , self.mode);
          self.setup();
        }

        console.log( '« end (init) »');
        console.groupEnd();
      },

      setup : function(){
        console.group( '««« setup »»»' );
        var self      = this,
            setupSequence = new Sequencer();

        setupSequence.add( self, self.setContentModuleSizes, self.sequencerSpeed ); // set content module sizes
        setupSequence.add( self, self.setScrollerOptions, self.sequencerSpeed + 100 ); // set scroller & iscroll options
        setupSequence.add( self, self.createScroller, self.sequencerSpeed ); // create scroller instance
        setupSequence.add( self, self.createNavigation, self.sequencerSpeed); // create bullet nav
        setupSequence.start();

        console.log( '« end »');
        console.groupEnd();
      },

      teardown : function(){
        console.group( '««« teardown »»»' );

        var self         = this,
        teardownSequence = new Sequencer();
        
        teardownSequence.add( self, self.removeStyleAttr, self.sequencerSpeed ); // remove scroller-specific style attributes
        teardownSequence.add( self, self.destroyNavigation, self.sequencerSpeed ); // hide bullets
        teardownSequence.add( self, self.destroyScroller, self.sequencerSpeed ); // destroy scroller instance
        teardownSequence.add( self, self.setMode, self.sequencerSpeed ); // destroy scroller instance
      
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
          fitPerPage:self.mode === 'phone' ? 1 : 2, // 2-up vs 1-up
          lastPageCenter: false, //self.mode == 'phone' ? false : true,

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
              }
              
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
        containerSize = Math.round(self.$el.outerWidth()); // assumes 'phone'

        // tablet is 2-up not 1-up, so split
        if(self.mode === 'tablet'){
          containerSize = Math.round(containerSize / 2);
        }
        
        console.log( 'contentModules size »' , containerSize );

        self.$contentModules.each(function() {
          var hasPaddingLeft = $(this).css('padding-left') === '0px' ? false : true,
              hasPaddingRight = $(this).css('padding-right') === '0px' ? false : true;

          if(hasPaddingRight){
            console.log( 'this modules has padding right »' , $(this).css('padding-right') );
          }else{
            console.log( 'no padding right »');
          }

          if(hasPaddingLeft){
            console.log( 'this modules has padding left »' , $(this).css('padding-left') ); 
          }else{
            console.log( 'no padding left »' );
          }

          // CONVERT PADDING TO PIXELS
         // REMOVE FROM WIDTH

          $(this).innerWidth(containerSize);


        });
     
        console.log( '« end »');
        console.groupEnd();
      },

      // BULLET PAGINATION NAVIGATION

      createNavigation : function(){
        console.group('««« createNavigation »»» ');

        // TODO default hidden

        var self = this,
        outerClasses = self.outerNavClasses.join(' '),
        innerClasses = self.innerNavClasses.join(' '),
        itemHTML = '<div class="' + innerClasses + '"></div>',
        out      = '<div class="' + outerClasses + '">',
        numPages = self.mode === 'tablet' ? 2 : self.$contentModules.length;
          
        if(self.controlNav){
          console.log( 'destroying existing nav first »', self.controlNav );
          self.destroyNavigation(); // remove any existing
        }
        
        //reset current slide id
        self.currentId = 0;

        for(var i = 0; i < numPages; i++) {
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

        $( '.' + self.outerNavClasses.join('.') ).addClass(self.bulletPaginationOn);

        self.ev.trigger( 'tccOnNavUpdate' );

        console.log( '« end »');
        console.groupEnd();
      },

      destroyNavigation : function(){
        console.group( '««« destroyNavigation »»»' );
        var self = this;
      
        // 'fade out' before removing
        $( '.' + self.outerNavClasses.join('.') )
          .removeClass(self.bulletPaginationOn)
          .delay(300) // let it fade out...
          .remove(); // remove references


        console.groupEnd();
      },

      updateNavigation : function(){
        console.group( '««« updateNavigation »»»' );
        var self = this;
      
        var id = self.currentId,
            currItem;

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
            item = $(e.target).closest( '.' + self.innerNavClasses.join('.') );

        if( item.length ) {
          self.updateCurrentId(item.index());

          // tell sony-iscroll what page to go to
          self.$scrollerInstance.scrollerModule('gotopage',( self.currentId ));

          self.ev.trigger( 'tccOnNavUpdate' );
        }
      
        console.log( '« end »');
        console.groupEnd();
      },

      // END BULLET PAGINATION

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
        
        var self = this;

        self.setMode();

        console.log( 'mode is  »' , self.mode);

        // @ mobile breakpoint?
        if( self.mode !== 'desktop' ){
          console.log('in mobile (resize) »', self.mode);
          
          var resizeSequencer = new Sequencer();

          if( self.$scrollerInstance !== null ) {
            resizeSequencer.add( self, self.teardown, self.sequencerSpeed ); // teardown
          }

          resizeSequencer.add( self, self.setup, self.sequencerSpeed + 100 ); // setup
          resizeSequencer.start();
          
        }else{
          console.log( 'in desktop (resize) »' );

          if( self.$scrollerInstance !== null ){
            console.log( 'there was a scrollerInstance »' , self.$scrollerInstance );
          
            self.teardown(); // teardown

            console.log( 'it should now be destroyed »' , self.$scrollerInstance );
          }

        }

        console.log( '« end »');
        console.groupEnd();
      },

      setMode : function(){
        console.group( '««« setMode »»»' );
        var self = this;

        if( Modernizr.mq('(max-width:'+ self.phoneBreakpoint+'px)') ){
          self.mode = 'phone';
        }else if ( Modernizr.mq('(min-width:' + self.tabletBreakpointMin + 'px) and (max-width:' + self.tabletBreakpointMax + 'px)') ) {
          self.mode = 'tablet';
        }else{
          self.mode = 'desktop';
        }

        console.log( 'mode is »' , self.mode);
        console.log( '« end »');
        console.groupEnd();
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
      $('.tcc-scroller').tertiaryModule({}).data('tertiaryModule');
    } );

 })(jQuery, Modernizr, window, undefined);
