const rpcws = require('rpc-websockets').Client

let client = new rpcws('ws://localhost:4000')

client.on('open', async () => {
    try{
        await client.login({username: 'admin', password: 'admin'})

        console.log('connected to server');
        console.log(`square(5,4) = ${await client.call('square', [5,4])}`)
        console.log(`square(3) = ${await client.call('square', [3])}`)
        console.log(`sum(2) = ${await client.call('sum', [2])}`);
        console.log(`sum(2,4,6,8,10) = ${await client.call('sum', [2,4,6,8,10])}`);
        console.log(`mul(3) = ${await client.call('mul', [3])}`);
        console.log(`mul(3,5,7,9,11,13) = ${await client.call('mul', [3,5,7,9,11,13])}`);
        
        console.log(`fib(1) = ${await client.call('fib', [1])}`);
        console.log(`fib(2) = ${await client.call('fib', [2])}`);
        console.log(`fib(7) = ${await client.call('fib', [7])}`);
        console.log(`fact(0) = ${await client.call('fact', [0])}`);
        console.log(`fact(5) = ${await client.call('fact', [5])}`);
        console.log(`fact(10) = ${await client.call('fact', [10])}`);
        console.log(`sum(square(3), square(5,4), mul(3,5,7,9,11,13))+fib(7)*mul(2,4,6) = 
${await client.call('sum',[await client.call('sum', [await client.call('square', [3]), await client.call('square', [5,4]), await client.call('mul', [3,5,7,9,11,13])]), await client.call('mul',[await client.call('fib', [7]),await client.call('mul', [2,4,6])])])}`);
        
        

    } catch(err){
        console.log('Authentification failed:',err);
    }
})