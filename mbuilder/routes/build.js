fs = require('fs');

exports.generate = function(req, res) {
    console.log("yo")
    var terminal = require('child_process').spawn('bash');
    var config = require('../config.js');

    var t = String(req.query.module).replace(/.html(.eco|.hb)/g, '') + "_" + Math.floor(Date.now() / 1000);
    var p = '../src/html/generated/' + t + ".html.eco";
    var d = String(fs.readFileSync('module_template.html.eco'));
    d = d.replace(/{{{{t}}}}/g, t);
    d = d.replace(/{{{{d}}}}/g, "This module page was generated from the module builder");
    d = d.replace(/{{{{b}}}}/g, "<%-@partial('modules/" + req.query.module + "', {this:this, data:@data('" + req.query.data + "')})%>");

    fs.writeFile(p, d, 'utf8', function(err) {
        if (err) {
            throw err;
        }

        console.log('Sending stdin to terminal');
        terminal.stdin.write('cd ../src;  grunt mbuilder');
        terminal.stdin.end();
    })

    terminal.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
    });

    terminal.on('exit', function(code) {
        console.log('child process exited with code ' + code);
        if (code == 0) {
            res.send(config.localbase + t + '.html');
        } else {
            res.send("false");
        }

    });

}

exports.generatePage = function(req, res) {
  
    var terminal = require('child_process').spawn('bash');
    var config = require('../config.js');
    var moduleList = "";

    console.log('req.body.module', req.body['module']);

    for (var i = 0; i < req.body['module'].length; i++) {

        var moduleFileName = req.body['module'][i] || "";
        var moduleDataFileName = req.body['moduleData'][i] || "vide.json";

        console.log("elem" + i + " : moduleFileName : " + moduleFileName + " ||  moduleDataFileName" + moduleDataFileName);

        moduleList = moduleList + "<%-@partial('modules/" + moduleFileName + "', {this:this, data:@data('../data/" + moduleDataFileName + "')})%>";
    };

    console.log("moduleList : " + moduleList);

    var t = "page" + "_" + Math.floor(Date.now() / 1000);
    var p = '../src/html/generated/' + t + ".html.eco";
    var d = String(fs.readFileSync('pages_template.html.eco'));
    d = d.replace(/{{{{t}}}}/g, t);
    d = d.replace(/{{{{d}}}}/g, "This page page was generated from the module builder");
    d = d.replace(/{{{{b}}}}/g, moduleList);


        
    fs.writeFile(p, d, 'utf8', function(err) {
        if (err) {
            throw err;
        }

        console.log('Sending stdin to terminal');
        terminal.stdin.write('cd ../src;  grunt mbuilder');
        terminal.stdin.end();
    })

    terminal.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
    });

    terminal.on('exit', function(code) {
        console.log('child process exited with code ' + code);
        if (code == 0) {
            res.send(config.localbase + t + '.html');
        } else {
            res.send("false");
        }

    });


}