<!DOCTYPE html>
<!--[if lt IE8]>  <html class="ie lt-ie10 lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="ie lt-ie10 lt-ie9" lang="en"> <![endif]-->
<!--[if IE 9]>    <html class="ie lt-ie10" lang="en"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html class="modern" lang="en"> <!--<![endif]-->

	{{partial 'includes/docs_head.html'}}
	<body data-spy="scroll" data-target=".bs-docs-sidebar">
		{{partial 'includes/docs_nav.html'}}

			<!-- Subhead
			================================================== -->
			<header class="jumbotron subhead" id="overview">
			  <div class="container">
			    <h2 class="bs-docs-heading">Grid Tool</h2>
			  </div>
			</header>
			
			  <div class="container">
			
			        <!-- Fluid grid system
			        ================================================== -->
			        <section id="fluidGridSystem"> <div class="bs-docs-grid">
			        	<div class="row-fluid show-grid">
		            	<div class="gridsec pageMargin"></div><div class="gridsec gridMargin"></div>
		              <div class="gridsec column"></div><div class="gridsec gutter"></div>
		              <div class="gridsec column"></div><div class="gridsec gutter"></div>
		              <div class="gridsec column"></div><div class="gridsec gutter"></div>
		              <div class="gridsec column"></div><div class="gridsec gutter"></div>
		              <div class="gridsec column"></div><div class="gridsec gutter"></div>
		              <div class="gridsec column"></div><div class="gridsec gutter"></div>
		              <div class="gridsec column"></div><div class="gridsec gutter"></div>
		              <div class="gridsec column"></div><div class="gridsec gutter"></div>
		              <div class="gridsec column"></div><div class="gridsec gutter"></div>
		              <div class="gridsec column"></div><div class="gridsec gutter"></div>
		              <div class="gridsec column"></div><div class="gridsec gutter"></div>
		              <div class="gridsec column"></div>
		            	<div class="gridsec gridMargin"></div><div class="gridsec pageMargin"></div>
		            </div>
		            <p class="bpBtns">Example Starting Points: <a class="btn btn-mini" id="btnExample768">768</a> <a class="btn btn-mini" id="btnExample980">980</a> <a class="btn btn-mini" id="btnExample1200">1200</a> </p>
		            
			        </section>

			        <form method="post" action="">
						    <div class="inc">
						        <label for="name">Page Margin</label>
						        <input type="text" name="pageMargin" id="pageMargin" value="45" style="color:rgb(0, 0, 255);"/>
						    </div>
						    <div class="inc">
						        <label for="name">Grid Margin</label>
						        <input type="text" name="gridMargin" id="gridMargin" value="40" style="color:rgb(0, 125, 0);"/>
						    </div>
						    <div class="inc">
						        <label for="name">Column Width</label>
						        <input type="text" name="columnWidth" id="columnWidth" value="45"/>
						    </div>
						    <div class="incOdd">
						        <label for="name">Gutter Width</label>
						        <input type="text" name="gutterWidth" id="gutterWidth" value="20" style="color:rgb(255,0,0);"/>
						    </div>

						    <div>
						        <label for="name">TOTAL</label>
						        <input type="text" name="totalWidth" id="totalWidth" class="no-select" value="" />
						    </div>
						  </form>

						  <style type="text/css">
						  	body 							{ background-image: url("img/breakpoints.png");	}
						  	body.bp768 				{ background-image: url("img/breakpoints768.png");	}
						  	body.bp980 				{ background-image: url("img/breakpoints980.png");	}
						  	body.bp1200				{ background-image: url("img/breakpoints1200.png");	}
								label            	{ color: #222; display: block; float: left; text-align: right; padding: 5px 10px 0 0; width: 140px; }
								input[type=text] 	{ float: left; width: 60px; padding: 3px 0 0 0; text-align: center; }
								form div         	{ overflow: hidden; margin: 0 0 5px 0; }
								form *						{ user-select: none; -o-user-select:none; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none;}
								form input				{ user-select: text; -o-user-select:text; -moz-user-select: text; -khtml-user-select: text; -webkit-user-select: text;}
								.button          	{ margin: 0 0 0 5px; text-indent: -9999px; cursor: pointer; width: 29px; height: 29px; float: left; text-align: center; background: url(img/inc-buttons.png) no-repeat; }
								.inc 							{ background-position: 0 0; }
								.dec             	{ background-position: 0 -29px; }
								.inc2             { background-position: -29px 0; }
								.dec2             { background-position: -29px -29px;}
								.inc5             { background-position: -58px 0; }
								.dec5             { background-position: -58px -29px; margin-left:15px;}
								.inc6             { background-position: -87px 0; }
								.dec6             { background-position: -87px -29px; margin-left:15px;}
								.no-select			 	{ user-select: none; -o-user-select:none; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; }
								.gridsec 					{ float:left; width:20px; height:50px; margin:0; padding:0; background-color: #EEE; text-align: center; -webkit-border-radius: 0px; -moz-border-radius: 0px; border-radius: 0px; min-height: 40px; line-height: 40px; margin:0; padding:0; }
								.jumbotron			 	{ margin:0 30px; background:none;}
								#fluidGridSystem	{ padding:25px 0; }
								.inc input[type="text"] { font-size:1em; color: #83838F; }
								.incOdd input[type="text"] { font-size:1em; color: #83838F; }
								#totalWidth 			{ font-size:1em; color: #444; }
								.bp 							{ display:none; }
								.bpBtns						{ margin-left:10px; color:#222; }
								.bpBtns a.btn			{ margin-left:10px; width:80px; }

								.show-grid .pageMargin 			{ background:rgba(0,0,255,0.6); color:#fff; }
								.show-grid .gridMargin 			{ background:rgba(0,125,0,0.6); color:#fff; }
								.show-grid .gutter 					{ background:rgba(255,0,0,0.6); color:#fff; }
								.show-grid .column 					{ background:rgba(255,255,255,0.8); }

							</style>
						  <script type="text/javascript">
						  $(function() {

								var $container = $("#fluidGridSystem"),
						  		$pageMargin = $("#pageMargin"),
						  		$gridMargin = $("#gridMargin"),
						  		$columnWidth = $("#columnWidth"),
						  		$gutterWidth = $("#gutterWidth"),
						  		$totalWidth = $("#totalWidth"),
						  		$grid = $(".show-grid"),
						  		$columns = $(".column"),
						  		$pageMargins = $(".pageMargin"),
						  		$gridMargins = $(".gridMargin"),
						  		$gutters = $(".gutter");

						  	$(".container").css({"width":"100%", "max-width":"100%", "padding":0}); // override media queries
						  	$("footer.footer").css({"display":"none"}); // override media queries


						  	$(".container .inc input, .container .incOdd input").keyup(function(){
							  	updateDisplay();
							  });

							  var bg768 = $('<img />').attr('src', "img/breakpoints768.png");
							  var bg980 = $('<img />').attr('src', "img/breakpoints980.png");
							  var bg1200 = $('<img />').attr('src', "img/breakpoints1200.png");

							  $("#btnExample768").click(function(){
							  	$pageMargin.val(36);
							  	$gridMargin.val(32);
							  	$columnWidth.val(38);
							  	$gutterWidth.val(16);
							  	setTimeout(function(){
							  		updateDisplay();
							  	},100);
							  });
							  $("#btnExample980").click(function(){
							  	$pageMargin.val(45);
							  	$gridMargin.val(49);
							  	$columnWidth.val(44);
							  	$gutterWidth.val(24);
							  	setTimeout(function(){
							  		updateDisplay();
							  	},100);
							  });
							  $("#btnExample1200").click(function(){
							  	$pageMargin.val(56);
							  	$gridMargin.val(68);
							  	$columnWidth.val(50);
							  	$gutterWidth.val(32);
							  	setTimeout(function(){
							  		updateDisplay();
							  	},100);
							  });

						  	initIncrements = function(){

	    						$("form div.inc").append('<div class="dec button">-</div><div class="inc button">+</div><div class="dec5 button">-5</div><div class="inc5 button">+5</div>');
	    						$("form div.incOdd").append('<div class="dec2 button">-2</div><div class="inc2 button">+2</div><div class="dec6 button">-6</div><div class="inc6 button">+6</div>');
	    						$(".button").click(function() {
								    var $button = $(this);
								    var oldValue = $button.parent().find("input").val();

								    if ($button.text() == "+") {
										  var newVal = parseFloat(oldValue) + 1;
										} else if ($button.text() == "+2"){
										  var newVal = parseFloat(oldValue) + 2;
										} else if ($button.text() == "+5"){
										  var newVal = parseFloat(oldValue) + 5;
										}	else if ($button.text() == "-2") {
										  var newVal = parseFloat(oldValue) - 2;
										}	else if ($button.text() == "-5") {
										  var newVal = parseFloat(oldValue) - 5;
										} else {
										  var newVal = parseFloat(oldValue) - 1;
									  }
									  if (newVal < 0){
									  	newVal = 0;
									  }
										$button.parent().find("input").val(newVal);
										updateDisplay();
									});
									updateDisplay();
								},
								updateDisplay = function(){
						  		var pageMargin = parseInt($pageMargin.val()),
						  			gridMargin = parseInt($gridMargin.val()),
						  			columnWidth = parseInt($columnWidth.val()),
						  			gutterWidth = parseInt($gutterWidth.val()),
						  			totalWidth = (pageMargin*2) + (gridMargin*2) + (columnWidth*12) + (gutterWidth*11),
						  			pageMarginPct = 100*pageMargin/totalWidth,
						  			gridMarginPct = 100*gridMargin/totalWidth,
										columnWidthPct = 100*columnWidth/totalWidth,
										gutterWidthPct = 100*gutterWidth/totalWidth;

									$totalWidth.val(totalWidth);
									$grid.width(totalWidth);
									$columns.css("width",columnWidthPct+"%").text(columnWidth);
									$gutters.css("width",gutterWidthPct+"%").text(gutterWidth);
									$pageMargins.css("width",pageMarginPct+"%").text(pageMargin);
									$gridMargins.css("width",gridMarginPct+"%").text(gridMargin);

									$("body").removeClass("bp768 bp980 bp1200");

									if (totalWidth == 768){
										$("body").addClass("bp768");
									} else if (totalWidth == 980){
										$("body").addClass("bp980");
									} else if (totalWidth == 1200){
										$("body").addClass("bp1200");
									}
								}

								initIncrements();
							});
						  </script>
			
			
			
			      </div>
			    </div>
			
			  </div>
			  
		{{partial 'includes/docs_foot.html'}}
	</body>
</html>