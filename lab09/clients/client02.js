const http = require('http')

let options = {
    host: 'localhost',
    path: '/doSum?x=5&y=8',
    port: 5000,
    method: 'GET'
}

const req = http.request(options, (res) => {
    console.log(`req: status: ${res.statusCode} ${res.statusMessage}`);
    console.log(`req: address: ${res.socket.remoteAddress}:${res.socket.remotePort}`);
    
    let data = ''
    res.on('data', (chunk) => {
        data += chunk.toString('utf8')
    })
    res.on('end', () => console.log(`body = ${data}`))
    
})

req.on('error', (e) => console.log(`req: error: ${e.message}`))
req.end()