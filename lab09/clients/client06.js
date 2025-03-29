const http = require('http')
const query = require('querystring')
const fs = require('fs')
const path = require('path')


let bound = 'smw60-smw60-smw60'
let body = ''
body += `--${bound}\r\n`
body += 'Content-Disposition:form-data; name="file"; filename="MyFile.txt"\r\n'
body += 'Content-Type:text/plain\r\n\r\n'
//body += '111\nqdq\nd3827'
body += fs.readFileSync(path.join(__dirname, './static/MyFile.txt'))
body += `\r\n--${bound}--\r\n`

let options = {
    host: 'localhost',
    path: '/doTxtPost',
    port: 5000,
    method: 'POST',
    headers: {'content-type': 'multipart/form-data; boundary='+bound}
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
req.end(body)