const rpcws = require('rpc-websockets').Server
const readline = require('readline');

const server = new rpcws({ port: 4000 });

server.event('A');
server.event('B');
server.event('C');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log('A B C to generate event:');

rl.on('line', (line) => {
    const input = line.trim().toUpperCase();
    if (['A', 'B', 'C'].includes(input)) {
        console.log(`event ${input}`);
        server.emit(input); 
    } else {
        console.log('uncorrect');
    }
});
