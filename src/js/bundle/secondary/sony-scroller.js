/*global jQuery, Modernizr, IScroll */

// ------------  ------------
// Module: Generic Scroller
// Version: 1.0
// Modified: 2013-01-04 by Telly Koosis, Tyler Madison, Glen Cheney
// Dependencies: jQuery 1.7+, Modernizr, iScroll v4.2.5
// -------------------------------------------------------------------------

// TODO: broadcast if pagination (including page number)

(function($, Modernizr, window, undefined) {

	'use strict';

	var ScrollerModule = function( $element, options ) {
		var self = this;

		$.extend(self, $.fn.scrollerModule.defaults, options, $.fn.scrollerModule.settings);

		self.$el = $($element),
		self.$win = $(window),
		self.$contentContainer = $(self.contentSelector);
		self.$elements = $(self.itemElementSelector),
		self.$sampleElement = self.$elements.eq(0);

		self._setContainerWidth();

		// Override the onscrollend for our own use
		self.onScrollEnd = self.iscrollProps.onScrollEnd;

		// NOT SURE WHY THIS ISN'T BEING CALLED
		self.iscrollProps.onScrollEnd = function() {
			self._onScrollEnd( this );
		};

		self.onAnimationEnd = self.iscrollProps.onAnimationEnd;

		// Pass the iScroll instance to our function (we still want `this` to reference ScrollerModule)
		self.iscrollProps.onAnimationEnd = function() {
			self._onAnimationEnd( this );
		};

		// Create instance of scroller and pass it defaults
		self.scroller = new IScroll( self.$el[0], self.iscrollProps );

    self.$win.on(self.resizeEvent + '.sm', $.proxy( self._onResize, self ));

    // Initially set the isPaginated boolean. This may be changed later inside paginate()
    self.isPaginated = self.mode === 'paginate';

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

	};

	ScrollerModule.prototype = {
		constructor: ScrollerModule,

		/**
		 * Private Methods
		 */

		_paginate : function() {
			var self = this,
					widthOfOneElement = self.$sampleElement.outerWidth(true),
					itemCount	= self.$elements.length,
					containerWidth = self.$el.width() - self.extraSpacing,
					availToFit = self.fitPerPage || Math.floor(containerWidth / widthOfOneElement) || 1,
					numPages = Math.ceil( itemCount / availToFit ),
					i	= 0,
					totalBlockWidth = widthOfOneElement * availToFit;

			// Add back the extra spacing we took away for previous calculations
			containerWidth += self.extraSpacing;

			//stop processing function /maybe hide paddles or UI?
			if ( numPages === 1 || availToFit > itemCount ) {
				self.isPaginated = false;
				return false;
			} else {
				self.isPaginated = true;
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

			if ( self.mode === 'paginate' ) {
				for (i = 0 ; i < numPages; i ++) {
					var startIndex = i * availToFit,
							endIndex = startIndex + availToFit - 1;

					buildPage( i , startIndex , endIndex );
				}
			}

			// Update the width again to the new width based on however many 'pages' there are now
			self.$contentContainer.css('width' , numPages * containerWidth );

			// Save values for later outsiders if they want it
			self.totalPages = numPages;
			self.itemsPerPage = availToFit;

			self._fire('paginationcomplete');

			return true;
		},

		_update : function() {
			var self = this,
					paginated = true;

			// Paginate() will return false if there aren't enough items to be paginated
			// If there aren't enough items, we don't want to create an iScroll instance
			if ( self.mode === 'paginate' ) {
				paginated = self._paginate();
			}

			// else if mode is free, recalculate the container width

			// Is this needed? iScroll calls refresh() on itself on window resize already.
			if ( paginated ) {
				self.scroller.refresh(); //update scroller
			}

			if ( self.mode === 'paginate' && paginated ) {
				self.scroller.scrollToPage(0, 0, 400);
			}

			self._fire('update');
		},

		_onResize : function() {
			var self = this;

			// Clear the timer if it exists
			if ( self.resizeTimer ) { clearTimeout( self.resizeTimer ); }

			// Set a new timer
			self.resizeTimer = setTimeout(function() {
				if ( !self.destroyed ) {
					self._update();
				}
			}, self.throttleTime);
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

			// If they've defined a callback as well, call it
			// We saved their function to this reference so we could have our own onAnimationEnd
			if ( self.onAnimationEnd ) {
				self.onAnimationEnd( iscroll );
			}
		},

    _setContainerWidth : function() {
      var self = this,
          contentWidth = 0;

      // Count it
      self.$el.find(self.itemElementSelector).each(function() {
        contentWidth += Math.round($(this).outerWidth(true));
      });

      // Set it
      self.$contentContainer.css('width' , contentWidth );
    },

    _fire : function( eventName, args ) {
			this.$el.trigger( eventName + '.sm', args || [this] );
    },

		/**
		 * Public Methods
		 */

		goto: function( pageNo, duration ) {
			this.scroller.scrollToPage(pageNo , 0 , duration || 400);
		},

		next: function() {
			this.goto('next');
		},

		prev: function() {
			this.goto('prev');
		},

		refresh: function() {
			this._update();
		},

		destroy: function() {
			var self = this;

			self.$contentContainer.css('width', '');
			self.$elements.css({
				'position' : '',
				'top' : '',
				'left' : ''
			});

			// Destroy our resize timer. NOT SURE WHY THIS ISN'T WORKING
			clearTimeout( self.resizeTimer );
			self.destroyed = true; // work around for above

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
		throttleTime: 25, // How much the resize event is throttled (milliseconds)
		contentSelector: '.content',
		itemElementSelector: '.block',
		mode: 'free', // if mode == 'paginate', the items in the container will be paginated
		lastPageCenter: false,
		extraSpacing: 0,
		nextSelector: '', // selector for next paddle
		prevSelector: '', // selector for previous paddle
		fitPerPage: null,
		centerItems: true,

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
		resizeTimer: null,
		resizeEvent: 'onorientationchange' in window ? 'orientationchange' : 'resize'
  };

})(jQuery, Modernizr, window);