const http = require('http');
const fs = require('fs');
const path = require('path');

const file = fs.createWriteStream('./clients/static/File.txt'); 

let options = {
    host: 'localhost',
    path: '/doFileGet',
    port: 5000,
    method: 'GET',
};

const req = http.request(options, (res) => {
    if (res.statusCode === 200) {
        res.pipe(file);

        file.on('finish', () => {
            file.close(() => {
                console.log('File downloaded and saved:', './clients/static/File.txt');
            });
        });

        file.on('error', (err) => {
            console.log('Error writing file:', err.message);
        });
    } else {
        console.log(`Failed to download file. Status: ${res.statusCode}`);
        res.resume();
    }
});

req.on('error', (e) => console.error(`Request error: ${e.message}`));
req.end();
