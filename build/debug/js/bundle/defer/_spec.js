// //Global variables.
// var $tableContainerBackup;
// var refreshData = null;
// var arrayTableContainer = [];
// var arrayTableFirstColumn = [];
// var tableContainerBackup;
// var array = [];

// $(window).load(function() {

// 	$('.tableContainer').each(function(indexTable) {

// 		arrayTableContainer.push([]);
// 		arrayTableFirstColumn.push([]);

// 		//nb of cell in the first column
// 		var $firstColumn = $(this).findColumn(1);
// 		var firstColumnNbCell = $($firstColumn).size();

// 		$(this).find('.tbody:first > .specRow').each(function(indexRow) {
// 			$(this).find('>.specCell').not(':first-child').each(function(indexCell) {
// 				$(this).prepend('<h2>' + $firstColumn[indexRow + 1].textContent + '</h2>');
// 			});
// 		});

// 		var nbColumn = ($(this).find('.thead > .specRow > .specCell').size());

// 		if (nbColumn > 2)
// 			dumpText = ' Models';
// 		else
// 			dumpText = ' Model';

// 		$(this).find('.thead > .specRow > .specCell:first-child').append('<p>' + (nbColumn - 1) + '<span>' + dumpText + '</span></p>');

// 		//Clone the first column (we will push it for each table)
// 		$firstColumnTablesBackup = $(this).findColumn(1).clone();
// 		arrayTableFirstColumn[indexTable].push($firstColumnTablesBackup);

// 		$(this).findColumn(1).remove();

// 		//Clone it without the first column
// 		$tableContainerBackup = $(this).clone();
// 		arrayTableContainer[indexTable].push($tableContainerBackup);

// 	});

// 	//init.
// 	resize('init', ifMobile, $browser, $tableContainerBackup);
// });

// $(window).resize(function() {
// 	var ifMobile = Modernizr.mq('only all and (max-width: 640px)');

// 	delay(function() {
// 		resize('resize', ifMobile, $browser, $tableContainerBackup);
// 	}, 100);
// 	//var sonySlider = $('section > .gallery-tabs > .tableContainer').data('sonyCarousel');
// });

// //When you resize.
// //params--------------------------------------------
// //status:  string - init/resize
// //device:  boolean - true = mobile, false = desktop
// //browser: string - old/modern

// function resize(status, device, browser, tableContainerBackup) {

// 	//hide any modal on resize.
// 	if ($('.module-spec .modal').length > 0) {
// 		$('.module-spec .modal').modal('hide');
// 	}

// 	//Put it in the scope.
// 	var browser = browser;
// 	var device = device;

// 	//Get the window width.
// 	var windowWidth = $(window).width();

// 	//minimum per table (column)
// 	var minWidthTable = 321;

// 	// Number of element present in the viewport (visible element)
// 	var elemMinWidth = (windowWidth / minWidthTable);

// 	//get the number of column to display.
// 	nbElementByPage = Math.min(Math.max(Math.floor(elemMinWidth), 1), 4);

// 	//If it's necessary to refresh the number of data
// 	if ((refreshData == null) || (refreshData !== nbElementByPage)) {

// 		//index of each container.
// 		var indexContainer;

// 		$('section > .gallery-tabs > .tableContainer').each(function(indexContainer) {
// 			$_this = $(this);

// 			//#############

// 			//Define the carousel
// 			var sonySlider = $_this.data('sonyCarousel');

// 			//destroy the current slider instance.
// 			if (sonySlider)
// 				sonySlider.destroy();

// 			//Empty the container.
// 			$_this.empty();

// 			//#############

// 			//get the tableContainer
// 			tableContainerBackup = $(arrayTableContainer)[indexContainer][0].clone();

// 			//get all cells
// 			var $myCells = tableContainerBackup.clone().find(".specsTable > .thead > .specRow > .specCell, .specsTable > .tbody > .specRow > .specCell");

// 			//nb total column
// 			var nbCol = tableContainerBackup.clone().find(".specRow:first .specCell").length;

// 			//nb of table to show
// 			var nbTableToShow = nbCol / nbElementByPage;

// 			//#############
// 			//matrix
// 			var matrix = listToMatrix($myCells, nbCol);

// 			//#############
// 			//Build the sticky nav. - We only add it once.
// 			if ($_this.parent().find('.tabs-container').length <= 0) {
// 				var tabContainer = $('<div class="tabs-container">');
// 				var tabInnerContainer = $('<div class="tabs">');

// 				$(matrix[0]).each(function(index) {
// 					tabInnerContainer.append($(this).clone().addClass('tab table-' + (indexContainer + '-' + index + 1)));
// 				});

// 				tabContainer.append(tabInnerContainer);
// 				$_this.before(tabContainer);

// 				tabInnerContainer.children(':first-child').addClass('active')


// 				// Initialize sticky tabs
// 				// THERES NO DATA-TARGET ATTRIBUTE AND THEREFORE NO ACTIVE TAB
// 				$('.tab-strip').stickyTabs();
// 				$('.tabs').trigger("setup_stickytabs");
// 			}

// 			//Loop each table to add.
// 			for (var i = 0; i < Math.ceil(nbTableToShow); i++) {
// 				var $table = "";

// 				if (browser == 'modern') {//Table div layout
// 					$table = $('<div class="specsTable" id="table-' + indexContainer + '-' + (i + 1) + '">');

// 					var $thead = $("<div class='thead'></div>");
// 					var $tbody = $("<div class='tbody'></div>");
// 				} else {//Table layout
// 					$table = $('<table class="specsTable" id="table-' + indexContainer + '-' + (i + 1) + '">');

// 					var $thead = $("<thead class='thead'></thead>");
// 					var $tbody = $("<tbody class='tbody'></tbody>");
// 				}

// 				//loop in each row
// 				$(listToMatrix($myCells, nbCol)).each(function(index) {

// 					if (browser == 'modern') {//Table div layout
// 						var $curentRow = new $("<div class='specRow'></div>");
// 						var $firstCurentRow = new $("<div class='specRow'></div>");
// 					} else {//Table layout
// 						var $curentRow = new $("<tr class='specRow'></tr>");
// 						var $firstCurentRow = new $("<tr class='specRow'></tr>");
// 					}

// 					for ( j = 1; j <= index; j++) {
// 						titleToCopy = $(this[0]).text();

// 						$(this).each(function() {
// 							if ($(this).find('h2').length <= 0)
// 								$(this).prepend('<h2>' + titleToCopy + '</h2>');
// 						})
// 					}

// 					if (index == 0) {//Put the first row inside the .thead
// 						$firstCurentRow.append(listToMatrix(this, nbElementByPage)[i]);
// 						$thead.append($firstCurentRow);
// 					} else {//Else, put them inside the .tbody

// 						$curentRow.append(listToMatrix(this, nbElementByPage)[i]);
// 						$tbody.append($curentRow);
// 					}

// 					//Build each table.
// 					$table.append($thead, $tbody);
// 					$_this.append($table);
// 				});
// 			};

// 			if (!device) {
// 				//Desktop

// 				//Start it.
// 				$_this.sonyCarousel({
// 					keyboardNavEnabled : true,
// 					sliderDrag : false,
// 					navigateByClick : false,
// 					autoScaleSlider: false,
// 					autoHeight: true
// 				});

// 				$desktopNav = $_this.parent('.gallery-tabs').find('.desktopNav');

// 				if ($desktopNav.length <= 0)
// 					$_this.before('<div class="desktopNav"><a href="#" class="prev">Previous</a><a href="#" class="next">Next</a></div>');

// 				//Prev
// 				$_this.prev().find('a.next').click(function() {
// 					var sonySlider = $_this.data('sonyCarousel');
// 					sonySlider.next();
// 				});

// 				//Next
// 				$_this.prev().find('a.prev').click(function() {
// 					var sonySlider = $_this.data('sonyCarousel');
// 					sonySlider.prev();
// 				});


// 				var sonySlider = $_this.data('sonyCarousel');

// 				//init
// 				slideChange(sonySlider);

// 				sonySlider.ev.on('scAfterSlideChange', function(event) {
// 					//After each slide change.. Look if it's necessary to show the Next & Previous button.
// 					slideChange(sonySlider);
// 				});

// 			} else {
// 				//Mobile

// 				//Start it.
// 				$_this.sonyCarousel({
// 					keyboardNavEnabled : false,
// 					drag : true,
// 					autoScaleSlider: false,
// 					autoHeight: true
// 				});

// 				//Mobile version
// 				var sonySlider = $_this.data('sonyCarousel');

// 				//When you click on tabs
// 				$_this.prev().find('.tab').click(function() {
// 					$(this).parent().find('.tab').removeClass('active').removeAttr('style');
// 					$(this).addClass('active');
// 					$_this.sonyCarousel('goTo', $(this).index());
// 				});

// 				var sonySlider = $('.tableContainer').data('sonyCarousel');
// 				sonySlider.ev.on('scAfterSlideChange', function(event) {

// 					// triggers after slide change
// 					$_this.closest('.tableContainer').prev().find('.tabs.sticky .tab').removeClass('active').removeAttr('style');
// 					$_this.closest('.tableContainer').prev().find('.tabs.sticky .tab.table-' + indexContainer + '-' + (sonySlider.currSlideId + 1)).addClass('active');
// 				});
// 			}

// 			leftTitle = $(arrayTableFirstColumn)[indexContainer][0].clone();

// 			//Add a title to the left of each row.
// 			$(leftTitle).each(function(index) {
// 				if (index == '0')
// 					$_this.find('.specsTable > .thead > .specRow:nth-child(' + (index + 1) + ')').prepend($(this));
// 				else {
// 					$_this.find('.specsTable > .tbody > .specRow:nth-child(' + (index) + ')').prepend($(this));
// 				}
// 			})
// 		});

// 		//modify the new current nbElementByPage
// 		refreshData = nbElementByPage;

// 		//Load iq (we load images)
// 		iQ.update({
// 			asyncDistance : -1
// 		});

// 		//remove the active class.
// 		$('.tabs-container .tabs .specCell').removeClass('active');

// 		//init the active class for the tabs
// 		activeTab = $('.tableContainer .specsTable:in-viewport').attr('id');
// 		$('.tabs-container .tabs').children('.specCell.' + activeTab).addClass('active');
// 	}

// 	var arrayCel = [];
// 	$('.tableContainer .specsTable > .tbody >.specRow > .specCell > div').attr("style","min-height:0");
// 	//This section is always running while resizing.
// 	$('section > .gallery-tabs > .tableContainer .specsTable').each(function(indexContainer) {

// 		//	self = $(this);

// 		if (arrayCel.length == 0) {
// 			isFirstTable = true;
// 		} else {
// 			isFirstTable = false;
// 		}

// 		$(this).find('>.tbody>.specRow').each(function(indexR) {

// 			var storedRowHeight = 0;
// 			var currentCellHeight = $($(this).find('.specCell')[1]).height();

// 			if (isFirstTable) {
// 				arrayCel.push(currentCellHeight);
// 			} else {
// 				storedRowHeight = arrayCel[indexR];
// 				if (currentCellHeight > storedRowHeight) {
// 					arrayCel[indexR] = currentCellHeight;
// 				}
// 			}

// 		});
// 	});

// 	$('section > .gallery-tabs > .tableContainer .specsTable').each(function(indexTable) {
// 		self = $(this);

// 		$(arrayCel).each(function(index) {
// 			var rows = self.find('> .tbody > .specRow')[index];
// 			$(rows).find("> .specCell > div").attr("style","min-height:" + arrayCel[index]+"px;" );
// 		});
// 	});
// 	arrayCel = [];


// 	//console.info(status, device, browser);
// 	$('.tableContainer').each(function() {
// 		$(this).setContainerHeight();
// 	});

// 	//fit the fixed header on resize.
// 	fixedHeader();
// }


// function slideChange(sonySlider)
// {
// 	currentSlide = (parseInt(sonySlider.currSlideId)+1);
// 	totalSlide = (sonySlider.numSlides);

// 	if(currentSlide === 1){
// 		//Hide the left arrow
// 		$('.desktopNav').find('.prev').hide();
// 	}
// 	else{
// 		$('.desktopNav').find('.prev').show();
// 	}

// 	if(totalSlide === currentSlide){
// 		//Hide the right arrow
// 		$('.desktopNav').find('.next').hide();
// 	}
// 	else{
// 		$('.desktopNav').find('.next').show();
// 	}
// }


// $(window).bind("scroll", function(event) {
// 	fixedHeader();
// });

// function fixedHeader()
// {
// 	windowWidth = $(window).width();
// 	sectionWidth = $('.container > section').width();
// 	currentFixedHeader = $('.fixed-header').width();

// 	/*
// 	spaceAvail = (windowWidth-sectionWidth);

// 	console.info('Window width: '+windowWidth);
// 	console.info('FixedHeader width: '+currentFixedHeader);
// 	console.info('Avail space: '+spaceAvail);



//   $(".fixed-header:above-the-top").each(function() {
//   	$('.fixed-header').attr('style', 'position:fixed;top:0;background:#fff;z-index:99999; width:92.5%;');
//   	$('.fixed-header').next().attr('style', 'padding-top:105px;')
//   	$('.fixed-header').next().find('.desktopNav').attr('style', 'top:105px;')
//   });
//   */
// }

