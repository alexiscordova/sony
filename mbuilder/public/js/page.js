var mb = {}

mb.isSuperModule = false;
mb.moduleName = "";
mb.modulePath = ""
mb.moduleData = {};
mb.subModules = [];
mb.modulePaths = [];

$(document).ready(function() {

    $('#data_control, #main_data_edit, #buttons').hide();

    $.ajax({
        url : "/mnames"
    }).done(function(res) {
        mb.modulePaths = JSON.parse(res);
        $.each(mb.modulePaths, function(i, e) {
            $('#module_select').append("<option value=" + e + ">" + e.replace(/.html(.eco|.hb)/g, '') + "</option>")
        })
        addSub();
    });

    var addSub = function() {
        //
        var sub = $('<li><div class="clearfix form-inline row"></div></li>');
        var form = sub.find('.form-inline')
        form.append('<div class="control-group span4"><label>Module</label> <select class="submodule-select" name="module"><option class="hold"></option></select></div>');
        form.append('<div class="control-group span4"><label>Data</label> <select class="submodule-data-select" name="moduleData"></select></div>')
        form.append('<div class="span1"><button class="btn btn-block btn-mini edit-me" data-toggle="modal" data-target="#edit_box">Edit</button></div>');
        form.append('<div class="span1"><button class="btn btn-block btn-mini remove-me">Remove</button></div>');
        var subselect = sub.find('.submodule-select');
        var dataselect = sub.find('.submodule-data-select');

        $.each(mb.modulePaths, function(i, e) {
            subselect.append("<option value=" + e + ">" + e.replace(/.html(.eco|.hb)/g, '') + "</option>");
        })
        //remove button functionality
        form.find('.remove-me').bind('click', function(e) {
            sub.remove();
        })
        //edit button functionality

        form.find('.edit-me').bind('click', function(e) {
            var p = dataselect.val();
            $('#edit_box .modal-body input').val(p);
            $.ajax({
                url : "/getjson",
                data : {
                    path : p
                }
            }).done(function(res) {
                $('#edit_box .modal-body textarea').val(JSON.stringify(JSON.parse(res), null, '    '));

            })
        })
        //get list of data.json path names for each submodule:
        subselect.change(function(e) {
            subselect.find('.hold').remove();
            var n = e.target.value.replace(/.html(.eco|.hb)/g, '');
            $.ajax({
                url : "/dnames",
                data : {
                    mname : n
                }
            }).done(function(res) {
                var d = JSON.parse(res);
                sub.find('.control-group:nth-child(2), .span1').toggle(d.length > 0);
                dataselect.html("");
                $.each(d, function(i, e) {
                    dataselect.append("<option value=" + n + "/" + e + ">" + e + "</option>")
                })
                //if dataname is defined select it
                // !dataname || dataselect.val(dataname);
            })
        })
        //!modname || subselect.val(modname).trigger('change');

        $('#submodule_list').append(sub);
    }
    //add the remaining data to the module edit text field
    //$('#main_data_edit textarea').val(JSON.stringify(mb.moduleData, null, '    '));
    //$('#main_data_edit textarea').trigger('keyup');
    $('#buttons, #main_data_edit').show();
    // $('#edit_box input:first, #save_as_box input:first').val($('#data_select').val())

    $('#submodule_section').find('.add-me').bind('click', function(e) {
        addSub();
    });

    //on textarea edit run JSLINT to test for valid json
    $('#main_data_edit textarea').bind('keyup', function(e) {
        var res = JSLINT($('#main_data_edit textarea').val())
        $('#main_data_edit textarea').toggleClass('error', !res);
    });

    //when you pop up the save as dialog focus the filename
    $('#edit_box, #save_as_box').modal().modal('hide').on('shown', function(e) {
        $(e.target).find('input:first').focus();
    });

    //when you hit save submit the current filename
    $('#save_submit').bind('click', function(e) {
        if ($('#data_text').hasClass('error')) {
            return;
        } else {
            doSave($('#data_select').val(), $('#main_data_edit textarea:first').val(), mb.isSuperModule);
        }
    })
    //when you hit save as submit the new filename
    $('#save_as_submit').bind('click', function(e) {
        if ($('#main_data_edit textarea:first').hasClass('error')) {
            return;
        } else {
            doSave($('#save_as_box input:first').val(), $('#main_data_edit textarea:first').val(), mb.isSuperModule);
        }
    })
    //when you hit save in the edit submodule popup
    $('#edit_submit').bind('click', function(e) {
        if ($('#edit_box textarea:first').hasClass('error')) {
            return;
        } else {
            doSave($('#edit_box input:first').val(), $('#edit_box textarea:first').val(), false);
        }
    })

    mb.updateSubs = function() {
        mb.subModules = [];
        $.each($('#submodule_list li'), function(i, e) {
            sub = $(e);
            var subselect = sub.find('.submodule-select');
            var dataselect = sub.find('.submodule-data-select')

            mb.subModules.push({
                type : subselect.val(),
                data : dataselect.val()
            });
        })
    }
    //saves the current contents of the text area to the file path
    var doSave = function(path, data, issuper) {
        //if its a supermodule re-add supermodule array
        if (issuper) {
            var d = JSON.parse(data);
            mb.updateSubs();
            d.submodules = mb.subModules;
            data = JSON.stringify(d, null, '    ');
        }

        $.ajax({
            url : "/savejson",
            data : {
                path : path,
                data : data
            }
        }).done(function(res) {
            //show save success message
            if ($('.alert').length > 0) {
                $('.alert').remove();
            }
            $('body').prepend('<div id="save_success" class="alert alert-success">Success: File Saved!<button type="button" class="close" data-dismiss="alert">×</button></div>');
            $('#save_success').alert();
            var v = $('#data_select').val()
            $('#module_select').trigger('change')
            setTimeout(function() {
                $('#data_select option[value="' + v + '"]').prop('selected', true);
            }, 200)
            $('#edit_box, #save_as_box').modal('hide');
        });

    }
    var data;

    $('form').submit(function() {
        //  data = $(this).serialize();
        var temps;
        return false;
    });

    // when you hit build run the generate script
    $("#build").bind('click', function(e) {

        var myForm = $("#myForm");

        $.each($("#submodule_list li"), function(i, e) {

        })

        $("#build").button('loading');

        $.ajax({
            type : "POST",
            url : myForm.attr('action'),
            data : myForm.serialize(),
            success : function(res) {
                if (res != "false") {
                    $("#build").button('reset');
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

            }
        });

    });

    //turn build into a bootstrap button
    $("#build").button();

})

