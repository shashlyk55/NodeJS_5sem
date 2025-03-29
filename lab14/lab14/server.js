const http = require('http')
const path = require('path')
const fs = require('fs')
const url = require('url')

const mssql = require('mssql')

const poolConfig = {
    user: 'user_js',
    password: '123QWEasdzxc',
    server: 'DESKTOP-9MC22NJ',
    database: 'univer_db',
    pool: {
      max: 10, 
      min: 0,  
      idleTimeoutMillis: 30000 
    },
    options: {
      encrypt: true,
      trustServerCertificate: true
    }
  };

const poolPromise = new mssql.ConnectionPool(poolConfig)
    .connect()
    .then(pool => {
        console.log('Connected to SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('Database connection failed:', err);
    }
);

const HOST = '127.0.0.1'
const PORT = 4000

const httpHandler = async (req, res) => {
    const parsedUrl = url.parse(req.url, true)
    const pathname = parsedUrl.pathname

    if(req.method === 'GET'){
        if(pathname === '/') {
            fs.readFile(path.join(__dirname, 'index.html'),(err, data) => {
                if(err) {
                    res.writeHead(400, {'Content-Type': 'text/plain'})
                    res.end('server error')
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html'})
                    res.end(data)
                }
            })
        } else if(pathname === '/api/faculties'){
            let faculties

            console.log('get faculties');
            
            res.writeHead(200, {'Content-Type': 'application/json'})
            res.end(faculties)
        } else if(pathname === '/api/pulpits'){            
            console.log('get pulpits');

            try {
                const pool = await poolPromise; // Получение пула
                //const pool = await mssql.connect(config);

                const result = await pool.request().query('SELECT * FROM PULPIT');

                res.writeHead(200, {'Content-Type': 'application/json'})
                res.end(JSON.stringify(result.recordset))
            } catch (err) {
                console.error('Error executing query:', err);
            }
            
        } else if(pathname === '/api/subjects'){
            let faculties
            
            console.log('get subjects');
            
            res.writeHead(200, {'Content-Type': 'application/json'})
            res.end(faculties)
        } else if(pathname === '/api/auditoriumTypes'){
            let faculties
            
            console.log('get auditoriumTypes');
            
            res.writeHead(200, {'Content-Type': 'application/json'})
            res.end(faculties)
        } else if(pathname === '/api/auditoriums'){
            let faculties
            
            console.log('get auditoriums');
            
            res.writeHead(200, {'Content-Type': 'application/json'})
            res.end(faculties)
        } 
    } else if(req.method === 'POST'){
        if(pathname === '/api/faculties'){
            let data = ""
            req.on('data', (chunk) => {
                data += chunk
            })

            req.on('end', () => {
                const faculty = JSON.parse(data)
                
                console.log('post faculty');
                console.log(faculty);
                
                let err
                res.writeHead(500, {'Content-Type': 'application/json'})
                res.end(JSON.stringify(err))
            })
        } else if(pathname === '/api/pulpits'){
            let data = ""
            req.on('data', (chunk) => {
                data += chunk
            })

            req.on('end', async () => {
                try {
                    const newPulpit = JSON.parse(data)

                    console.log('post pulpit');
                    console.log(newPulpit);

                    const { pulpit, pulpitName, faculty } = newPulpit;

                    const query = `INSERT INTO PULPIT (PULPIT, PULPIT_NAME, FACULTY) VALUES ('${pulpit}', '${pulpitName}', '${faculty}')`;

                    const pool = await poolPromise; // Получение пула
                    const result = await pool.request().query(query);
                    console.log(result);
                    
                    res.writeHead(200, {'Content-Type': 'application/json'})
                    res.end(JSON.stringify(newPulpit));
                } catch (err) {
                    console.log(err);
                    res.statusCode = 400;
                    res.end(err.toString());
                }
            })
        } else if(pathname === '/api/subjects'){
            let data = ""
            req.on('data', (chunk) => {
                data += chunk
            })

            req.on('end', () => {
                const subject = JSON.parse(data)
                
                console.log('post subject');
                console.log(subject);
                
                let err 
                res.writeHead(500, {'Content-Type': 'application/json'})
                res.end(JSON.stringify(err))
            })
        } else if(pathname === '/api/auditoriumTypes'){
            let data = ""
            req.on('data', (chunk) => {
                data += chunk
            })

            req.on('end', () => {
                const auditoriumType = JSON.parse(data)
                
                console.log('post auditoriumType');
                console.log(auditoriumType);
                
                let err 
                res.writeHead(500, {'Content-Type': 'application/json'})
                res.end(JSON.stringify(err))
            })
        } else if(pathname === '/api/auditoriums'){
            let data = ""
            req.on('data', (chunk) => {
                data += chunk
            })

            req.on('end', () => {
                const auditorium = JSON.parse(data)
                
                console.log('post auditoriumType');
                console.log(auditorium);
                
                let err 
                res.writeHead(500, {'Content-Type': 'application/json'})
                res.end(JSON.stringify(err))
            })
        } 
    } else if(req.method === 'PUT'){
        if(pathname === '/api/faculties'){
            let data = ""
            req.on('data', (chunk) => {
                data += chunk
            })

            req.on('end', () => {
                const faculty = JSON.parse(data)
                
                console.log('put faculty');
                console.log(faculty);
                
                let err
                res.writeHead(500, {'Content-Type': 'application/json'})
                res.end(JSON.stringify(err))
            })
        } else if(pathname === '/api/pulpits'){
            let data = ""
            req.on('data', (chunk) => {
                data += chunk
            })

            req.on('end', async () => {
                try{
                    const newPulpit = JSON.parse(data)
                    const { pulpit, pulpitName, faculty } = newPulpit;

                    console.log('put pulpit');
                    console.log(newPulpit);

                    const query = `UPDATE PULPIT SET PULPIT_NAME = '${pulpitName}', FACULTY = '${faculty}' WHERE PULPIT = '${pulpit}';`;

                    const pool = await poolPromise; // Получение пула
                    const result = await pool.request().query(query);
                    console.log(result.rowsAffected.length);
                    
                    const updatedPulpits = result.rowsAffected.length > 0 ? data : null;

                    res.writeHead(200, {'Content-Type': 'application/json'})
                    res.end(JSON.stringify(updatedPulpits));   
                }             
                catch(err){
                    console.log(err);
                    res.statusCode = 400
                    res.end(err.toString())
                }
                    
            })
        } else if(pathname === '/api/subjects'){
            let data = ""
            req.on('data', (chunk) => {
                data += chunk
            })

            req.on('end', () => {
                const subject = JSON.parse(data)
                
                console.log('put subject');
                console.log(subject);
                
                let err 
                res.writeHead(500, {'Content-Type': 'application/json'})
                res.end(JSON.stringify(err))
            })
        } else if(pathname === '/api/auditoriumTypes'){
            let data = ""
            req.on('data', (chunk) => {
                data += chunk
            })

            req.on('end', () => {
                const auditoriumType = JSON.parse(data)
                
                console.log('put auditoriumType');
                console.log(auditoriumType);
                
                let err 
                res.writeHead(500, {'Content-Type': 'application/json'})
                res.end(JSON.stringify(err))
            })
        } else if(pathname === '/api/auditoriums'){
            let data = ""
            req.on('data', (chunk) => {
                data += chunk
            })

            req.on('end', () => {
                const auditorium = JSON.parse(data)
                
                console.log('put auditoriumType');
                console.log(auditorium);
                
                let err 
                res.writeHead(500, {'Content-Type': 'application/json'})
                res.end(JSON.stringify(err))
            })
        } 
    } else if(req.method === 'DELETE'){
        const urlParts = pathname.split('/')
        if(urlParts[1] === 'api' && urlParts.length === 4){
            const id = urlParts[3]

            if(urlParts[2] === 'faculties'){       
                console.log('delete faculty');
                console.log();
                
                let err
                res.writeHead(500, {'Content-Type': 'application/json'})
                res.end(JSON.stringify(err))
            } else if(urlParts[2] === 'pulpits'){

                try{
                    console.log('delete pulpit');
                    console.log();

                    let deletedPulpit

                    const selectQuery = `SELECT * FROM PULPIT WHERE PULPIT = '${id}'`;
                    const deleteQuery = `DELETE FROM PULPIT WHERE PULPIT = '${id}'`;
                    console.log(selectQuery);
                    

                    const pool = await poolPromise; // Получение пула

                    const rows = await pool.request().query(selectQuery);
                    
                    console.log(rows.recordset);
                    
                    if (rows.recordset.length === 0) 
                        deletedPulpit = null;
                    else {
                        await pool.request().query(deleteQuery);
    
                        deletedPulpit = rows.recordset[0]
                    }
                    console.log(deletedPulpit);
                    

                    res.statusCode = 200;
                    res.end(JSON.stringify(deletedPulpit));
                } catch(err){
                    console.log(err);
                    res.statusCode = 400
                    res.end(err.toString())
                }
            } else if(urlParts[2] === 'subjects'){
                console.log('delete subject');
                console.log();
                
                let err 
                res.writeHead(500, {'Content-Type': 'application/json'})
                res.end(JSON.stringify(err))
            } else if(urlParts[2] === 'auditoriumTypes'){
                console.log('delete auditoriumType');
                console.log();
                
                let err 
                res.writeHead(500, {'Content-Type': 'application/json'})
                res.end(JSON.stringify(err))
            } else if(urlParts[2] === 'auditoriums'){
                console.log('delete auditoriumType');
                console.log();
                
                let err 
                res.writeHead(500, {'Content-Type': 'application/json'})
                res.end(JSON.stringify(err))
            } 
        }
    }
}

const server = http.createServer()
server.on('request', httpHandler)

server.listen(PORT,HOST,() => console.log(`http server: ${HOST}:${PORT}`))