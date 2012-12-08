var express = require('express'), 
	build = require('./routes/build'),
	modules = require('./routes/modules'),
	pages = require('./routes/pages'),
	data = require('./routes/data'), 
	http = require('http'),
	path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, '/public')));
});

app.get('/mnames', modules.getmnames);
app.get('/dnames', data.getdnames);
app.get('/pnames', pages.getpnames);
app.get('/getjson', data.getjson);
app.get('/savejson', data.savejson);
app.get('/generate', build.generate);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
