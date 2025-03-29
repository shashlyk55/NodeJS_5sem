const http = require('http')
const fs = require('fs')
const path = require('path')
const websocket = require('ws')

const http_server = http.createServer()
const HOST = 'localhost'
const HTTP_PORT = 3000
const WS_PORT = 4000
const ws_server = new websocket.Server({port: WS_PORT, host: HOST, path: '/wsserver'})
console.log(`WS-Server started on ${HOST}:${WS_PORT}`);

ws_server.on('connection', (ws) => {
    let k = 0
    let n = 0
    ws.on('message', (message) => {
        console.log(`Message from client: ${message}`);
        console.log(message.toString().split(':')[1].trim())
    })
    setInterval(() => ws.send(`10-01-server: ${n} -> ${++k}`), 5000)

})



const httpHandler = (req, res) => {
    if(req.method === 'GET' && req.url === '/start') {
        fs.readFile(path.join(__dirname, './html/index.html'), (err, data) => {
            if(err){
                res.writeHead(500, {'Content-Type':'text/plain'})
                res.end('Server error')
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'})
                res.end(data)
            }
        })
    } else {
        res.writeHead(400)
        res.end()
    }
}

http_server.on('request', httpHandler)

http_server.listen(HTTP_PORT, HOST, () => {
    console.log(`HTTP-Server started on ${HOST}:${HTTP_PORT}`);
})