
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

exports.getmdata = function(req, res){
	var dir = fs.existsSync('../src/html/data/'+ req.query.mname) ? fs.readdirSync('../src/html/data/'+ req.query.mname) : [];	
	res.send(JSON.stringify(dir));
}

exports.save = function(req, res){
	res.send('ok');
}
