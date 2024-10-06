const http = require('http')
const fs = require('fs')
const url = require('url')
const path = require('path')
const readline = require('readline')

let appState = 'idle'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.on('line',(input) => {
    let isState = true
    let prevState = appState

    switch(input){
        case('exit'):{
            console.log('Server stoped')
            process.exit()
        } break;
        case('norm'):{
              appState = 'norm'
        } break;
        case('stop'):{
            appState = 'stop'
        } break;
        case('test'):{
            appState = 'test'
        } break;
        case('idle'):{
            appState = 'idle'
        } break;
        default:{
            isState = false
        } break;
    }
    console.log(isState ? `${prevState} -> ${appState}` : 'This is not state')
    isState = true
})

function fact(n){
    if(n === 0 || n === 1)
        return n;
    else
        return fact(n-1) * n
}

function factNextTick(n, callback){
    let result = 1;

    function computeFactorial(current) {
        if (current <= 1) {
            callback(null, result);
        } else {
            result *= current;
            
            process.nextTick(() => computeFactorial(current - 1));
        }
    }

    computeFactorial(n);
}

function factSetImmediate(n, callback){
    let result = 1

    function computeFactorial(current){
        if(current <= 1){
            callback(null, result)
        } else {
            result *= current

            setImmediate(() => computeFactorial(current - 1))
        }
    }

    computeFactorial(n)
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true)
    const pathname = parsedUrl.pathname
    const queryParams = parsedUrl.query
    
        if (pathname === '/'){          // task 1
            fs.readFile(path.join(__dirname, 'html/index.html'), (err, data) => {
                if (err) {
                    res.writeHead(500, {'Content-Type': 'text/text'})
                    res.end('Server error')
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html'})
                    res.end(data)
                }
            })
        } else if(pathname === '/state'){
            res.writeHead(200, {'Content-Type': 'text/plain'})
            res.end(`${appState}`)
        } else if(pathname === '/fact' && queryParams.k != null){           // task 2
            res.writeHead(200, {'Content-Type': 'application/json'})
            res.end(JSON.stringify({
                k: queryParams.k,
                fact: fact(queryParams.k).toString()
            }))
        } else if(pathname === '/factorial') {          // task 3
            fs.readFile(path.join(__dirname, 'html/factorial.html'), (err, data) => {
                if(err){
                    res.writeHead(500, {'Content-Type': 'text/text'})
                    res.end('Server error')
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html'})
                    res.end(data)
                }
            })
        } else if(pathname === '/nextTickFact' && queryParams.k != null){   // task 4
            factNextTick(queryParams.k, (err, result) => {
                if(err){
                    res.writeHead(500, {'Content-Type': 'text/plain'})
                    res.end('Server error: ' + err)
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html'})
                    res.end(JSON.stringify({
                        k: queryParams.k,
                        fact: result
                    }))
                }
            })
        } else if(pathname === '/nextTick') {           
            fs.readFile(path.join(__dirname, 'html/nextTick.html'), (err, data) => {
                if(err){
                    res.writeHead(500, {'Content-Type': 'text/text'})
                    res.end('Server error')
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html'})
                    res.end(data)
                }
            })
        } else if(pathname === '/setImmediateFact' && queryParams.k != null){   // task 5
            factSetImmediate(queryParams.k, (err, result) => {
                if(err){
                    res.writeHead(500, {'Content-Type': 'text/plain'})
                    res.end('Server error: ' + err)
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html'})
                    res.end(JSON.stringify({
                        k: queryParams.k,
                        fact: result
                    }))
                }
            })
        } else if(pathname === '/setImmediate'){
            fs.readFile(path.join(__dirname, 'html/setImmediate.html'), (err, data) => {
                if(err){
                    res.writeHead(500, {'Content-Type': 'text/text'})
                    res.end('Server error')
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html'})
                    res.end(data)
                }
            })
        }
        else {
            res.writeHead(500, {'Content-Type': 'text/plain'})
            res.end('Server error')
        }
    }
)

const PORT = 5000;
server.listen(PORT,() => {console.log(`Server running on localhost:${PORT}`)})
