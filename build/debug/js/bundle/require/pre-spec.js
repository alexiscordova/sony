//Init all
var ifMobile = Modernizr.mq('only all and (max-width: 640px)');

//Temporary $browser variable.
if ($.browser.msie && parseInt($.browser.version, 10) === 7)
	var $browser = 'ie7';
else
	var $browser = 'modern';

//Global Array
var myArray = new Array();





//var mytables = $(".tableContainer .specsTable").clone();



$.fn.setContainerHeight = function() {
	tallest = $(this).find('.specsTable').maxHeight();
	$(this).height(tallest);
	$(this).children('.scOverflow').height(tallest);
}


/*********************************************************/
//Usage: $('.tableContainer').findColumn(index); //Morph a table into a div table layout.
$.fn.findColumn = function(index) {

	$column = $(this).find('.specsTable > .thead > .row > .cell:nth-child('+index+'), .specsTable > .tbody > .row > .cell:nth-child('+index+')');

	return $column;
}



/*********************************************************/
//Usage: $('table').tableToDiv(); //Morph a table into a div table layout.
$.fn.tableToDiv = function() {

	if ($browser == 'ie7') {
		//IE7
		$(this).each(function() {

			var tableClass = '';
			$table = $(this);

			if ($table.hasClass('specsTable'))
				tableClass = 'specsTable';
			else
				tableClass = 'smallTable';

			$table.addClass('table, ' + tableClass + '');
			$table.find('thead').addClass('thead');
			$table.find('tbody').addClass('tbody');
			$table.find('tr').addClass('row');
			$table.find('tr:nth-child(even)').addClass('odd_rows');
			$table.find('th, td').addClass('cell');
		});

	} else {
		//Modern

		$(this).each(function() {

			var tableClass = '';
			$table = $(this);

			if ($table.hasClass('specsTable'))
			{
				tableClass = 'specsTable';
				
				//keep in memory
				myArray.push($table);
			}
			else
				tableClass = 'smallTable';

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
				return $('<div class="cell">').append($(this).contents());
			});

			$table.find('td').replaceWith(function() {
				return $('<div class="cell">').append($(this).contents());
			});

			$table.replaceWith(function() {
				return $('<div class="' + tableClass + '">').append($(this).contents());
			});

			// Odd and Even Classes
			$table.find('.row:nth-child(even)').addClass('odd_rows');
		});
	}

	return this;
}

/*********************************************************/
//function to create a matrix
//Usage: $(listToMatrix(nbCells, nbCol));
function listToMatrix(list, elementsPerSubArray) {
    var matrix = [], i, k;

    for ( i = 0, k = -1; i < list.length; i++) {
        if (i % elementsPerSubArray === 0) {
            k++;
            matrix[k] = [];
        }

        matrix[k].push(list[i]);
    }

    return matrix;
}


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
//Usage: delay(function(){functionToCall();}, 10); //Set a delay.
var delay = (function() {
	var timer = 0;
	return function(callback, ms) {
		clearTimeout(timer);
		timer = setTimeout(callback, ms);
	};
})();

$('table').tableToDiv();



/*
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
*/



/*
$.fn.responsiveTableContainer = function() {
	//pre-module js here (Has to be before the sony gallery for the mobile version)
	this.each(function()
	{
		$tableContainer = $(this);

		//If we are in mobile view and there is more than one table.
		if (ifMobile && $tableContainer.children().length > 1)
		{
			//first table to insert the data.
			$firstTable = $tableContainer.find('table:first-child');
			
			$tableContainer.children('table').not(':first-child').each(function()
			{
				$currentTable = $(this);
				
				//column per table (not the first)
				var column_count = $currentTable.find('thead th').not(':first-child').size();
				for ( i=1; i <= column_count; i++ )
				{
					//append each th
					$firstTable.find('thead tr').append($currentTable.find('thead tr th').not(':first-child'));
					
					//rows
					var row_count = $currentTable.find('tbody td').size();
					for ( j=1; j <= row_count; j++ )
					{
						$firstTable.find('tbody > tr:nth-child('+j+')').append($currentTable.find('tbody > tr:nth-child('+j+') td'));
					}
				}
				
				$currentTable.remove();
			})
		}
	});
	
	return this;
}

$('.tableContainer').responsiveTableContainer();
*/