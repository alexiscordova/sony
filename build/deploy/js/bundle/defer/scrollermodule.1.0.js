// ------------  ------------
// Module: Generic Scroller
// Version: 1.0
// Modified: 2012-12-11 by Telly Koosis, Tyler Madison
// Dependencies: jQuery 1.7+, Modernizr, iScroll v4.2.5
// -------------------------------------------------------------------------
(function(window){
    'use strict';
    var sony = window.sony = window.sony || {};
    sony.modules = sony.modules || {};
})(window);

(function($ , window , undefined , Modernizr){

	'use strict';

	var ScrollerModule = function(element, opts){

		var t      = this;

		$.extend(t, {} , $.fn.scrollerModule.defaults , opts);

		t.$el 							= $(element),
		t.$win              = $(window),
		t.$contentContainer = $(t.contentSelector);
		t.$ev               = $(); //events object
<<<<<<< HEAD
		t.$elements			= $(t.itemElementSelector , t.$contentContainer),
		t.$sampleElement	= t.$elements.eq(0);

=======
		t.$elements					= $(t.itemElementSelector , t.$contentContainer),
		t.$sampleElement		= t.$elements.eq(0);

		console.log(t.$sampleElement.outerWidth(true) * t.$elements.length);
>>>>>>> 8956d28e68b0b960dc7546631bda7d1c1a09292f
		$( t.$contentContainer).css('width' , t.$sampleElement.outerWidth(true) * t.$elements.length );

		//override the onscrollend for our own use - listen for 'onAfterSroll'
		t.iscrollProps.onScrollEnd = $.proxy(t._onScrollEnd , t);

		//create instance of scroller and pass it defaults
		t.scroller = new iScroll(t.$el[0],t.iscrollProps);

		function paginate(){
			//console.group("function paginate");

			var lastSlideCentered = t.lastPageCenter,
					$itemCount        = t.$elements.length,
					wW                = t.$el.width() - t.extraSpacing,
					availToFit        = Math.floor(wW / t.$sampleElement.outerWidth(true)),
					numPages          = Math.ceil( $itemCount / availToFit ),
<<<<<<< HEAD
					i        		  = 0,
=======
					i        		      = 0,
>>>>>>> 8956d28e68b0b960dc7546631bda7d1c1a09292f
					totalBlockWidth   = t.$sampleElement.outerWidth(true) * availToFit;

			wW += t.extraSpacing;

			//console.log("Number of pages » " , numPages , wW , t.$sampleElement);
			//console.log('Available blocks to fit in MyScroller:' , availToFit , ' Number of pages:' , numPages);

			if(availToFit > $itemCount) { return; } //stop processing function /maybe hide paddles or UI?

			function buildPage(pageNo, startIndx, endIndx){

				var $elemsInPage = t.$elements.slice(startIndx, endIndx + 1);

		    if(pageNo === numPages - 1 && lastSlideCentered === true){
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

<<<<<<< HEAD
			}	
=======
			}
>>>>>>> 8956d28e68b0b960dc7546631bda7d1c1a09292f

			if(t.mode.toLowerCase() === 'paginate'){
				for (i = 0 ; i < numPages; i ++){
					var startIndx = i * availToFit,
					endIndx       = startIndx + availToFit - 1;

					buildPage( i , startIndx , endIndx );
				}
			}

			//update the width again to the new width based on however many 'pages' there are now
			t.$contentContainer.css('width' , numPages * wW );

			//console.groupEnd();

			t.$ev.trigger('onPaginationComplete.sm');
		}

		function update(){
			if(t.mode === 'paginate'){
				paginate();
			}
<<<<<<< HEAD
	  	
=======

>>>>>>> 8956d28e68b0b960dc7546631bda7d1c1a09292f
	  	t.scroller.refresh(); //update scroller

	  	if(t.mode === 'paginate'){
	  		t.scroller.scrollToPage(0, 0, 200);
	  	}
<<<<<<< HEAD
	  	
=======

>>>>>>> 8956d28e68b0b960dc7546631bda7d1c1a09292f
	  	t.$ev.trigger('onUpdate.sm');
		};

		var resizeTimer,
		resizeEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize';
<<<<<<< HEAD
    $(window).on(resizeEvent, function(e) {  
        if(resizeTimer) { clearTimeout(resizeTimer); }
        resizeTimer = setTimeout(function() { 
        	update();
        }, t.throttleTime);          
    });	
=======
    $(window).on(resizeEvent, function(e) {
        if(resizeTimer) { clearTimeout(resizeTimer); }
        resizeTimer = setTimeout(function() {
        	update();
        }, t.throttleTime);
    });
>>>>>>> 8956d28e68b0b960dc7546631bda7d1c1a09292f

    $(window).trigger(resizeEvent);
	};

	ScrollerModule.prototype = {
		goto: function(pageNo , duration){
			var t = this;

			t.scroller.scrollToPage(pageNo , 0 , duration || 300);
		},

		destroy: function(){
			var t = this;

			//destroy the scroller
			t.scroller.destroy();
			t.scroller = null;
		},

		_onScrollEnd : function(){
			var t = this;

			t.$ev.trigger('onAfterSroll.sm');
		}
	}

	//plugin definition
<<<<<<< HEAD
	$.fn.scrollerModule = function(options) {      
=======
	$.fn.scrollerModule = function(options) {
>>>>>>> 8956d28e68b0b960dc7546631bda7d1c1a09292f
	  var args = arguments;
	  return this.each(function(){
	    var t = $(this);
	    if (typeof options === "object" ||  !options) {
	      if( !t.data('scrollerModule') ) {
	        t.data('scrollerModule', new ScrollerModule(t, options));
	      }
	    } else {
	      var scrollerModule = t.data('scrollerModule');
	      if (scrollerModule && scrollerModule[options]) {
	          return scrollerModule[options].apply(scrollerModule, Array.prototype.slice.call(args, 1));
	      }
	    }
	  });
	};

<<<<<<< HEAD
	//defaults    
	$.fn.scrollerModule.defaults = { 
=======
	//defaults
	$.fn.scrollerModule.defaults = {
>>>>>>> 8956d28e68b0b960dc7546631bda7d1c1a09292f
	  throttleTime: 25,
	  contentSelector: '.content',
	  itemElementSelector: '.block',
	  mode: 'free',
	  lastPageCenter: false,
	  extraSpacing: 0,

	  //iscroll props get mixed in
	  iscrollProps: {
			snap: false,
			hScroll: true,
			vScroll: false,
			hScrollbar: false,
			vScrollbar: false,
			momentum: true,
			bounce: true,
<<<<<<< HEAD
			onScrollEnd: null 	
	  }
	 
	};
	
=======
			onScrollEnd: null
	  }

	};

>>>>>>> 8956d28e68b0b960dc7546631bda7d1c1a09292f

})(jQuery , window , undefined , Modernizr);