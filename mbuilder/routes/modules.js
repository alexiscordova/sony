
/*
 * GET module listing.
 */

fs = require('fs');
wrench = require('wrench');

exports.getmnames = function(req, res){
  var x = wrench.readdirSyncRecursive('../src/packages/modules/');
	var p = '../src/packages/modules/';
	var d = fs.existsSync(p) ? fs.readdirSync(p) : [];	
	res.send(JSON.stringify(x));
}