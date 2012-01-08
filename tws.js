// this: tws.js (Basic TiddlyWiki server for node.js)
// ver.: 0.2.0
// by:   Poul Staugaard
// URL:  http://giewiki.appspot.com/Tutorials/nodepad

var http = require('http');
var child_process = require('child_process');
var fs = require('fs');
var dispatcher = require('./dispatcher.js').dispatcher;

var localhost = "127.0.0.1";
var startPort = 1337;
var nextPort = startPort;

exports.browse = function (path, port) {
	if (port === undefined)
		port = nextPort++;
	console.log('browse "' + path + '"');
	var svr = http.createServer(dispatcher).listen(port, localhost);
	svr.on('error', function (ex) {
		http.get({
				host: localhost,
				port: startPort,
				path: "/.tws/browse:" + path
			},
			function (res) {
				if (res.statusCode != 200)
					console.log("Command res: " + res.statusCode);
			});
		//console.log("Net error: ");
		//console.dir(ex);
	});
	svr.on('listening', function () {
		var exec = require('child_process').exec;
		var browser = require('./browser.js');
		if (!browser.command)
			console.log("Browser not found, tried \n" + browser.tried.join('\n'));
		else {
			var cmd = [browser.command, ' "', 'http://localhost:', port, '/', path, '"'].join('');
			child_process.exec(cmd, function (err, stdout, stderr) {
				if (err) {
					console.log("Failed to start " + cmd);
					console.dir(err);
				}
				else
					console.log("Started " + cmd);
			}
				);
		}
	});
};

var fullpath = fs.realpathSync(process.argv.length > 2 ? process.argv[2] : "").replace('\\','/');

exports.browse(fullpath);
console.log("Ctrl+C terminates process");

