const WebSocket = require('ws')
const http = require('http')
const fs = require('fs')
const path = require('path')

const WS_PORT = 5000
const HTTP_PORT = 4000
const HOST = 'localhost'

const http_server = http.createServer((req, res) => {
    if(req.method === 'GET' && req.url === '/'){
        fs.readFile(path.join(__dirname, 'broadcast_client.html'), (err, data) => {
            if(err){
                res.writeHead(400, {'Content-Type': 'text/plain'})
                res.end('server error')
            }
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.end(data)
        })

    }
})

http_server.listen(HTTP_PORT, HOST, () => {
    console.log(`http server started on ${HOST}:${HTTP_PORT}`);
})


const ws_server = new WebSocket.Server({port: WS_PORT, host: HOST, path: '/wsserver'})
console.log(`ws server started on ${HOST}:${WS_PORT}`)

function broadcast(data, sender){
    ws_server.clients.forEach((client) => {
        if(client !== sender && client.readyState === WebSocket.OPEN){
            client.send(data)
        }
    });
}

ws_server.on('connection', (ws) => {
    ws.on('message', (message) => {
        console.log(`message: ${message}`);
        
        broadcast(message, ws)
    })
})

