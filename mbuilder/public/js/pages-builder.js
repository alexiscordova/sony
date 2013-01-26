var moduleGroupContainer = $('<li><div class="main-module-container">'), moduleGroup = $(
/* @formatter:off */
    ' <div class="clearfix form-inline row modContainer ui-corner-all ui-state-default">' +
    '   <span class="sprite btnResize"></span>' +
    '   <div class="control-group span5">' + 
    '     <label>Module</label>' + 
    '     <select class="module_select empty"  name="module">' + 
    '       <option class="hold">Select a module</option>' +     
    '     </select>' + 
    '   </div>' + 
    '   <div class="data_control control-group span5">' + 
    '     <label>Data</label>' + 
    '     <select class="data_select" name="moduleData"></select>' + 
    '   </div>' + 
    '   <span class="span2 btnRemove">' +
    '     <span class="sprite"></span>' +
    '     <button class="btn btn-small btn-block remove-module">' +
    '       Remove' +
    '     </button>' +
    '   </span>' +
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
        moduleName = moduleName.replace(/_|-/g, ' ');

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
  $("#add-module").click(function(e) {
    e.preventDefault();
    createModuleContainer(this);
  });

  $("#dialog-form").dialog({
    autoOpen : false,
    height : 380,
    width : 450,
    draggable : false,
    dialogClass : 'pageBuilderPop',
    modal : true,
    buttons : {
      "Build" : function() {
        var bValid = true;
      //  $('#dialog-form input').removeClass("ui-state-error").val("");
   
        // regex that find LineBreak
        var replaceLB = new RegExp('\\n', 'g');
        var replaceSpace = new RegExp('\\n', 'g');
        
        if (bValid) {
          $('#fileName').val($('#name').val().replace(' ',''));
          $('#fileTitle').val($('#title').val());
          $('#fileDescription').val($('#description').val().replace(replaceLB, ' '));

          buildPage();
        }
      },
      Cancel : function() {
        $(this).dialog("close");
        $('.ui-dialog-buttonset button').show();
        $('#postResult,#pageSaving').hide();
        $($('.ui-dialog-buttonset button')[1]).html('Cancel');
      }

    },
    close : function() {
      $('#fileName').val("").removeClass("ui-state-error");
      $('.ui-dialog-buttonset button').show();
      $('#postResult,#pageSaving').hide();
      $($('.ui-dialog-buttonset button')[1]).html('Cancel');
    }

  });

  //turn build into a bootstrap button
  //$('button').button();

  updateBuildButton();

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
    $(elem.target).find('.hold').remove();

    moduleSelected = this.options[this.selectedIndex].value;
    getDataList(elem);
  });

  $('.data_select').change(function(e) {
    e.preventDefault();
    getJsonContent(this, e);
    updateBuildButton();
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

      var dataName = e.replace(/.json/g, '');
      dataName = dataName.replace(/_|-/g, ' ');

      $(dataSelect).append('<option value=' + mb.moduleName + '/' + e + '>' + dataName + '</option>')
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

    typeof result.submodules !== 'undefined' ? mb.subModules = result.submodules : mb.subModules = '';
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
    return false;
  } else {
    return true;
  }
}

/*************************************
 *     Dom Manipulation functions    *
 *************************************/

function updateBuildButton() {

  var buildButton = $('#build');

  if ($('.hold').length === 0 && $('.ui-sortable li').length !== 0) {
    $(buildButton).prop('disabled', false);
  } else {
    $(buildButton).prop('disabled', true);
  }
}

function createModuleContainer(elem) {

  modulesContainer = $('#main-forms-container ul');

  $moduleGroupContainer = moduleGroupContainer.clone(true);
  $moduleGroup = moduleGroup.clone(true);
  $moduleGroup.find('.remove-module').bind('click', function(e) {
    e.preventDefault();
    removeModuleContainer(e.target);
  });

  $submodContainer = submodContainer.clone(true);

  $($moduleGroupContainer).find('.main-module-container').append($moduleGroup, $submodContainer);

  $(modulesContainer).append($moduleGroupContainer);

  getModuleName();

  $("#main-forms-container ul").sortable();
  updateBuildButton();
};

function removeModuleContainer(elem) {
  $(elem).parents('li').remove();
  updateBuildButton();
}

function generateSubModule(selectedElem) {

  subModuleContainer = $(selectedElem).parents('.main-module-container').find('.submodContainer');

  // $(subModuleContainer).find('.modContainer').remove();
  $(subModuleContainer).show();

  addSubModule(subModuleContainer);

}

function saveModule(elem) {

}

function addSubModule(elem) {

  $(elem).find('ol').remove();
  $(elem).append('<ol class="subModElem">');

  if ( typeof mb.subModules === 'undefined' || mb.subModules === '') {
    $(elem).hide();
  }

  $.each(mb.subModules, function(i) {

    typeof mb.subModules[i].name !== 'undefined' ? mb.subModules[i].name : mb.subModules[i].name = mb.subModules[i].data;
    typeof mb.subModules[i].desc !== 'undefined' ? mb.subModules[i].desc : mb.subModules[i].desc = mb.subModules[i].type;

    $(elem).find('ol').append(
    /* @formatter:off */
     '<li> ' +
     '  <span class="title">' +
     '    <strong>title : </strong>' + 
            mb.subModules[i].name + 
     '  </span>' +
     '  <span class="title">' +
     '    <strong>description : </strong>' + 
          mb.subModules[i].desc + 
     '  </span>' +
     '</li>'
     /* @formatter:on */
    );
  })

};

$("#build").click(function(e) {
  e.preventDefault();
  $("#dialog-form").dialog("open");
});

function buildPage() {

  var myForm = $('#myForm');

  var btnBuildPop = $('.ui-dialog-buttonset button')[0], btnCancelPop = $('.ui-dialog-buttonset button')[1];

  $(btnBuildPop).hide();
  $(btnCancelPop).hide();

  $('#dialog-form').hide();
  $('#dialog-form').after('<div id="pageSaving"><img src="img/ajax-loader.gif">Saving and Building ...</div>');
  $('#pageSaving').show();

  $.ajax({
    type : 'POST',
    url : myForm.attr('action'),
    data : myForm.serialize(),

    success : function(res) {
      $(btnCancelPop).html('Close');
      $(btnCancelPop).show();
      $('#pageSaving').hide();

      //div('#postResult').show();

      if (res !== 'false' && res !== false) {

        $('#dialog-form').after('<div id="postResult">Your page is now available : <a target="_blank" href="http://' + res + '">Link</a></div>');
        $('#postResult').show();

      } else {

      }
    },
    error : function(jqXHR, textStatus, errorThrown) {
      $('#dialog-form').after('<div id="build_success" class="alert alert-success">ERROR: Check it out here: The AJax call return an error : ' + errorThrown);
      $('#postResult').show();

    }

  });

};

