// ------------ Ter ------------
// Module:
// Version: 1.0
// Modified: 2012-12-11 by Telly Koosis, Tyler Madison
// Dependencies: jQuery 1.7+, Modernizr, iScroll v4.2.5
// -------------------------------------------------------------------------
(function($ , window , undefined , Modernizr){

	'use strict';


	$(window).load(function(){

		return; //this was just a test we dont want it running

		var $blocks = $('.content1 .block');
		var $blocks2 = $('.content2 .block');
		var $blocks3 = $('.content3 .block');

		$blocks.each(function(){
			$(this).css('backgroundColor' , '#'+Math.floor(Math.random()*16777215).toString(16));
		});

		$blocks2.each(function(){
			$(this).css('backgroundColor' , '#'+Math.floor(Math.random()*16777215).toString(16));
		});
		$blocks3.each(function(){
			//$(this).css('backgroundColor' , '#'+Math.floor(Math.random()*16777215).toString(16));
		});

		$('.content1').css('width' , $blocks.eq(0).outerWidth(true) * $blocks.length );
		$('.content2').css('width' , $blocks2.eq(0).outerWidth(true) * $blocks2.length );
		$('.content3').css('width' , $blocks3.eq(0).outerWidth(true) * $blocks3.length );

		var myScroll = new IScroll('wrapper',
			{
				hScroll: true,
				vScroll: false,
				hScrollbar: false,
				vScrollbar: false,
				momentum: true,
				bounce: true
			});

		var myScroll2 = new IScroll('wrapper2',
			{
				snap: 'div',
				hScroll: true,
				vScroll: false,
				hScrollbar: false,
				vScrollbar: false,
				momentum: true,
				bounce: true
			});

		var myScroll3 = window._s = new IScroll('wrapper3',
			{
				snap: true,
				hScroll: true,
				vScroll: false,
				hScrollbar: false,
				vScrollbar: false,
				momentum: false,
				bounce: true,
				onScrollEnd: null
			});


		function paginate(sel){
			//myscroller 3 stuff for pages
			console.group("function paginate");

			var lastSlideCentered = true,
					$w                = $(sel),
					$c                = $w.find('.content'),
					$blks             = $c.find('.block'),
					$itemCount        = $blks.length,
					extraSpace        = 100,
					wW                = $w.width() - extraSpace,
					availToFit        = Math.floor(wW / $blks.eq(0).outerWidth(true)),
					numPages          = Math.ceil( $itemCount / availToFit ),
					i        		      = 0,
					colors            = ['#00ff00','#ff0000','#cc0000','#00ff00','#ff0000'],
					totalBlockWidth   = $blks.eq(0).outerWidth(true) * availToFit;

			wW += extraSpace;

			console.log("Number of pages » " , numPages);

			console.log('Available blocks to fit in MyScroller:' , availToFit , ' Number of pages:' , numPages);

			if(availToFit > $itemCount) { return; } //stop processing function /maybe hide paddles or UI?

			function buildPage(pageNo, startIndx, endIndx){

				var $elemsInPage = $blks.slice(startIndx, endIndx + 1);

		    if(pageNo === numPages - 1 && lastSlideCentered === true){
		    	console.log("LAST PAGE »", pageNo+1);
		    	totalBlockWidth = $blks.eq(0).outerWidth(true) * $elemsInPage.length;
		    }

				var offsetX = Math.floor((wW - totalBlockWidth) * 0.5),
				startX      = Math.floor((pageNo * wW) + offsetX);

		    console.log("left over »", (wW - totalBlockWidth));
		    console.log("offsetX »", offsetX);
		    console.log("startX »", startX);

				$elemsInPage.css({
					'position' : 'absolute',
					'top' : '10px',
					'left' : '0',
					'backgroundColor': colors[pageNo]
				});


				$.each($elemsInPage , function(i){
					var $el = $(this);
					$el.css('left' , Math.floor(startX + (i * $el.outerWidth(true))) + 'px');
				});

				console.log("Building new page »", [startIndx , endIndx] ,$elemsInPage.length);

			}

			//some vars
			for (i = 0 ; i < numPages; i ++){
				var startIndx = i * availToFit,
					endIndx = startIndx + availToFit - 1;

				buildPage( i , startIndx , endIndx );
			}

			//update the width again to the new width based on however many 'pages' there are now
			$('.content3').css('width' , numPages * wW );

			console.groupEnd();
		}

      var resizeTimer;
      $(window).on('resize onorientationchange', function(e) {
          if(resizeTimer) {
              clearTimeout(resizeTimer);
          }
          resizeTimer = setTimeout(function() {

          	paginate('#wrapper3');

          	myScroll.refresh();
          	myScroll2.refresh();
          	myScroll3.refresh();

          	myScroll3.scrollToPage(0, 0, 200);

          }, 50);
      });

      $(this).trigger('resize');

	});




})(jQuery , window , undefined , Modernizr);