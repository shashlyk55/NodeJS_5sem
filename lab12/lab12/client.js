
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:4000');

ws.on('open', function open() {
    console.log('Connected to server');
});

ws.on('message', function incoming(data) {
    const message = JSON.parse(data);
    if (message.type === 'file_changed') {
        console.log(message.message);  // Логирование уведомления об изменении файла
    }
});