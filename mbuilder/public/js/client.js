var mb = {}

mb.isSuperModule = false;
mb.moduleName = "";
mb.modulePath = ""
mb.moduleData = {};
mb.subModules = [];
mb.modulePaths = [];



$(document).ready(function(){	
	$('#data_control, #main_data_edit, #build, #submodule_section').hide();
	
	// loads module names
	$.ajax({
	  url: "/mnames"
	}).done(function(res) { 
		mb.modulePaths = JSON.parse(res);
		$.each(mb.modulePaths, function(i,e){
			$('#module_select').append("<option value="+e+">"+e.replace(/.html(.eco|.hb)/g,'')+"</option>")
		})
		$('#module_select').trigger('change');
	});
	
	
	// on module name select
	$('#module_select').change(function(e){
		if(!e.target.value){
			$('#data_control, #main_data_edit, #build, #submodule_section').hide();
			return;
		}
		mb.modulePath = e.target.value;
		mb.moduleName  = mb.modulePath.replace(/.html(.eco|.hb)/g,'');
		
		$('#data_control').show();
		//get list of associated data.json path names
		$.ajax({
		  url: "/dnames",
		  data: {mname: mb.moduleName }
		}).done(function(res) { 
			var dnames = JSON.parse(res);
			dnames.length >0 || $('#data_control, #main_data_edit, #submodule_section').hide();
			$('#data_select').html("");
			$.each(dnames, function(i,e){
				$('#data_select').append("<option value="+mb.moduleName+"/"+e+">"+e+"</option>")
				if(e == "default.json"){
					$('#data_select').val(mb.moduleName+"/"+e);
				}
			})
			$('#data_select').trigger('change');
		});
		
	})
	
	//on data select
	$('#data_select').change(function(e){
		$('#main_data_edit textarea, #submodule_list').html("");
		$('#submodule_section').hide();
		mb.subModules = null;
		mb.isSuperModule = false;
		
		//load json file
		$.ajax({
		  url: "/getjson",
		  data: {path: e.target.value}
		}).done(function(res) { 
			//parse json 
			mb.moduleData = JSON.parse(res);
			
			//if it contains submodules
			mb.subModules = mb.moduleData.submodules
			if(mb.subModules && mb.subModules.length >0){
				mb.isSuperModule = true;
				//show submodule editor
				$('#submodule_section').show();
				//remove submodules from the supermodule data (for now)
				mb.moduleData.submodules = undefined;				
				$.each(mb.subModules, function(i,e){
					//add each submodule to the edit list
					
					
					//TODO change the markup to make this dropdown lists and an edit button
					//
					var sub = $('<li><div class="clearfix form-inline row"><div class="control-group span4"><label>Module</label> <select class="submodule-select"></select></div><div class="control-group span4"><label>Data</label> <select class="submodule-data-select"></select></div></div></li>');
					$.each(mb.modulePaths, function(i,e){
						sub.find('.submodule-select').append("<option value="+e+">"+e.replace(/.html(.eco|.hb)/g,'')+"</option>");
					})
					sub.find('.form-inline').append('<div class="span1"><button class="btn btn-block btn-mini" data-toggle="modal" data-target="#edit_box">Edit</button></div>');
					sub.find('.form-inline').append('<div class="span1"><button class="btn btn-block btn-mini">Remove</button></div>');
					sub.find('.submodule-select').val(e.type);
					
					
					$('#submodule_list').append(sub);
				})
			}
			//add the remaining data to the module edit text field
			$('#main_data_edit textarea').val(JSON.stringify(mb.moduleData, null, '    '));
			$('#main_data_edit textarea').trigger('keyup');
			$('#build, #main_data_edit').show();
			$('#edit_box input:first, #save_as_box input:first').val($('#data_select').val())
		});
	})
	
	
	
	
	//on textarea edit run JSLINT to test for valid json
	$('#main_data_edit textarea').bind('keyup',function(e){
		var res = JSLINT($('#main_data_edit textarea').val())
		$('#main_data_edit textarea').toggleClass('error', !res);
	})
	
	//when you pop up the save as dialog focus the filename
	$('#edit_box, #save_as_box').modal().modal('hide').on('shown', function(e){
		$(e.target).find('input')[0].focus();
	});
	
	//when you hit save submit the current filename
	$('#save_submit').bind('click', function(e){
		if($('#data_text').hasClass('error')){
			return;
		} else{
			doSave($('#data_select').val());
		}
	})

	
	//when you hit save as submit the new filename
	$('#save_as_submit').bind('click', function(e){
		if($('#main_data_edit textarea').hasClass('error')){
			return;
		}else{
			doSave($('#save_as_box input:first').val());
		}
		
	})
	
	//saves the current contents of the text area to the file path
	var doSave = function(path){
		
		var datastring = $('#main_data_edit textarea').val()
		
		//if its a supermodule re-add supermodule array
		if(mb.isSuperModule){
			var d = JSON.parse(datastring);
			d.submodules = mb.subModules;
			datastring = JSON.stringify(d, null, '    ');
		}
			
		$.ajax({
		  url: "/savejson",
		  data: {path: path, data:datastring}
		}).done(function(res) { 
			//show save success message
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
			$('#edit_box, #save_as_box').modal('hide');	
		});
	}

	// when you hit build run the generate script
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

	//turn build into a bootstrap button
	$("#build").button();
	

})


