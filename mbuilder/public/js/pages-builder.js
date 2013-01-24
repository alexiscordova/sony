var moduleGroupContainer = $('<li><div class="main-module-container">'), moduleGroup = $(
/* @formatter:off */
    ' <div class="clearfix form-inline row modContainer ui-corner-all ui-state-default">' +
    '   <div class="control-group span4">' + 
    '     <label>Module</label>' + 
    '     <select class="module_select empty"  name="module">' + 
    '       <option class="hold">Select a module</option>' +     
    '     </select>' + 
    '   </div>' + 
    '   <div class="data_control control-group span4">' + 
    '     <label>Data</label>' + 
    '     <select class="data_select" name="moduleData"></select>' + 
    '   </div>' + 
    ' </div>'
/* @formatter:on */
), submodContainer = $(
/* @formatter:off */
    '<div class="clearfix form-inline submodContainer">' +
    '<h4>Submodules</h4>' +
    '</div>'
/* @formatter:on */
);

var mainModuleContainer, subModuleContainer, moduleSelected, selectedElem;

var mb = {};

mb.moduleName = "";
mb.modulePath = "";
mb.moduleData = {};
mb.subModules = [];
mb.modulePaths = [];
mb.moduleList = [];
mb.moduleDataList = [];

$(document).ready(function() {

  $.ajax({
    url : '/mnames'
  }).done(function(res) {

    mb.modulePaths = JSON.parse(res);

    $.each(mb.modulePaths, function(i, e) {
      // TEMPORARY : remove old template from list
      if (e.indexOf('.jade') !== -1) {

        var moduleName = e.replace(/.html(.eco|.hb|.jade)/g, '');
        // create a list of all module
        mb.moduleList.push({
          name : moduleName,
          value : e
        });

      }
    });
    createModuleContainer();
  });

  /** Add module block **/
  $("#add-module").button().click(function(e) {

    createModuleContainer(this);

  });

  $("#dialog-form").dialog({
    autoOpen : false,
    height : 250,
    width : 400,
    resizable : false,
    dialogClass : 'pageBuilderPop',
    modal : true,
    buttons : {
      "Generate a page" : function() {
        var bValid = true;
        // allFields.removeClass("ui-state-error");
        bValid = checkLength($('#name'), "fileName", 3, 16);

        if (bValid) {
          console.log('go');
          $('#fileName').val($('#name').val());
          
          $(this).dialog("close");
          buildPage();
        }
      },
      Cancel : function() {
        $(this).dialog("close");
      }

    },
    close : function() {
      // allFields.val("").removeClass("ui-state-error");
    }

  });

});
/** Document Ready end here**/

/*************************************
 *      Call to web services         *
 *************************************/

function getModuleName() {

  $.each(mb.moduleList, function(i, e) {
    $('.module_select.empty').append('<option value=' + e.value + '>' + e.name + '</option>');

  });
  $('.module_select.empty').removeClass('empty');

  $('.module_select').change(function(elem) {
    $('.module_select .hold').remove();
    moduleSelected = this.options[this.selectedIndex].value;
    getDataList(elem);
  });

  $('.data_select').change(function(e) {
    e.preventDefault();
    getJsonContent(this, e);
  });

}

function getDataList(elem) {

  /* @formatter:off */
  var moduleContainer = $(elem.target).parents('.form-inline')[0], 
      dataControl = $(moduleContainer).find('.data_control'), 
      dataSelect = $(moduleContainer).find('.data_select');
/* @formatter:on */

  mb.modulePath = elem.target.value.replace(/((module_)|(.html(.eco|.hb|.jade)))/g, '');
  mb.moduleName = mb.modulePath.replace(/.html(.eco|.hb|.jade)/g, '');

  $.ajax({
    url : '/dnames',
    cache : false,
    data : {
      mname : mb.moduleName
    }
  }).done(function(res) {

    var dnames = JSON.parse(res);

    $(dataControl).toggle(dnames.length > 0);
    $(dataControl).toggleClass('disabled', dnames.length == 0);
    $(dataSelect).html('');

    $.each(dnames, function(i, e) {

      $(dataSelect).append('<option value=' + mb.moduleName + '/' + e + '>' + e + '</option>')
      if (e == 'default.json') {
        $(dataSelect).val(mb.moduleName + '/' + e);
      }

    })


    $(dataSelect).trigger('change');

  });

}

function getJsonContent(dataSelect, elem) {

  selectedElem = $(dataSelect);

  $.ajax({
    url : '/getjson',
    data : {
      path : elem.target.value
    },
  }).done(function(res) {

    result = JSON.parse(res);

    mb.subModules = result.submodules;
    generateSubModule(selectedElem);

  })

}

/*************************************
 *              Utilities            *
 *************************************/

/* create the superModule Node if it undefined */
function addSuperModuleNode() {
  $.extend(mb.moduleData, {
    "config" : {
      "maxSubModule" : 0
    }
  })
};

function setSuperModule(dataSelect, elem) {
  var selectedElem = $(dataSelect).find("option")[dataSelect.selectedIndex];
  $(selectedElem).data();
  var temp;
}

function checkLength(o, n, min, max) {
  if (o.val().length > max || o.val().length < min) {
    o.addClass("ui-state-error");
    updateTips("Length of " + n + " must be between " + min + " and " + max + ".");
    return false;
  } else {
    return true;
  }
}

/*************************************
 *     Dom Manipulation functions    *
 *************************************/

function createModuleContainer(elem) {
  modulesContainer = $('#main-forms-container ul');

  $moduleGroupContainer = moduleGroupContainer.clone(true);
  $moduleGroup = moduleGroup.clone(true);
  $submodContainer = submodContainer.clone(true);

  $($moduleGroupContainer).find('.main-module-container').append($moduleGroup, $submodContainer);

  $(modulesContainer).append($moduleGroupContainer);

  getModuleName();

  $("#main-forms-container ul").sortable();
  var temp;
};

function addModule(res) {
  //parse json
  mb.moduleData = JSON.parse(res);

  /* test if node is undefined*/
  if (!(mb.moduleData.config && mb.moduleData.config.maxSubModule)) {
    //addSuperModuleNode();
  }

  if (mb.moduleData.config.maxSubModule > 0) {

    subModuleContainer = $(selectedElem).parents('.main-module-container').find('.submodContainer');

    $(subModuleContainer).show();

  } else if ($(selectedElem).parents('.submodContainer').length === 0) {
    $(selectedElem).parents('.main-module-container').find('.submodContainer').hide();
  }

}

function generateSubModule(selectedElem) {

  subModuleContainer = $(selectedElem).parents('.main-module-container').find('.submodContainer');

  $(subModuleContainer).find('.modContainer').remove();
  $(subModuleContainer).show();

  addSubModule(subModuleContainer);

}

function saveModule(elem) {

}

function addSubModule(elem) {

  $(elem).find('p').remove();
  $.each(mb.subModules, function(i) {
    $(elem).append('<p class="subModElem"><strong>submodule : </strong>' + mb.subModules[i].name + ' \\ <strong>description : </strong>' + mb.subModules[i].desc + '</p>');
  })

  var temp;

};

$("#build").button().click(function() {
  $("#dialog-form").dialog("open");
});
// when you hit build run the generate script
//$('#build').bind('click', function(e) {
function buildPage() {
  var myForm = $('#myForm');

  $.ajax({
    type : 'POST',
    url : myForm.attr('action'),
    data : myForm.serialize(),

    success : function(res) {
      if (res !== 'false' && res !== false) {
        $('#build').button('reset');
        if ($('.alert').length > 0) {
          $('.alert').remove();
        }
        $('body').prepend('<div id="build_success" class="alert alert-success">Success! Check it out here: <a target="_blank" href="http://' + res + '">' + res + '</a><button type="button" class="close" data-dismiss="alert">×</button></div>');
        $('#build_success').alert();
      } else {
        if ($('.alert').length > 0) {
          $('.alert').remove();
        }
        $('body').prepend('<div id="build_success" class="alert alert-success">ERROR: Build Failed!<button type="button" class="close" data-dismiss="alert">×</button></div>');
        $('#build_success').alert();
      }

    },
    error : function(jqXHR, textStatus, errorThrown) {
      $('body').prepend('<div id="build_success" class="alert alert-success">ERROR: Check it out here: The AJax call return an error : ' + errorThrown + '<button type="button" class="close" data-dismiss="alert">×</button></div>');
      $('#build_success').alert();
    }

  });

};

//turn build into a bootstrap button
//$('button').button();
