const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')
//const util = require('util')
const events = require('events')

const DB = require('../DB/DB.js')



DB.on('GET', async (req, res) =>{
    console.log('DB.GET')

    res.end(JSON.stringify(await DB.select()))
})
DB.on('POST', async (req, res) => {
    console.log('DB.POST')

    req.on('data', async (data) => {
        let r = JSON.parse(data)
        //console.log(r.name)
        await DB.insert(r)
        res.end(JSON.stringify(r))
    })
})
DB.on('PUT', async (req,res) => {
    console.log('DB.PUT')

    const parsedUrl = url.parse(req.url, true)
    const pathname = parsedUrl.pathname
    const queryParams = parsedUrl.query

    req.on('data', async (data) => {
        let r = JSON.parse(data)
        await DB.update(r)
        res.end(JSON.stringify(r))
    })
})
DB.on('DELETE', async (req, res) => {
    console.log('DB.DELETE')

    const parsedUrl = url.parse(req.url, true)
    const pathname = parsedUrl.pathname
    const queryParams = parsedUrl.query

    if(queryParams.id != null){
        res.end(JSON.stringify(DB.delete(queryParams.id)))
    }
})

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true)
    const pathname = parsedUrl.pathname

    if(pathname === '/'){

        fs.readFile(path.join(__dirname, '../html/index.html'), (err, html) => {
            if(err){
                res.writeHead(500, {'Content-Type': 'text/text'})
                res.end('Server error')
            } else {
                res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'})
                res.end(html)
            }
        })
    } if (pathname === '/api/db'){
        
        DB.emit(req.method, req, res)

    }


})

const PORT = 5000

server.listen(PORT, () => {
    console.log(`Server started on localhost:${PORT}`)
})