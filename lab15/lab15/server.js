const http = require('http')
const url = require('url')

const PulpitModel = require('./models/Pulpit')
const FacultyModel = require('./models/Faculty')

const mongoose = require('mongoose');

const dbURI = 'mongodb://localhost:27017/nodejs_db';

mongoose.connect(dbURI)
  .then(() => console.log('Подключение к базе данных успешно'))
  .catch(err => console.log('Ошибка подключения:', err));

const HOST = '127.0.0.1'
const PORT = 3000

const server = http.createServer()

const httpHandler = async (req, res) => {
    const parsedUrl = url.parse(req.url, true)
    const pathname = parsedUrl.pathname
    const splitUrl = pathname.split('/')

    res.setHeader('Content-Type', 'application/json');

        if(req.method === 'GET'){
            if(pathname === '/api/faculties') {
                console.log('get faculties');

                const items = await FacultyModel.find().lean();
                res.statusCode = 200;
                res.end(JSON.stringify(items));

            } else if(pathname === '/api/pulpits') {
                console.log('get pulpits');

                const items = await PulpitModel.find().populate('faculty', {
                    faculty: 1,
                });
                res.statusCode = 200;
                res.end(JSON.stringify(items));
            } 
        } else if(req.method === 'POST'){
            if(pathname === '/api/faculties') {
                console.log('post faculty');

                let body = '';
                req.on('data', chunk => {
                    body += chunk;
                });

                req.on('end', async () => {
                try {
                    const parsedBody = JSON.parse(body)

                    const doc = new FacultyModel({
                        faculty: parsedBody.faculty,
                        faculty_name: parsedBody.faculty_name
                    })
                    const chat = await doc.save()
                    
                    res.statusCode = 201;
                    res.end(JSON.stringify(chat));
                } catch (err) {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ message: 'Ошибка при создании объекта', error: err.message }));
                }
                });

            } else if(pathname === '/api/pulpits') {
                console.log('post pulpit');

                let body = '';
                req.on('data', chunk => {
                    body += chunk;
                });

                req.on('end', async () => {
                    try {
                        const parsedBody = JSON.parse(body);
                        
                        const faculty = await FacultyModel.findOne({_id: parsedBody.faculty})
                        if (!faculty) {
                            res.statusCode = 404;
                            return res.end(JSON.stringify({ message: 'Факультет не найден' }));
                        }
                        
                        const doc = await PulpitModel({
                            pulpit: parsedBody.pulpit,
                            pulpit_name: parsedBody.pulpit_name,
                            faculty: parsedBody.faculty
                        })

                        const pulpit = await doc.save()

                        res.statusCode = 201;
                        res.end(JSON.stringify(pulpit));
                    } catch (err) {
                        res.statusCode = 500;
                        res.end(JSON.stringify({ message: 'Ошибка при создании объекта', error: err.message }));
                    }
                });
            } 
        } else if(req.method === 'PUT'){
            if(pathname === '/api/faculties') {
                console.log('put faculty');

                let body = '';
                req.on('data', chunk => {
                    body += chunk;
                });

                req.on('end', async () => {
                    const parsedBody = JSON.parse(body);
                    const faculty = await FacultyModel.findOne({faculty: parsedBody.faculty})
                    
                    if(!faculty){
                        res.statusCode = 404;
                        res.end(JSON.stringify({ message: 'faculty not found' }));
                    }
                    const result = await FacultyModel.findOneAndUpdate(
                        {faculty: parsedBody.faculty}, 
                        {faculty_name: parsedBody.faculty_name},
                        {new: true});
                                        
                    if (result) {
                        res.statusCode = 200;
                        res.end(JSON.stringify(result));
                    } else {
                        res.statusCode = 500;
                        res.end(JSON.stringify({ message: 'faculty not updated' }));
                    }
                });

            } else if(pathname === '/api/pulpits') {
                console.log('put pulpit');

                let body = '';
                req.on('data', chunk => {
                    body += chunk;
                });

                req.on('end', async () => {
                    const parsedBody = JSON.parse(body);
                    try {
                        const faculty = await FacultyModel.findOne({_id: parsedBody.faculty});
                        console.log(faculty);
                        
                        if (!faculty) {
                            res.statusCode = 404;
                            return res.end(JSON.stringify({ message: 'Факультет не найден' }));
                        }
                        
                        const result = await PulpitModel.findOneAndUpdate(
                            {pulpit: parsedBody.pulpit},
                            {
                                pulpit: parsedBody.pulpit,
                                pulpit_name: parsedBody.pulpit_name,
                                faculty: parsedBody.faculty
                            },
                            { new: true });
                        if (result) {
                            res.statusCode = 200;
                            res.end(JSON.stringify(result));
                        } else {
                            res.statusCode = 500;
                            res.end(JSON.stringify({ message: 'Pulpit not updated' }));
                        }
                    } catch (err) {
                        res.statusCode = 500;
                        res.end(JSON.stringify({ message: 'Ошибка при обновлении объекта', error: err.message }));
                    }
                });
            } 
        } else if(req.method === 'DELETE'){
            if(splitUrl[1] && splitUrl.length === 4){
                const code = splitUrl[3]
                console.log(code);
                
                if(splitUrl[2] === 'faculties'){
                    console.log('delete faculty');
                    
                    const result = await FacultyModel.deleteOne({ faculty: code });
                    if (result.deletedCount > 0) {
                        res.statusCode = 200;
                        res.end(JSON.stringify({ result }));
                    } else {
                        res.statusCode = 500;
                        res.end(JSON.stringify({ message: 'faculty not deleted' }));
                    }

                } else if(splitUrl[2] === 'pulpits') {
                    console.log('delete pulpit');
                    const result = await PulpitModel.deleteOne({ pulpit: code });
                    if (result.deletedCount > 0) {
                        res.statusCode = 200;
                        res.end(JSON.stringify({ result }));
                    } else {
                        res.statusCode = 404;
                        res.end(JSON.stringify({ message: 'pulpit not deleted' }));
                    }
                }
            }
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ message: 'Not Found' }));
        }
    
}

server.on('request', httpHandler)

server.listen(PORT,HOST, () => console.log(`http server on ${HOST}:${PORT}`))