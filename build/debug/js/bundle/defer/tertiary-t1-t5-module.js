/*global jQuery, Modernizr, Sequencer*/

// Sony Tertiary Content Container
// -------------------------------------------------
//
// * **Module:** Tertiary Module
// * **Version:** 0.1
// * **Modified:** 01/29/2013
// * **Author:** Telly Koosis
// * **Dependencies:** jQuery 1.7+, Modernizr, [sony-iscroll.js](sony-iscroll.html), [sony-scroller.js](sony-scroller.html), [sony-sequencer.js](sony-sequencer.html)
//
// *Example Usage:*
//      Automatic detection of .tcc-scroller on page
//      $('.tcc-scroller').tertiaryModule({
//        'sampleOption': 'foo'
//      }).data('tertiaryModule');
//      
// TODO: Support more than one Tertiary Container on a page, only one supported currently     

(function($, Modernizr, window, undefined) {
    
    'use strict';

    var TertiaryModule = function(element, options){
      var self                 = this;
      
      $.extend(self, {}, $.fn.tertiaryModule.defaults, options, $.fn.tertiaryModule.settings);
      
      self.$el                     = $( element );
      self.$win                    = $( window );
      self.$doc                    = $( window.document );
      self.ev                      = $( {} ); //event object
      
      self.mode                    = null;
      
      self.$tccBodyWrapper         = self.$el;
      self.$tccBody                = self.$tccBodyWrapper.find('.tcc-body');
      self.$contentModules         = self.$el.find('.tcc-content-module');
      self.$scrollerInstance       = null;
                
      self.resizeEvent             = 'onorientationchange' in window ? 'orientationchange' : 'resize';
      self.resizeThrottle          = function(){self.handleResize();};
      
      self.hasTouch                = 'ontouchstart' in window || 'createTouch' in self.$doc ? true : false;
      self.tapOrClick              = function(){return self.hasTouch ? 'touchend' : 'click';};
      
      self.sequencerSpeed          = 50; 
      self.debounceSpeed           = 300;
      self.scrollDuration          = 400;
      
      self.phoneBreakpoint         = 479;
      self.tabletBreakpointMin     = self.phoneBreakpoint + 1;
      self.tabletBreakpointMax     = 768;

      // define resize listener, debounced
      self.$win.on(self.resizeEvent + '.tcc', $.debounce(self.debounceSpeed, self.resizeThrottle));     

      // start it
      self.init();
    };

    TertiaryModule.prototype = {
      constructor: TertiaryModule,

      init : function() {

        var self = this;

        self.setMode();
     
        // if screen size is in mobile (tablet, phone) mode then create a scroller
        if(self.mode !== 'desktop'){
          self.setup();
        }
      },

      // controller for scroller setup
      setup : function(){
        var self      = this,
            setupSequence = new Sequencer();

        // define order of events via sequencer
        setupSequence.add( self, self.setContentModuleSizes, self.sequencerSpeed ); // set content module sizes
        setupSequence.add( self, self.setScrollerOptions, self.sequencerSpeed + 100 ); // set scroller & iscroll options
        setupSequence.add( self, self.createScroller, self.sequencerSpeed ); // create scroller instance
        setupSequence.start();

      },

      // teardown controller
      teardown : function(){
        var self         = this,
        teardownSequence = new Sequencer();

        // teardown sequence        
        teardownSequence.add( self, self.removeStyleAttr, self.sequencerSpeed ); // remove scroller-specific style attributes
        teardownSequence.add( self, self.destroyScroller, self.sequencerSpeed ); // destroy scroller instance
        teardownSequence.add( self, self.setMode, self.sequencerSpeed ); // destroy scroller instance     
        teardownSequence.start();
      },

      // instantiate a scroller 
      createScroller : function(){       
        var self=this;
        
        self.$scrollerInstance = self.$el.scrollerModule( self.scrollerOptions );

        //console.log( '« end »');
        //console.groupEnd();
      },

      // destroy scroller if not in mobile
      destroyScroller : function(){
        //console.group('««« destroyScroller »»»');
        var self  = this;
      
        self.$scrollerInstance.scrollerModule('destroy');
        self.$scrollerInstance = null;
      
        //console.log( '« end »');
        //console.groupEnd();
      },

      // clean up residual style elements after teardown
      removeStyleAttr : function(){
        //console.group('««« removeStyleAttr »»»');
        var self  = this,
        $elements = self.$tccBodyWrapper.add(self.$tccBody).add(self.$contentModules);
    
        $elements.removeAttr('style'); 
      
        //console.log( '« end »');
        //console.groupEnd();
      },

      // set scroller options to be passed to sony-scroller
      // based on current mode 
      setScrollerOptions : function(){
        //console.group('««« setOptions »»»');
        
        var self = this;
       
        // all general settings are set as default options      
        self.scrollerOptions = self.options;
       
       // now that we know mode, add it as option.
        self.scrollerOptions.fitPerPage = self.mode === 'phone' ? 1 : 2; 

        //console.log( 'self.scrollerOptions »', self.scrollerOptions);
        //console.log( 'self.scrollerOptions.fitPerPage »' , self.scrollerOptions.fitPerPage);
        //console.log( '« end »');
        //console.groupEnd();
      },

      // every resize event (debounced) determine size of each content module 
      setContentModuleSizes : function(){
        //console.group('««« setContentModuleSizes »»»');
      
        var self      = this,
        containerSize = Math.round(self.$el.outerWidth()); // assumes 'phone'

        // tablet is 2-up not 1-up, so split
        if(self.mode === 'tablet'){
          containerSize = Math.round(containerSize / 2);
        }
        
        //console.log( 'contentModules size »' , containerSize );

        self.$contentModules.each(function() {
          var hasPaddingLeft = $(this).css('padding-left') === '0px' ? false : true,
              hasPaddingRight = $(this).css('padding-right') === '0px' ? false : true;

          $(this).innerWidth(containerSize);

        });
     
        //console.log( '« end »');
        //console.groupEnd();
      },

      // on resize event (debounced) determine what to do
      handleResize : function(){
        //console.group( '««« handleResize »»»' );
        
        var self = this;

        self.setMode();

        //console.log( 'mode is  »' , self.mode);

        // mobile breakpoint?
        if( self.mode !== 'desktop' ){
          //console.log('in mobile (resize) »', self.mode);
          
          var resizeSequencer = new Sequencer();

          if( self.$scrollerInstance !== null ) {
            resizeSequencer.add( self, self.teardown, self.sequencerSpeed ); // teardown
          }

          resizeSequencer.add( self, self.setup, self.sequencerSpeed + 100 ); // setup
          resizeSequencer.start();
          
        }else{
          //console.log( 'in desktop (resize) »' );

          if( self.$scrollerInstance !== null ){
            //console.log( 'there was a scrollerInstance »' , self.$scrollerInstance );
          
            self.teardown(); // teardown

            //console.log( 'it should now be destroyed »' , self.$scrollerInstance );
          }

        }

        //console.log( '« end »');
        //console.groupEnd();
      },

      // based on current breakpoint value, set mode accordingly
      // based on self.phoneBreakpoint || self.tabletBreakpointMin || self.tabletBreakpointMax
      setMode : function(){
        //console.group( '««« setMode »»»' );
        var self = this;

        if( Modernizr.mq('(max-width:'+ self.phoneBreakpoint+'px)') ){
          self.mode = 'phone';
        }else if ( Modernizr.mq('(min-width:' + self.tabletBreakpointMin + 'px) and (max-width:' + self.tabletBreakpointMax + 'px)') ) {
          self.mode = 'tablet';
        }else{
          self.mode = 'desktop';
        }

        //console.log( 'mode is »' , self.mode);
        //console.log( '« end »');
        //console.groupEnd();
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

    // Defaults options for the module
    $.fn.tertiaryModule.defaults = {
      
      options : {
        contentSelector: '.tcc-body',
        itemElementSelector: '.tcc-content-module',
        mode: 'paginate',
        fitPerPage: null, // null for now, determined once self.mode is set
        lastPageCenter: false,
        generatePagination: true,
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
        }
      }
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
