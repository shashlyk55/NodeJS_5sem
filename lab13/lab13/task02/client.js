const net = require('net')

const HOST = '127.0.0.1'
const PORT = 4000

let client = new net.Socket()
let buf = new Buffer.alloc(4)

let timeoutId

client.connect(PORT, HOST, () => {
    console.log(`client connected ${client.remoteAddress}:${client.remotePort}`);
    timeoutId = setTimeout(() => {
        client.end()
    },20000)
})

setInterval(() => {
    const rand = Math.floor(Math.random() * 10)
    //client.write(rand.toString())
    buf.writeInt32LE(rand,0)
    client.write(buf)
},1000)

client.on('data', (data) => {
    console.log(`from server: ${data.readInt32LE()}`);
})

client.on('close', () => {
    console.log('client close');
    clearTimeout(timeoutId)
    process.exit()
})


client.on('error', () => {
    console.log('client error');
    clearTimeout(timeoutId)
    process.exit()
})