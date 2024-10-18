const sendmail = require('sendmail')()
const http = require('http')
const fs = require('fs')
const url = require('url')
const path = require('path')

const {send} = require('../my_modules/send_SIV')

const server = http.createServer((req, res) => {
    let parsedUrl = url.parse(req.url, true)
    const pathname = parsedUrl.pathname

    if(pathname === '/'){
        fs.readFile(path.join(__dirname, '../html/index.html'), (err, html) => {
            if(err){
                res.writeHead(500, {'Content-Type': 'text/text'})
                res.end('Server error')
            } else {
                res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'})
                res.end(html)
            }
        })
    } else if(pathname === '/send' && req.method === 'POST'){
        req.on('data', async (json) => {
            let data = JSON.parse(json)
            
            send(data.message)
            console.log(data)
        })
    }
})

const PORT = 5000
server.listen(PORT, () => {
    console.log(`Server started on localhost:${PORT}`)
})
