const http = require('http')
const path = require('path')
const fs = require('fs')
const url = require('url')

module.exports = function respStatusHandler(req, res) {
    const parsedUrl = url.parse(req.url, true)
    const queryParams = parsedUrl.query
    const statusCode = parseInt(queryParams.c, 10); 
    const message = queryParams.m;

    if (isNaN(statusCode)) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid status code');
    } else {
        res.writeHead(statusCode, message, { 'Content-Type': 'text/plain' });
        res.end(`code: ${statusCode} message:${message}`);
    }
}