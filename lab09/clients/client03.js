const http = require('http')
const query = require('querystring')

let params = query.stringify({x: 4, y: 5, s: 8})
let path = `/doPost?${params}`

let options = {
    host: 'localhost',
    path: path,
    port: 5000,
    method: 'POST'
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