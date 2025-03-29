const fs = require('fs')
const http = require('http')
const path = require('path')
const url = require('url')
const ws = require('ws')
const chokidar = require('chokidar')

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true)
    const pathParts = req.url.split('/');

    const fileName = 'StudentList.json'
    const file = path.join(__dirname, `/static/${fileName}`)
    const staticDir = path.join(__dirname, 'static')

    if (req.method === 'GET') {
        if (parsedUrl.pathname === '/'){
            fs.readFile(file, (err, data) => {
                if (err) {
                    console.log('Error reading file:', err);
                    let errObj = {
                        error: 1,
                        message: `Error reading file: ${file}`
                    }
                    res.writeHead(507, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(errObj));
                } else {
                    console.log(JSON.parse(data));
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(data);
                }
            })
        }
        else if (parsedUrl.pathname === '/backup') {
            getFilesCopies(req, res, staticDir)
        }
        else if (/^\/\d+$/.test(parsedUrl.pathname)) {
            const n = parseInt(parsedUrl.pathname.slice(1))
            //console.log(n)

            fs.readFile(file, (err, data) => {
                if (err) {
                    console.error('Error reading file:', err);
                    let errObj = {
                        error: 1,
                        message: `Error reading file: ${file}`
                    }
                    res.writeHead(507, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(errObj));
                } else {
                    const students = JSON.parse(data)
                    const student = students.filter((el) => el.id === n)[0]

                    if(student == null || student.length == 0){
                        let errObj = {
                            error: 2,
                            message: `student with id = ${n} not found`
                        }
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(errObj));
                    } else {
                        //console.log(student);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(student));
                    }
                }
            })
        }
        else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        }
    }
    else if (req.method === 'POST') {
        if(parsedUrl.pathname === '/'){
            let data = ''

            req.on('data', (chunk) => {
                data += chunk;
            })

            req.on('end', () => {
                const student = JSON.parse(data)
                addStudent(req, res, file, student)
            })
        }
        else if(parsedUrl.pathname === '/backup'){
            copyFile(req, res, staticDir, fileName)
        }
        else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        }
    } else if (req.method === 'PUT') {
        if(parsedUrl.pathname === '/'){
            let data = ''

            req.on('data', (chunk) => {
                data += chunk;
            })
            req.on('end', () => {
                const student = JSON.parse(data)
                console.log(student);

                editStudent(req, res, file, student)
            })
        }
        else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        }
    } else if (req.method === 'DELETE') {
        if (/^\/\d+$/.test(parsedUrl.pathname)) {
            const n = parseInt(parsedUrl.pathname.slice(1))
            deleteStudent(req, res, file, n)
        }
        else if(pathParts[1] === 'backup' && /^\d{8}$/.test(pathParts[2])) {
            const date = pathParts[2]
            deleteFiles(req, res, staticDir, date)
        }
        else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        }
    }
})

const PORT = 4000
const HOST = 'localhost'
server.listen(PORT, HOST, () => {
    console.log(`server started on ${HOST}:${PORT}`);
})


function addStudent(req, res, file, student) {
    fs.readFile(file, (err, data) => {
        if (err) {
            console.log('Error reading file:', err);
            let errObj = {
                error: 1,
                message: `Error reading file: ${file}`
            }
            res.writeHead(507, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(errObj));
        } else {
            students = JSON.parse(data)
            //console.log(students);

            if(students.filter((el) => el.id === student.id).length === 0){
                students.push(student)

                fs.writeFile(file, JSON.stringify(students), (err) => {
                    if (err) {
                        console.log('Error writing file:', err);
                        let errObj = {
                            error: 4,
                            message: `Error writing file: ${file}`
                        }
                        res.writeHead(508, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(errObj));
                    } else {
                        console.log('File successfully overwritten');
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(student));
                    }
                })
            } else {
                let errObj = {
                    error: 3,
                    message: `student with id = ${student.id} is already exists in list`
                }
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end(JSON.stringify(errObj));
            }
        }
    })
}
function editStudent(req, res, file, student) {
    fs.readFile(file, (err, data) => {
        if (err) {
            console.log('Error reading file:', err);
            let errObj = {
                error: 1,
                message: `Error reading file: ${file}`
            }
            res.writeHead(507, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(errObj));
        } else {
            students = JSON.parse(data)
            //console.log(students);

            if(students.filter((el) => el.id === student.id).length !== 0){
                students.forEach((el) => {
                    if(el.id === student.id){
                        el.name = student.name;
                        el.bday = student.bday;
                        el.speciality = student.speciality;
                    }
                })

                fs.writeFile(file, JSON.stringify(students), (err) => {
                    if (err) {
                        console.log('Error writing file:', err);
                        let errObj = {
                            error: 4,
                            message: `Error writiong file: ${file}`
                        }
                        res.writeHead(508, { 'Content-Type': 'text/plain' });
                        res.end(JSON.stringify(errObj));
                    } else {
                        console.log('File successfully overwritten');
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(student));
                    }
                })
            } else {
                let errObj = {
                    error: 2,
                    message: `student with id = ${student.id} not found`
                }
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(errObj));
            }
        }
    })
}
function deleteStudent(req, res, file, id){
    fs.readFile(file, (err, data) => {
        if (err) {
            console.log('Error reading file:', err);
            let errObj = {
                error: 1,
                message: `Error reading file: ${file}`
            }
            res.writeHead(507, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(errObj));
        } else {
            const students = JSON.parse(data)
            let student

            if(students.filter((el) => el.id === id).length !== 0) {
                students.forEach((el, index) => {
                    if(el.id === id){
                        student = el
                        students.splice(index, 1)
                    }
                })

                fs.writeFile(file, JSON.stringify(students), (err) => {
                    if (err) {
                        console.log('Error writing file:', err);
                        let errObj = {
                            error: 4,
                            message: `Error writiong file: ${file}`
                        }
                        res.writeHead(508, {'Content-Type': 'text/plain'});
                        res.end(JSON.stringify(errObj));
                    } else {
                        console.log('File successfully overwritten');
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify(student));
                    }
                })
            }
            else {
                let errObj = {
                    error: 2,
                    message: `student with id = ${id} not found`
                }
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(errObj));
            }

        }
    })
}
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // месяцы начинаются с 0
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}
function copyFile(req, res, staticDir, fileName){
    const date = new Date()
    //console.log(formatDate(date))

    setTimeout(() => {
        fs.copyFile(path.join(staticDir, fileName), path.join(staticDir, `${formatDate(date)}_${fileName}`), (err) => {
            if (err) {
                console.log('error copying file:', err);

                let errObj = {
                    error: 5,
                    message: `Error copying file: ${file}`
                }
                res.writeHead(509, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(errObj));
            } else {
                console.log('coping successfully');
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end();
            }
        })
    }, 2000)
}
function deleteFiles(req, res, staticDir, date) {
    fs.readdir(staticDir, (err, files) => {
        if (err) {
            let errObj = {
                error: 6,
                message: `Error reading directory: ${staticDir}`
            }
            res.writeHead(510, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(errObj));
        } else {
            files.forEach(file => {
                const pathDate = date + '000000'
                const fileDate = file.split('_');

                if(fileDate.length == 2 && fileDate < pathDate){
                    const filePath = path.join(staticDir, file);

                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.log(`error deleting file ${file}: ${err}`);
                        } else {
                            console.log(`file ${file} deleted`);
                        }
                    });
                }
            });
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('files deleted');
        }
    });
}
function getFilesCopies(req, res, staticDir) {
    fs.readdir(staticDir, (err, files) => {
        if (err) {
            let errObj = {
                error: 6,
                message: `Error reading directory: ${staticDir}`
            }
            res.writeHead(510, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(errObj));
        } else {
            const fileCopies = []

            files.forEach(file => {
                const fileDate = file.split('_');

                if(fileDate.length == 2){
                    fileCopies.push(file);
                }
            });

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(fileCopies));
        }
    });
}


const WS_PORT = 5000
const WS_HOST = 'localhost'
//const ws_server = new ws.Server({ port: WS_PORT, host: WS_HOST, path: '/ws'})
const ws_server = new ws.Server({ server })

let clients = []

ws_server.on('connection', (ws) => {
    console.log('client connected');
    clients.push(ws);

    ws.on('close', () => {
        console.log('Client disconnected');
        clients = clients.filter(client => client !== ws);
    });
})

const staticDir = path.join(__dirname, '/static')

const watcher = chokidar.watch(staticDir, {
    persistent: true,
    ignoreInitial: true // не генерировать события при старте
})

watcher.on('change', (filePath) => {
    const parsedPath = filePath.split('/')
    const parsedFileName = parsedPath[parsedPath.length - 1].split('_')

    if(parsedFileName.length != 2){
        console.log(`File ${filePath} has been changed`);

        // Уведомляем всех клиентов
        clients.forEach(client => {
            if (client.readyState === ws.OPEN) {
                client.send(JSON.stringify({
                    type: 'file_changed',
                    message: `File ${filePath} has been modified`
                }));
            }
        });
    }
    }
)
