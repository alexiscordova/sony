fs = require('fs');

exports.generate = function (req, res) {
  console.log("yo")
  var terminal = require('child_process').spawn('bash');
  var config = require('../config.js');

  var t = String(req.query.module).replace(/.html(.eco|.hb)/g, '') + "_" + Math.floor(Date.now() / 1000);
  var p = '../src/html/generated/' + t + ".html.eco";
  var d = String(fs.readFileSync('module_template.html.eco'));
  d = d.replace(/{{{{t}}}}/g, t);
  d = d.replace(/{{{{d}}}}/g, "This module page was generated from the module builder");
  d = d.replace(/{{{{b}}}}/g, 'e = {"locals":locals, "data":data("' + req.query.data + '")}');
  d = d.replace(/{{{{c}}}}/g, "!{partial('modules/" + req.query.module + "', e)}");

  fs.writeFile(p, d, 'utf8', function (err) {
    if (err) {
      throw err;
    }

    console.log('Sending stdin to terminal');
    terminal.stdin.write('cd ../src;  grunt mbuilder');
    terminal.stdin.end();
  })

  terminal.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  terminal.on('exit', function (code) {
    console.log('child process exited with code ' + code);
    if (code == 0) {
      res.send(config.localbase + t + '.html');
    } else {
      res.send("false");
    }

  });

}

exports.generatePage = function (req, res) {

  var terminal = require('child_process').spawn('bash');
  var config = require('../config.js');
  var moduleList = "";

  /* PATCH : test if the first element contains more than 1 character
   *         Correction for a bug when there is only one element, it
   *         is seen as a STRING.
   */
  if (req.body['module'] [0].length <= 1) {
    moduleLength = 1;

  } else {
    moduleLength = req.body ['module'].length;
  }

  console.log('nb of element(s) : ' + moduleLength);

  for ( var i = 0; i < moduleLength; i++ ) {

    var moduleFileName, moduleDataFileName;

    if (moduleLength == 1) {
      moduleFileName = req.body ['module'] || null;
      moduleDataFileName = req.body ['moduleData'] || null;
    } else {
      moduleFileName = req.body['module'] [i] || null;
      moduleDataFileName = req.body['moduleData'] [i] || null;
    }

    moduleList = moduleList + 'e = {"locals":locals, "data":data("' + moduleDataFileName + '")}\r    !{partial("modules/' + moduleFileName + '", e)}\r';
    console.log(moduleList);
  };


  var t = "page" + "_" + Math.floor(Date.now() / 1000);
  var p = '../src/html/generated/' + t + ".html.jade";
  var d = String(fs.readFileSync('page-builder-template.jade'));
  // d = d.replace(/{{{{t}}}}/g, t);
  // d = d.replace(/{{{{d}}}}/g, "This page page was generated from the module builder");
  d = d.replace(/{{{{b}}}}/g, moduleList);

  fs.writeFile(p, d, 'utf8', function (err) {
    if (err) {
      throw err;
    }

    console.log('Sending stdin to terminal');
    terminal.stdin.write('cd ../src;  grunt mbuilder');
    terminal.stdin.end();
  })

  terminal.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  terminal.on('exit', function (code) {
    console.log('child process exited with code ' + code);
    if (code == 0) {
      res.send(config.localbase + t + '.html');
    } else {
      res.send("false");
    }

  });

}