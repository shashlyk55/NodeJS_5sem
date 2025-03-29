// task 07
module.exports = function reqDataHandler(req, res){

    let data = ''

    req.on('data', (chunk) => {
        data += chunk
        console.log(chunk);
        console.log(`Part of message was processed`)
    })

    req.on('end', () => {
        console.log('Message was processed succesfully')
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.end()
    })

}
