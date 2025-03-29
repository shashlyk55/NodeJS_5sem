const rpcws = require('rpc-websockets').Server

let server = new rpcws({port: 4000, host: 'localhost'})

server.setAuth((data) => {
    return data.username === 'admin' && data.password === 'admin'
})

server.register('square', (params) => {
    console.log('calling square');
    
    let res
    if(params.length == 1){
        const [a] = params
        res = 3.14 * a
    } else if(params.length == 2){
        const [a,b] = params
        res = a * b
    }
    return res
})

server.register('sum', (params) => {
    console.log('calling sum');

    let res = 0
    for(let p of params)
        res += p
    return res
})

server.register('mul', (params) => {
    console.log('calling mul');

    let res = 1
    for(let p of params)
        res *= p
    return res
})

server.register('fib', (params) => {
    console.log('calling fib');
    
    const [n] = params
    let res = []
    for (let i=0; i<n; i++) {
        if(i == 0 || i == 1){
            res.push(i)
        } else {
            res.push(res[i-2] + res[i-1])
        }
    }
    return res
}).protected()

server.register('fact', (params) => {
    console.log('calling fact');
    
    const [n] = params
    let res = 1

    if(n == 0 || n == 1) return res

    for(let i = 1; i<=n; i++){
        res *= i
    }

    return res
}).protected()
