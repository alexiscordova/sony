/*global jQuery, Modernizr, Sequencer*/

// Sony Tertiary Content Container
// -------------------------------------------------
//
// * **Module:** Tertiary Module
// * **Version:** 0.1
// * **Modified:** 02/14/2013
// * **Author:** Telly Koosis
// * **Dependencies:** jQuery 1.7+, Modernizr, [sony-iscroll.js](sony-iscroll.html), [sony-scroller.js](sony-scroller.html), [sony-sequencer.js](sony-sequencer.html)
//
// *Example Usage:*
//      Automatic detection of .tcc-scroller on page
//      $('.tcc-wrapper').tertiaryModule({}).data('tertiaryModule');
// 

(function($, Modernizr, window, undefined) {
    
    'use strict';

    var TertiaryModule = function(element, options){
      var self                 = this;
      
      $.extend(self, {}, $.fn.tertiaryModule.defaults, options, $.fn.tertiaryModule.settings);
      
      self.$win                    = SONY.$window;
      self.isTouch                 = SONY.Settings.hasTouchEvents;
      self.ev                      = $( {} ); //event object
     
      self.isLayoutHidden          = false;
      self.mode                    = null;
      self.prevMode                = null;
      self.$scrollerInstance       = null;              

      // CACHED SELECTORS      
      self.$container              = $( element );
      self.$el                     = self.$container.find(".tcc-scroller");
      self.containerId             = '#' + self.$container.attr("id");
      self.contentModulesClass     = '.tcc-content-module';
      self.contentSelectorClass    = '.tcc-body';
      self.$tccHeaderWrapper       = self.$container.find('.tcc-header-wrapper');
      self.$tccHeader              = self.$tccHeaderWrapper.find(".tcc-header");
      self.$tccBodyWrapper         = self.$el;
      self.$tccBody                = self.$tccBodyWrapper.find(self.contentSelectorClass);
      self.$contentModules         = self.$el.find(self.contentModulesClass);
      self.$hideShowEls            = self.$tccBodyWrapper.add(self.$tccBody).add(self.$contentModules);
      
      self.$loader                 = self.$container.find(".loader");
      
      //self.debounce                = $.debounce;

      // EVENTS
      // namespaced versions of the global event 
      self.tccNamespace            = '.tcc';
      self.debounceBeforeEvent     = 'global:resizeDebouncedAtBegin-200ms' + self.tccNamespace; 
      self.debounceEvent           = 'global:resizeDebounced-200ms' + self.tccNamespace;

      //self.resizeFunc              = $.proxy( self.onResizeTcc, self ); // function(){self.onResizeTcc();};
      self.beforeResizeFunc        = $.proxy( self.beforeResize, self ); // function(){self.handleResize();};
      self.afterResizeFunc         = $.proxy( self.afterResize, self ); // function(){self.handleResize();};
     
      self.sequencerSpeed          = 250;
      self.hideShowSpeed           = 250;
      //self.debounceSpeed           = 300;
     
      // BREAKPOINTS
      self.phoneBreakpoint         = 479;
      self.tabletBreakpointMin     = self.phoneBreakpoint + 1;
      self.tabletBreakpointMax     = 768;

      // GRID & SPACING
      self.marginPercent          = Number('.0334'); // 22/650 (at 2-up)
      self.paddingPerContent      = 20;

      // define before debounce
      //self.debouncedBeforeResize = self.debounce ? self.debounce( self.debounceSpeed, true, self.beforeResizeFunc ) : self.beforeResizeFunc;
      
      // register listen for global debounce to call method before debounce begins
      SONY.on(self.debounceBeforeEvent, self.beforeResizeFunc);
      
      // define resize listener, debounced
      //self.debouncedResize = self.debounce ? self.debounce( self.debounceSpeed, self.afterResizeFunc ) : self.afterResizeFunc; 
      SONY.on(self.debounceEvent, self.afterResizeFunc);
    
      // listen
      //self.$win.on(self.resizeEvent + '.tcc', self.resizeFunc); 

      // start it
      self.init();
    };

    TertiaryModule.prototype = {
      constructor: TertiaryModule,

      init : function() {

        var self = this;

        // TODO: if needed, add sequencer here. 
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
        
        // set content module sizes        
        setupSequence.add( self, self.setContentModuleSizes, self.sequencerSpeed ); 

        // set scroller & iscroll options
        setupSequence.add( self, self.setScrollerOptions, self.sequencerSpeed + 200 ); 

        // create scroller instance
        setupSequence.add( self, self.createScroller, self.sequencerSpeed ); 

        if(self.mode === 'tablet'){
          // adjusts margins after content modules are absolute positioned
          setupSequence.add( self, self.adjustMargins, self.sequencerSpeed ); 
        }

        if(self.isLayoutHidden){
          // show contents again after transition
          setupSequence.add( self, self.showAll, self.sequencerSpeed);       
        }

        // start sequence
        setupSequence.start();
      },

      // teardown controller
      teardown : function(){
        var self         = this,
        teardownSequence = new Sequencer();

        //teardown sequence
        if((self.mode === 'desktop') && (self.prevMode != 'desktop')){
          // for desktop clear out width
          teardownSequence.add( self, self.clearContentWidth, self.sequencerSpeed ); 
        }
        
        // destroy scroller instance
        teardownSequence.add( self, self.destroyScroller, self.sequencerSpeed ); 
       
        // start sequence
        teardownSequence.start();
      },
      
      // Hide scroller content for transition   
      hideAll : function(){
        var self = this;

        var hideSequence = new Sequencer();
        
        // hide elements
        hideSequence.add( self, self.hideElements, self.sequencerSpeed ); 
        
        // show loader
        hideSequence.add( self, self.showLoader, self.sequencerSpeed ); 
        
        // start sequence
        hideSequence.start();
      },

      // Show scroller content after transition
      showAll : function(){
        var self = this;

        var showSequence = new Sequencer();
        //hide loader
        showSequence.add( self, self.hideLoader, self.sequencerSpeed ); 

        // show elements after resize is done                
        showSequence.add( self, self.showElements, self.sequencerSpeed); 
        
        // start sequence
        showSequence.start();
      },

      // show loading animation layer
      showLoader : function(  ){
        var self = this;
        self.$loader.show();
      },

      // hide loading animation layer
      hideLoader : function(  ){
        var self = this;
        self.$loader.hide();
      },

      // hide $elements: opacity & visibility 
      hideElements : function(){
        var self  = this,
        $els = self.$hideShowEls;
       
        // hide content modules 
        $els.css({
          'opacity' : 0,
          'visibility' : 'hidden'
        });

        // set bool once it's done
        self.isLayoutHidden = true;

        // TODO: expand this out      
        //$els.stop(true,true).animate({ opacity: 0 },{ duration: self.hideShowSpeed , complete: function(){$els.css({"visibility":"hidden"});}});
      },

      // show $els: opacity & visibility 
      showElements : function(){
        var self = this,
            $els = self.$hideShowEls;
        
        // TODO: expand this out
        $els.stop(true,true).animate({ opacity: 1 },{ duration: self.hideShowSpeed , complete: function(){$els.css({"visibility":"visible"});}});
        
        // set bool once it's done
        self.isLayoutHidden = false;
      },

      // instantiate a scroller 
      createScroller : function(){
        var self=this;
        self.$scrollerInstance = self.$el.scrollerModule( self.scrollerOptions );
      },

      // destroy scroller if not in mobile
      destroyScroller : function(){
        var self  = this;
      
        self.$scrollerInstance.scrollerModule('destroy');
        self.$scrollerInstance = null;
      },

      // clean up residual style elements after teardown
      clearContentWidth : function(){
        var self  = this;
  
        // clear out content module widths to be responsive
        self.$contentModules.css('width',''); 
      },

      // set scroller options to be passed to sony-scroller
      // based on current mode 
      setScrollerOptions : function(){
        var self = this;
       
        // all general settings are set as default options      
        self.scrollerOptions = self.options;
       
        // now that we know mode, add it as option.
        self.scrollerOptions.fitPerPage = self.mode === 'phone' ? 1 : 2; 

        // if it is a touch device, do not use paddle navigation only use swipe 
        self.scrollerOptions.generateNav = !(self.isTouch);

        // TODO: determine why passing this into scroller was casusing issues
        // when more than one scroller instance was on the page 
        // bullets would get appended to last instance and oddly 
        // not respecting encapsulation
        // self.scrollerOptions.appendBulletsTo = self.containerId + '.tcc-wrapper';
      },

      // determine left and right margin total 
      getHorizontalMargins : function( selector ){
        var self = this,
            $el  = selector;
      
        // outer width with margins subtracted by width without margins = margins
        return Math.round(Number($el.outerWidth(true) - $el.outerWidth()));
      },

      // every resize event (debounced) determine size of each content module 
      setContentModuleSizes : function(){     
        var self         = this,
        containerSize    = Math.round(self.$el.outerWidth()), // no margins 
        headerLRMargin   = self.getHorizontalMargins(self.$tccHeaderWrapper),
        eachContentWidth = null,
        $elements        = self.$contentModules;

        // should only ever be "mobile"
        if((self.mode === 'tablet') || (self.mode === 'phone')){          
          // accounts for margins in container widths to support full-bleed
          eachContentWidth = containerSize - headerLRMargin;
        
          // tablet is 2-up not 1-up, so split evenly
          if(self.mode === 'tablet'){
             
             // accounts for margins in between the two content modules (set after scroller instance)
             eachContentWidth = Math.round((eachContentWidth / 2) - (headerLRMargin/2));

          }else{
            // assumes self.mode = 'phone'
                        
            // check if we need to set width of specific children elements also
            $elements = self.addDynamicWidthElements( $elements );
          }

        }

        // set each width
        $elements.each(function() {
          $(this).innerWidth(eachContentWidth);
        });
      },

      // checks $elements for specific content type:mode
      // if there's a match, it adds that element's child ".center-content" to $elements
      // $elements obj is returned to get width set
      addDynamicWidthElements : function( $elements ){
        var self = this;
      
        // loop through the content modules
        $elements.each(function() {
          var $el = $(this),
              modeType = $el.data("tcc-content-type") + ':' + $el.data("tcc-content-mode");

          // only these two "mode:type" content modules should get added   
          if((modeType === 'flickr:default') || (modeType === 'sonys-voice:instagram')){
            // add ".center-content" child to the objects that will get width set
            $elements = $elements.add($el.find(".center-content"));
          }
        });

        return $elements;
      },

      adjustMargins : function(  ){
        var self       = this,
        headerLRMargin = self.getHorizontalMargins(self.$tccHeaderWrapper),
        $content, newLeft, contentPosition, contentLeft;

        self.$contentModules.each(function(i) {
          $content = $(self.$contentModules[i]); // content module
          contentPosition = $content.position(); // current position object
          contentLeft = Number(contentPosition.left); // content module left position
          
          if((i === 0) || (i === 2)){
            // first / last content module move left
            newLeft = Math.round(Number(contentLeft - (headerLRMargin/2)));
          }else{
            // second content module move right
            newLeft = Math.round(Number(contentLeft + (headerLRMargin/2)));
          }

          // set new left position
          $content.offset({left:newLeft});
 
        });
      },


      // onResizeTcc : function(  ){
      //   // console.log( '««« onResizeTcc »»»' );
      //   var self = this;        
        
      //   // This should execute the first time onResize is called
      //   self.debouncedBeforeResize();

      //   // This should execute the last time onResize is called
      //   self.debouncedResize();
      // },


      beforeResize : function(  ){
        // console.log( '««« beforeResize »»»' );
        var self = this;

        self.reportMode("beforeResize");

         // if we're in mobile entering desktop  
        // or if we're in desktop entering mobile
        // or if we're in tablet entering phone or phone entering tablet
        if (((self.mode === 'desktop') && (self.prevMode != 'desktop')) || ((self.mode != 'desktop') && (self.prevMode === 'desktop')) || ((self.mode != 'desktop') && (self.prevMode != 'desktop'))){
            
            // trigger hide sequence
            self.hideAll();            
         }              
      },

      // on resize event (debounced) determine what to do
      afterResize : function(){
        var self = this,
            resizeMobileSequencer = new Sequencer();

        // update mode at current break point
        self.setMode(); 

        self.reportMode("afterResize");

        // what direction are we going?
        if((self.mode != 'desktop') && (self.prevMode === 'desktop')){
          // from desktop to mobile
          
          // build new (assumes there's no scroller instance)
          resizeMobileSequencer.add( self, self.setup, self.sequencerSpeed);

        }else if ((self.mode != 'desktop') && (self.prevMode != 'desktop')){
          // from mobile to mobile

          // teardown 
          if(self.$scrollerInstance){
            resizeMobileSequencer.add( self, self.teardown, self.sequencerSpeed );
          }

          // build new scroller instance (assumes there's no scroller instance)
          resizeMobileSequencer.add( self, self.setup, self.sequencerSpeed);

        }else if((self.mode === 'desktop') && (self.prevMode != 'desktop')){
          // from mobile to desktop
          
          // teardown 
          if(self.$scrollerInstance){
            resizeMobileSequencer.add( self, self.teardown, self.sequencerSpeed );
          }

        }

        resizeMobileSequencer.add( self, self.showAll, self.sequencerSpeed);

        // start sequence
        resizeMobileSequencer.start();

              
        // // if the mode is 'phone' or 'tablet' (aka mobile) then proceed
        // if( self.mode !== 'desktop' ){
          
        //   var resizeMobileSequencer = new Sequencer();

        //   // if there's a scroller set up, add teardown method to the sequence (reset)
        //   if( self.$scrollerInstance !== null ) {
        //     resizeMobileSequencer.add( self, self.teardown, self.sequencerSpeed ); // teardown
        //   }

        //   // create a new scroller
        //   resizeMobileSequencer.add( self, self.setup, self.sequencerSpeed + 100 );
          
        //   // start sequence
        //   resizeMobileSequencer.start();
          
        // }else{        
  
        //   // if mode is now 'desktop' then simply destroy scroller if there is one
        //   if( self.$scrollerInstance !== null ){        
        //     self.teardown();            
        //   }
        // }
      },

      // set mode based on current breakpoint
      setMode : function(){
        var self = this;
        
        // archive current mode to use in directional situations
        // ex. desktop entering mobile (phone or desktop)
        // ex. mobile entering desktop 
        self.prevMode = self.mode; 

        if( Modernizr.mq('(max-width:'+ self.phoneBreakpoint+'px)') ){
          self.mode = 'phone';
        }else if ( Modernizr.mq('(min-width:' + self.tabletBreakpointMin + 'px) and (max-width:' + self.tabletBreakpointMax + 'px)') ) {
          self.mode = 'tablet';
        }else{
          self.mode = 'desktop';
        }

        if(self.prevMode === null){
          // handle init
          self.prevMode = self.mode;
        }
      },

      reportMode : function( methodName ){
        var self = this,
            loc = methodName || null;

        console.log( '======= at', loc ,' ============');
        console.log( 'self.mode »' , self.mode);
        console.log( 'self.prevMode »' , self.prevMode);
        console.log( '=================================');
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
        generatePagination: true,
        centerItems: true,

        iscrollProps: {
          snap: true,
          lockDirection:false,
          momentum: false,
          vScroll:true,
          hScrollbar: false,
          vScrollbar: false
        }
      }
    };
   

    // wait to init until all js has loaded.      
    SONY.on('global:ready', function(){
      var isIE = $("html").hasClass("lt-ie10");

      // do not enable scroller features if in IE     
      if(!isIE){
        $('.tcc-wrapper').each(function() {
          $(this).tertiaryModule({}).data('tertiaryModule');
        });
      }
     
    });

 })(jQuery, Modernizr, window, undefined);
