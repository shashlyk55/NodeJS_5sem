const fs = require('fs')
const path = require('path')
const mimetypes = require('../mimeTypes')

module.exports = function filesHandler(req, res){
    const parsedUrl = req.url.split('/')

    const dir = path.join(__dirname, '../static')

    if(parsedUrl.length === 2){

        fs.readdir(dir, (err, files) => {
            if(err){
                res.writeHead(400, {'Content-Type': 'text/plain'})
                res.end('Server error')   
            } else {
                const filesCount = files.filter((file) => {
                    const filePath = path.join(dir, file)    
                    return fs.statSync(filePath).isFile()
                }).length

                res.writeHead(200, {
                    'Content-Type': 'text/text',
                    'x-static-files-count': filesCount
                })
                res.end()
            }
        })
    } else if(parsedUrl.length === 3){
        const filename = parsedUrl[2]

        fs.readdir(dir, (err, files) => {
            if(err){
                res.writeHead(400, {'Content-Type': 'text/plain'})
                res.end('Server error: read dir error')   
                return
            } 
            const responseFile = files.find((f) => f.split('.')[0] === filename)

            if(!responseFile) {
                res.writeHead(404, { "Content-Type": "text/plain" })
                res.end("Server error: file not found")
                return
            }

            const filePath = path.join(dir, responseFile)
            const fileExt = path.extname(filePath)
            const mimeType = mimetypes[fileExt]
            
            console.log(filePath);
            console.log(fileExt);
            console.log(mimeType);
            
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('File not found');
                } else {
                    const stream = fs.createReadStream(filePath);
                    res.writeHead(200, { 'Content-Type': 'application/octet-stream' }); // Устанавливаем корректный Content-Type
                    stream.pipe(res);
                }
            });
        })
        
        


    } else {
        res.writeHead(400, {'Content-Type': 'text/plain'})
        res.end('Unknown url')
    }
}