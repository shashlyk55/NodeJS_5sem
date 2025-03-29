const net = require('net')

const HOST = '0.0.0.0'
const PORT = 4000

net.createServer((sock) => {
    console.log(`client connected: ${sock.remoteAddress}:${sock.remotePort}`)
    
    let sum = 0
    let buf = new Buffer.alloc(4)

    const intervalId = setInterval(() => {
        console.log(`${sock.remoteAddress}:${sock.remotePort} = ${sum}`);
        buf.writeInt32LE(sum,0)
        sock.write(buf)
    }, 5000)

    sock.on('data', (data) => {
        const n = data.readInt32LE()
        sum += n
    })


    sock.on('close', (data) => {
        console.log('connected closed');
        clearInterval(intervalId)
    })
    
}).listen(PORT,HOST)

console.log(`TCP-server: ${HOST}:${PORT}`);
