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
    delay(function(){
    	resize();
    }, 10);
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
	var isMqActivated = Modernizr.mq('only all');
	
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
		
		//Only apply to the big table. (not every )
		if ($table.is('.bigTable'))
		{
			$tableBig = $(this);
			//Spread the table of title (hidden)
			var first_column_count =  $tableBig.find('tbody tr th:first-child').size();
			for ( i=1; i <= (first_column_count) ; i++ )
			{
				var get_title = $tableBig.find('tbody tr:nth-child('+ i +') th:first-child').text();
				j=2;
				$tableBig.find('>tbody >tr').each(function(){
					$tableBig.find('>tbody > tr:nth-child('+i+') > .column:nth-child('+j+')').prepend('<h2>'+get_title+'</h2>');
					j++;
				});
			}
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
	$('.table').each(function()
	{
		$table = $(this);
		//If mobile version (desktop atm) **** Apply to the big table only.
		if (isMqActivated && $(this).hasClass('bigTable'))
		{
			$table = $(this);

			//Number of column
			var col_count = $table.find('thead tr:first-child th').size();
			for ( i=1; i <= (col_count-1); i++ )
			{
				//i = nb of column
				$table.append('<div class="column column'+i+'">');
				
				var row_count = $table.find('thead > tr, tbody > tr').size();
				for ( j=1; j <= (row_count-1); j++ )
				{
					//j = nb of rows
					$table.find('tr').children(':nth-child('+(i+1)+')').each(function(){
						$table.find('.column'+i).append($(this).children());
					});
				}
			}
			
			$table.addClass('sonyCarousel');
			$table.find('tr, thead, tbody').remove(); //remove the useless stuff.
			
			
			// Odd and Even Classes
			//$('.row:nth-child(even)').addClass('odd_rows');
		}
		else
		{
			//If desktop version (mobile atm)
			// replaces thead with <div class="thead">
			$table.find('thead').replaceWith(
				function(){
					return $('<div class="thead">').append($(this).contents());
				}
			);
			
			$table.find('tbody').replaceWith(
				function(){
					return $('<div class="tbody">').append($(this).contents());
				}
			);
			
			$table.find('tr').replaceWith(
				function(){
					return $('<div class="row">').append($(this).contents());
				}
			);    
			
			$table.find('th').replaceWith(
				function(){
					return $('<div class="column">').append($(this).contents());
				}
			);
			
			$table.find('td').replaceWith(
				function(){
					return $('<div class="column">').append($(this).contents());
				}
			);
		
			// Odd and Even Classes
			$table.find('.row:nth-child(even)').addClass('odd_rows');
		}
	});
	
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
