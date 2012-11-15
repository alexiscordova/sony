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
	
	function resize()
	{
		var windowWidth = $(window).width();
		
		// when the window is less or equal to 640px wide.
		if (windowWidth <= 640)
		{
			
			if ($('.table .column.show').length <= 0)
			{
				//We need to add the class for each column
				$('.table tbody .row').each(function()
				{
					$(this).children('.column:nth-child(2)').addClass('show');
				})
			}
		}
	}
});


//Apply when a table appear.
if ($('table').length > 0)
{
	// counts total number of td in a head so that we can can use it for label extraction
	var head_col_count =  $('thead th').size();

	for ( i=0; i <= head_col_count; i++ )
	{	
		var head_col_label = $('thead th:nth-child('+ i +')').text();
		
		$('tr td:nth-child('+ i +')').replaceWith(
				function(){
						return $('<div class="column" data-label="'+ head_col_label +'">').append($(this).contents());
				}
		);
	}
	var first_column_count =  $('tbody tr th:first-child').size();
	for ( i=1; i <= (first_column_count) ; i++ )
	{
		var get_title = $('tbody tr:nth-child('+ i +') th:first-child').text();
		
		j=2;
		$('tbody tr').each(function(){
			$('tbody tr:nth-child('+i+') .column:nth-child('+j+')').prepend('<h2>'+get_title+'</h2>');
			j++;
		});
	}

	// replaces table with <div class="table">
	$('table').replaceWith(
			function(){
					return $('<div class="table">').append($(this).contents());
			}
	);
	
	var $myUl = $('<ul class="table-mobile-tabs clearfix">');
	$('thead th').each(function()
	{
		$myUl.append('<li>'+$(this).text()+'</li>');
	});
	$myUl.find("li:first-child").remove(); 
	$('.table').before($myUl);	

	// replaces thead with <div class="table-head">
	$('thead').replaceWith(
			function(){
					return $('<div class="table-head">').append($(this).contents());
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

	// Odd and Even Classes
	$('.row:nth-child(even)').addClass('odd_rows');
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
