const http = require('http')
const fs = require('fs')
const url = require('url')
const path = require('path')
const { requestStaticHandler } = require('./requestStaticHandler')

const staticdir = path.join(__dirname, 'files')

const server = http.createServer((req, res) => {

    if (req.method !== 'GET') {
        res.writeHead(405, { 'Content-Type': 'text/plain' })
        res.end('method not allowed')
        return
    }
    
    if(req.url === '/'){
        fs.readFile(path.join(__dirname, 'index.html'), (err, html) => {
            if(err){
                res.writeHead(500, {'Content-Type': 'text/text'})
                res.end('server error')
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'})
                res.end(html)
            }
        })
        return
    }

    requestStaticHandler(req, res, staticdir)
})

const PORT = 5000
server.listen(PORT, () => console.log(`Server started on localhost:${PORT}`))