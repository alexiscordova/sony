var mb = {}

mb.isSuperModule = false;
mb.moduleName = "";
mb.modulePath = ""
mb.moduleData = {};
mb.subModules = [];
mb.modulePaths = [];



$(document).ready(function(){	
	$('#data_control, #main_data_edit, #buttons, #submodule_section').hide();
	
	//turn text area into a codemirror editor
	mb.mainCodeEditor = CodeMirror(
		function(elt) {
	  		mainEditor.parentNode.replaceChild(elt, mainEditor);
		}, {
			value: mainEditor.value, 
			lineNumbers: true,
	        matchBrackets: true
        }
    );
        
    mb.popupCodeEditor = CodeMirror(
    	function(elt) {
    		popupEditor.parentNode.replaceChild(elt, popupEditor);
		}, {
			value: popupEditor.value, 
			lineNumbers: true,
        	matchBrackets: true
        }
    );
	
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
			$('#data_control, #main_data_edit, #buttons, #submodule_section').hide();
			return;
		}
		$('#module_select .hold').remove();
		mb.modulePath = e.target.value;
		mb.moduleName  = mb.modulePath.replace(/.html(.eco|.hb)/g,'');
		
		$('#data_control').show();
		//get list of associated data.json path names
		$.ajax({
		  url: "/dnames",
		  data: {mname: mb.moduleName }
		}).done(function(res) { 
			var dnames = JSON.parse(res);
			$('#data_control, #main_data_edit, #submodule_section, #buttons').toggle(dnames.length >0);
			$("#build, #save_submit button, #save_as button").toggleClass('disabled', dnames.length ==0);
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
		$('#submodule_list').html("");
		mb.mainCodeEditor.setValue("");
		$('#submodule_section').find('.add-me').unbind('click');
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
					addSub(e.type, e.data);
					
					//init sortable list
       				$( "#submodule_list" ).sortable().disableSelection();
				})
				$('#submodule_section').find('.add-me').bind('click', function(e){
					addSub();
				})
			}
			//add the remaining data to the module edit text field
			mb.mainCodeEditor.setValue(JSON.stringify(mb.moduleData, null, '    '))
			mb.mainCodeEditor.change();
			$('#edit_box input:first, #save_as_box input:first').val($('#data_select').val())
		});
	})
	
	
	//add new row to submodules
	
	var addSub = function(modname, dataname){
		//
		var sub = $('<li><div class="clearfix form-inline row"></div></li>');
		var form = sub.find('.form-inline')
		form.append('<div class="control-group span4"><label>Module</label> <select class="submodule-select"><option class="hold"></option></select></div>');
		form.append('<div class="control-group span4"><label>Data</label> <select class="submodule-data-select"></select></div>')
		form.append('<div class="span1"><button class="btn btn-block btn-mini edit-me" data-toggle="modal" data-target="#edit_box">Edit</button></div>');
		form.append('<div class="span1"><button class="btn btn-block btn-mini remove-me">Remove</button></div>');
		var subselect = sub.find('.submodule-select');
		var dataselect = sub.find('.submodule-data-select')
				
		$.each(mb.modulePaths, function(i,e){
			subselect.append("<option value="+e+">"+e.replace(/.html(.eco|.hb)/g,'')+"</option>");
		})
		
		//remove button functionality
		form.find('.remove-me').bind('click',function(e){
			sub.remove();
		})	
		
		//edit button functionality
		form.find('.edit-me').bind('click', function(e){
			var p = dataselect.val();
			$('#edit_box .modal-body input').val(p);	
			$.ajax({
			  url: "/getjson",
			  data: {path: p}
			}).done(function(res) {
				mb.popupCodeEditor.setValue(JSON.stringify(JSON.parse(res), null, '    '));
			})
		})				
		
		//get list of data.json path names for each submodule:
		subselect.change(function(e){
			subselect.find('.hold').remove();
			var n = e.target.value.replace(/((module_)|(.html(.eco|.hb)))/g, '');
			$.ajax({
	 			url: "/dnames",
	  			data: {mname: n }
			}).done(function(res){
				var d = JSON.parse(res);
				sub.find('.control-group:nth-child(2), .span1').toggle(d.length >0);
				$("#build, #save_submit button, #save_as button").toggleClass('disabled', d.length ==0);
				dataselect.html("");
				$.each(d, function(i,e){
					dataselect.append("<option value="+n+"/"+e+">"+e+"</option>")				
				})
				//if dataname is defined select it
				!dataname || dataselect.val(dataname);
			})
		})
		!modname || subselect.val(modname).trigger('change');
		
		$("#build, #save_submit button, #save_as button").addClass('disabled');
		$('#submodule_list').append(sub);
	}
	
	
	
	//on code edit run JSLINT to test for valid json
	mb.mainCodeEditor.on('change',function(){
		var res = JSLINT(mb.mainCodeEditor.getValue())
		$('#main_data_edit').toggleClass('error', !res);
	});
	mb.popupCodeEditor.on('change', function(){
		var res = JSLINT(mb.popupCodeEditor.getValue());
		$('.modal-body').toggleClass('error', !res);
	})
	
	//when you pop up the save as dialog focus the filename
	$('#edit_box, #save_as_box').modal().modal('hide').on('shown', function(e){
		$(e.target).find('input:first').focus();
	});
	
	//when you hit save submit the current filename
	$('#save_submit').bind('click', function(e){
		if($('#data_text').hasClass('error')){
			return;
		} else{
			doSave($('#data_select').val(), mb.mainCodeEditor.getValue(), mb.isSuperModule);
		}
	})

	//when you hit save as submit the new filename
	$('#save_as_submit').bind('click', function(e){
		if($('#main_data_edit').hasClass('error')){
			return;
		}else{
			doSave($('#save_as_box input:first').val(), mb.mainCodeEditor.getValue(), mb.isSuperModule);
		}
	})
	
	//when you hit save in the edit submodule popup
	$('#edit_submit').bind('click', function(e){
		if($('.modal-body').hasClass('error')){
			return;
		}else{
			doSave($('#edit_box input:first').val(), mb.popupCodeEditor.getValue(), false);
		}
		
	})
	
	mb.updateSubs = function(){
		mb.subModules = [];
		$.each($('#submodule_list li'), function(i,e){
			sub = $(e);
			var subselect = sub.find('.submodule-select');
			var dataselect = sub.find('.submodule-data-select')
			
			mb.subModules.push({type: subselect.val(), data:dataselect.val()});
		})
	}
	
	//saves the current contents of the text area to the file path
	var doSave = function(path, data, issuper){
		//if its a supermodule re-add supermodule array
		if(issuper){
			var d = JSON.parse(data);
			mb.updateSubs();
			d.submodules = mb.subModules;
			data = JSON.stringify(d, null, '    ');
		}
			
		$.ajax({
		  url: "/savejson",
		  data: {path: path, data: data}
		}).done(function(res) { 
			//show save success message
			if($('.alert').length >0){
				$('.alert').remove();
			}
			$('body').prepend('<div id="save_success" class="alert alert-success">Success: File Saved!<button type="button" class="close" data-dismiss="alert">×</button></div>');
			$('#save_success').alert();
			var v = $('#data_select').val()
			$('#module_select').trigger('change');
			setTimeout(function(){
				$('#data_select option[value="'+v+'"]').prop('selected', true);
				$('#data_select').trigger('change');
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


