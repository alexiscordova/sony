//Init all
var ifMobile = Modernizr.mq('only all and (max-width: 640px)');

//Temporary $browser variable.
if ($.browser.msie && parseInt($.browser.version, 10) === 7)
	var $browser = 'old';
else
	var $browser = 'modern';

//Global Array
var myArray = new Array();

//var mytables = $(".tableContainer .specsTable").clone();



//Usage: $('.tableContainer').setContainerHeight();
$.fn.setContainerHeight = function() {
	tallest = $(this).find('.specsTable').maxHeight();
	$(this).height(tallest);
	$(this).children('.scOverflow').height(tallest);
}

/*********************************************************/
//Usage: $('.tableContainer').findColumn(index); //Morph a table into a div table layout.
$.fn.findColumn = function(index) {

	$column = $(this).find('.specsTable > .thead > .specRow > .specCell:nth-child('+index+'), .specsTable > .tbody > .specRow > .specCell:nth-child('+index+')');

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
			$table.find('tr').addClass('specRow');
			$table.find('tr:nth-child(even)').addClass('odd_rows');
			$table.find('th, td').addClass('specCell');
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
				return $('<div class="specRow">').append($(this).contents());
			});

			$table.find('th').replaceWith(function() {
				return $('<div class="specCell">').append($(this).contents());
			});

			$table.find('td').replaceWith(function() {
				getClass = '';
				
				if ($(this).attr('class'))
					getClass = $(this).attr('class');
				
				return $('<div class="specCell '+getClass+'">').append($(this).contents());
			});

			$table.replaceWith(function() {
				return $('<div class="' + tableClass + '">').append($(this).contents());
			});

			// Odd and Even Classes
			$table.find('.specRow:nth-child(even)').addClass('odd_rows');
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

