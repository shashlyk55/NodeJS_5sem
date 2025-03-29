
function parseHeaders(headers){
    return Object.entries(headers)
    .map(([key, value]) => `<li>${key}: ${value}</li>`)
    .join("");
}

module.exports = function headersHandler(req, res){
    
    res.setHeader('X-Custom-Header', 'CustomHeaderValue')
    
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end(`<h3>Request headers:</h3>
        <ul>${parseHeaders(req.headers)}</ul>
        <h3>Response headers:</h3>
        <ul>${parseHeaders(res.getHeaders())}</ul>`)
}