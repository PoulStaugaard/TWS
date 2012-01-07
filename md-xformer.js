// this: md-xformer.js
// does: Renders markdown as HTML
// uses: markdown ("npm install markdown")
// ver.: 0.1.0
// by:   Poul Staugaard

var markdown = require('markdown').markdown;

exports.xform = function(fn,text) {
	console.log("Markdown " + fn + " as HTML");
	return markdown.toHTML(text);
}
