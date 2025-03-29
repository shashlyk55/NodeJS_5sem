const WebSocket = require('ws')
const fs = require('fs')
const path = require('path')



const uploadDir = path.join(__dirname, 'upload');

const PORT = 4000
const ws_server = new WebSocket.Server({port: PORT, path: '/task01'})
console.log(`ws server started on localhost:${PORT}`);

ws_server.on('connection', (ws) => {
    // Создаем поток из WebSocket
    const stream = WebSocket.createWebSocketStream(ws, { encoding: 'utf8' });

    let filename = '';

    // Получаем имя файла (первое сообщение от клиента)
    stream.once('data', (data) => {
        filename = data.toString().trim();
        console.log(`Getting file: ${filename}`);

        const writeStream = fs.createWriteStream(path.join(uploadDir, filename));

        // Перенаправляем данные из WebSocket потока в файл
        stream.pipe(writeStream);

        writeStream.on('finish', () => {
            console.log(`file ${filename} uploaded`);
        });

        writeStream.on('error', (err) => {
            console.error(`error file loading: ${err.message}`);
        });
    });
});
