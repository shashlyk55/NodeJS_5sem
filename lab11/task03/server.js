const WebSocket = require('ws')


const ws_server = new WebSocket.Server({port: 4000, path: '/task03'})
console.log('ws server started on localhost:4000');

let connections = 0

ws_server.on('connection', (ws) => {
    connections++
    let n = 0
    console.log('client connected');
    ws.isAlive = true
    
    let intervalId = setInterval(() => {
        ws.send(`11-03-server: ${n++}`)
    }, 15000) 

    ws.on('pong', () => {
        //console.log('pong from client');
        ws.isAlive = true
    })

    ws.on('close', () => {
        console.log('client disconnected');
        connections--
        clearInterval(intervalId)
    })
})

let pingIntervalId = setInterval(() => {
    ws_server.clients.forEach((client) => {
        if (client.readyState !== WebSocket.OPEN) return;

        if(!client.isAlive) {
            console.log('terminate unresponsive connection');
            return client.terminate()
        }
        client.isAlive = false
        client.ping()
    })
    // Вывод количества активных соединений
    const activeClients = Array.from(ws_server.clients).filter(ws => ws.readyState === WebSocket.OPEN);
    
    console.log(`active connections: ${activeClients.length}`);
    
}, 5000)

ws_server.on('close', () => {
    clearInterval(pingIntervalId)
})
