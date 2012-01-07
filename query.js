// this: query.js
// does: Handles URL's with a query part
// ver.: 0.2.6
// by:   Poul Staugaard
// URL:  http://giewiki.appspot.com/Tutorials/nodepad

var fs = require('fs');

exports.handler = function(rq, handlers) {
	var query = rq.up.query;
	if (query.rss == 'true')
	{
		var bodyparts = [];
		
		rq.req.on('data',
			function(chunk) {
				bodyparts.push(chunk);
			});
		rq.req.on('end',
			function() {
				rq.fn = rq.fn.substring(0,rq.ftPos) + "xml";
				fs.writeFileSync(rq.fn,bodyparts.join(''));
				bodyparts = null;
				console.log("Wrote " + rq.fn);
				rq.res.writeHead(200,"OK");
				rq.res.end("saved " + rq.fn);
			});
		return true;
	}
	else if (query.saveBackup !== undefined)
	{
		var bodyparts = [];                
		rq.req.on('end',
			function() {
				console.log("end " + rq.req.url);
				if (query.saveBackup == 'true') {
					rq.ftPos = rq.fn.lastIndexOf('.');
					var ts = (new Date()).convertToYYYYMMDDHHMMSSMMM();
					if (rq.ftPos > 0)
						bfn = [rq.fn.substring(0,rq.ftPos), ts, rq.fn.substring(rq.ftPos + 1)].join('.');
					else
						bfn = rq.fn + '.' + ts;
						
					if (query.backupFolder) {
						var fnparts = bfn.split('/');
						var clen = fnparts.length;
						var fnleaf = fnparts[clen - 1];
						fnparts[clen - 1] = query.backupFolder;
						var bfpath = fnparts.join('/');
						try {
							var nsr = fs.statSync(bfpath);
						} catch (es) {
							if (es.message.substring(0,6) == 'ENOENT')
								fs.mkdirSync(bfpath);
						}
						fnparts[clen] = fnleaf;
						bfn = fnparts.join('/');
					}
					fs.renameSync(rq.fn,bfn);
					console.log( "renamed " + rq.fn + ' to ' + bfn);
				}
				fs.writeFileSync(rq.fn,bodyparts.join(''));
				bodyparts = null;
				console.log("Wrote " + rq.fn);
				rq.res.writeHead(200,"OK");
				rq.res.end("saved " + rq.fn);
			});
		rq.req.on('data',
			function(chunk) {
				bodyparts.push(chunk);
			});
		return true;
	}
	else for (a in query)
	{
		if (handlers[a])
			return handlers[a](rq);
	}

	console.log("Unknown query:");
	console.dir(query);
	return false;
}

// Convert a date to UTC YYYYMMDD.HHMMSSMMM string format
Date.prototype.convertToYYYYMMDDHHMMSSMMM = function()
{
    return this.getUTCFullYear() + String.zeroPad(this.getUTCMonth()+1,2) + String.zeroPad(this.getUTCDate(),2) + "." + String.zeroPad(this.getUTCHours(),2) + String.zeroPad(this.getUTCMinutes(),2) + String.zeroPad(this.getUTCSeconds(),2) + String.zeroPad(this.getUTCMilliseconds(),3) +"0";
};

// Static method to left-pad a string with 0s to a certain width
String.zeroPad = function(n,d)
{
    var s = n.toString();
    if(s.length < d)
        s = "000000000000000000000000000".substr(0,d-s.length) + s;
    return s;
};
