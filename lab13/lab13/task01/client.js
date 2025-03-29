const net = require('net')

const HOST = '127.0.0.1'
const PORT = 4000

let client = new net.Socket()
client.connect(PORT, HOST, () => {
    console.log(`client connected ${client.remoteAddress}:${client.remotePort}`);
})

client.write('hello server')

client.on('data', (data) => {
    console.log(`from server: ${data.toString()}`);
    client.destroy()
})

client.on('close', () => {
    console.log('client close');
    process.exit()
})


client.on('error', () => {
    console.log('client error');
    process.exit()
})