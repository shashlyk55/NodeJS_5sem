// task 06
module.exports = function socketHandler(req, res, server){

    const clientIp = res.socket.remoteAddress
    const clientPort = res.socket.remotePort

    const serverIp = server.address().address
    const serverPort = server.address().port

    res.writeHeader(200, {'Content-Type': 'text/html'})
    res.end(`<h3>Client: ${clientIp}:${clientPort}<br>Server: ${serverIp}:${serverPort}</h3>`)
}