//this lets node run a terminal script
/*
var terminal = require('child_process').spawn('bash');

terminal.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
});

terminal.on('exit', function (code) {
        console.log('child process exited with code ' + code);
});

setTimeout(function() {
    console.log('Sending stdin to terminal');
    terminal.stdin.write('grunt debug');
    terminal.stdin.end();
}, 1000);

//
*/
var express = require('express'), 
	modules = require('./routes/modules'), 
	http = require('http'),
	db = require('./moduledb.js'), 
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
app.get('/mdata', modules.getmdata);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
