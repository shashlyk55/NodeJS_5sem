const http = require('http')
const query = require('querystring')

let jsonObj = {
    __comment: "Request lab 8, task 10",
    x: 1,
    y: 2,
    s: "message",
    m: ["a","b","c","d"],
    o: {"surname": "Slesarev","name": "Ivan"}
}

let path = `/doJsonPost`

let options = {
    host: 'localhost',
    path: path,
    port: 5000,
    method: 'POST',
    headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
    }
}

const req = http.request(options, (res) => {
    console.log(`req: status: ${res.statusCode} ${res.statusMessage}`);
    console.log(`req: address: ${res.socket.remoteAddress}:${res.socket.remotePort}`);
    
    let data = ''
    res.on('data', (chunk) => {
        data += chunk.toString('utf8')
    })
    res.on('end', () => console.log(`req: end: body = ${data}`))
    
})

req.on('error', (e) => console.log(`req: error: ${e.message}`))
req.end(JSON.stringify(jsonObj))