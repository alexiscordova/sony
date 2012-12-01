
$(document).ready(function(){
	$("#build").bind('click', function(e){
	
	})
	
	$('#data_control, #data_text, #build').hide();
	
	$.ajax({
	  url: "/mnames"
	}).done(function(res) { 
		var mnames = JSON.parse(res);
		$.each(mnames, function(i,e){
			$('#module_select').append("<option value="+e+">"+e+"</option>")
		})
		$('#module_select').trigger('change');
	});
	
	
	
	$('#module_select').change(function(e){
		if(!e.target.value){
			$('#data_control, #data_text, #build').hide();
			return;
		}
		var mname = e.target.value;
		$('#data_control').show();
		$.ajax({
		  url: "/dnames",
		  data: {mname: mname}
		}).done(function(res) { 
			var mnames = JSON.parse(res);
			mnames.length >0 || $('#data_control, #data_text').hide();
			$('#data_select').html("<option></option>");
			$.each(mnames, function(i,e){
				$('#data_select').append("<option value="+mname+"/"+e+">"+e+"</option>")
			})
			
		});
	})
	
	$('#data_select').change(function(e){
		$('#data_text textarea').html("");
		
		$.ajax({
		  url: "/getjson",
		  data: {path: e.target.value}
		}).done(function(res) { 
			$('#data_text textarea').val(JSON.stringify(JSON.parse(res), null, '    '));
			$('#data_text textarea').trigger('keyup');
			$('#build, #data_text').show();
		});
	})
	
	
	$('#data_text textarea').bind('keyup',function(e){
		var res = JSLINT($('#data_text textarea').val())
		$('#data_text').toggleClass('error', !res);
	})

})


