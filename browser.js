// this: browser.js
// is:   Platform dependencies related to the browser launch command
// ver.: 0.2.2
// by:   Poul Staugaard
// URL:  http://giewiki.appspot.com/Tutorials/nodepad

if (process.env.USERPROFILE) // i.e. Windows
	exports.command = process.platform == 'win32' ? 
	    '"' + process.env.USERPROFILE + '/Local Settings/Application Data/Google/Chrome/Application/chrome.exe" --homepage ' :
	    '"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe" --homepage ';
else if (process.platform == 'darwin') // i.e. Mac
	exports.command = "open '/Applications/Google Chrome.app' --args --homepage ";
else
	exports.command = "/usr/bin/google-chrome";
