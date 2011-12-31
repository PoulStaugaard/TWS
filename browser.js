// this: browser.js
// does: Starts a simple node.js server and a browser to hit it
// ver.: 0.1.0
// by:   Poul Staugaard
// URL:  http://giewiki.appspot.com/Tutorials/nodepad

exports.command = process.env.USERPROFILE ?
    '"' + process.env.USERPROFILE + '/Local Settings/Application Data/Google/Chrome/Application/chrome.exe" --homepage ' :
    "open '/Applications/Google Chrome.app' --args --homepage ";
