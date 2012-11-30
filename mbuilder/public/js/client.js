
$(document).ready(function(){
	$("#build").bind('click', function(e){
	
	})
	$('#data_control').hide();
	
	$.ajax({
	  url: "/mnames"
	}).done(function(res) { 
		var mnames = JSON.parse(res);
		$.each(mnames, function(i,e){
			$('#module_select').append("<option value="+e+">"+e+"</option>")
		})
		$('#module_select').trigger('change');
	});
	
	
	
	$('#module_select').bind('change', function(e){
		if(!e.target.value){
			$('#data_control').hide();
			return;
		}
		$('#data_control').show();
		$.ajax({
		  url: "/mdata",
		  data: {mname: e.target.value}
		}).done(function(res) { 
			var mnames = JSON.parse(res);
			mnames.length >0 || $('#data_control').hide();
			$('#data_select').html("");
			$.each(mnames, function(i,e){
				$('#data_select').append("<option value="+e+">"+e+"</option>")
			})
			
		});
	})

})


