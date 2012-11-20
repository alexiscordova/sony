$(document).ready(function(){
	$('.table-mobile-tabs li').click(function(){
		var indexToSwap = $(this).index();
		console.info(indexToSwap);
	});
});

$(window).load(function()
{
	//init.
	resize();
	
	$(window).resize(function(){
    delay(function(){resize();}, 10);
	});
	
	//When you resize.
	function resize()
	{
		var windowWidth = $(window).width();
		
		// when the window is less or equal to 640px wide.
		if (windowWidth <= 640)
		{
			if ($('.table .column.show').length <= 0)
			{
				//We need to add the class for each column
				$('.table .tbody .row').each(function()
				{
					$(this).children('.column:nth-child(2)').addClass('show');
				})
			}
		}
	}
});


//Apply when a table appear && IE7 is not the browser.
if ($('table').length > 0 && $.browser.version != 7)
{
	$('table').each(function()
	{
		//init.
		$table = $(this);
		
		var head_col_count = $table.find('thead th').size();
		for ( i=0; i <= head_col_count; i++ )
		{
			var head_col_label = $table.find('thead th:nth-child('+ i +')').text();
			
			$table.find('tr td:nth-child('+ i +')').replaceWith(
				function(){
						return $('<div class="column" data-label="'+ head_col_label +'">').append($(this).contents());
				}
			);
		}
		
		//Spread the table of title (hidden)
		var first_column_count =  $table.find('tbody tr th:first-child').size();
		for ( i=1; i <= (first_column_count) ; i++ )
		{
			var get_title = $table.find('tbody tr:nth-child('+ i +') th:first-child').text();
			
			j=2;
			$table.find('tbody tr').each(function(){
				$table.find('tbody tr:nth-child('+i+') .column:nth-child('+j+')').prepend('<h2>'+get_title+'</h2>');
				j++;
			});
		}
		
		// replaces table with <div class="table"> && add class "bigTable" when needed else it's considered as a small Table
		$(this).replaceWith(
			function(){
				var tableKind = 'smallTable';
				if ($table.hasClass('bigTable')){tableKind = 'bigTable';}
					return $('<div class="table '+tableKind+' rTable">').append($(this).contents());
			}
		);
	});
	
	//Mobile navigation
	/*
	var $myUl = $('<ul class="table-mobile-tabs clearfix">');
	$('table.bigTable').each(function()
	{
		$(this).find('thead th').each(function()
		{
			$myUl.append('<li>'+$(this).text()+'</li>');
		});
		
		$(this).find("li:first-child").remove(); 
		$(this).before($myUl);
	});
	*/
	
	// replaces thead with <div class="thead">
	$('thead').replaceWith(
			function(){
					return $('<div class="thead">').append($(this).contents());
			}
	);
	
	$('tbody').replaceWith(
			function(){
					return $('<div class="tbody">').append($(this).contents());
			}
	);
	
	// replaces tr with <div class="row">
	$('tr').replaceWith(
			function(){
					return $('<div class="row">').append($(this).contents());
			}
	);    
	// replaces th with <div class="column">
	$('th').replaceWith(
			function(){
					return $('<div class="column">').append($(this).contents());
			}
	);
	
	// replaces th with <div class="column">
	$('td').replaceWith(
			function(){
					return $('<div class="column">').append($(this).contents());
			}
	);

	// Odd and Even Classes
	$('.row:nth-child(even)').addClass('odd_rows');
	
}else if($.browser.version == 7)
{
	//IE7 Table Layout css.
	$('table').addClass('table');
	$('thead').addClass('thead');
	$('tbody').addClass('tbody');
	$('tr').addClass('row');
	$('tr:nth-child(even)').addClass('odd_rows');
	$('th, td').addClass('column');
}
	
/*********************************************************/
//Usage: var tallest = $('div').maxHeight(); // Returns the height of the tallest div.
$.fn.maxHeight = function() 
{
	var max = 0;
	this.each(function() {
		max = Math.max( max, $(this).height() );
	});
	return max;
};

/*********************************************************/
//Usage: delay(function(){functionToCall();}, 10); //Set a delay.
var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();
