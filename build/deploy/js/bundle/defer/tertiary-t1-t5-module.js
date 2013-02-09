/*global jQuery, Modernizr, Sequencer*/

// Sony Tertiary Content Container
// -------------------------------------------------
//
// * **Module:** Tertiary Module
// * **Version:** 0.1
// * **Modified:** 02/05/2013
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
      
      self.$container              = $( element );
      self.containerId             = '#' + self.$container.attr("id");
      self.$el                     = self.$container.find(".tcc-scroller");
      self.$win                    = $( window );
      self.$doc                    = $( window.document );
      self.ev                      = $( {} ); //event object
      
      self.mode                    = null;

      self.contentSelectorClass    = '.tcc-body';
      self.contentModulesClass     = '.tcc-content-module';
      self.$tccBodyWrapper         = self.$el;
      self.$tccBody                = self.$tccBodyWrapper.find(self.contentSelectorClass);
      self.$contentModules         = self.$el.find(self.contentModulesClass);
      self.$scrollerInstance       = null;
                
      self.resizeEvent             = 'onorientationchange' in window ? 'orientationchange' : 'resize';
      self.resizeThrottle          = function(){self.handleResize();};
      
      self.hasTouch                = 'ontouchstart' in window || 'createTouch' in self.$doc ? true : false;
      self.tapOrClick              = function(){return self.hasTouch ? 'touchend' : 'click';};
      
      self.sequencerSpeed          = 100; 
      self.debounceSpeed           = 300;
      self.scrollDuration          = 400;
      
      self.phoneBreakpoint         = 479;
      self.tabletBreakpointMin     = self.phoneBreakpoint + 1;
      self.tabletBreakpointMax     = 768;

      self.marginPercent          = Number('.0334'); // 22/650 (at 2-up)
      self.paddingPerContent      = 20;

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
        var self = this;
       
        // all general settings are set as default options      
        self.scrollerOptions = self.options;
       
        // now that we know mode, add it as option.
        self.scrollerOptions.fitPerPage = self.mode === 'phone' ? 1 : 2; 

        // TODO: determine why passing this into scroller was casusing issues
        // when more than one scroller instance was on the page 
        // bullets would get appended to last instance and oddly 
        // not respecting encapsulation
        // self.scrollerOptions.appendBulletsTo = self.containerId + '.tcc-wrapper';

      },

      // every resize event (debounced) determine size of each content module 
      setContentModuleSizes : function(){
        //console.group('««« setContentModuleSizes »»»');
      
        var self      = this,
        containerSize = Math.round(self.$el.outerWidth()), // no margins 
        eachContentWidth = containerSize;  // default to 1 up, 100%

        if((self.mode === 'tablet') || (self.mode === 'phone')){
        
          // set padding to get full bleed effect on pagination
          self.setContentModulePadding(self.paddingPerContent);
          
          // tablet is 2-up not 1-up, so split evenly
          if(self.mode === 'tablet'){
            var marginPerContent =  self.getContentModuleMargin(containerSize);

            // set margins of content modules
            self.setContentModuleMargins(marginPerContent);

            // calculate each content module width without margin so it fits
            eachContentWidth = Math.round((containerSize / 2) - marginPerContent);
          }
          
        }

        self.$contentModules.each(function() {
          $(this).innerWidth(eachContentWidth);
        });

      },

      // Determines margin needed per content module 
      // *self.marginPercent* was determined target / context (at exact tablet breakpoint)
      // TODO: if necessary, make this flexible for more than 3 content modules
      getContentModuleMargin : function( totalSize ){
        var self = this,
            relativeMargin, 
            eachMargin;
      
        // calculate the relative margin given the current available width
        relativeMargin = Math.round(totalSize * self.marginPercent);
        //console.log( 'relativeMargin »' , relativeMargin);


        // calculate margin for each content module
        eachMargin = relativeMargin/2;
        
        //console.log( 'eachMargin »' , eachMargin);
        return eachMargin;
      },

      // Assumes there are exactly three content modules (2 pages) in 2-up formation
      setContentModuleMargins : function( marginForEach ){     
        var self = this;
        
        // set content module's margins correctly
        $(self.$contentModules[0]).css( "marginLeft", marginForEach );
        $(self.$contentModules[1]).css( "marginRight", marginForEach );
        $(self.$contentModules[2]).css( "marginRight", marginForEach );
        $(self.$contentModules[2]).css( "marginLeft", marginForEach );

      },

      // Adding "grid paddding" back in on the content modules 
      // as padding to support full bleed pagination
      setContentModulePadding : function( paddingValue ){
        //console.group( '««« setContentMoudlePadding »»»' );
        var self = this;

        // set content module's padding correctly
        $(self.$contentModules[0]).css( "paddingRight", paddingValue );
        $(self.$contentModules[0]).css( "paddingLeft", paddingValue );
        $(self.$contentModules[1]).css( "paddingLeft", paddingValue );
        $(self.$contentModules[1]).css( "paddingRight", paddingValue );
        $(self.$contentModules[2]).css( "paddingRight", paddingValue );
        $(self.$contentModules[2]).css( "paddingLeft", paddingValue );
        
        //console.log( '« end »');
        //console.groupEnd();
      },

      // on resize event (debounced) determine what to do
      handleResize : function(){
        //console.group( '««« handleResize »»»' );
        var self = this;

        // update mode at current break point
        self.setMode(); 

        // if the mode is 'phone' or 'tablet' (aka mobile) then proceed
        if( self.mode !== 'desktop' ){
          
          var resizeSequencer = new Sequencer();

          // if there's a scroller set up, add teardown method to the sequence (reset)
          if( self.$scrollerInstance !== null ) {
            resizeSequencer.add( self, self.teardown, self.sequencerSpeed ); // teardown
          }

          // create a new scroller
          resizeSequencer.add( self, self.setup, self.sequencerSpeed + 100 ); // setup

          // start sequence
          resizeSequencer.start();
          
        }else{
          //console.log( 'in desktop (resize) »' );

          // if mode is now 'desktop' then simply destroy scroller
          if( self.$scrollerInstance !== null ){        
            self.teardown();
          }

        }
      },

      // based on current breakpoint, set mode
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
        contentSelector: ".tcc-body", 
        itemElementSelector: ".tcc-content-module", 
        mode: 'paginate',
        //fitPerPage: null, // null for now, determined once self.mode is set in setScrollerOptions
        generatePagination: true,
        //appendBulletsTo:null, // adding this later in setScrollerOption
        centerItems: true,

        iscrollProps: {
          snap: true,
          momentum: false,
          hScrollbar: false,
          vScrollbar: false,
        }
      }
    };

    // Non override-able settings
    $.fn.tertiaryModule.settings = {
      isTouch: !!( 'ontouchstart' in window ),
      isInitialized: false
    };

    $( function(){

      // TODO: optimize for more than one tertiary container
      $('.tcc-wrapper').each(function() {
        $(this).tertiaryModule({}).data('tertiaryModule');
      });

    } );

 })(jQuery, Modernizr, window, undefined);
