// task 05
module.exports = function closeHandler(req, res, server){
    setTimeout(() => {
        console.log('closing server')
        process.exit(0)
    }, 10000)
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end('<h3>Server turn off for 10 sec</h3>')
}