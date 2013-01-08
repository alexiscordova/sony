// ------------  ------------
// Module: Generic Scroller
// Version: 1.0
// Modified: 2013-1-7 by Telly Koosis, Tyler Madison, Glen Cheney
// Dependencies: jQuery 1.7+, Modernizr, iScroll v4.2.5
// -------------------------------------------------------------------------

// TODO: broadcast if pagination (including page number)
// TODO: add listener for prev and next page.
// TODO: allow init of more than one scroller on a page
// TODO: allEqual: t/f option: if true, then grab any $sampleElement otherwise add in func to tally total (or handle differences)

(function(window) {
    'use strict';
    var sony = window.sony = window.sony || {};
    sony.modules = sony.modules || {};
    sony.ev = sony.ev || $();

})(window);

(function($ , window , undefined , Modernizr) {

	'use strict';

	var ScrollerModule = function(element, opts) {

		var t = this;

		$.extend(self, {} , $.fn.scrollerModule.defaults , opts);

		self.$el               = $(element),
		self.$win              = $(window),
		self.$contentContainer = $(self.contentSelector);
		self.$ev               = $(); //events object
		self.$elements         = $(self.itemElementSelector , self.$contentContainer),
		self.$sampleElement    = self.$elements.eq(0);

		$( self.$contentContainer).css('width' , (self.$sampleElement.outerWidth(true) * self.$elements.length));

		// Override the onscrollend for our own use - listen for 'onAfterSroll'
		self.iscrollProps.onScrollEnd = $.proxy(self._onScrollEnd , self);

		// Create instance of scroller and pass it defaults
		//self.iscrollProps.onTouchEnd = self.iscrollProps.onScrollEnd = window.iQ.update;
		self.scroller = new iScroll(self.$el[0],self.iscrollProps);

		function paginate() {
			// console.group("function paginate");

			var lastSlideCentered = self.lastPageCenter,
					itemCount					= self.$elements.length,
					wW                = self.$el.width() - self.extraSpacing,
					availToFit        = Math.floor(wW / self.$sampleElement.outerWidth(true)),
					numPages          = Math.ceil( itemCount / availToFit ),
					i        		  		= 0,
					totalBlockWidth   = self.$sampleElement.outerWidth(true) * availToFit;

			wW += self.extraSpacing;

			// console.log("Number of pages Â» " , numPages , wW , self.$sampleElement);

			// console.log('Available blocks to fit in MyScroller:' , availToFit , ' Number of pages:' , numPages);

			//stop processing function /maybe hide paddles or UI?
			if ( numPages === 1 || availToFit > itemCount ) {
				self.isPaginated = false;
				return false;
			} else {
				self.isPaginated = true;
			}

			function buildPage(pageNo, startIndx, endIndx) {

				var $elemsInPage = self.$elements.slice(startIndx, endIndx + 1);

		    if ( pageNo === numPages - 1 && lastSlideCentered === true ) {
		    	console.log("LAST PAGE Â»", pageNo+1);
		    	totalBlockWidth = self.$sampleElement.outerWidth(true) * $elemsInPage.length;
		    }

				var offsetX = Math.floor((wW - totalBlockWidth) * 0.5),
				startX      = Math.floor((pageNo * wW) + offsetX);

		    //console.log("left over Â»", (wW - totalBlockWidth));
		    //console.log("offsetX Â»", offsetX);
		    //.log("startX Â»", startX);

				$elemsInPage.css({
					'position' : 'absolute',
					'top' : '0',
					'left' : '0'
				});

				$.each($elemsInPage , function(i){
					var $el = $(this);
					$el.css('left' , Math.floor(startX + (i * $el.outerWidth(true))) + 'px');
				});

				//console.log("Building new page Â»", [startIndx , endIndx] ,$elemsInPage.length);
			}

			if ( self.mode.toLowerCase() === 'paginate' ) {
				for (i = 0 ; i < numPages; i ++) {
					var startIndx = i * availToFit,
					endIndx       = startIndx + availToFit - 1;

					buildPage( i , startIndx , endIndx );
				}
			}

			// Update the width again to the new width based on however many 'pages' there are now
			self.$contentContainer.css('width' , numPages * wW );

			//console.groupEnd();

			self.$ev.trigger('onPaginationComplete.sm');

			return true;
		}

		function update() {
			var paginated = true;

			// Paginate() will return false if there aren't enough items to be paginated
			// If there aren't enough items, we don't want to create an iScroll instance
			if ( self.mode === 'paginate' ) {
				paginated = paginate();
			}

			// Is this needed? iScroll calls refresh() on itself on window resize already.
	  	// if ( paginated ) {
	  	// 	self.scroller.refresh(); //update scroller
	  	// }

	  	if ( self.mode === 'paginate' && paginated ) {
	  		self.scroller.scrollToPage(0, 0, 400);
	  	}

	  	self.$ev.trigger('update.sm');
	
		};

		self.resizeTimer = null;
		self.resizeEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize';
    self.$win.on(self.resizeEvent + '.sm', function(e) {
        
        // Clear the timer if it exists
        // if ( self.resizeTimer ) { clearTimeout( self.resizeTimer ); }

        // // Set a new timer
        // self.resizeTimer = setTimeout(function() {
        // 	if ( !self.destroyed ) {
        // 		console.log("update() »");
        // 		update();
        // 	}
        // }, self.throttleTime);

				// $.throttle(500, function(){
				// 	console.log("resizeEvent »", self.resizeEvent);
				// 	//update();
				// });

    });

    // Initially set the isPaginated boolean. This may be changed later inside paginate()
    self.isPaginated = self.mode === 'paginate';

    //$(window).trigger(resizeEvent);
    update();
	};

	ScrollerModule.prototype = {
		constructor: ScrollerModule,

		goto: function(pageNo , duration){
			var t = this;

			self.scroller.scrollToPage(pageNo , 0 , duration || 400);
		},

		next: function() {

			this.goto('next');
		},

		prev: function() {

			this.goto('prev');
		},

		refresh: function() {
			var t = this;
			self.update();
		},

		destroy: function() {
			var t = this;

			self.$contentContainer.css('width', '');

			// Destroy our resize timer. NOT SURE WHY THIS ISN'T WORKING
			clearTimeout( self.resizeTimer );
			self.destroyed = true; // work around for above

			// Destroy the scroller
			self.scroller.destroy();

			// Remove resize event
			self.$win.off('.sm');
			self.$el.removeData('scrollerModule');
		},

		disable: function() {
			var t = this;

			self.scroller.disable();
		},

		enable: function() {
			var t = this;
			self.scroller.enable();
		},

		_onScrollEnd : function() {
			var t = this;

			self.$ev.trigger('scrolled.sm');
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

      if ( typeof options === 'string' ) {
        scrollerModule[ options ].apply( scrollerModule, args );
      }
    });
  };

	// Defaults
	$.fn.scrollerModule.defaults = {
		throttleTime: 250,
		contentSelector: '.content',
		itemElementSelector: '.block',
		mode: 'free',
		lastPageCenter: false,
		extraSpacing: 0,

		// iscroll props get mixed in
		iscrollProps: {
			snap: false,
			hScroll: true,
			vScroll: false,
			hScrollbar: false,
			vScrollbar: false,
			momentum: true,
			bounce: true,
			onScrollEnd: null
		}

	};

})(jQuery , window , undefined , Modernizr);