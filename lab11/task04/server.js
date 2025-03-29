const WebSocket = require('ws')


const ws_server = new WebSocket.Server({port: 4000, path: '/task04'})
console.log('ws server started on localhost:4000');


ws_server.on('connection', (ws) => {
    let n = 0

    ws.on('open', () => {
        console.log('client connected');
    })
    
    ws.on('message', (message) => {
        let clientObj = JSON.parse(message)
        console.log(clientObj);
        ws.send(JSON.stringify({
            server: n,
            client: clientObj.client,
            timestamp: new Date()
        }))
    })


    ws.on('close', () => {
        console.log('client disconnected');
    })
})
