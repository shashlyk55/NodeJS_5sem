
const http = require('http');
const fs = require('fs')
const path = require('path')
const url = require('url')

const server = http.createServer((req, res) => {
    
    const parsedUrl = url.parse(req.url, true)

    const pathname = parsedUrl.pathname

    if(pathname === '/'){
        res.writeHead(299, {'Content-Type': 'text/html'})
        res.end(`
        <a href="/html">to html page</a><br>
        <a href="/png">to image</a><br>
        <a href="/api/name">to name</a><br>
        <a href="/xmlhttprequest">go to XMLHTTPRequest</a><br>
        <a href="/fetch">go to fetch</a><br>
        <a href="/jquery">go to jquery</a><br>
        `)
    } else if(pathname === '/html'){        // task 1
        fs.readFile(path.join(__dirname,'index.html'), (err,data) => {
            if(err){
                res.writeHead(500,{'Content-Type': 'text/plain'})
                res.end('Server Error')
            } else{
                res.writeHead(299, {'Content-Type': 'text/html'})
                res.end(data)
            }
        })
    } else if(pathname === '/png'){         // task 2
        fs.readFile(path.join(__dirname,'image.jpg'), (err, data) => {
            if(err){
                res.writeHead(500,{'Content-Type': 'text/plain'})
                res.end('Error loading image')
            } else{
                res.writeHead(200,{'Content-Type':'image/jpg'})
                res.end(data)
            }
        })
    } else if(pathname === "/api/name" && req.method === 'GET'){        // task 3
        res.writeHead(200, {'Content-Type':'text/plain;charset=utf-8'})
        res.end('Слесарев Ваня')
    } else if(pathname === '/xmlhttprequest'){  // task 4
        fs.readFile(path.join(__dirname,'XMLHTTPRequest.html'), (err, data) => {
            if(err){
                res.writeHead(500,{'Content-Type': 'text/plain'})
                res.end('Server error')
            } else{
                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                res.end(data)
            }
        })
    } else if(pathname === '/fetch') {          // task 5
        fs.readFile(path.join(__dirname,'fetch.html'), (err, data) => {
            if(err){
                res.writeHead(500,{'Content-Type': 'text/plain'})
                res.end('Server error')
            } else{
                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                res.end(data)
            }
        })
    } else if(pathname === '/jquery'){          // task 6
        fs.readFile(path.join(__dirname, 'jquery.html'), (err, data) =>{
            if(err){
                res.writeHead(500, {'Content-Type': 'text/plain'})
                res.end('Server end')
            } else{
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.end(data)
            }
        })
    } else{
        res.writeHead(404,{'Content-Type': 'text/plain'})
        res.end('Not found')
    }

})

const PORT = 5000
server.listen(PORT, () => {
    console.log(`Server started on localhost:${PORT}`)
})

