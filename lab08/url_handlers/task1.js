const path = require('path')
const fs = require('fs')
const url = require('url')

function connectionHadler(req, res, server){
    const parsedUrl = url.parse(req.url, true)
    const queryParams = parsedUrl.query 

    if(queryParams.set){
        server.keepAliveTimeout = parseInt(queryParams.set)
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.end(`<h2>Set keepAliveTimeout: ${server.keepAliveTimeout}</h2>`)
    } else {
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.end(`<h2>KeepAliveTimeout: ${server.keepAliveTimeout}</h2>`)
    }
}

module.exports = connectionHadler