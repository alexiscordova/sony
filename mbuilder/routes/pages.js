
/*
 * GET module listing.
 */

fs = require('fs');

exports.getpnames = function(req, res){
	var p = '../src/html/pages';
	var d = fs.existsSync(p) ? fs.readdirSync(p) : [];	
	res.send(JSON.stringify(d));
}