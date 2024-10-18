const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')
//const util = require('util')
const events = require('events')
const readline = require('readline')


const DB = require('../DB/DB.js')
const { clearTimeout } = require('timers')


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

let timerId = -1
let intervalId = -1
let statisticTimerId = -1
let isBegunCollectStat = false

let statistics = {
    start: null,
    finish: null,
    request: 0,
    commit: 0,
}

rl.on('line',(input) => {
    let parseCommandLine = input.split(' ')

    let command = parseCommandLine[0]
    let arg = parseCommandLine[1] == null ? 0 : parseCommandLine[1]

    switch(command){
        case('sd'):{
            console.log(`Server will turn of in ${arg} ms`)
            clearTimeout(timerId)
            timerId = setTimeout(() => process.exit(), arg)
        } break;
        case('sc'):{
            if(arg != null){
                console.log('Start interval commiting')
                intervalId = setInterval(() => {
                    if(isBegunCollectStat){
                        statistics.commit++
                    }
                    DB.commit()
                }, arg)
                intervalId.unref()
            } else {
                console.log('Stop interval commiting')
                clearTimeout(intervalId)
            }
        } break;
        case('ss'):{
            if(arg != null){
                isBegunCollectStat = true
                console.log('Start collecting statistic')
                statistics.start = new Date()
                statistics.finish = null
                statistics.request = 0
                statistics.commit = 0

                clearTimeout(statisticTimerId)
                statisticTimerId = setTimeout(() => {
                    statistics.finish = new Date()
                    console.log('End of statistic collecting')
                    console.log(statistics)
                    isBegunCollectStat = false
                }, arg)
                statisticTimerId.unref()
            } else {
                clearTimeout(statisticTimerId)
                statistics.finish = new Date()
                console.log('End of statistic collecting')
                console.log(statistics)
                isBegunCollectStat = false
            }
        } break;
        default:{
            console.log('Not a command')
        } break;
    }
})

DB.on('GET', async (req, res) =>{
    console.log('DB.GET')
    if(isBegunCollectStat){
        statistics.request++
    }
    res.end(JSON.stringify(await DB.select()))
})
DB.on('POST', async (req, res) => {
    console.log('DB.POST')
    if(isBegunCollectStat){
        statistics.request++
    }
    req.on('data', async (data) => {
        let r = JSON.parse(data)
        await DB.insert(r)
        res.end(JSON.stringify(r))
    })
})
DB.on('PUT', async (req,res) => {
    console.log('DB.PUT')
    if(isBegunCollectStat){
        statistics.request++
    }
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
    if(isBegunCollectStat){
        statistics.request++
    }
    const parsedUrl = url.parse(req.url, true)
    const pathname = parsedUrl.pathname
    const queryParams = parsedUrl.query

    if(queryParams.id != null){
        res.end(JSON.stringify(await DB.delete(queryParams.id)))
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
    } else if (pathname === '/api/db'){
        DB.emit(req.method, req, res)
    } else if (pathname === '/api/ss' && req.method === 'GET'){
        if(isBegunCollectStat){
            statistics.finish = null
        }
        let jsonStat = JSON.stringify(statistics)
        res.writeHead(200, {'Content-Type': 'aplication/json'})
        res.end(jsonStat)
    }
})

const PORT = 5000

server.listen(PORT, () => {
    console.log(`Server started on localhost:${PORT}`)
})