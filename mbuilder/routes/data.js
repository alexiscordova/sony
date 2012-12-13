
fs = require('fs');

exports.getdnames = function(req, res){
	var p = '../src/html/data/'+ req.query.mname;
	var d = fs.existsSync(p) ? fs.readdirSync(p) : [];	
	res.send(JSON.stringify(d));
}

exports.getjson = function(req, res){
	var p = '../src/html/data/' + req.query.path
	var d = fs.existsSync(p) ? fs.readFileSync(p) : "";
	res.send(d);
}

exports.savejson = function(req, res){
	var p = '../src/html/data/'+ req.query.path;
	var d = req.query.data;
	fs.writeFileSync(p, d, 'utf8', function(err){
		if(err) throw err;
	})
	res.send(d);
}