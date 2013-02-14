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
      
      self.$container              = $( element );
      self.containerId             = '#' + self.$container.attr("id");
      self.$el                     = self.$container.find(".tcc-scroller");
      self.$win                    = $( window );
      self.$doc                    = $( window.document );
      self.ev                      = $( {} ); //event object
      
      self.mode                    = null;
      
      self.contentModulesClass     = '.tcc-content-module';
      self.contentSelectorClass    = '.tcc-body';
      self.$tccHeaderWrapper       = self.$container.find('.tcc-header-wrapper');
      self.$tccHeader              = self.$tccHeaderWrapper.find(".tcc-header");
      self.$tccBodyWrapper         = self.$el;
      self.$tccBody                = self.$tccBodyWrapper.find(self.contentSelectorClass);
      self.$contentModules         = self.$el.find(self.contentModulesClass);
      self.$hideShowEls            = self.$tccBodyWrapper.add(self.$tccBody).add(self.$contentModules);
      self.$loader                 = self.$container.find(".loader");

      self.$scrollerInstance       = null;
               
      self.resizeEvent             = 'onorientationchange' in window ? 'orientationchange' : 'resize';
      self.resizeThrottle          = function(){self.handleResize();};
      
      self.hasTouch                = 'ontouchstart' in window || 'createTouch' in self.$doc ? true : false;
      self.tapOrClick              = function(){return self.hasTouch ? 'touchend' : 'click';};
      
      self.sequencerSpeed          = 250;
      self.hideShowSpeed           = 250;
      self.debounceSpeed           = 300;
      
      self.phoneBreakpoint         = 479;
      self.tabletBreakpointMin     = self.phoneBreakpoint + 1;
      self.tabletBreakpointMax     = 768;

      self.marginPercent          = Number('.0334'); // 22/650 (at 2-up)
      self.paddingPerContent      = 20;

      // a non-debounced resize event so content is hidden immediately
      $(window).on('resize', function(){
        if(self.mode !== "desktop"){
          
          // hide content modules 
          self.$hideShowEls.css({
            'opacity' : 0,
            'visibility' : 'hidden'
          });

          // once content is hidden, show loader icon 
         self.showLoader();
        }

      });

      // define resize listener, debounced
      self.$win.on(self.resizeEvent + '.tcc', $.debounce(self.debounceSpeed, self.resizeThrottle));     

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
        setupSequence.add( self, self.setContentModuleSizes, self.sequencerSpeed ); // set content module sizes        
        setupSequence.add( self, self.setScrollerOptions, self.sequencerSpeed + 200 ); // set scroller & iscroll options
        setupSequence.add( self, self.createScroller, self.sequencerSpeed ); // create scroller instance

        if(self.mode === 'tablet'){
          // adjusts margins after content modules are absolute positioned
          setupSequence.add( self, self.adjustMargins, self.sequencerSpeed ); 
        }

        setupSequence.start();
      },

      // teardown controller
      teardown : function(){
        var self         = this,
        teardownSequence = new Sequencer();

        // teardown sequence
        if(self.mode == 'desktop'){
          teardownSequence.add( self, self.removeStyleAttr, self.sequencerSpeed ); // remove scroller-specific style attributes
        }

        teardownSequence.add( self, self.destroyScroller, self.sequencerSpeed ); // destroy scroller instance
        teardownSequence.add( self, self.setMode, self.sequencerSpeed ); // destroy scroller instance     
        teardownSequence.start();
      },
      
      // Hide scroller content for transition   
      hideAll : function(){
        var self = this;

        var hideSequence = new Sequencer();
        hideSequence.add( self, self.hideElements, self.sequencerSpeed ); // hide elements
        hideSequence.add( self, self.showLoader, self.sequencerSpeed ); // show loader
        hideSequence.start();
      },

      // Show scroller content after transition
      showAll : function(){
        var self = this;

        var showSequence = new Sequencer();
        showSequence.add( self, self.hideLoader, self.sequencerSpeed ); //hide loader
        showSequence.add( self, self.showElements, self.sequencerSpeed); // show elements after resize is done                
        showSequence.add( self, self.updateIQ, self.sequencerSpeed + 200 ); // update iq
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

      // reload images for iQ
      updateIQ : function(){
        console.log( 'update iq »');
        var self = this;
        window.iQ.update();               
      },

      // hide $elements: opacity & visibility 
      hideElements : function(){
        var self  = this,
        $els = self.$hideShowEls;

        // TODO: expand this out      
        $els.stop(true,true).animate({ opacity: 0 },{ duration: self.hideShowSpeed , complete: function(){$els.css({"visibility":"hidden"});}});
      },

      // show $els: opacity & visibility 
      showElements : function(){
        var self = this,
            $els = self.$hideShowEls;
        
        // TODO: expand this out
        $els.stop(true,true).animate({ opacity: 1 },{ duration: self.hideShowSpeed , complete: function(){$els.css({"visibility":"visible"});}});        
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
      removeStyleAttr : function(){
        var self  = this,
        $elements = self.$tccBodyWrapper.add(self.$tccBody).add(self.$contentModules);        
        $elements.removeAttr('style'); 
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

      // on resize event (debounced) determine what to do
      handleResize : function(){
        var self = this;
        
        // update mode at current break point
        self.setMode(); 

        // if the mode is 'phone' or 'tablet' (aka mobile) then proceed
        if( self.mode !== 'desktop' ){
          
          var resizeMobileSequencer = new Sequencer();

          // if there's a scroller set up, add teardown method to the sequence (reset)
          if( self.$scrollerInstance !== null ) {
            resizeMobileSequencer.add( self, self.teardown, self.sequencerSpeed ); // teardown
          }

          // create a new scroller
          resizeMobileSequencer.add( self, self.setup, self.sequencerSpeed + 100 );
          
          // show contents again after transition
          resizeMobileSequencer.add( self, self.showAll, self.sequencerSpeed + 200 ); 

          // start sequence
          resizeMobileSequencer.start();
          
        }else{        
  
          // if mode is now 'desktop' then simply destroy scroller if there is one
          if( self.$scrollerInstance !== null ){        
            self.teardown();
            self.showAll();
          }
        }
      },

      // set mode based on current breakpoint
      setMode : function(){
        var self = this;

        if( Modernizr.mq('(max-width:'+ self.phoneBreakpoint+'px)') ){
          self.mode = 'phone';
        }else if ( Modernizr.mq('(min-width:' + self.tabletBreakpointMin + 'px) and (max-width:' + self.tabletBreakpointMax + 'px)') ) {
          self.mode = 'tablet';
        }else{
          self.mode = 'desktop';
        }
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
        generateNav:true,
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
      $('.tcc-wrapper').each(function() {
        $(this).tertiaryModule({}).data('tertiaryModule');
      });
    } );

 })(jQuery, Modernizr, window, undefined);
