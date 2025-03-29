const WebSocket = require('ws')
const fs = require('fs')
const path = require('path')


const downloadDir = path.join(__dirname, 'download');

const PORT = 4000
const ws_server = new WebSocket.Server({port: PORT, path: '/task02'})
console.log(`ws server started on localhost:${PORT}`);

ws_server.on('connection', (ws) => {
    
    ws.on('message', (message) => {
        if(message.toString() === 'SEND_FILES'){
            sendFiles(ws)
        }
    })
});



async function sendFiles(ws) {
    try {
        const files = fs.readdirSync(downloadDir)
        console.log(files);
        
        for(const file of files){
            const filepath = path.join(downloadDir, file)

            if (fs.statSync(filepath).isFile()) {
                const fileStream = fs.createReadStream(filepath)

                await new Promise((resolve, reject) => {
                    ws.send(`START:${file}`, (err) => {
                        if(err) 
                            return reject(err)
                        
                        fileStream.on('data', (chunk) => {
                        ws.send(chunk, (err) => {
                            if(err)
                                console.log(`error sending chunk: ${err.message}`);
                        })
                        })

                        fileStream.on('end', () => {
                            ws.send(`END:${file}`, () => {
                                console.log(`file ${file} sent`);
                                resolve()
                            })
                        })
                        
                        fileStream.on('error', (err) => {
                            console.log(`error: ${err.message}`);
                            reject(err)
                        })
                    })
                })
            }
        }
        ws.send('ALL_FILES_SENT')
    } catch (err){
        console.log(`error sending files: ${err.message}`);
    }
}
