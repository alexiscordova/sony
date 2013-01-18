var moduleGroupContainer = $('<div class="main-module-container">'), moduleGroup = $(
/* @formatter:off */
    '<div class="clearfix form-inline row modContainer">' + 
    ' <div class="control-group span4">' + 
    '   <label>Module</label>' + 
    '   <select class="module_select"  name="module">' + 
    '     <option class="hold">Select a module</option>' +     
    '   </select>' + 
    ' </div>' + 
    ' <div class="data_control control-group span4">' + 
    '   <label>Data</label>' + 
    '   <select class="data_select" name="moduleData"></select>' + 
    ' </div>' + 
    '</div>'
/* @formatter:on */
), submodContainer = $(
/* @formatter:off */
    '<div class="clearfix form-inline submodContainer">' +
    '<h4>Submodules</h4>' +
    '   <div class="span2 btn-addSubModule">' +
    '       <button class="btn btn-small addSubModule" >' +
    '           Define a Sub-module '+
    '       </button>' +
    '   </div>' +
    '</div>'
/* @formatter:on */
);

var mainModuleContainer, subModuleContainer;

var mb = {}, selectedElem;

mb.moduleName = "";
mb.modulePath = "";
mb.moduleData = {};
mb.subModules = [];
mb.modulePaths = [];

$(document).ready(function() {

  /** Add module block **/
  $("#add-module").click(function(e) {
    createModuleContainer(this);
  });

  createModuleContainer();

});
/** Document Ready end here**/

/*************************************
 *      Call to web services         *
 *************************************/

function getModuleName() {
  $.ajax({
    url : '/mnames'
  }).done(function(res) {

    mb.modulePaths = JSON.parse(res);

    $.each(mb.modulePaths, function(i, e) {
      $('.module_select').append('<option value=' + e + '>' + e.replace(/.html(.eco|.hb|.jade)/g, '') + '</option>');
    });

    $('.module_select').change(function(elem) {
      $('.module_select .hold').remove();
      getDataList(elem);
    });

    $('.data_select').change(function(elem) {
      getJsonContent(this, elem);
      setSuperModule(this, elem);
    });

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

  var result = '', count = 0, me;
  selectedElem = $(dataSelect);

  $.each(elem.target.options, function(index, domEle) {

    me = domEle;

    $.ajax({
      url : '/getjson',
      data : {
        path : elem.target.options[index].value
      },
    }).done(function(res) {

      result = JSON.parse(res);

      if (result.config && result.config.name) {
        elem.target.options[count].text = result.config.name;

      }

      /* test if node is undefined*/
      if (result.config && result.config.maxSubModule) {
        $(elem.target.options[count]).data({
          maxSubModule : result.config.maxSubModule
        });
      }

      if (elem.target.options[count].selected && $(elem.target.options[count]).data("maxSubModule") > 0) {
        console.log($(elem.target.options[count]).data("maxSubModule"));

        subModuleContainer = $(selectedElem).parents('.main-module-container').find('.submodContainer');
        console.log(subModuleContainer);
        $(subModuleContainer).show();

      } else if (elem.target.options[count].selected && $(selectedElem).parents('.submodContainer').length === 0) {
        $(selectedElem).parents('.main-module-container').find('.submodContainer').hide();
      }

      count = count + 1;
    });
  })

  //addModule(result);
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

/*************************************
 *     Dom Manipulation functions    *
 *************************************/

function createModuleContainer(elem) {
  modulesContainer = $('#main-forms-container');

  $moduleGroupContainer = moduleGroupContainer.clone(true);
  $moduleGroup = moduleGroup.clone(true);
  $submodContainer = submodContainer.clone(true);

  $($submodContainer).find('button.addSubModule').bind('click', function(e) {
    e.preventDefault();
    addSubModule(this);
  });

  $($moduleGroupContainer).append($moduleGroup, $submodContainer);

  $(modulesContainer).append($moduleGroupContainer);

  getModuleName();

};

function addModule(res) {
  //parse json
  mb.moduleData = JSON.parse(res);

  //if it contains submodules
  mb.subModules = mb.moduleData.submodules

  /* test if node is undefined*/
  if (!(mb.moduleData.config && mb.moduleData.config.maxSubModule)) {
    addSuperModuleNode();
  }

  if (mb.moduleData.config.maxSubModule > 0) {

    subModuleContainer = $(selectedElem).parents('.main-module-container').find('.submodContainer');

    $(subModuleContainer).show();

  } else if ($(selectedElem).parents('.submodContainer').length === 0) {
    $(selectedElem).parents('.main-module-container').find('.submodContainer').hide();
  }
}

function addSubModule(elem) {

  /* @formatter:off */
  var subModContainer = $(elem).parent('.btn-addSubModule'),
      $moduleGroup = moduleGroup.clone(true);
 /* @formatter:on */

  $($moduleGroup).find('select').each(function() {
    this.name === 'module' ? this.name = 'subModule' : this.name = 'subModuleData';
  });

  $(subModContainer).before($moduleGroup);
  getModuleName();

};

// when you hit build run the generate script
$('#build').bind('click', function(e) {

  var myForm = $('#myForm');

  // $("#build").button('loading');

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

});

//turn build into a bootstrap button
$('#build').button();

