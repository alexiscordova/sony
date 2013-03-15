/*global jQuery, Modernizr, Sequencer*/

// Sony Tertiary Content Container
// -------------------------------------------------
//
// * **Module:** Tertiary Module
// * **Version:** 0.1
// * **Modified:** 03/14/2013
// * **Author:** Telly Koosis
// * **Dependencies:** jQuery 1.7+, Modernizr, [sony-iscroll.js](sony-iscroll.html), [sony-scroller.js](sony-scroller.html), [sony-sequencer.js](sony-sequencer.html)
//
// *Example Usage:*
//      Automatic detection of .tcc-scroller on page
//      $('.tcc-wrapper').tertiaryModule({}).data('tertiaryModule');
//

define(function(require){

    'use strict';

    var $ = require('jquery'),
        Modernizr = require('modernizr'),
        iQ = require('iQ'),
        Settings = require('require/sony-global-settings'),
        Environment = require('require/sony-global-environment'),
        Utilities = require('require/sony-global-utilities'),
        sonyPaddles = require('secondary/index').sonyPaddles,
        sonyNavigationDots = require('secondary/index').sonyNavigationDots,
        sequencer = require('secondary/sony-sequencer');


    var self = {
      'init': function() {
        $('.tcc-wrapper').each(function() {
          $(this).tertiaryModule({}).data('tertiaryModule');
        });
      }
    };

    var TertiaryModule = function(element, options){
      var self                 = this;

      $.extend(self, {}, $.fn.tertiaryModule.defaults, options, $.fn.tertiaryModule.settings);

      // INITS, SELECTORS
      self.$win                           = Settings.$window;
      self.isTouch                        = Settings.hasTouchEvents || Settings.hasPointerEvents;
      self.isLayoutHidden                 = false;
      self.isInit                         = true;
      self.heightsAdjusted                = false;
      self.mode                           = null;
      self.prevMode                       = null;
      self.$scrollerInstance              = null;

      // CACHED CLASSES & TYPES
      self.contentBlocksClass             = '.tcc-content-block';
      self.contentSelectorClass           = '.tcc-body';
      self.imageClass                     = '.tcc-image';
      self.desktopClasses                 = 'span4';
      self.centerContentArr               = ['flickr:default','sonys-voice:instagram','sonys-voice:twitter','sonys-voice:facebook'];

      // SELECTORS
      self.$container                     = $( element );
      self.$el                            = self.$container.find(".tcc-scroller");
      self.containerId                    = '#' + self.$container.attr("id");
      self.$tccHeaderWrapper              = self.$container.find('.tcc-header-wrapper');
      self.$tccHeader                     = self.$tccHeaderWrapper.find(".tcc-header");
      self.$tccBodyWrapper                = self.$el;
      self.$tccBody                       = self.$tccBodyWrapper.find(self.contentSelectorClass);
      self.$contentBlocks                 = self.$el.find(self.contentBlocksClass);
      self.$hideShowEls                   = self.$tccBodyWrapper.add(self.$tccBody).add(self.$contentBlocks);
      self.$loader                        = self.$container.find(".loader");

      // EVENTS
      // Namespaced versions of global events
      self.tccNamespace                   = '.tcc';
      self.debounceBeforeEvent            = 'global:resizeDebouncedAtBegin-200ms' + self.tccNamespace;
      self.debounceEvent                  = 'global:resizeDebounced-200ms' + self.tccNamespace;

      // PROXY CALLS
      self.beforeResizeFunc               = $.proxy( self.beforeResize, self );
      self.afterResizeFunc                = $.proxy( self.afterResize, self );
      self.onImagesLoaded                 = $.proxy( self.handleImagesLoaded, self);

      // TIMING
      self.afterResizeSpeed               = 200;
      self.setupSpeed                     = 200;
      self.teardownSpeed                  = 50;
      self.hideAllSpeed                   = 100;
      self.showAllSpeed                   = 200;
      self.animationSpeed                 = 300;

      // BREAKPOINT CONSTANTS
      self.SONY_TCC_PHONE_BREAKPOINT      = 479;
      self.SONY_TCC_TABLET_BREAKPOINT_MIN = 480;
      self.SONY_TCC_TABLET_BREAKPOINT_MAX = 979; // 767

      // Breakpoints in ems
      self.phoneBreakpointEm              = Utilities.pxToEm(self.SONY_TCC_PHONE_BREAKPOINT);
      self.tabletBreakpointMinEm          = Utilities.pxToEm(self.SONY_TCC_TABLET_BREAKPOINT_MIN);
      self.tabletBreakpointMaxEm          = Utilities.pxToEm(self.SONY_TCC_TABLET_BREAKPOINT_MAX);

      // GRID & SPACING
      self.marginPercent                  = Number('.034'); // 22/650 (at 2-up)
      self.contentInnerMargin             = 22;

      // don't listen for these events if >ie10
      if(!Settings.isLTIE10){

        // register listener for global debounce to call method **before** debounce begins
        Environment.on(self.debounceBeforeEvent, self.beforeResizeFunc);

        // register listener for global debounce to call method **after** debounce begins
        Environment.on(self.debounceEvent, self.afterResizeFunc);
      }

      // listen for background images that have laoded
      // self.$el.find(self.imageClass).on('iQ:imageLoaded', function(){
      //   self.onImagesLoaded();
      // });

      // start it all
      self.init();
    };

    TertiaryModule.prototype = {
      constructor: TertiaryModule,

      init : function() {

        var self = this,
            $allImages = self.$el.find(self.imageClass),
            $readyImages = $allImages.filter(function(){return $(this).data('hasLoaded');});

        $allImages.on('imageLoaded iQ:imageLoaded', function(){
          $readyImages = $readyImages.add($(this));
         
          if ($readyImages.length === $allImages.length) {
            self.onImagesLoaded();
          }

        });

        if ($readyImages.length === $allImages.length) {
          self.onImagesLoaded();
        }

        self.setImageClass();
        self.setMode();

        if(!Settings.isLTIE10){
          // if screen size is in mobile (tablet, phone) mode then create a scroller
          if(self.mode !== 'desktop'){
            self.setup();
          }
        }

        log('SONY : TertiaryModule : Initialized');
      },

      setImageClass : function(  ){
        var self = this;     
        
        self.$el
          .find(self.imageClass)
          .addClass('iq-img')
          .parent()
          .addClass('on');

        iQ.update(true);
      },

      handleImagesLoaded : function(){
        var self = this;
        self.setCenterContentHeight();
      },

      // controller for scroller setup
      setup : function(){
        var self      = this,
            setupSequence = new Sequencer();

        // remove desktop spans if there are any
        if(self.$contentBlocks.hasClass(self.desktopClasses)){
          setupSequence.add( self, self.removeDesktopClasses, self.setupSpeed);
        }

        // set content block sizes
        setupSequence.add( self, self.setcontentBlockSizes, self.setupSpeed );

        // set scroller & iscroll options
        setupSequence.add( self, self.setScrollerOptions, self.setupSpeed );

        // create scroller instance
        setupSequence.add( self, self.createScroller, self.setupSpeed );

        if(self.mode === "tablet"){
          // adjusts margins after content blocks are absolute positioned
          setupSequence.add( self, self.adjustPositionForMargins, self.setupSpeed );
        }

        if(!self.heightsAdjusted){
          // set heights for inner centering
          setupSequence.add( self, self.setCenterContentHeight, self.setupSpeed + 100);
        }

        // show the elements if they've beenh hidden
        if(self.isLayoutHidden){
          // show contents again after transition
          setupSequence.add( self, self.showAll, self.setupSpeed + 500);

          // use very sparingly
          Utilities.forceWebkitRedraw();
        }

        // start sequence
        setupSequence.start();
      },

      // teardown controller
      teardown : function(){
        var self         = this,
        teardownSequence = new Sequencer();

        // reset after every teardown
        self.heightsAdjusted = false;

        //teardown sequence

        // destroy scroller instance
        teardownSequence.add( self, self.destroyScroller, self.teardownSpeed );

        // clear transition set by scroller
        // desktop mode sometimes sticks in old position
        teardownSequence.add( self, self.clearTransition, self.setupSpeed + 200);

        // if we're going from "mobile" to desktop
        if((self.mode === "desktop") && (self.prevMode !== "desktop")){

          // clear width
          teardownSequence.add( self, self.clearContentWidth, self.teardownSpeed );

          // add grid spans, etc. back in
          teardownSequence.add( self, self.addDesktopClasses, self.setupSpeed);

          // set height again for inner centering
          teardownSequence.add( self, self.setCenterContentHeight, self.setupSpeed + 100);
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
        self.$contentBlocks.addClass(self.desktopClasses);
      },

      // takes out grid-specific classes (scroller is out of grid)
      removeDesktopClasses : function(){
        var self = this;
        self.$contentBlocks.removeClass(self.desktopClasses);
      },

      // hide $elements: opacity & visibility
      hideElements : function(){
        var self  = this,
        $els = self.$hideShowEls;

        // hide content blocks
        $els.css({
          'opacity' : 0,
          'visibility':'hidden'
        });

        // set bool once it's done
        self.isLayoutHidden = true;
      },

      // show $els: opacity & visibility
      showElements : function(){
        var self = this,
            $els = self.$hideShowEls;

        $els
          .stop(true,true)
          .css({'visibility':'visible'})
          .animate({ opacity: 1 }, { duration: self.animationSpeed , complete: function(){}});

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

        // clear out content block widths to be responsive
        self.$contentBlocks.css('width','');
      },

      clearTransition : function(  ){
        var self = this;

        // remove all transform when we enter desktop
        self.$tccBody.css('-webkit-transform','');
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

      // on every (debounced) resize event determine size of each content block
      setcontentBlockSizes : function(){
        var self               = this,
        $elements              = self.$contentBlocks,
        eachContentWidth       = Math.round(self.$tccHeader.innerWidth()); // no margins

        // tablet is 2-up and split evenly
        // and also "padding" is added between the two
        // which is really narrowing the content mod's width a bit
        // and compensating for the width change by adjusting the left position
        // accomplished in self.adjustPositionForMargins()
        if(self.mode === 'tablet'){
           eachContentWidth = Math.round((eachContentWidth / 2) - (self.contentInnerMargin / 2));
        }

        // set each content block's width
        $elements.each(function() {
          $(this).innerWidth(eachContentWidth);
        });
      },

      setCenterContentHeight : function(){
        var self = this;

        // prevent redundancy
        if(!self.heightsAdjusted){

          // loop through the content blocks
          self.$contentBlocks.each(function() {
            var $el = $(this),
                modeType = $el.data("tcc-content-type") + ':' + $el.data("tcc-content-mode");

            // if the modetype is in the array
            if(self.centerContentArr.indexOf(modeType) >= 0){
              var $sampleContent   = $el,
              $centerContainer     = $sampleContent.find('.center'),
              $imageContainer      = $centerContainer.find('.center-container'),
              containerHeight      = $sampleContent.innerHeight(),
              topHeight            = $sampleContent.find('.top').outerHeight(),
              bottomHeight         = $sampleContent.find('.bottom').outerHeight(),
              newCenterHeight      = Math.round(containerHeight - (topHeight + bottomHeight)),
              imageContainerHeight = $imageContainer.outerHeight(),
              imgContainerTop;

              // check boundaries
              newCenterHeight = self.checkHeightBoundaries(newCenterHeight, modeType);

              // special case for >IE10 and particular content block
              if((Settings.isLTIE10) && ($el.data("tcc-content-type") === "sonys-voice")){
                newCenterHeight = newCenterHeight - imgContainerTop;
                imgContainerTop = imgContainerTop/2;
              }

              // calculate margin top for image container
              imgContainerTop = Math.round((newCenterHeight/2) - (imageContainerHeight/2));

              // margin should never be negative
              imgContainerTop = imgContainerTop < 0 ? 0 : imgContainerTop;

              // set center div container height
              $centerContainer.height(newCenterHeight);

              // set margin top to accomodate inside center with
              $imageContainer.css('margin-top', imgContainerTop + 'px');

            }

          });

          // reduce redundant adjustments
          self.heightsAdjusted = true;

        }
      },

      // enforce height boundaries at different breakpoints
      checkHeightBoundaries : function(h, modeType){
        var self = this,
            max;

        switch (self.mode) {
          case "desktop":
            max = 250;
            break;
          case "tablet":
            max = modeType === 'sonys-voice:instagram' ? 140 : 173;
            break;
          case "phone":
            max = 160;
            break;
          default:
            max = h;
            break;
        }

        h = h > max ? max: h;

        return h;
      },

      /**
       * Get availble container width from header (because it's still in the grid)
       * For each content block, adjust current left position to accomodate new margins on resize
       * Assumes exactly three modules always
       * @return none
       */
      adjustPositionForMargins : function(){
        var self       = this,
        headerLeftRightMargins = self.contentInnerMargin,//self.getHorizontalMargins(self.$tccHeader),
        $content, newLeft, contentPosition, contentLeft;

        self.$contentBlocks.each(function(i) {
          $content = $(self.$contentBlocks[i]); // content block
          contentPosition = $content.position(); // current position object
          contentLeft = Number(contentPosition.left); // content block left position

          if((i === 0) || (i === 2)){
            // first / last content block move left
            newLeft = Math.round(Number(contentLeft - (headerLeftRightMargins/2)));
          }else{
            // second content block move right
            newLeft = Math.round(Number(contentLeft + (headerLeftRightMargins/2)));
          }

          // set new left position
          $content.offset({left:newLeft});

        });
      },

      beforeResize : function(){
        var self = this;

        // hide content blocks 
        self.hideAll();
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

          // set to false b/c it was set to true in desktop
          self.heightsAdjusted = false;

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
        resizeMobileSequencer.add( self, self.showAll, self.afterResizeSpeed + 500);

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
        itemElementSelector: ".tcc-content-block",
        appendBulletsTo:".tcc-wrapper",
        mode: 'paginate',
        generatePagination: true,
        centerItems: true,

        iscrollProps: {
          snap: true,
          hScrollbar: false,
          vScrollbar: false
        }
      }
    };

    return self;

 });
