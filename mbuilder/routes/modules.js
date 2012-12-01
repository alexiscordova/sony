
/*
 * GET module listing.
 */

fs = require('fs');

exports.getmnames = function(req, res){
	var dir = fs.readdirSync('../src/html/modules');
	var fnames = [];
	for(var f in dir){
		fnames.push(dir[f].replace(/.html(.eco|.hb)/g, ''));
	}
	res.send(JSON.stringify(fnames));
}

exports.getdnames = function(req, res){
	var p = '../src/html/data/'+ req.query.mname
	var d = fs.existsSync(p) ? fs.readdirSync(p) : [];	
	res.send(JSON.stringify(d));
}

exports.getjson = function(req, res){
	var p = '../src/html/data/' + req.query.path
	var d = fs.existsSync(p) ? fs.readFileSync(p) : "";
	res.send(d);
}


exports.save = function(req, res){
	res.send('ok');
}
