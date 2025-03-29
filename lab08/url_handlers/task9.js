const url = require('url')

// task 09
module.exports = function formParameterHandler(req, res){

    let result = ''
    
    req.on('data', (chunk) => {
        result += chunk
        console.log(result);
        
    })
    
    req.on('end', () => {
        res.writeHead(200,{'Content-Type': 'text/html'})
        res.end(result);
    })
}