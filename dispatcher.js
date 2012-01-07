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

exports.dispatcher = function (req, res) {
    try {
        console.log('URL: ' + req.url);
		var rq = {
			req: req,
			res: res,
			up: url.parse(req.url,true),
			parse: function() {
				var fn = decodeURIComponent(this.up.pathname.substring(1)); 
				this.fn = fn == '' ? '.' : fn; // default directory or requested object
				this.ftPos = this.fn.lastIndexOf('.') + 1; // location in fn of the filetype 
			}
		};
		rq.parse();

        try {
            var fi = fs.statSync(rq.fn);
            if (fi.isDirectory()) {
                if (rq.up.query && rq.up.query.filename)
                {
                    var nfn = decodeURIComponent(rq.up.query.filename) + '.htm';
                    var npn = rq.fn + '/' + nfn;
                    try {
                        var nsr = fs.statSync(npn);
                    } catch (es) {
                        if (es.message.substring(0,6) == 'ENOENT')
                        {
                            var psf = require.resolve('./empty.html');
                            console.log('cp ' + psf + '  ' + npn);
                            var tt = fs.readFileSync(psf,'utf8');    
                            fs.writeFileSync(npn,tt);
                            var reda = ['http://', req.headers.host, rq.up.pathname == '/' ? '' : rq.up.pathname, '/', encodeURIComponent(nfn)].join('');
                            console.log("Redirect to " + reda);
                            res.setHeader('Location', reda);
                            res.writeHead(302, 'your new file');
                            res.end();
                            return;
                        }
                        else
                            console.log(es.message);
                    }
                }
                return folder.list(rq);
            }
        }
        catch (x) {
            console.log(x.message);
            res.writeHead(404, rq.fn + " not found");
            res.end("The server has no recollection of anything named " + rq.fn);
        }
		if (rq.up.search == '')		
			return files.handler(rq);
		else if (!query.handler(rq, { 
			debug: files.handler
			}))
        {
            res.writeHead(500,"Error");
            res.end("invalid query");            
        }
    } catch (e) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end("Server error: " + e.message);
    }
};
