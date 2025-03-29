const fs = require('fs')
const url = require('url')
const path = require('path')

const {mimetypes} = require('./mimeTypes')

function requestStaticHandler(req, res, staticdir) {
    
    const filepath = path.join(staticdir, req.url)        
    const extention = path.extname(filepath)
    const mimetype = mimetypes[extention]

    fs.readFile(filepath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('file not found');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('server error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': mimetype })
            res.end(data)
        }
    })
}


module.exports = {requestStaticHandler}