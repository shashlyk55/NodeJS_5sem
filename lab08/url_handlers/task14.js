const fs = require('fs')
const path = require('path')
const mp = require('multiparty')

module.exports = function uploadHandler(req, res){
    let form = new mp.Form({ uploadDir: './static' });
    form.on('file', (name, file) => {
        console.log(`filename: ${file.originalFilename} in ${file.path}`);
    });
    form.on('error', err => { res.end(`form returned error: ${err}`) });
    form.on('close', () => {
        res.end('File uploaded');
    });
    form.parse(req);  
}