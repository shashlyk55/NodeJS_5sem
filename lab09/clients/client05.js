const http = require('http')
const query = require('querystring')

let xmlDoc = `<request id="28">
            <x value="1"/>
            <x value="4"/>
            <x value="2"/>
            <m value="a"/>
            <m value="r"/>
        </request>`

let path = `/doXmlPost`

let options = {
    host: 'localhost',
    path: path,
    port: 5000,
    method: 'POST',
    headers: {
        'content-type': 'text/xml',
        'accept': 'text/xml'
    }
}

const req = http.request(options, (res) => {
    console.log(`req: status: ${res.statusCode} ${res.statusMessage}`);
    console.log(`req: address: ${res.socket.remoteAddress}:${res.socket.remotePort}`);
    
    let data = ''
    res.on('data', (chunk) => {
        data += chunk
    })
    res.on('end', () => console.log(`req: end: body = ${data}`))
    
})

req.on('error', (e) => console.log(`req: error: ${e.message}`))
req.end(xmlDoc.toString({pretty: true}))