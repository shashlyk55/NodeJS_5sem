const rpcws = require('rpc-websockets').Server

const server = new rpcws({ port: 4000 });

console.log('server started');

server.register('notify', (params) => {
    const type = params.type.toUpperCase();
    switch(type){
        case 'A':
            console.log(`notify A`);
            return `notify A processed`;
        case 'B':
            console.log(`notify B`);
            return `notify B processed`;
        case 'C':
            console.log(`notify C`);
            return `notify C processed`;
        default:
            console.log(`unknown notify: ${type}`);
            return `error, unknown notify: ${type}`;
    }
    
});
