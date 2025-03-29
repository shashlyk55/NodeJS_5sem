const rpcws = require('rpc-websockets').Client
const async = require('async')

let client = new rpcws('ws://localhost:4000')

client.on('open', async () => {
    try{
        await client.login({username: 'admin', password: 'admin'})

        async.parallel(
            {
                'square(5,4)': async () => await client.call('square', [5,4]),
                'square(3)': async () => await client.call('square', [3]),
                'sum(2)': async () => await client.call('sum', [2]),
                'sum(2,4,6,8,10)': async () => await client.call('sum', [2,4,6,8,10]),
                'mul(3)': async () => await client.call('mul', [3]),
                'mul(3,5,7,9,11,13)': async () => await client.call('mul', [3,5,7,9,11,13]),

                'fib(1)': async (callback) => await client.call('fib', [1]),
                'fib(2)': async (callback) => await client.call('fib', [2]),
                'fib(7)': async (callback) => await client.call('fib', [7]),
                'fact(0)': async (callback) => await client.call('fact', [0]),
                'fact(5)': async (callback) => await client.call('fact', [5]),
                'fact(10)': async (callback) => await client.call('fact', [10]),
            },
            (err, result) => {
                if(err){
                    console.log('error:',err);   
                } else {
                    console.log(result);
                }
                client.close()
            }
        )
        
    } catch(err){
        console.log('Authentification failed:',err);
    }
})