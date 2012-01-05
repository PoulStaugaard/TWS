// this: tws.js (Basic TiddlyWiki server for node.js)
// ver.: 0.2.0
// by:   Poul Staugaard
// URL:  http://giewiki.appspot.com/Tutorials/nodepad

var http = require('http');
var dispatcher = require('./dispatcher.js').dispatcher;
http.createServer(dispatcher).listen(1337, "127.0.0.1");

var exec = require('child_process').exec;
var docfile = process.argv.length > 2 ? process.argv[2] : "";
var browser = require('./browser.js');
if (!browser.command)
	console.log("Browser not found, tried \n" + browser.tried.join('\n'));
else {
	var cmd = browser.command + ' "' + 'http://localhost:1337/' + docfile + '"';
	exec(cmd,function(err,stdout,stderr) {
				if (err) {
					console.log("Failed to start " + cmd);
					console.dir(err);
				}
				else
					console.log("Started " + cmd);
			}
		);
}
console.log("Ctrl+C terminates process");

