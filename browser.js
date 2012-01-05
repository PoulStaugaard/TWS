// this: browser.js
// is:   Platform dependencies related to the browser launch command
// ver.: 0.2.3
// by:   Poul Staugaard
// URL:  http://giewiki.appspot.com/Tutorials/nodepad

if (process.env.USERPROFILE) { // i.e. Windows
	var exepath = '/Google/Chrome/Application/chrome.exe';
	var fx = function(p) {
		var fs = require('fs');
		try {
			p = p + exepath;
			fs.statSync(p);
			return p;
		}
		catch (x)
		{
			exports.tried = exports.tried || [];
			exports.tried.push(p);
			return false;
		}
	}
	
	var otherpath = process.env.GooglePath || process.env['ProgramFiles(x86)'];
	exports.command =
		fx(process.env.ProgramFiles) || 
		fx(process.env.APPDATA) ||
		fx(process.env.USERPROFILE + "/Local Settings/Application Data") ||
		(otherpath && fx(otherpath));
		
	if (exports.command) {
		console.log("Using " + exports.command);
		exports.command = '"' + exports.command + '" --homepage ';
	}
}
else if (process.platform == 'darwin') // i.e. Mac
	exports.command = "open '/Applications/Google Chrome.app' --args --homepage ";
else
	exports.command = "/usr/bin/google-chrome";
