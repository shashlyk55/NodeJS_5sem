const WebSocket = require('ws')


const ws = new WebSocket('ws://localhost:4000/task03')

ws.on('open', () => {
    console.log('connected to server');
})

ws.on('ping', () => {
    console.log('ping from server');
    ws.pong()
})

ws.on('message', (message) => {
    console.log(`from server: ${message}`);
    
})

ws.on('close', () => {
    console.log('disconnected from server');
})

