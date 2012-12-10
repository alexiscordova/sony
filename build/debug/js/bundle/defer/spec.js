var $tableContainerBackup;
$(window).load(function() {

	//Create a backup of the tableContainer
	$tableContainerBackup = $('.tableContainer').clone();
	//$firstColumnTablesBackup = $tableContainerBackup.findColumn(1).clone();

	
	//init.
	resize('init', ifMobile, $browser, $tableContainerBackup);

	//Strike the resize
	$("#button").click(function(e) {
		e.preventDefault();
		var ifMobile = Modernizr.mq('only all and (max-width: 640px)');

		resize('resize', ifMobile, $browser, $tableContainerBackup);
	});

});

/*
$(window).resize(function() {
var ifMobile = Modernizr.mq('only all and (max-width: 640px)');

delay(function() {
resize('resize', ifMobile, $browser, $tableContainerBackup);
}, 100);
});
*/

//When you resize.
//params--------------------------------------------
//status:  string - init/resize
//device:  boolean - true = mobile, false = desktop
//browser: string - old/modern

function resize(status, device, browser, tableContainerBackup) {
	var browser = browser;

	var windowWidth = $(window).width();

	//minimum per table (COLUMN)
	var minWidthTable = 250;

	$('section > .tableContainer').each(function() {

		$_this = $(this);

		//#############

		//Define the carousel
		var sonySlider = $(this).data('sonyCarousel');

		//destroy the current slider instance.
		if (sonySlider)
			sonySlider.destroy();

		//Empty the container.
		$_this.empty();

		//#############

		// Number of element present in the viewport (visible element)
		var elemMinWidth = (windowWidth / minWidthTable);

		//get the number of column to display.
		nbElementByPage = Math.min(Math.max(Math.floor(elemMinWidth), 1), 4);

		//#############

		//get all cells
		var $myCells = tableContainerBackup.clone().find(".specsTable > .thead > .row > .cell, .specsTable > .tbody > .row > .cell");
		
		//nb total column
		var nbCol = tableContainerBackup.clone().find(".row:first .cell").length;

		//nb of table to show
		var nbTableToShow = nbCol / nbElementByPage;

		//#############
		//matrix
		var matrix = listToMatrix($myCells, nbCol);

		for (var i = 0; i < Math.ceil(nbTableToShow); i++) {//loop de tableau

			var $table = "";

			if (browser == 'modern') {
				//modern Browsers
				$table = $('<div class="specsTable" id="table' + i + '">');

				var $thead = $("<div class='thead'></div>");
				var $tbody = $("<div class='tbody'></div>");
			} else {
				//old Browsers
				$table = $('<table class="specsTable" id="table' + i + '">');

				var $thead = $("<thead class='thead'></thead>");
				var $tbody = $("<tbody class='tbody'></tbody>");
			}

			//loop in each row
			$(listToMatrix($myCells, nbCol)).each(function(index) {
				
				if (browser == 'modern') {
					var $curentRow = new $("<div class='row'></div>");
					var $firstCurentRow = new $("<div class='row'></div>");
				} else{
					var $curentRow = new $("<tr class='row'></tr>");
					var $firstCurentRow = new $("<tr class='row'></tr>");
				}

				if (index == 0) {
					$firstCurentRow.append(listToMatrix(this, nbElementByPage)[i]);
					$thead.append($firstCurentRow);
				} else {
					$curentRow.append(listToMatrix(this, nbElementByPage)[i]);
					$tbody.append($curentRow);
				}

				$table.append($thead, $tbody);
				$_this.append($table);
			});
		};

	})
	//Restart carousels
	$('.tableContainer').sonyCarousel();

	//Set the height.
	$('.tableContainer').each(function() {
		$(this).setContainerHeight();
	})
	//console.info(status, device, browser);
}

/*
 $(window).load(function() {

 $Layout = requestLayout();

 // When all images are loaded.
 $(window).load(function() {
 var sonySlider = $(".sonyCarousel").data('sonyCarousel');
 $('.table-mobile-tabs li').click(function() {
 var indexToSwap = $(this).index();
 sonySlider.goTo(indexToSwap - 1);
 });

 //When you resize.
 function resize(status) {
 var windowWidth = $(window).width();
 $Layout = requestLayout();

 $('table, .table').responsiveTable($Layout, status);

 //Set the height of each big table
 $('.tableContainer').each(function() {
 //mobile version
 var tallestMobile = $(this).find('.scContainer > div').maxHeight();
 //pc version
 var tallestPc = $(this).find('.specsTable').maxHeight();
 //get the biggest number..
 var tallest = Math.max(tallestMobile, tallestPc);
 $(this).height(tallest);

 $(this).children('.specsTable').children('.scOverflow').height(tallest);
 });

 // when the window is less or equal to 640px wide.
 if (windowWidth <= 640) {
 if ($('.table .cell.show').length <= 0) {
 //We need to add the class for each column
 $('.table .tbody .row').each(function() {
 $(this).children('.cell:nth-child(2)').addClass('show');
 })
 }
 }
 }

 });

 //########################################################//
 //Usage: $('table').responsiveTable();
 // params : desktop/mobile/ie7
 $.fn.responsiveTable = function(deviceLoaded, status) {

 //status = 'mobile', 'desktop' or 'ie7'
 //deviceLoaded = 'init' or 'resize'

 //Each table
 this.each(function() {
 //init the $table variable
 $table = $(this);

 //Apply when a table appear && IE7 is not the browser.
 if ($.browser.version != 7) {

 var head_col_count = $table.find('thead th').size();

 for ( i = 0; i <= head_col_count; i++) {
 var head_col_label = $table.find('thead th:nth-child(' + i + ')').text();

 $table.find('tr td:nth-child(' + i + ')').replaceWith(function() {
 return $('<div class="cell" data-label="' + head_col_label + '">').append($(this).contents());
 });
 }

 // Only apply to the big table. (not every table)
 if ($table.is('.specsTable')) {
 $tableBig = $(this);

 // Table title (hidden)
 var first_column_count = $tableBig.find('tbody tr th:first-child').size();
 for ( i = 1; i <= (first_column_count); i++) {
 var get_title = $tableBig.find('tbody tr:nth-child(' + i + ') th:first-child').text();
 j = 2;
 $tableBig.find('>tbody >tr').each(function() {
 $tableBig.find('>tbody > tr:nth-child(' + i + ') > .cell:nth-child(' + j + ')').prepend('<h2>' + get_title + '</h2>');
 j++;
 });
 }
 }

 // replaces table with <div class="table"> && add class "specsTable" when needed else it's considered as a small Table
 $table.replaceWith(function() {
 var tableKind = 'smallTable';
 if ($table.hasClass('specsTable')) {
 tableKind = 'specsTable';
 }
 return $('<div class="table ' + tableKind + ' rTable">').append($(this).contents());
 });

 //Add the tab navigation only for the mobile.
 if (ifMobile) {
 //Mobile navigation
 var $myUl = $('<ul class="table-mobile-tabs clearfix">');
 $('.tableContainer > .table.specsTable').each(function() {

 $(this).find('thead th').each(function() {
 $myUl.append('<li>' + $(this).text() + '</li>');
 });

 $(this).find("li:first-child").remove();
 $(this).before($myUl);
 });
 } else// check if we need to add some navigation for the desktop version.
 {
 //if there's more than one table inside the tableContainer..!
 $('.tableContainer').each(function() {
 if ($(this).children('.table').length > 1) {
 $(this).sonyCarousel({
 keyboardNavEnabled : true,
 navigateByClick : false,
 sliderDrag : false
 });
 $(this).addClass('desktopNav');
 $(this).append('<div class="desktopNav"><a href="#" class="prev">Previous</a><a href="#" class="next">Next</a></div>');

 var tableSlider = $(this).data('sonyCarousel');

 //Prev
 $(this).find('a.next').click(function() {
 tableSlider.next();
 });
 //Next
 $(this).find('a.prev').click(function() {
 tableSlider.prev();
 });

 //var tallestTable = $(this).find('.specsTable').maxHeight();
 //console.info(tallestTable);
 //$(this).children().height(tallestTable);

 }
 });
 }

 $('.table').each(function() {
 $table = $(this);

 //If mobile version **** Apply to the big table only.
 if (ifMobile && $table.hasClass('specsTable')) {

 //Number of column
 var col_count = $table.find('thead tr:first-child th').size();
 for ( i = 1; i <= (col_count - 1); i++) {
 //i = nb of column
 $table.append('<div class="cell cell' + i + '">');
 var row_count = $table.find('thead > tr, tbody > tr').size();
 for ( j = 1; j <= (row_count - 1); j++) {

 //j = nb of rows
 $table.find('tr').children(':nth-child(' + (i + 1) + ')').each(function() {
 $table.find('.cell' + i).append($(this).children());
 });
 }
 }

 $table.addClass('sonyCarousel');
 $table.find('tr, thead, tbody').remove();
 //remove the useless stuff.

 // Odd and Even Classes
 //$('.row:nth-child(even)').addClass('odd_rows');
 }
 });
 }

 // SWITCH CASE START //
 switch(deviceLoaded) {

 //DESKTOP ---
 case 'desktop':

 //execute the code here
 console.info('desktop');

 //Morph each table into a Div Table layout.
 $('.table').each(function() {
 $(this).tableToDiv();
 })

 break;

 //MOBILE ---
 case 'mobile':

 //execute the code here
 console.info('mobile');

 //Morph the table into a Div Table layout.
 $('.table').each(function() {
 $(this).tableToDiv();
 })

 break;

 //INTERNET EXPLORER 7 ---
 case 'ie7':
 //execute the code here
 console.info('ie7');

 //Add support for old browser (Adding class instead of morphing the table into a div table layout)
 $('table').addClass('table');
 $('thead').addClass('thead');
 $('tbody').addClass('tbody');
 $('tr').addClass('row');
 $('tr:nth-child(even)').addClass('odd_rows');
 $('th, td').addClass('cell');

 break;
 }
 // SWITCH CASE END //

 });
 // EACH TABLE END //

 return this;
 };
 */
