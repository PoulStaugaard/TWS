// this: dispatcher.js
// does: Dispatches requests to a simple node.js server
// ver.: 0.1.0
// by:   Poul Staugaard
// URL:  http://giewiki.appspot.com/Tutorials/nodepad
var url = require('url');
var fs = require('fs');

function MimeTypeFromFileType(ft)
{
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
    }
    return { value: 'text/html', encoding: 'utf8' };
}

function writeFolderListing(req,res,p)
{
    var handler = function(e,dl)
    {
        if (e) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Server error: " + e.message);
        }
        else {
            res.setHeader('Content-Type', 'text/html');
            var fullpath = fs.realpathSync(p);
            res.write(['<html><head><title>', fullpath, 
                      '</title></head><body style="font-family:courier"><h3>', 
                      fullpath, '</h3>\n'].join('') );
            for (var i = 0; i < dl.length; i++)
            {
                res.write(['<a href="', encodeURIComponent(p), '/', 
                           encodeURIComponent(dl[i]), '">', dl[i], '</a>'
                          ].join(''));
                res.write('<br/>\n');
            }
            res.write(["<form method='get' action='", req.url, "'>",
                       "<input id='filename' name='filename' style='display:none'>",
                       "<a href='javascript:;' onclick='",
                           "document.getElementById(\"filename\").style.display=\"block\"'>",
                       " ..new TiddlyWiki</a></form>"].join(''));
            res.end('</body>');
        }
    };
    fs.readdir(p,handler);
}

exports.dispatcher = function (req, res) {
    try {
        console.log('URL: ' + req.url);
        var up = url.parse(req.url,true);
        var fn = decodeURIComponent(up.pathname.substring(1));
        if (fn == '')
            fn = '.'; // list default directory
        try {
            var fi = fs.statSync(fn);
            if (fi.size == 0) {
                if (up.query && up.query.filename)
                {
                    var nfn = decodeURIComponent(up.query.filename) + '.htm';
                    var npn = fn + '/' + nfn;
                    try {
                        var nsr = fs.statSync(npn);
                    } catch (es) {
                        //console.log( 'testing for ' + nfn + ': ' + es.message);
                        if (es.message.substring(0,6) == 'ENOENT')
                        {
                            var psf = require.resolve('./empty.html');
                            console.log('cp ' + psf + '  ' + npn);
                            var tt = fs.readFileSync(psf,'utf8');    
                            fs.writeFileSync(npn,tt);
                        }
                        else
                            console.log(es.message);
                    }
                }
                return writeFolderListing( req, res, fn);
            }
        }
        catch (x) {
            res.writeHead(404, fn + " not found");
            res.end("The server has no recollection of anything named " + fn);
        }
        var ftPos = fn.lastIndexOf('.') + 1;
        if (!up.search || up.query.debug)
        {
            var mt = MimeTypeFromFileType(ftPos ? fn.substring(ftPos) : false);
            res.setHeader('Content-Type', mt.value);
            console.log("request: " + fn);
            fs.readFile(fn,mt.encoding,
                function(err,data) {
                    if (err) {
                        res.writeHead(404, fn + " not found");
                        res.end("No such file: " + fn );
                    }
                    else if (mt.value == 'text/html')
                        res.end(require('./tw-patcher.js').patch(fn,data));
                    else 
                        res.end(data);
            });
        }
        else if (up.query.rss == 'true')
        {
            var bodyparts = [];
            
            req.on('data',
                function(chunk) {
                    bodyparts.push(chunk);
                });
            req.on('end',
                function() {
                    fn = fn.substring(0,ftPos) + "xml";
                    fs.writeFileSync(fn,bodyparts.join(''));
                    bodyparts = null;
                    console.log("Wrote " + fn);
                    res.writeHead(200,"OK");
                    res.end("saved " + fn);
                });
        }
        else if (up.query.saveBackup !== undefined)
        {
            var bodyparts = [];                
            req.on('end',
                function() {
                    console.log("end " + req.url);
                    if (up.query.saveBackup == 'true') {
                        ftpos = fn.lastIndexOf('.');
                        var ts = (new Date()).convertToYYYYMMDDHHMMSSMMM();
                        if (ftpos > 0)
                            bfn = [fn.substring(0,ftpos), ts, fn.substring(ftpos + 1)].join('.');
                        else
                            bfn = fn + '.' + ts;
                            
                        if (up.query.backupFolder) {
                            var fnparts = bfn.split('/');
                            var clen = fnparts.length;
                            var fnleaf = fnparts[clen - 1];
                            fnparts[clen - 1] = up.query.backupFolder;
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
                        fs.renameSync(fn,bfn);
                        console.log( "renamed " + fn + ' to ' + bfn);
                    }
                    fs.writeFileSync(fn,bodyparts.join(''));
                    bodyparts = null;
                    console.log("Wrote " + fn);
                    res.writeHead(200,"OK");
                    res.end("saved " + fn);
                });
            req.on('data',
                function(chunk) {
                    bodyparts.push(chunk);
                });
        }
        else
        {
            res.writeHead(500,"Error");
            res.end("missing arguments");            
        }
    } catch (e) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end("Server error: " + e.message);
    }
};

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
