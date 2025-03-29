const udp = require('dgram')

const HOST = '0.0.0.0'
const PORT = 3000

const server = udp.createSocket('udp4')

server.on('error', (err) => {
    console.log(err)
})

server.on('message', (msg, info) => {
    console.log(`from client ${info.address}:${info.port} ${msg.toString()}`);
    
    server.send(`ECHO:${msg}`, info.port, info.address, (err) => {
        if(err){
            console.log('server error');
            server.close()
        } 
    })
})

server.on('listening', () => {
    console.log(`${server.address().port}\n${server.address().address}\n${server.address().family}`);
})

server.on('close', () => console.log('server close'))

server.bind(PORT, HOST)


