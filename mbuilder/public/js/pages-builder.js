var mb = {};

mb.isSuperModule = false;
mb.moduleName = "";
mb.modulePath = ""
mb.moduleData = {};
mb.subModules = [];
mb.modulePaths = [];

$(document).ready(function () {

  /** Add module block **/
  $("#add-module").click(function (e) {

    var _this = this, modulesContainer = $("#main-forms-container"), moduleGroup =
    /* @formatter:off */
                            '<div class="clearfix form-inline row">'+
                            '    <div class="control-group span4">'+
                            '        <label>Module</label>'+
                            '        <select class="module_select">'+
                            '           <option class="hold"></option>'+
                            '        </select>'+
                            '   </div>'+
                    
                            '    <div class="data_control control-group span4">'+
                            '        <label>Data</label>'+
                            '        <select class="data_select"></select>'+
                            '     </div>'+
                            '</div>';
         /* @formatter:on */

    $(modulesContainer).append(moduleGroup).change(function (elem) {
      onModuleSelect(elem)
    });

    getModuleName();

  });

});

function getModuleName (selectedModule) {
  $.ajax({
    url : "/mnames"
  }).done(function (res) {
      
    mb.modulePaths = JSON.parse(res);
    
    $.each(mb.modulePaths, function (i, e) {
        
      $('.module_select').append("<option value=" + e + ">" + e.replace(/.html(.eco|.hb)/g, '') + "</option>")
    })
    
    
  });
}

function onModuleSelect (elem) {

  var moduleContainer = $(elem.target).parents(".form-inline"), 
  dataControl = $(moduleContainer).find(".data_control"), 
  dataSelect = $(moduleContainer).find(".data_select");
  mb.modulePath = elem.target.value.replace (/((module_)|(.html(.eco|.hb)))/g, '');
  mb.moduleName = mb.modulePath.replace(/.html(.eco|.hb)/g, '');

  $(dataSelect).show();

  $.ajax({
    url : "/dnames",
    data : {
      mname : mb.moduleName
    }
  }).done(function (res) {
    var dnames = JSON.parse(res);

    if (mb.isSuperModule) {

    }

    $(dataControl).toggle(dnames.length > 0);
    $(dataControl).toggleClass('disabled', dnames.length == 0);
    $(dataSelect).html("");
    
    $.each (dnames, function (i, e) {
        $ (dataSelect).append ("<option value=" + mb.moduleName + "/" + e + ">" + e + "</option>")
        if (e == "default.json") {
          $ (dataSelect).val (mb.moduleName + "/" + e);
        }
      })
      
      $ (dataSelect).trigger ("change");
      
    var temp;
  });

}

