/*global jQuery, Modernizr, IScroll, SONY */

// Generic Scroller
// -------------------------------------------------
//
// * **Version:** 0.1
// * **Modified:** 02/22/2013
// * **Authors:** Telly Koosis, Tyler Madison, Glen Cheney
// * **Dependencies:** jQuery 1.7+, Modernizr, [sony-iscroll.js](sony-iscroll.html)
//
// *Example Usage:*
//      TODO: add example here
//


(function($, Modernizr, IScroll, window, undefined) {

  'use strict';

  var ScrollerModule = function( $element, options ) {
    var self = this;

    $.extend(self, $.fn.scrollerModule.defaults, options, $.fn.scrollerModule.settings);

    self.$el = $element;
    self.$win = SONY.$window;
    self.unique = '.sm_' + $.now();
    self._init();
  };

  ScrollerModule.prototype = {
    constructor: ScrollerModule,

    /**
     * Private Methods
     */

    _init : function() {
      var self = this,
          resizeFunc = $.debounce( self.throttleTime, $.proxy( self._onResize, self ) );

      self.$contentContainer = self.$el.find(self.contentSelector);
      self.$elements = self.$el.find(self.itemElementSelector);
      self.$sampleElement = self.$elements.eq(0);

      self.windowWidth = SONY.Settings.windowWidth;
      self.windowHeight = SONY.Settings.windowHeight;

      // Initially set the isPaginated boolean. This may be changed later inside paginate()
      self.isPaginated = self.mode === 'paginate';

      // These don't change
      self.isPaginateMode = self.mode === 'paginate';
      self.isCarouselMode = self.mode === 'carousel';
      self.isFreeMode = self.mode === 'free';

      // save iscroll properties
      self._setIscrollProps();

      // Set equal widths on the items in the carousel so they always take up as much space
      // as the container, then generate pagination for it.
      if ( self.isCarouselMode ) {
        self._setItemWidths();
      }

      // Set the width of the inner container
      self._setContentWidth();

      // If carousel mode and generate pagination is true or not given, make it.
      if ( self.isCarouselMode && (self.generatePagination || self.generatePagination === undefined) ) {
        self._generatePagination( self.$elements.length );
      }

      // They haven't set whether they want to generate the nav or not.
      // Let's see if they've given us selectors for the nav paddles.
      // If they haven't and we're in carousel mode, generate the paddles for them.
      // Otherwise, we'll assume they don't want it.
      if ( self.generateNav === undefined ) {
        self.generateNav = !self.nextSelector && !self.prevSelector && self.isCarouselMode;
      }

      if ( self.generateNav ) {
        self._generateNavPaddles();
      }

      // Register our resize handler before iscroll's
      self.$win.on(self.resizeEvent + self.unique, resizeFunc);

      // Create instance of scroller and pass it defaults
      self.scroller = new IScroll( self.$el[0], self.iscrollProps );
      self.currentPage = self.scroller.currPageX;

      // Paddle clicks
      // If the selector is a jQuery object, use that, otherwise look for the selector inside our container
      if ( self.nextSelector ) {
        self.$navNext = self.nextSelector.jquery ? self.nextSelector : self.$el.find( self.nextSelector );
        self.$navNext.on('click', function( evt ) {
          // Stop the mouse click from bubbling up.
          evt.preventDefault();
          evt.stopPropagation();
          self.next();
        });
      }
      if ( self.prevSelector ) {
        self.$navPrev = self.prevSelector.jquery ? self.prevSelector : self.$el.find( self.prevSelector );
        self.$navPrev.on('click', function( evt ) {
          // Stop the mouse click from bubbling up.
          evt.preventDefault();
          evt.stopPropagation();
          self.prev();
        });
      }

      self._update( true );
      self._showHideNavs( 0, self.scroller.pagesX.length - 1 );
    },

    _setIscrollProps : function() {
      var self = this;

      // Override the onscrollend for our own use
      self.onScrollEnd = self.iscrollProps.onScrollEnd;
      self.onAnimationEnd = self.iscrollProps.onAnimationEnd;
      self.onBeforeScrollStart = self.iscrollProps.onBeforeScrollStart;

      if ( self.mode === 'carousel' ) {
        self.iscrollProps = {
          snap: true,
          hScrollbar: false,
          momentum: false
        };
        // self.iscrollProps.snap = true;
        // self.iscrollProps.hScrollbar = false;
        // self.momentum = false;
      }

      // NOT SURE WHY THIS ISN'T BEING CALLED
      self.iscrollProps.onScrollEnd = function() {
        self._onScrollEnd( this );
      };

      // Pass the iScroll instance to our function (we still want `this` to reference ScrollerModule)
      self.iscrollProps.onAnimationEnd = function() {
        self._onAnimationEnd( this );
      };

      // Pass the iScroll instance to our function (we still want `this` to reference ScrollerModule)
      self.iscrollProps.onBeforeScrollStart = function(e) {
        self._onBeforeScrollStart( this, e);
      };




      return self;
    },

    _paginate : function() {
      var self = this,
          widthOfOneElement = self.$sampleElement.outerWidth(true),
          itemCount = self.$elements.length,
          containerWidth = self.$el.width() - self.extraSpacing,
          availToFit = self.fitPerPage || Math.floor(containerWidth / widthOfOneElement) || 1,
          numPages = Math.ceil( itemCount / availToFit ),
          i = 0,
          totalBlockWidth = widthOfOneElement * availToFit;

      // Add back the extra spacing we took away for previous calculations
      containerWidth += self.extraSpacing;

      // Update the width again to the new width based on however many 'pages' there are now
      self._setContentWidth( numPages, containerWidth );

      //stop processing function /maybe hide paddles or UI?
      if ( numPages === 1 || availToFit > itemCount ) {
        return false;
      }

      function buildPage(pageNum, startIndex, endIndex) {
        var $elemsInPage = self.$elements.slice(startIndex, endIndex + 1),
            offsetX,
            startX;

        if ( pageNum === numPages - 1 && self.lastPageCenter ) {
          totalBlockWidth = self.$sampleElement.outerWidth(true) * $elemsInPage.length;
        }

        offsetX = self.centerItems ? Math.floor((containerWidth - totalBlockWidth) * 0.5) : 0;
        startX = Math.floor((pageNum * containerWidth) + offsetX);

        $elemsInPage.css({
          'position' : 'absolute',
          'top' : '0',
          'left' : '0'
        });


        $.each($elemsInPage , function(i) {
          var $el = $(this);

          if(self.autoGutters){
            $el.css( 'left' , Math.floor(startX + (i * $el.outerWidth(true))) + 'px' );
          }else{
            if( i === 0 ){
              $el.css( 'left' , Math.floor(startX + (i * $el.outerWidth(false))) + 'px' );
            }else{
              $el.css( 'left' , Math.floor(startX + (i * $el.outerWidth(false))) + (i * self.gutterWidth) + 'px' );
            }
          }

        });
      }

      // Generate nav bullets ( if wanted )
      if ( self.generatePagination ) {
        self._generatePagination( numPages );
      }

      // Space elements out accordingly
      for (i = 0 ; i < numPages; i++) {
        var startIndex = i * availToFit,
            endIndex = startIndex + availToFit - 1;

        buildPage( i , startIndex , endIndex );
      }


      // Save values for later outsiders if they want it
      self.totalPages = numPages;
      self.itemsPerPage = availToFit;

      self._fire('paginationcomplete');

      return true;
    },

    _generatePagination : function( pages ) {

      var self = this,
          $elementToAppend = self.appendBulletsTo ? $(self.appendBulletsTo) : self.$el;

      if ( !$.fn.sonyNavDots ) {
        return;
      }

      if ( self.$pagination ) {
        self.$pagination.sonyNavDots('reset', {
          'buttonCount': pages
        });
        return;
      }

      self.$pagination = $('<div/>', { 'class' : 'navigation-container' });

      $elementToAppend.append( self.$pagination );

      self.$pagination.sonyNavDots({
        'buttonCount': pages
      });

      self.$pagination.on('SonyNavDots:clicked', function(e, a){
        self.gotopage(a);
      });
    },

    _generateNavPaddles : function() {
      var self = this,
          $nav = $( self.navTemplate ),
          $prev = $nav.find('.nav-paddle-prev'),
          $next = $nav.find('.nav-paddle-next'),
          $parent = self.appendNavOutside ? self.$el.parent() : self.$el;

      $parent
        .append( $nav )
        .addClass(  self.paddleTrigger );

      self.$nav = $nav;
      self.prevSelector = $prev;
      self.nextSelector = $next;
    },

    _update : function( isInit ) {
      var self = this;

      // Paginate() will return false if there aren't enough items to be paginated
      // If there aren't enough items, we don't want to create an iScroll instance
      if ( self.mode === 'paginate' ) {
        self.isPaginated = self._paginate();
      }

      // If this is running on init, we've already set the values, so skip it
      if ( !isInit ) {
        // Set the width of the element containing all the items
        if ( self.isCarouselMode ) {
          self._setItemWidths();
        }

        // We need to update the container's width
        if ( self.isCarouselMode || self.isFreeMode ) {
          self._setContentWidth();
        }
      }

      // When `isPaginated` or `isCarouselMode`, we're using iscroll, which needs to be updated.
      if ( self.isPaginated || self.isCarouselMode || self.isFreeMode ) {
        self.scroller.refresh();

        // As long as this isn't the initial setup, scroll to the current page.
        // We don't want to call this on init because it calls the `onScrollStart` function/option
        // Which might not have a reference to the scroller yet
        if ( !isInit ) {
          self.scroller.scrollToPage(self.currentPage, 0, 400);
        }
      }

      self._fire('update');
    },

    // Throttled resize event
    _onResize : function() {
      var self = this,
          windowWidth = self.$win.width(),
          windowHeight = self.$win.height(),
          hasWindowChanged = windowWidth !== self.windowWidth || windowHeight !== self.windowHeight;

      if ( self.destroyed || !hasWindowChanged || !self.enabled ) {
        return;
      }

      self.windowWidth = windowWidth;
      self.windowHeight = windowHeight;

      self._update();
    },

    _onScrollEnd : function() {
      var self = this;

      self._fire('scrolled');

      // If they've defined a callback as well, call it
      // We saved their function to this reference so we could have our own onScrollEnd
      if ( self.onScrollEnd ) {
        self.onScrollEnd();
      }
    },

    _showHideNavs : function( currentPage, numPages ) {
      var self = this;

      if ( self.$navPrev && self.$navNext ) {
        // Hide show prev button depending on where we are
        if ( currentPage === 0 ) {
          self.$navPrev.addClass('hide');
        } else {
          self.$navPrev.removeClass('hide');
        }

        // Hide show next button depending on where we are
        if ( currentPage === numPages ) {
          self.$navNext.addClass('hide');
        } else {
          self.$navNext.removeClass('hide');
        }
      }
    },

    _onBeforeScrollStart : function( iscroll, e ){
      var self = this,
          distX = iscroll.absDistX || 0,
          distY = iscroll.absDistY || 0;

      //if vertical scrolling passes threshhold then "lock direction"
      if ( distX >= (distY + self.threshhold ) ) {
        // prevent the browsers' native scrolling
        e.preventDefault();
      }

      // If they've defined a callback as well, call it
      // Original function is saved as reference (self.onBeforeScrollStart) so we could have a custom onBeforeScrollStart
      if ( self.onBeforeScrollStart ) {
        self.onBeforeScrollStart( iscroll );
      }
    },

    _onAnimationEnd : function( iscroll ) {
      var self = this;


      if ( iscroll.pagesX && iscroll.pagesX.length ){

        self.currentPage = iscroll.currPageX;

        // Show or hide paddles based on our current page
        self._showHideNavs( self.currentPage, iscroll.pagesX.length - 1 );

        // Update nav bullets
        if ( self.$pagination ) {
          self.$pagination.sonyNavDots('reset', {
            'activeButton': self.currentPage
          });
        }

      }

      // If they've defined a callback as well, call it
      // We saved their function to this reference so we could have our own onAnimationEnd
      if ( self.onAnimationEnd ) {
        self.onAnimationEnd.call( iscroll, iscroll );
      }
    },

    _setContentWidth : function( numPages, containerWidth ) {
      var self = this,
          contentWidth = 0;

      // If we're not given a number of pages, calculate it based on the width of each item
      if ( !numPages ) {
        // They've given us a function that will retun the container width
        if ( typeof self.getContentWidth === 'function' ) {
          contentWidth = self.getContentWidth( self.$elements );

        // Calculate it ourselves
        } else {
          self.$elements.each(function() {
            contentWidth += Math.round($(this).outerWidth(true));
          });
        }
      } else {
        contentWidth = numPages * containerWidth;
      }

      // Set it
      self.$contentContainer.css('width' , contentWidth );

      return self;
    },

    _setItemWidths : function() {
      var self = this,
          containerWidth = self.$el.width();

      self.$elements.css('width', containerWidth);
    },

    _fire : function( eventName, args ) {
      this.$el.trigger( eventName + '.sm', args || [this] );

      return this;
    },

    /**
     * Public Methods
     */

    setGutterWidth: function(gutterWidth){
      var self = this;
      self.gutterWidth = gutterWidth;
    },

    gotopage: function( pageNumber, duration ) {
      duration = duration || 400;
      this.scroller.scrollToPage(pageNumber, 0, duration);
    },

    next: function() {
      this.gotopage('next');
    },

    prev: function() {
      this.gotopage('prev');
    },

    refresh: function() {
      this._update();
    },

    destroy: function() {
      var self = this;

      if ( self.$pagination ) {
        self.$pagination.remove();
      }

      if ( self.generateNav ) {
        self.$nav.remove();

        // We added a paddle trigger class to one of the parents, lets find the parent and remove it.
        if ( self.addPaddleTrigger ) {
          // $().closest search the current element and then up the tree until it finds the selector
          self.$el.closest( self.paddleTrigger ).removeClass( self.paddleTrigger);
        }
      }

      self.$contentContainer.css('width', '');
      self.$elements.css({
        'position' : '',
        'top' : '',
        'left' : ''
      });

      if ( self.isCarouselMode ) {
        self.$elements.css('width', '');
      }

      // Flag to know it's destroyed
      self.destroyed = true;

      // Destroy the scroller
      self.scroller.destroy();
      // self.scroller = null;

      // Remove resize event
      self.$win.off( self.unique );

      self.$el.removeData('scrollerModule');
    },

    disable: function() {
      this.enabled = false;
      this.scroller.disable();
    },

    enable: function() {
      this.enabled = true;
      this.scroller.enable();
    }
  };

  // Plugin definition
  $.fn.scrollerModule = function( options ) {
    var args = Array.prototype.slice.call( arguments, 1 );
    return this.each(function() {
      var self = $(this),
          scrollerModule = self.data('scrollerModule');

      // If we don't have a stored scrollerModule, make a new one and save it
      if ( !scrollerModule ) {
        scrollerModule = new ScrollerModule( self, options );
        self.data( 'scrollerModule', scrollerModule );
      }

      if ( typeof options === 'string' && options.charAt(0) !== '_' ) {
        scrollerModule[ options ].apply( scrollerModule, args );
      }
    });
  };

  // Defaults
  $.fn.scrollerModule.defaults = {
    mode: 'free', // if mode == 'paginate', the items in the container will be paginated
    contentSelector: '.content', // parent of items in scroller
    itemElementSelector: '.block', // items in scroller
    lastPageCenter: false, // option to center last page elements
    extraSpacing: 0, // per page
    nextSelector: '', // selector for next paddle
    prevSelector: '', // selector for previous paddle
    fitPerPage: null, // if content needs to be fixed per page
    centerItems: true, // centers items per page
    generatePagination: undefined, // if bullet pagination is needed in mode = paginate,
    generateNav: undefined, // if left undefined, nav will be generated for carousel modes with no next/prev selectors
    appendBulletsTo: null, // option on where to place pagination bullets, if null defaults to self.$el
    appendNavOutside: true, // Outside the scroller ($el). You probably want this because the scroller has overflow:hidden
    addPaddleTrigger: true, // Add the paddle-trigger class to fade in paddles when the parent is hovered
    autoGutters: true,
    gutterWidth: 0,
    threshhold: 5, // in pixels, determines when native scrolling is prevented (used with onBeforeScrollStart)

    // iscroll props get mixed in
    iscrollProps: {
      snap: false,
      hScroll: true,
      vScroll: false,
      hScrollbar: false,
      vScrollbar: false,
      momentum: true,
      bounce: true,
      onScrollEnd: null,
      lockDirection: true,
      onBeforeScrollStart: null,
      onAnimationEnd: null,
      gutterWidth:0
    }

  };

  // Not overrideable
  $.fn.scrollerModule.settings = {
    enabled: true,
    throttleTime: 350, // How much the resize event is throttled (milliseconds)
    paginationClass: 'pagination-bullet',
    paddleTrigger:  'paddle-trigger',
    resizeEvent: 'onorientationchange' in window ? 'orientationchange' : 'resize',
    navTemplate: '<nav class="nav-paddles"><button class="nav-paddle nav-paddle-prev"><i class="fonticon-10-chevron-reverse"></i></button><button class="nav-paddle nav-paddle-next"><i class="fonticon-10-chevron"></i></button></nav>'
  };

})(jQuery, Modernizr, IScroll, window);
