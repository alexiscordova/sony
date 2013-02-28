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
      
      // INITS & CACHED SELECTORS
      self.$win                    = SONY.$window;
      self.isTouch                 = SONY.Settings.hasTouchEvents;
      self.isLayoutHidden          = false;
      self.isInit                  = true;
      self.mode                    = null;
      self.prevMode                = null;
      self.$scrollerInstance       = null;              

      // SELECTORS
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

      // EVENTS
      
      // namespaced versions of the global event 
      self.tccNamespace            = '.tcc';
      self.debounceBeforeEvent     = 'global:resizeDebouncedAtBegin-200ms' + self.tccNamespace; 
      self.debounceEvent           = 'global:resizeDebounced-200ms' + self.tccNamespace;
      
      // method calls within self content
      self.beforeResizeFunc        = $.proxy( self.beforeResize, self ); 
      self.afterResizeFunc         = $.proxy( self.afterResize, self );
     
      // TIMING
      self.afterResizeSpeed        = 200;
      self.setupSpeed              = 200;
      self.teardownSpeed           = 50;
      self.hideAllSpeed            = 50;
      self.showAllSpeed            = 200;
      self.animationSpeed          = 200;
     
      // BREAKPOINTS
      self.phoneBreakpoint         = 479;
      self.tabletBreakpointMin     = self.phoneBreakpoint + 1;
      self.tabletBreakpointMax     = 768;

      // GRID & SPACING
      self.marginPercent          = Number('.0334'); // 22/650 (at 2-up)
      self.paddingPerContent      = 20;
     
      // register listener for global debounce to call method **before** debounce begins
      SONY.on(self.debounceBeforeEvent, self.beforeResizeFunc);
      
      // register listener for global debounce to call method **after** debounce begins
      SONY.on(self.debounceEvent, self.afterResizeFunc);
    
      // start it all
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
                        
        // set content module sizes        
        setupSequence.add( self, self.setContentModuleSizes, self.setupSpeed ); 

        // set scroller & iscroll options
        setupSequence.add( self, self.setScrollerOptions, self.setupSpeed ); 

        // create scroller instance
        setupSequence.add( self, self.createScroller, self.setupSpeed ); 

        if(self.mode === 'tablet'){
          // adjusts margins after content modules are absolute positioned
          setupSequence.add( self, self.adjustPositionForMargins, self.setupSpeed ); 
        }

        // show the elements if they've beenh hidden
        if(self.isLayoutHidden){
          // show contents again after transition
          setupSequence.add( self, self.showAll, self.setupSpeed);       
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
          teardownSequence.add( self, self.clearContentWidth, self.teardownSpeed ); 
        }
        
        // destroy scroller instance
        teardownSequence.add( self, self.destroyScroller, self.teardownSpeed ); 
       
        // start sequence
        teardownSequence.start();
      },
      
      // Hide scroller content for transition   
      hideAll : function(){
        var self = this;

        var hideSequence = new Sequencer();
        
        // hide elements
        hideSequence.add( self, self.hideElements, self.hideAllSpeed ); 
        
        // show loader
        hideSequence.add( self, self.showLoader, self.hideAllSpeed ); 
               
        // start sequence
        hideSequence.start();

        //console.log( 'hideAll done »');
      },

      // Show scroller content after transition
      showAll : function(){
        var self = this;

        var showSequence = new Sequencer();
        
        //hide loader
        showSequence.add( self, self.hideLoader, self.showAllSpeed ); 

        // show elements after resize is done                
        showSequence.add( self, self.showElements, self.showAllSpeed ); 
        
        // start sequence
        showSequence.start();
      },

      // show loading animation layer
      showLoader : function(){
        var self = this;
        self.$loader.show();
      },

      // hide loading animation layer
      hideLoader : function(){
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
      },

      // show $els: opacity & visibility 
      showElements : function(){
        var self = this,
            $els = self.$hideShowEls;
        
        // TODO: expand this out
        $els.stop(true,true).animate({ opacity: 1 },{ duration: self.animationSpeed , complete: function(){$els.css({"visibility":"visible"});}});
        
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
        headerLRMargin   = self.getHorizontalMargins(self.$tccHeader),
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
      
      //  1. Checks each $element in $elements for its content type and mode (type:mode)
      //  2. If there is a match, then it adds that $element to selector group
      //  *@param {jquery obj} $elements* [current set of element objects]
      //  *returns $elements* {jquery obj} [new group of element objects]
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

      
      /**
       * Get availble container width from header (because it's still in the grid)
       * For each content module, adjust current left position to accomodate new margins on resize
       * Assumes exactly three modules always
       * @return none
       */
      adjustPositionForMargins : function(){
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


      /**
       * if resize is not going from desktop to desktop then hide elements for rebuild.
       * in other words:         
       ** if we're in mobile entering desktop  
       ** or if we're in desktop entering mobile
       ** or if we're in tablet entering phone or phone entering tablet
       * @return [nothing]
       */
      beforeResize : function(){
        var self = this;

        // TODO: if needed, hide on init and desktop to mobile

        //if (((self.mode === 'desktop') && (self.prevMode != 'desktop')) || ((self.mode != 'desktop') && (self.prevMode === 'desktop')) || ((self.mode != 'desktop') && (self.prevMode != 'desktop'))){         
        if (!((self.mode === 'desktop') && (self.prevMode === 'desktop'))){ 
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

        // what direction are we going?
        if((self.mode != 'desktop') && (self.prevMode === 'desktop')){
          // from desktop to mobile
          
          // build new (assumes there's no scroller instance)
          resizeMobileSequencer.add( self, self.setup, self.afterResizeSpeed );
        }else if ((self.mode != 'desktop') && (self.prevMode != 'desktop')){
          // from mobile to mobile

          // teardown 
          if(self.$scrollerInstance){
            resizeMobileSequencer.add( self, self.teardown, self.afterResizeSpeed );
          }

          // build new scroller instance (assumes there's no scroller instance)
          resizeMobileSequencer.add( self, self.setup, self.afterResizeSpeed);
        }else if((self.mode === 'desktop') && (self.prevMode != 'desktop')){
          // from mobile to desktop
          
          // teardown 
          if(self.$scrollerInstance){
            resizeMobileSequencer.add( self, self.teardown, self.afterResizeSpeed );
          }
        }

        // show the elements again
        resizeMobileSequencer.add( self, self.showAll, self.afterResizeSpeed );

        // start sequence
        resizeMobileSequencer.start();
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
        console.log( self.prevMode, ' »»» ', self.mode);
        console.log( '================================');
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
        threshold:5,

        iscrollProps: {
          snap: true,
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
