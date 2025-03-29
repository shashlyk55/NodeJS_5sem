const WebSocket = require('ws')
const path = require('path')
const fs = require('fs')

const ws = new WebSocket('ws://localhost:4000/task01')

const stream = WebSocket.createWebSocketStream(ws, ({encoding: 'utf8'}))

const filepath = path.join(__dirname, 'files/text.txt')
const filename = path.basename(filepath)

stream.write(filename)

const readStream = fs.createReadStream(filepath)

readStream.pipe(stream)

readStream.on('end', () => {
    console.log(`file ${filename} sended`);
});

readStream.on('error', (err) => {
    console.error(`error: ${err.message}`);
});