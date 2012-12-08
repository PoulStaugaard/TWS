// this: folder.js
// does: List file system folders to HTML
// ver.: 0.2.6
// by:   Poul Staugaard
// URL:  http://giewiki.appspot.com/Tutorials/nodepad

var fs = require('fs');

exports.folder = {
	list: function(rq)
	{
		var handler = function(e,dl)
		{
			if (e) {
				rq.res.writeHead(500, {'Content-Type': 'text/plain'});
				rq.res.end("Server error: " + e.message);
			}
			else {
				rq.res.setHeader('Content-Type', 'text/html');
				var fullpath = fs.realpathSync(rq.fn);
				rq.res.write(['<html><head><meta http-equiv="Content-Type" content="text/html;charset=utf-8" /><title>', fullpath, 
						  '</title></head><body style="font-family:courier"><h3>', 
						  fullpath, '</h3>\n'].join('') );
				for (var i = 0; i < dl.length; i++)
				{
					rq.res.write(['<a href="/', encodeURIComponent(rq.fn), '/',
							   encodeURIComponent(dl[i]), '">', dl[i], '</a>'
							  ].join(''));
					rq.res.write('<br/>\n');
				}
				rq.res.write(["<form method='get' action='", rq.req.url, "'>",
						   "<input id='filename' name='filename' style='display:none'>",
						   "<a id='newBtn' style='font-family: arial' href='javascript:;' onclick='",
							   "var idfn = document.getElementById(\"filename\"); idfn.style.display=\"block\"; idfn.focus(); document.getElementById(\"newBtn\").style.display=\"none\"'>",
						   "new TiddlyWiki.htm</a></form>"].join(''));
				rq.res.end('</body>');
			}
		};
		fs.readdir(rq.fn,handler);
	}
}

