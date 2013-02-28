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
      
      // INITS, SELECTORS
      self.$win                           = SONY.$window;
      self.isTouch                        = SONY.Settings.hasTouchEvents;
      self.isLayoutHidden                 = false;
      self.isInit                         = true;
      self.mode                           = null;
      self.prevMode                       = null;
      self.$scrollerInstance              = null;              
      
      // SCROLLER CLASSES
      self.contentModulesClass            = '.tcc-content-module';
      self.contentSelectorClass           = '.tcc-body';
      self.desktopClasses                 = 'span4';
      
      // SELECTORS
      self.$container                     = $( element );
      self.$el                            = self.$container.find(".tcc-scroller");
      self.containerId                    = '#' + self.$container.attr("id");
      self.$tccHeaderWrapper              = self.$container.find('.tcc-header-wrapper');
      self.$tccHeader                     = self.$tccHeaderWrapper.find(".tcc-header");
      self.$tccBodyWrapper                = self.$el;
      self.$tccBody                       = self.$tccBodyWrapper.find(self.contentSelectorClass);
      self.$contentModules                = self.$el.find(self.contentModulesClass);
      self.$hideShowEls                   = self.$tccBodyWrapper.add(self.$tccBody).add(self.$contentModules);      
      self.$loader                        = self.$container.find(".loader");
      
      // EVENTS     
      // Namespaced versions of global events 
      self.tccNamespace                   = '.tcc';
      self.debounceBeforeEvent            = 'global:resizeDebouncedAtBegin-200ms' + self.tccNamespace; 
      self.debounceEvent                  = 'global:resizeDebounced-200ms' + self.tccNamespace;
      
      // PROXY CALLS
      self.beforeResizeFunc               = $.proxy( self.beforeResize, self ); 
      self.afterResizeFunc                = $.proxy( self.afterResize, self );
      
      // TIMING
      self.afterResizeSpeed               = 200;
      self.setupSpeed                     = 200;
      self.teardownSpeed                  = 50;
      self.hideAllSpeed                   = 50;
      self.showAllSpeed                   = 200;
      self.animationSpeed                 = 200;
      
      // BREAKPOINT CONSTANTS
      self.SONY_TCC_PHONE_BREAKPOINT      = 479;
      self.SONY_TCC_TABLET_BREAKPOINT_MIN = 480;
      self.SONY_TCC_TABLET_BREAKPOINT_MAX = 979; // 767
      
      // TODO: remove these if not needed anymore
      // Breakpoints in pixels
      // self.phoneBreakpointPx           = self.SONY_TCC_PHONE_BREAKPOINT + "px";
      // self.tabletBreakpointMinPx       = self.SONY_TCC_TABLET_BREAKPOINT_MIN + "px";
      // self.tabletBreakpointMaxPx       = self.SONY_TCC_TABLET_BREAKPOINT_MAX + "px"; 
      
      // Breakpoints in ems
      self.phoneBreakpointEm              = SONY.Utilities.pxToEm(self.SONY_TCC_PHONE_BREAKPOINT);
      self.tabletBreakpointMinEm          = SONY.Utilities.pxToEm(self.SONY_TCC_TABLET_BREAKPOINT_MIN); 
      self.tabletBreakpointMaxEm          = SONY.Utilities.pxToEm(self.SONY_TCC_TABLET_BREAKPOINT_MAX); 
      
      // GRID & SPACING
      self.marginPercent                  = Number('.034'); // 22/650 (at 2-up)
      self.contentInnerMargin             = 20;
      //self.paddingPerContent            = 20;
     
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

        // remove desktop spans if there are any
        if(self.$contentModules.hasClass(self.desktopClasses)){
          setupSequence.add( self, self.removeDesktopClasses, self.setupSpeed);
        }
                        
        // set content module sizes        
        setupSequence.add( self, self.setContentModuleSizes, self.setupSpeed ); 

        // set scroller & iscroll options
        setupSequence.add( self, self.setScrollerOptions, self.setupSpeed ); 

        // create scroller instance
        setupSequence.add( self, self.createScroller, self.setupSpeed ); 

        if(self.mode === "tablet"){
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
       
        // if we're going from "mobile" to desktop then add grid spans back in
        if((self.mode === "desktop") && (self.prevMode !== "desktop")){
          teardownSequence.add( self, self.addDesktopClasses, self.setupSpeed);
        }

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

      // adds grid classes back in
      addDesktopClasses : function(){
        var self = this;
        self.$contentModules.addClass(self.desktopClasses);
      },

      // takes out grid-specific classes (scroller is out of grid)
      removeDesktopClasses : function(){
        var self = this;
        self.$contentModules.removeClass(self.desktopClasses);
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
      },

      // determine left and right margin total 
      getHorizontalMargins : function( $selector ){     
        // outer width with margins subtracted by width without margins = margins
        return Math.round(Number($selector.outerWidth(true) - $selector.outerWidth()));
      },

      // on every (debounced) resize event determine size of each content module 
      
      setContentModuleSizes : function(){     
        var self               = this,
        $elements              = self.$contentModules,
        eachContentWidth       = Math.round(self.$tccHeader.innerWidth()); // no margins 

        // tablet is 2-up and split evenly
        // and also "padding" is added between the two
        // which is really narrowing the content mod's width a bit 
        // and compensating for the width change by adjusting the left position 
        // accomplished in self.adjustPositionForMargins() 
        if(self.mode === 'tablet'){  
           eachContentWidth = Math.round((eachContentWidth / 2) - (self.contentInnerMargin / 2));
        }
        
        // phone is 1-up
        if(self.mode === 'phone'){
          // eachContentWidth's default is "100%" of the available space
          // so no changes are needed for 1-up
          
          // check if we need to set width of specific children elements
          $elements = self.addDynamicWidthElements( $elements );
        }

        // set each content module's width
        $elements.each(function() {
          $(this).innerWidth(eachContentWidth);
        });
      },

      //  1. Checks each $element in $elements for its content type and mode (type:mode)
      //  2. If there is a match, then it adds that $element to selector group
      //  *@param {jquery obj} $elements* [current set of element objects]
      //  *returns $elements* {jquery obj} [new group of element objects]
      
      // TOOD: Optimize this so it only runs if the data attributes exist 
      // instead of hitting each() automatically
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
        headerLeftRightMargins = self.contentInnerMargin,//self.getHorizontalMargins(self.$tccHeader),
        $content, newLeft, contentPosition, contentLeft;

        self.$contentModules.each(function(i) {
          $content = $(self.$contentModules[i]); // content module
          contentPosition = $content.position(); // current position object
          contentLeft = Number(contentPosition.left); // content module left position
          
          if((i === 0) || (i === 2)){
            // first / last content module move left
            newLeft = Math.round(Number(contentLeft - (headerLeftRightMargins/2)));
          }else{
            // second content module move right
            newLeft = Math.round(Number(contentLeft + (headerLeftRightMargins/2)));
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

        if( Modernizr.mq('(max-width:'+ self.phoneBreakpointEm + ')') ){
          self.mode = 'phone';
        }else if ( Modernizr.mq('(min-width:' + self.tabletBreakpointMinEm + ') and (max-width:' + self.tabletBreakpointMaxEm + ')') ) {
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
