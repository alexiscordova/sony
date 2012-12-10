fs = require('fs');

exports.generate = function(req, res){
	var terminal = require('child_process').spawn('bash');
	var	config = require('../config.js');
	
	var t = String(req.query.module).replace(/.html(.eco|.hb)/g,'') + "_" + Math.floor(Date.now() / 1000);
	var p = '../src/html/generated/'+t+".html.eco";
	var d = String(fs.readFileSync('module_template.html.eco'));
	d = d.replace(/{{{{t}}}}/g, t);
	d = d.replace(/{{{{d}}}}/g, "This module page was generated from the module builder");
	d = d.replace(/{{{{b}}}}/g, "<%-@partial('modules/"+req.query.module+"', {this:this, data:@data('"+req.query.data+"')})%>");
	
		
	fs.writeFile(p, d, 'utf8', function(err){
		if(err){
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
	    if(code == 0){
	    	res.send(config.localbase+t+'.html');
	    }else{
	    	 res.send("false");
	    }
	   
	});
	
}

