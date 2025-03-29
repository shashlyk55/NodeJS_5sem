const udp = require('dgram')

const PORT = 3000
const client = udp.createSocket('udp4')

client.on('message', (msg, info) => {
    console.log(`from server: ${msg.toString()}`);
})

let data = Buffer.from(`Client 01 - Hi`)
client.send(data, PORT, 'localhost',(err) => {
    if(err){
        console.log('client error');
        client.close()
    }
})

let data1 = Buffer.from('Hello ')
let data2 = Buffer.from('world')

client.send([data1, data2],PORT,'localhost',(err)=>{
    if(err){
        console.log('client error');
        client.close()
    }
})