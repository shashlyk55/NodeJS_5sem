const WebSocket = require('ws')


const ws = new WebSocket('ws://localhost:4000/task04')
const rand = Math.floor(Math.random() * 100)

// const args = process.argv.slice(2);
// if (args.length === 0) {
//     console.error('where is param X');
//     process.exit(1);
// }

// const x = args[0];
const client = `client ${rand}`

ws.on('open', () => {
    console.log('connected to server');

    ws.send(JSON.stringify({
        client: client,
        timestamp: new Date()
    }))
})

ws.on('message', (message) => {
    console.log(`from server: ${message}`);
    
})

ws.on('close', () => {
    console.log('disconnected from server');
})

