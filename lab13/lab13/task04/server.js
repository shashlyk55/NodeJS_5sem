const net = require('net')

const HOST = '0.0.0.0'
const PORT1 = 4000
const PORT2 = 5000

const TCP_handler = (sock) => {
    
    console.log(`client connected: ${sock.remoteAddress}:${sock.remotePort}`)
    
    let buf = new Buffer.alloc(4)

    sock.on('data', (data) => {
        const n = data.readInt32LE()
        buf.writeInt32LE(n,0)
        sock.write(`ECHO: ${n}`)
    })

    sock.on('close', (data) => {
        console.log('connected closed');
    })
}

net.createServer(TCP_handler).listen(PORT1,HOST,() => {
    console.log(`TCP-server: ${HOST}:${PORT1}`);
})
net.createServer(TCP_handler).listen(PORT2,HOST,() => {
    console.log(`TCP-server: ${HOST}:${PORT2}`);
})



