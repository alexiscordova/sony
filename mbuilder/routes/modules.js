
/*
 * GET module listing.
 */

fs = require('fs');

exports.getmnames = function(req, res){
	var p = '../src/html/modules';
	var d = fs.existsSync(p) ? fs.readdirSync(p) : [];	
	res.send(JSON.stringify(d));
}