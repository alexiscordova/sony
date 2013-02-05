/*global jQuery, Modernizr, IScroll */

// ------------  ------------
// Module: Generic Scroller
// Version: 1.0
// Modified: 2013-01-04 by Telly Koosis, Tyler Madison, Glen Cheney
// Dependencies: jQuery 1.7+, Modernizr, iScroll v4.2.5
// -------------------------------------------------------------------------

// TODO: broadcast if pagination (including page number)


(function($, Modernizr, IScroll, window, undefined) {

  'use strict';

  var ScrollerModule = function( $element, options ) {
    var self = this;

    $.extend(self, $.fn.scrollerModule.defaults, options, $.fn.scrollerModule.settings);

    self.$el = $($element);
    self.$win = $(window);
    self._init();
  };

  ScrollerModule.prototype = {
    constructor: ScrollerModule,

    /**
     * Private Methods
     */

    _init : function() {
      var self = this,
          resizeFunc = $.throttle( self.throttleTime, $.proxy( self._onResize, self ) );

      self.$contentContainer = $(self.contentSelector);
      self.$elements = self.$el.find(self.itemElementSelector);
      self.$sampleElement = self.$elements.eq(0);

      // console.log( 'self.contentSelector »' , self.contentSelector);
      // console.log( 'self.$contentContainer »' , self.$contentContainer);

      // Initially set the isPaginated boolean. This may be changed later inside paginate()
      self.isPaginated = self.mode === 'paginate';

      // These don't change
      self.isPaginateMode = self.mode === 'paginate';
      self.isCarousel = self.mode === 'carousel';

      // save iscroll properties
      self._setIscrollProps();

      // Set equal widths on the items in the carousel so they always take up as much space
      // as the container, then generate pagination for it.
      if ( self.isCarousel ) {
        self._setItemWidths();
        self._generatePagination( self.$elements.length );
      }

      // Set the width of the inner container
      self._setContainerWidth();

      // Create instance of scroller and pass it defaults
      //console.log( 'self.$el. »' , self.$el);

      self.scroller = new IScroll( self.$el[0], self.iscrollProps );
      self.currentPage = self.scroller.currPageX;

      self.$win.on(self.resizeEvent + '.sm', resizeFunc);

      // Paddle clicks
      // If the selector is a jQuery object, use that, otherwise look for the selector inside our container
      if ( self.nextSelector ) {
        self.$navNext = self.nextSelector.jquery ? self.nextSelector : self.$el.find( self.nextSelector );
        self.$navNext.on('click', function() {
          self.next();
        });
      }
      if ( self.prevSelector ) {
        self.$navPrev = self.prevSelector.jquery ? self.prevSelector : self.$el.find( self.prevSelector );
        self.$navPrev.on('click', function() {
          self.prev();
        });
      }

      self._update();
    },

    _setIscrollProps : function() {
      var self = this;

      // Override the onscrollend for our own use
      self.onScrollEnd = self.iscrollProps.onScrollEnd;
      self.onAnimationEnd = self.iscrollProps.onAnimationEnd;

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
      self._setContainerWidth( numPages, containerWidth );

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
          $el.css('left' , Math.floor(startX + (i * $el.outerWidth(true))) + 'px');
        });
      }

      // Generate nav bullets ( if wanted )
      if ( self.generatePagination ) {
        self._generatePagination( numPages );
      }

      // Space element sout accordingly
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
          i = 0,
          $bulletPagination,
          $bulletPaginationWrapper,
          clss, $li;

      if ( self.$pagination ) {
        self.$pagination.remove();
      }

      $bulletPagination = $('<ol/>', { 'class' : 'pagination-bullets on' });

      // Create each nav bullet
      for (i = 0 ; i < pages; i++) {
        clss = i === 0 ? self.paginationClass + ' bullet-selected' : self.paginationClass;
        $li = $('<li>', {
          'class' : clss,
          'data-index': i,
          'click' : $.proxy( self.gotopage, self )
        });
        $bulletPagination.append( $li );
      }
      
      // Add wrapper for bullet pagination
      $bulletPaginationWrapper = $('<div/>', { 'class' : 'pagination-wrapper' });
      $bulletPaginationWrapper.append($bulletPagination);

      // Append the nav bullets
      self.$el.append( $bulletPaginationWrapper );
      self.$pagination = $bulletPaginationWrapper;
    },

    _update : function() {
      var self = this;

      // Paginate() will return false if there aren't enough items to be paginated
      // If there aren't enough items, we don't want to create an iScroll instance
      if ( self.mode === 'paginate' ) {
        self.isPaginated = self._paginate();
      }

      // We need to update the container's width
      if ( self.isCarousel ) {
        self._setItemWidths();
        // Set the width of the element containing all the items
        self._setContainerWidth();
      }

      // When `isPaginated` or `isCarousel`, we're using iscroll, which needs to be updated.
      if ( self.isPaginated || self.isCarousel ) {
        self.scroller.refresh();
        self.scroller.scrollToPage(self.currentPage, 0, 400);
      }

      self._fire('update');
    },

    // Throttled resize event
    _onResize : function() {
      var self = this;

      if ( !self.destroyed ) {
        self._update();
      }
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

    _onAnimationEnd : function( iscroll ) {
      var self = this;

      self.currentPage = iscroll.currPageX;

      if ( self.$navPrev && self.$navNext ) {
        // Hide show prev button depending on where we are
        if ( iscroll.currPageX === 0 ) {
          self.$navPrev.addClass('hide');
        } else {
          self.$navPrev.removeClass('hide');
        }

        // Hide show next button depending on where we are
        if ( iscroll.currPageX === iscroll.pagesX.length - 1 ) {
          self.$navNext.addClass('hide');
        } else {
          self.$navNext.removeClass('hide');
        }
      }

      // Update nav bullets
      if ( self.$pagination ) {
        self.$pagination
          .children()
          .children()
            .eq( self.currentPage )
              .addClass('bullet-selected')
            .siblings()
              .removeClass('bullet-selected');
      }

      // If they've defined a callback as well, call it
      // We saved their function to this reference so we could have our own onAnimationEnd
      if ( self.onAnimationEnd ) {
        self.onAnimationEnd( iscroll );
      }
    },

    _setContainerWidth : function( numPages, containerWidth ) {
      var self = this,
          contentWidth = 0;

      // If we're not given a number of pages, calculate it based on the width of each item
      if ( !numPages ) {
        // Count it
        self.$el.find(self.itemElementSelector).each(function() {
          contentWidth += Math.round($(this).outerWidth(true));
        });
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

    gotopage: function( pageNumber, duration ) {
      // pageNumber could be an event object from a navigation bullet click.
      // if it is, get the index from it's data attribute
      pageNumber = pageNumber.type ? $(pageNumber.target).data('index') : pageNumber;
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

      self.$contentContainer.css('width', '');
      self.$elements.css({
        'position' : '',
        'top' : '',
        'left' : ''
      });

      if ( self.isCarousel ) {
        self.$elements.css('width', '');
      }

      // Flag to know it's destroyed
      self.destroyed = true;

      // Destroy the scroller
      self.scroller.destroy();
      // self.scroller = null;

      // Remove resize event
      self.$win.off('.sm');

      self.$el.removeData('scrollerModule');
    },

    disable: function() {
      this.scroller.disable();
    },

    enable: function() {
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
    contentSelector: '.content',
    itemElementSelector: '.block',
    mode: 'free', // if mode == 'paginate', the items in the container will be paginated
    lastPageCenter: false,
    extraSpacing: 0,
    nextSelector: '', // selector for next paddle
    prevSelector: '', // selector for previous paddle
    fitPerPage: null,
    centerItems: true,
    paginationClass: 'pagination-bullet',
    generatePagination: false,

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
    }

  };

  // Not overrideable
  $.fn.scrollerModule.settings = {
    throttleTime: 150, // How much the resize event is throttled (milliseconds)
    resizeEvent: 'onorientationchange' in window ? 'orientationchange' : 'resize'
  };

})(jQuery, Modernizr, IScroll, window);