const http = require('http')
const path = require('path')
const fs = require('fs')
const url = require('url')
const xml2js = require('xml2js');
const xmlbuilder = require('xmlbuilder')
const mp = require('multiparty')

const server = http.createServer()
const PORT = 5000
const HOSTNAME = 'localhost'

let httpHandler = (req, res) => {
    if(req.method === 'GET'){
        /*if(req.url === '/') {
            fs.readFile(path.join(__dirname, './clients/client01.html'), (err, data) => {
                if(err) {
                    res.writeHead(400, {'Content-Type': 'text/plain'})
                    res.end('Server error')
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html'})
                    res.end(data)
                }
            })
        }*/ // task 01
        if(req.url === '/doGet') {
            let obj = {
                message: 'Hello client',
            }
            res.writeHead(200, {'Content-Type': 'text/text'})
            res.end(JSON.stringify(obj))

        } // task 02
        else if(req.url.startsWith('/doSum')) {
            const parsedUrl = url.parse(req.url, true)
            const queryParams = parsedUrl.query
            let sum = parseInt(queryParams.x) + parseInt(queryParams.y)
            res.writeHead(200, {'Content-Type': 'text/text'})
            res.end(JSON.stringify(sum))
        } // task 08
        else if(req.url === '/doFileGet') {
            const FILE_PATH = path.join(__dirname, './servers/static/text.txt'); // Путь к файлу для отправки

            const fileStream = fs.createReadStream(FILE_PATH);
            fileStream.pipe(res);    

            res.writeHead(200, {
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': `attachment; filename="${path.basename(FILE_PATH)}"`,
            });

        }
    } else if(req.method === 'POST') {
        // task 03
        if(req.url.startsWith('/doPost')){
            const parsedUrl = url.parse(req.url, true)
            const queryParams = parsedUrl.query
            let result = parseInt(queryParams.x) + parseInt(queryParams.y) * parseInt(queryParams.s)
            res.writeHead(200, {'Content-Type': 'text/text'})
            res.end(JSON.stringify(result))
        } // task 04
        else if(req.url === '/doJsonPost'){
            let result = ''
            req.on('data', (chunk) => {
                result += chunk
            })

            req.on('end', () => {
                let obj = JSON.parse(result)

                let resObj = {
                    __comment: obj.__comment,
                    x_plus_y: obj.x + obj.y,
                    concat_s_o: `${obj.s} ${obj.o.surname} ${obj.o.name}`,
                    length_m: obj.m.length
                }

                res.writeHead(200, {'Content-Type': 'application/json'})
                res.end(JSON.stringify(resObj))
            })
        }
        // task 05
        else if(req.url === '/doXmlPost'){
            let result = ''
            req.on('data', (chunk) => {
                result += chunk
            })

            req.on('end', async () => {
                // Функция для парсинга XML
                const parseXML = (xml) =>
                    new Promise((resolve, reject) => {
                        xml2js.parseString(xml, { explicitArray: false }, (err, result) => {
                            if (err) reject(err);
                            else resolve(result);
                        });
                    });

                try {
                    // Парсинг входного XML
                    const parsedRequest = await parseXML(result);
                    const request = parsedRequest.request;

                    // Извлечение значений из элементов <x> и <m>
                    const xValues = request.x ? [].concat(request.x).map((x) => parseInt(x.$.value)) : [];
                    const mValues = request.m ? [].concat(request.m).map((m) => m.$.value) : [];

                    // Подсчет суммы и конкатенации
                    const sum = xValues.reduce((acc, val) => acc + val, 0);
                    const concat = mValues.join("");

                    // Создание ответа в формате XML
                    const responseXML = xmlbuilder
                        .create("response")
                        .ele("sum", { element: "x", result: sum })
                        .up()
                        .ele("concat", { element: "m", result: concat })
                        .end({ pretty: true });

                    // Отправка ответа
                    res.writeHead(200, { "Content-Type": "text/xml" });
                    res.end(responseXML);
                } catch (error) {
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    res.end("Server error");
                    console.log("Error processing request:", error);
                }
            })
        } // task 06 07
        else if(req.url === '/doTxtPost' || req.url === '/doPngPost'){
            let form = new mp.Form({ uploadDir: './servers/static' });

            form.on('file', (name, file) => {
                console.log(`filename: ${file.originalFilename} in ${file.path}`);
            });
            form.on('error', err => { 
                res.end(`form returned error: ${err}`) 
            });
            form.on('close', () => {
                res.end('File uploaded');
            });
            form.parse(req);
        }
        
    }
}

server.on('request', httpHandler)

server.listen(PORT, HOSTNAME, () => {
    console.log(`Server started on ${HOSTNAME}:${PORT}`);
    
})