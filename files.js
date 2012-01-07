// this: files.js
// does: Handles URL's that match a file
// ver.: 0.2.6
// by:   Poul Staugaard
// URL:  http://giewiki.appspot.com/Tutorials/nodepad

var fs = require('fs');

exports.handler = function(rq) {
	var mt = filetypes.find(rq.ftPos ? rq.fn.substring(rq.ftPos) : false);
	rq.res.setHeader('Content-Type', mt.value);
	console.log("request: " + rq.fn);
	fs.readFile(rq.fn,mt.encoding,
		function(err,data) {
			if (err) {
				rq.res.writeHead(404, rq.fn + " not found");
				rq.res.end("No such file: " + rq.fn );
			}
			else if (mt.xform) // Transformation required ?
				rq.res.end(mt.xform(rq.fn,data));
			else 
				rq.res.end(data);
	});
	return true;
};

var filetypes = {
	find: function(ft)
	{
		var dflt = { value: 'text/html', encoding: 'utf8' };

		if (ft) switch (ft.toLowerCase())
		{
		case 'ico':
			return  { value: 'image/icon', encoding: false };
		case 'gif':
			return { value: 'image/gif', encoding: false };
		case 'jpg':
		case 'jpeg':
			return  { value: 'image/jpeg', encoding: false };
		case 'pdf':
			return { value: 'application/pdf', encoding: false };
		case 'png':
			return { value: 'image/png', encoding: false };
		case 'xml':
			return { value: 'application/rss+xml', encoding: 'utf8' };
			
		case 'htm':
		case 'html':
			dflt.xform = require('./tw-patcher.js').patch;
			break;
		case 'md':
			dflt.xform = require('./md-xformer.js').xform;
			break;
		}
		return dflt;
	}
};
