$Layout = requestLayout();

// When all images are loaded.
$(window).load(function() {
	var sonySlider = $(".sonyCarousel").data('sonyCarousel');
	$('.table-mobile-tabs li').click(function() {
		var indexToSwap = $(this).index();
		sonySlider.goTo(indexToSwap - 1);
	});

	//init.
	resize('init');
	
	//Strike the resize
	$(window).resize(function() {
		delay(function() {
			resize('resize');
		}, 100);
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
			var tallestPc = $(this).find('.bigTable').maxHeight();
			//get the biggest number..
			var tallest = Math.max(tallestMobile, tallestPc);
			$(this).height(tallest);

			$(this).children('.bigTable').children('.scOverflow').height(tallest);
		});

		// when the window is less or equal to 640px wide.
		if (windowWidth <= 640) {
			if ($('.table .column.show').length <= 0) {
				//We need to add the class for each column
				$('.table .tbody .row').each(function() {
					$(this).children('.column:nth-child(2)').addClass('show');
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
					return $('<div class="column" data-label="' + head_col_label + '">').append($(this).contents());
				});
			}

			// Only apply to the big table. (not every table)
			if ($table.is('.bigTable')) {
				$tableBig = $(this);

				// Table title (hidden)
				var first_column_count = $tableBig.find('tbody tr th:first-child').size();
				for ( i = 1; i <= (first_column_count); i++) {
					var get_title = $tableBig.find('tbody tr:nth-child(' + i + ') th:first-child').text();
					j = 2;
					$tableBig.find('>tbody >tr').each(function() {
						$tableBig.find('>tbody > tr:nth-child(' + i + ') > .column:nth-child(' + j + ')').prepend('<h2>' + get_title + '</h2>');
						j++;
					});
				}
			}

			// replaces table with <div class="table"> && add class "bigTable" when needed else it's considered as a small Table
			$table.replaceWith(function() {
				var tableKind = 'smallTable';
				if ($table.hasClass('bigTable')) {
					tableKind = 'bigTable';
				}
				return $('<div class="table ' + tableKind + ' rTable">').append($(this).contents());
			});

			//Add the tab navigation only for the mobile.
			if (ifMobile) {
				//Mobile navigation
				var $myUl = $('<ul class="table-mobile-tabs clearfix">');
				$('.tableContainer > .table.bigTable').each(function() {

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

						//var tallestTable = $(this).find('.bigTable').maxHeight();
						//console.info(tallestTable);
						//$(this).children().height(tallestTable);

					}
				});
			}

			$('.table').each(function() {
				$table = $(this);

				//If mobile version **** Apply to the big table only.
				if (ifMobile && $table.hasClass('bigTable')) {

					//Number of column
					var col_count = $table.find('thead tr:first-child th').size();
					for ( i = 1; i <= (col_count - 1); i++) {
						//i = nb of column
						$table.append('<div class="column column' + i + '">');
						var row_count = $table.find('thead > tr, tbody > tr').size();
						for ( j = 1; j <= (row_count - 1); j++) {

							//j = nb of rows
							$table.find('tr').children(':nth-child(' + (i + 1) + ')').each(function() {
								$table.find('.column' + i).append($(this).children());
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
				$('th, td').addClass('column');

				break;
		}
		// SWITCH CASE END //

	});
	// EACH TABLE END //

	return this;
};






/*********************************************************/
//Usage: $('div').tableToDiv(); //Morph a table into a div table layout.
$.fn.tableToDiv = function() {
	$table = $(this);

	//This line is only if we want to use it from another module, to get the full table working.
	$table.find('table').replaceWith(function() {
		return $('<div class="table">').append($(this).contents());
	});

	$table.find('thead').replaceWith(function() {
		return $('<div class="thead">').append($(this).contents());
	});

	$table.find('tbody').replaceWith(function() {
		return $('<div class="tbody">').append($(this).contents());
	});

	$table.find('tr').replaceWith(function() {
		return $('<div class="row">').append($(this).contents());
	});

	$table.find('th').replaceWith(function() {
		return $('<div class="column">').append($(this).contents());
	});

	$table.find('td').replaceWith(function() {
		return $('<div class="column">').append($(this).contents());
	});

	// Odd and Even Classes
	$table.find('.row:nth-child(even)').addClass('odd_rows');

	return this;
};

/*********************************************************/
//Usage: var tallest = $('div').maxHeight(); // Returns the height of the tallest div.
$.fn.maxHeight = function() {
	var max = 0;
	this.each(function() {
		max = Math.max(max, $(this).height());
	});
	return max;
};

/*********************************************************/
//Usage: requestLayout();
function requestLayout() {
	var $Layout = '';
	
	//Define the kind of layout to use.
	if ($.browser.version == 7)
		$layout = 'ie7';
	else if (ifMobile)
		$Layout = 'mobile';
	else if (!ifMobile)
		$Layout = 'desktop';
	else
		$Layout = '';

	return $Layout;
};

/*********************************************************/
//Usage: delay(function(){functionToCall();}, 10); //Set a delay.
var delay = (function() {
	var timer = 0;
	return function(callback, ms) {
		clearTimeout(timer);
		timer = setTimeout(callback, ms);
	};
})();