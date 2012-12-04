
$(document).ready(function(){	
	$('#data_control, #data_text, #build').hide();
	
	$.ajax({
	  url: "/mnames"
	}).done(function(res) { 
		var mnames = JSON.parse(res);
		$.each(mnames, function(i,e){
			$('#module_select').append("<option value="+e+">"+e.replace(/.html(.eco|.hb)/g,'')+"</option>")
		})
		$('#module_select').trigger('change');
	});
	
	
	
	$('#module_select').change(function(e){
		if(!e.target.value){
			$('#data_control, #data_text, #build').hide();
			return;
		}
		var mname = e.target.value.replace(/.html(.eco|.hb)/g,'');
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
			$('#save_as_name').val($('#data_select').val())
		});
	})
	
	
	$('#data_text textarea').bind('keyup',function(e){
		var res = JSLINT($('#data_text textarea').val())
		$('#data_text').toggleClass('error', !res);
	})
	
	$('#save_as_box').modal().modal('hide').on('shown', function(e){
		$('#save_as_name').focus();
	});
	
	$('#save_submit').bind('click', function(e){
		if($('#data_text').hasClass('error')){
			return;
		} else{
			doSave($('#data_select').val());
		}
	})
	
	$('#save_as_submit').bind('click', function(e){
		if($('#data_text').hasClass('error')){
			return;
		}else{
			doSave($('#save_as_name').val());
		}
		
	})
	var doSave = function(path){
		$.ajax({
		  url: "/savejson",
		  data: {path: path, data:$('#data_text textarea').val()}
		}).done(function(res) { 
			if($('.alert').length >0){
				$('.alert').remove();
			}
			$('body').prepend('<div id="save_success" class="alert alert-success">Success: File Saved!<button type="button" class="close" data-dismiss="alert">×</button></div>');
			$('#save_success').alert();
			var v = $('#data_select').val()
			$('#module_select').trigger('change')
			setTimeout(function(){
				$('#data_select option[value="'+v+'"]').prop('selected', true);
			},200)
			$('#save_as_box').modal('hide');	
		});
	}

	$("#build").bind('click', function(e){
		$("#build").button('loading');
		
		$.ajax({
		  url: "/generate",
		  data: {module: $('#module_select').val(), data:$('#data_select').val()}
		}).done(function(res) { 
			if(res != "false"){
				$("#build").button('reset');
				if($('.alert').length >0){
					$('.alert').remove();
				}
				$('body').prepend('<div id="build_success" class="alert alert-success">Success! Check it out here: <a target="_blank" href="http://'+ res +'">'+ res+'</a><button type="button" class="close" data-dismiss="alert">×</button></div>');
				$('#build_success').alert();
			}else{
				if($('.alert').length >0){
					$('.alert').remove();
				}
				$('body').prepend('<div id="build_success" class="alert alert-success">ERROR: Build Failed!<button type="button" class="close" data-dismiss="alert">×</button></div>');
				$('#build_success').alert();
			}
			
		});
		  
	})

	$("#build").button();

})


