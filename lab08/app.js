const http = require('http')
const path = require('path')
const fs = require('fs')
const url = require('url')
const mp = require('multiparty')

const connectionHandler = require('./url_handlers/task1')
const headersHandler = require('./url_handlers/task2')
const parameterHandler = require('./url_handlers/task3')
const closeHandler = require('./url_handlers/task5')
const socketHandler = require('./url_handlers/task6')
const reqDataHandler = require('./url_handlers/task7')
const respStatusHandler = require('./url_handlers/task8')
const formParameterHandler = require('./url_handlers/task9')
const jsonHandler = require('./url_handlers/task10')
const xmlHandler = require('./url_handlers/task11')
const filesHandler = require('./url_handlers/task12')
const uploadHandler = require('./url_handlers/task14')


const errorHandler = require('./url_handlers/errorHadler')


const server = http.createServer()

let httpHandler = (req, res) => {

    const parsedUrl = url.parse(req.url, true)
    const pathname = parsedUrl.pathname
        
    if(req.method === 'GET'){
        if(pathname === '/') {
            fs.readFile(path.join(__dirname, '/html/index.html'), (err, html) => {
                if(err) {
                    res.writeHead(500, {'Content-Type': 'text/plain'})
                    res.end('Server error')
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html'})
                    res.end(html)
                }
            })
        } 
        else if(pathname === '/form'){
            fs.readFile(path.join(__dirname, '/html/form.html'), (err, html) => {
                if(err) {
                    res.writeHead(500, {'Content-Type': 'text/plain'})
                    res.end('Server error')
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html'})
                    res.end(html)
                }
            })
        }
        // task 01
        else if(pathname === '/connection') {
            connectionHandler(req, res, server)
        }
        // task 02 
        else if(pathname === '/headers') {
            headersHandler(req, res)
        } 
        // task 03 04
        else if(pathname.startsWith('/parameter')) {
            parameterHandler(req, res)
        } 
        // task 05
        else if(pathname === '/close') {
            closeHandler(req, res, server)
        } 
        // task 06
        else if(pathname === '/socket') {
            socketHandler(req, res, server)
        } 
        // task 07
        else if(pathname === '/req-data') {
            reqDataHandler(req, res)
        } 
        // task 08
        else if(pathname === '/resp-status') {
            respStatusHandler(req, res)
        } 
        // task 12 13
        else if(pathname.startsWith('/files')) {
            filesHandler(req, res)
        } 
        // task 14
        else if(pathname === '/upload') {
            fs.readFile(path.join(__dirname, './html/upload.html'), (err, data) => {
                if(err){
                    res.writeHead(400, {'Content-Type': 'text/plain'})
                    res.end('Server error')
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html'})
                    res.end(data)
                }
            })
        } else {
            errorHandler(req, res)
        }
    } else if(req.method === 'POST') {
        // task 09
        if(pathname.startsWith('/formparameter')) {
            formParameterHandler(req, res)
        }
        // task 10
        else if(pathname === '/json') {
            jsonHandler(req, res)
        }
        // task 11
        else if(pathname === '/xml') {
            xmlHandler(req, res)
        }
        // task 14
        else if(pathname === '/upload') {
            uploadHandler(req, res)
        } else {
            errorHandler(req, res)
        }
    } else {
        errorHandler(req, res)
    }
}

server.on('request', httpHandler)

const PORT = 5000
const HOSTNAME = 'localhost'
server.listen(PORT, HOSTNAME, () => {
    console.log(`Server started on ${HOSTNAME}:${PORT}`);
    
})