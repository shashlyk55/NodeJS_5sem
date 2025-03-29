const rpcws = require('rpc-websockets').Client

const client = new rpcws('ws://localhost:4000');

client.on('open', () => {
    console.log('connected to server');
    client.subscribe('A');
    client.on('A', () => {
        console.log('event A');
    });
});
