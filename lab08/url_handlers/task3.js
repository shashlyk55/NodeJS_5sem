const url = require('url')
const path = require('path')


module.exports = function parameter(req, res){
    const parsedUrl = url.parse(req.url, true)
    const queryParams = parsedUrl.query 

    // task 03
    if(queryParams.x && queryParams.y){
        let x = parseInt(queryParams.x)
        let y = parseInt(queryParams.y)

        if(!isNaN(x) && !isNaN(y)){
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.end(`<h3>x + y = ${x+y}<br>
                        x - y = ${x-y}<br>
                        x * y = ${x*y}<br>
                        x / y = ${y !== 0 ? parseFloat(x)/parseFloat(y) : 'Infinity'}</h3>`)
        } else {
            res.writeHead(500, {'Content-Type': 'text/plain'})
            res.end('Error: x or y not a number')
        }
    } else if(queryParams.x || queryParams.y){
        res.writeHead(500, {'Content-Type': 'text/plain'})
        res.end('Error: x or y not defined')
    } 
    // task 04
    else {
        const pathArr = parsedUrl.pathname.split('/')
        let x = parseInt(pathArr[2])
        let y = parseInt(pathArr[3])

        if(!isNaN(x) && !isNaN(y)){
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.end(`<h3>x + y = ${x+y}<br>
                        x - y = ${x-y}<br>
                        x * y = ${x*y}<br>
                        x / y = ${y !== 0 ? parseFloat(x)/parseFloat(y) : 'Infinity'}</h3>`)
        } else {
            res.writeHead(500, {'Content-Type': 'text/plain'})
            res.end(`Error: x or y not a number\n${req.url}`)
        }
    }
}