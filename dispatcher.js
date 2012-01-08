// this: dispatcher.js
// does: Dispatches requests to a simple node.js server
// ver.: 0.2.5
// by:   Poul Staugaard
// URL:  http://giewiki.appspot.com/Tutorials/nodepad

var url = require('url');
var fs = require('fs');
var folder = require('./folder.js').folder;
var files = require('./files.js');
var query = require('./query.js');

function RequestData(req,res)
{
	this.req = req;	// the client's request
	this.res = res; // the response to be generated
	this.up = url.parse(req.url,true); // the URL
	var fn = decodeURIComponent(this.up.pathname.substring(1)); // the file or folder
	this.fn = fn == '' ? '.' : fn; // default directory (.) or requested object
	this.ftPos = this.fn.lastIndexOf('.') + 1; // location in fn of the filetype 
}

exports.dispatcher = function (req, res) {
    try {
        console.log('URL: ' + req.url);
		var rq = new RequestData(req,res);

        try {
            var fi = fs.statSync(rq.fn);
            if (fi.isDirectory()) {
				if (rq.up.search == '')
					return folder.list(rq);
                else if (query.handlers.folder(rq))
					return;
            }
			else { // It's a file request
				if (rq.up.search == '')
					return files.handler(rq);
				else if (query.handlers.file(rq, { 
							debug: files.handler // allow a ?debug=true flag to be passed to the browser script
					}))
					return;
			}
			console.log("Unknown query received:");
			console.dir(rq.up.query);
			res.writeHead(400, "invalid query");
			res.end("Query not supported: " + rq.up.search);
        }
        catch (x) {
			// Not a file system object, perhaps a dynamic resource request (NYI) ?
            console.log(x.message);
            res.writeHead(404, rq.fn + " not found");
            res.end("The server has no recollection of anything named " + rq.fn);
        }
    } catch (e) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end("Server error: " + e.message);
    }
};
