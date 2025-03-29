module.exports = function errorHandler(req, res){
    res.writeHead(500, {'Content-Type': 'text/plain'})
    res.end('Unknown url or method')
}