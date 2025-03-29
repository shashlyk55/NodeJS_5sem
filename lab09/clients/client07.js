const http = require('http')
const query = require('querystring')
const fs = require('fs')
const path = require('path')

let bound = 'smw60-smw60-smw60'
let body = ''
body += `--${bound}\r\n`
body += 'Content-Disposition:form-data; name="file"; filename="screenshot.png"\r\n'
body += 'Content-Type:application/octet-stream\r\n\r\n'

let options = {
    host: 'localhost',
    path: '/doPngPost',
    port: 5000,
    method: 'POST',
    headers: {
        'content-type': 'multipart/form-data; boundary='+bound,
        //'content-disposition': 'attachment;filename="screenshot.png"'
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

req.write(body)

let stream = new fs.ReadStream(path.join(__dirname, './static/screenshot.png'))

stream.on('data', (chunk) => {
    req.write(chunk)
    console.log(Buffer.byteLength(chunk));
})

stream.on('end', () => req.end(`\r\n--${bound}--\r\n`))