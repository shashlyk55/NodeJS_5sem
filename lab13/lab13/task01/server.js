const net = require('net')

const HOST = '0.0.0.0'
const PORT = 4000

net.createServer((sock) => {
    console.log(`client connected: ${sock.remoteAddress}:${sock.remotePort}`)
    
    sock.on('data', (data) => {
        console.log('from client: ' + data);
        sock.write(data)  
    })

    sock.on('close', (data) => {
        console.log('server closed');
    })
    
}).listen(PORT,HOST)

console.log(`TCP-server: ${HOST}:${PORT}`);
