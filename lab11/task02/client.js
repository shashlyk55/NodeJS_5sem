const WebSocket = require('ws')
const path = require('path')
const fs = require('fs')

const ws = new WebSocket('ws://localhost:4000/task02')

const clientsDir = path.join(__dirname, 'clients_files')

ws.on('open', () => {
    console.log('Connected to server');
    ws.send('SEND_FILES');
});

let fileStream = null
let filename = null

ws.on('message', (message) => {
    
        if (message.toString().startsWith('START:')) {
            filename = message.toString().split(':')[1].trim();
            const filePath = path.join(clientsDir, filename);
            fileStream = fs.createWriteStream(filePath);
            console.log(`Receiving file: ${filename}`);
        } else if (message.toString().startsWith('END:')) {    
            fileStream.end();
            filename = null
            console.log(`file received and saved`);
        } else if (message.toString().startsWith('ALL_FILES_SENT')) {
            console.log('all files recieved');
            ws.close()
        }

    else if(filename && fileStream){
        fileStream.write(message)
    }
})

ws.on('error', (err) => {
    console.log('error:', err.message);
});