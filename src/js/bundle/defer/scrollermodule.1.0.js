// ------------  ------------
// Module: Generic Scroller
// Version: 1.0
// Modified: 2012-12-11 by Telly Koosis, Tyler Madison
// Dependencies: jQuery 1.7+, Modernizr, iScroll v4.2.5
// -------------------------------------------------------------------------
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

		$.extend(t, {} , $.fn.scrollerModule.defaults , opts);

		t.$el 							= $(element),
		t.$win              = $(window),
		t.$contentContainer = $(t.contentSelector);
		t.$ev               = $(); //events object
		t.$elements					= $(t.itemElementSelector , t.$contentContainer),
		t.$sampleElement		= t.$elements.eq(1);

		$( t.$contentContainer).css('width' , (t.$sampleElement.outerWidth(true) * t.$elements.length)/*hack: + 500*/ );

		console.log("Sample element width »", t.$sampleElement.outerWidth(true));

		console.log("Total container width »",(t.$sampleElement.outerWidth(true) * t.$elements.length));

		// Override the onscrollend for our own use - listen for 'onAfterSroll'
		t.iscrollProps.onScrollEnd = $.proxy(t._onScrollEnd , t);

		// Create instance of scroller and pass it defaults
		t.iscrollProps.onTouchEnd = t.iscrollProps.onScrollEnd = window.iQ.update;
		t.scroller = new iScroll(t.$el[0],t.iscrollProps);

		function paginate() {
			// console.group("function paginate");

			var lastSlideCentered = t.lastPageCenter,
					itemCount					= t.$elements.length,
					wW                = t.$el.width() - t.extraSpacing,
					availToFit        = Math.floor(wW / t.$sampleElement.outerWidth(true)),
					numPages          = Math.ceil( itemCount / availToFit ),
					i        		  		= 0,
					totalBlockWidth   = t.$sampleElement.outerWidth(true) * availToFit;

			wW += t.extraSpacing;

			// console.log("Number of pages » " , numPages , wW , t.$sampleElement);

			// console.log('Available blocks to fit in MyScroller:' , availToFit , ' Number of pages:' , numPages);

			//stop processing function /maybe hide paddles or UI?
			if ( numPages === 1 || availToFit > itemCount ) {
				t.isPaginated = false;
				return false;
			} else {
				t.isPaginated = true;
			}

			function buildPage(pageNo, startIndx, endIndx) {

				var $elemsInPage = t.$elements.slice(startIndx, endIndx + 1);

		    if ( pageNo === numPages - 1 && lastSlideCentered === true ) {
		    	console.log("LAST PAGE »", pageNo+1);
		    	totalBlockWidth = t.$sampleElement.outerWidth(true) * $elemsInPage.length;
		    }

				var offsetX = Math.floor((wW - totalBlockWidth) * 0.5),
				startX      = Math.floor((pageNo * wW) + offsetX);

		    //console.log("left over »", (wW - totalBlockWidth));
		    //console.log("offsetX »", offsetX);
		    //.log("startX »", startX);

				$elemsInPage.css({
					'position' : 'absolute',
					'top' : '0',
					'left' : '0'
				});

				$.each($elemsInPage , function(i){
					var $el = $(this);
					$el.css('left' , Math.floor(startX + (i * $el.outerWidth(true))) + 'px');
				});

				//console.log("Building new page »", [startIndx , endIndx] ,$elemsInPage.length);
			}

			if ( t.mode.toLowerCase() === 'paginate' ) {
				for (i = 0 ; i < numPages; i ++) {
					var startIndx = i * availToFit,
					endIndx       = startIndx + availToFit - 1;

					buildPage( i , startIndx , endIndx );
				}
			}

			// Update the width again to the new width based on however many 'pages' there are now
			t.$contentContainer.css('width' , numPages * wW );

			//console.groupEnd();

			t.$ev.trigger('onPaginationComplete.sm');

			return true;
		}

		function update() {

			return;

			
			var paginated = true;

			// Paginate() will return false if there aren't enough items to be paginated
			// If there aren't enough items, we don't want to create an iScroll instance
			if ( t.mode === 'paginate' ) {
				paginated = paginate();
			}

			// Is this needed? iScroll calls refresh() on itself on window resize already.
	  	if ( paginated ) {
	  		t.scroller.refresh(); //update scroller
	  	}

	  	if ( t.mode === 'paginate' && paginated ) {
	  		t.scroller.scrollToPage(0, 0, 200);
	  	}

	  	t.$ev.trigger('update.sm');
		};

		t.resizeTimer = null;
		t.resizeEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize';
    t.$win.on(t.resizeEvent + '.sm', function(e) {
        // Clear the timer if it exists
        if ( t.resizeTimer ) { clearTimeout( t.resizeTimer ); }

        // Set a new timer
        t.resizeTimer = setTimeout(function() {
        	if ( !t.destroyed ) {
        		update();
        	}
        }, t.throttleTime);
    });

    // Initially set the isPaginated boolean. This may be changed later inside paginate()
    t.isPaginated = t.mode === 'paginate';

    // $(window).trigger(resizeEvent);
    update();
	};

	ScrollerModule.prototype = {
		constructor: ScrollerModule,

		goto: function(pageNo , duration){
			var t = this;

			t.scroller.scrollToPage(pageNo , 0 , duration || 300);
		},

		next: function() {
			this.goto('next');
		},

		prev: function() {
			this.goto('prev');
		},

		refresh: function() {
			var t = this;
			t.update();
		},

		destroy: function() {
			var t = this;

			t.$contentContainer.css('width', '');

			// Destroy our resize timer. NOT SURE WHY THIS ISN'T WORKING
			clearTimeout( t.resizeTimer );
			t.destroyed = true; // work around for above

			// Destroy the scroller
			t.scroller.destroy();

			t.scroller = null;

			// Remove resize event
			t.$win.off('.sm');
			t.$el.removeData('scrollerModule');
		},

		disable: function() {
			var t = this;

			t.scroller.disable();
		},

		enable: function() {
			var t = this;
			t.scroller.enable();
		},

		_onScrollEnd : function() {
			var t = this;

			t.$ev.trigger('scrolled.sm');
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
		throttleTime: 25,
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