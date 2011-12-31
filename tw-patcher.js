// this: tw-patcher.js
// does: Patches TiddlyWiki files to insert SaveToHttpPlugin
// ver.: 0.1.0
// by:   Poul Staugaard
// URL:  http://giewiki.appspot.com/Tutorials/nodepad
var fs = require('fs');
var plugin = fs.readFileSync('./SaveToHttpPlugin.xml','utf-8');

exports.patch = function(fn,text) {
	var token = '<div id="storeArea">';
	var ppos = text.indexOf(token);
	if (ppos > 0)
	{
		ppos += token.length; 
		text = text.substring(0,ppos) + plugin + text.substring(ppos);
	}
	return text;
}