const rpcws = require('rpc-websockets').Client
const readline = require('readline');

const client = new rpcws('ws://localhost:4000');

client.on('open', () => {
    console.log('connected to server');
    console.log('A B C for sending notify');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.on('line', async (line) => {
        const type = line.trim().toUpperCase();
        if (['A', 'B', 'C'].includes(type)) {
            try {
                const response = await client.call('notify', { type });
                console.log(`server response: ${response}`);
            } catch (err) {
                console.error('error sending notify:', err);
            }
        } else {
            console.log('uncorrect input');
        }
    });
});
