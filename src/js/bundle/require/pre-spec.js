var ifMobile = Modernizr.mq('only all and (max-width: 640px)');

//pre-module js here (Has to be before the sony gallery for the mobile version)

$('.tableContainer').each(function()
{
	$tableContainer = $(this);
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
