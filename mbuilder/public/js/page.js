var mb = {}

mb.isSuperModule = false;
mb.moduleName = "";
mb.pageName = "";
mb.modulePath = ""
mb.moduleData = {};
mb.subModules = [];
mb.modulePaths = [];
mb.pagePaths = [];



$(document).ready(function(){	
	$('#data_control, #main_data_edit, #build, #submodule_section').hide();
	
	// loads module names
	$.ajax({
	  url: "/pnames",
	  dataType : "json"
	}).done(function(res) { 
		$.each(res, function(i,e){
			$('#page_select').append("<option value="+e+">"+e.replace(/.html(.eco|.hb)/g,'')+"</option>")
		})
		$('#page_select').trigger('change');
	});
	
})


