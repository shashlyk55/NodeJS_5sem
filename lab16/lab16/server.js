const http = require('http');
const { graphql, buildSchema } = require('graphql');
const sql = require('mssql');
const fs = require('fs')
const path = require('path')


const dbConfig = {
    user: 'user_js',
    password: '123QWEasdzxc',
    server: 'DESKTOP-9MC22NJ',
    database: 'univer_db',
    pool: {
      max: 10, // Максимальное количество соединений в пуле
      min: 0,  // Минимальное количество соединений в пуле
      idleTimeoutMillis: 30000 // Время простоя до закрытия соединения
    },
    options: {
      encrypt: true,
      trustServerCertificate: true
    }
  };
  
  const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log('Connected to SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('Database connection failed:', err);
    }
  );

// Функция для выполнения SQL-запросов
async function executeQuery(query, params = []) {
  const pool = await poolPromise
  const request = pool.request();
  params.forEach(({ name, value }) => request.input(name, value));
  const result = await request.query(query);
  return result.recordset;
}

// GraphQL-схема
const schema = buildSchema(`
    type Teacher {
      teacher: String
      teacher_name: String
      pulpit: String
    }

    type Pulpit {
      pulpit: String
      pulpit_name: String
      faculty: String
    }

    type Faculty {
      faculty: String
      faculty_name: String
    }
  
    type Query {
      getFaculties(faculty: String): [Faculty]
      getPulpits(pulpit: String): [Pulpit]
      getTeachers(teacher: String, pulpit: String): [Teacher]
    }
  
    type Mutation {
      setFaculty(faculty: FacultyInput): Faculty
      delFaculty(faculty: String!): Boolean
      setPulpit(pulpit: PulpitInput): Pulpit
      delPulpit(pulpit: String!): Boolean
      setTeacher(teacher: TeacherInput): Teacher
      delTeacher(teacher: String): Boolean
    }
  
    input TeacherInput {
      teacher: String
      teacher_name: String
      pulpit: String
    }

    input PulpitInput {
      pulpit: String!
      pulpit_name: String!
      faculty: String!
    }

    input FacultyInput {
      faculty: String!
      faculty_name: String!
    }
  `);
  
  // GraphQL-резолверы
  const root = {
    getFaculties: async ({ faculty }) => {
      const query = faculty
        ? 'SELECT faculty, faculty_name FROM faculty WHERE faculty = @faculty'
        : 'SELECT faculty, faculty_name FROM faculty';
      const params = faculty ? [{ name: 'faculty', value: faculty }] : [];
      const result = executeQuery(query, params);

      // Для каждого факультета получаем кафедры
      for (const f in result) {
        const departments = await executeQuery(
          'SELECT pulpit, pulpit_name, faculty FROM pulpit WHERE faculty = @faculty',
          [{ name: 'faculty', value: f.faculty }]
        );
        f.departments = departments; // Добавляем кафедры к факультету
      }

      return result
    },
    setFaculty: async ({ faculty }) => {
      const existingFaculty = await executeQuery(
        'SELECT faculty, faculty_name FROM faculty WHERE faculty = @faculty',
        [{ name: 'faculty', value: faculty.faculty }]
      );
  
      if (existingFaculty.length > 0) {
        // Обновить факультет
        await executeQuery(
          'UPDATE faculty SET faculty_name = @faculty_name WHERE faculty = @faculty',
          [
            { name: 'faculty', value: faculty.faculty },
            { name: 'faculty_name', value: faculty.faculty_name },
          ]
        );
      } else {
        // Добавить факультет
        await executeQuery(
          'INSERT INTO faculty (faculty, faculty_name) VALUES (@faculty, @faculty_name)',
          [
            { name: 'faculty', value: faculty.faculty },
            { name: 'faculty_name', value: faculty.faculty_name },
          ]
        );
      }
      return faculty;
    },
    delFaculty: async ({ faculty }) => {        
      const existingFaculty = await executeQuery(
        'SELECT faculty, faculty_name FROM faculty WHERE faculty = @faculty',
        [{ name: 'faculty', value: faculty }]
      );
      console.log(existingFaculty);
      
      if (existingFaculty.length > 0) {
        // Удалить факультет
        const result = await executeQuery('DELETE FROM faculty WHERE faculty = @faculty', [
          { name: 'faculty', value: faculty },
        ]);
        return true;
      } else {
        return false;
      }
    },
    getPulpits: async ({ pulpit: parm }) => {
      let query = 'SELECT pulpit, pulpit_name, faculty FROM pulpit';
      let params = [];
    
      if (parm) {
        query += ' WHERE pulpit = @pulpit';
        params.push({ name: 'pulpit', value: parm });
      }
    
      const pulpits = await executeQuery(query, params);
      return pulpits;
    },
    setPulpit: async ({ pulpit: parm }) => {
      const { pulpit, pulpit_name, faculty } = parm;
    
      const checkQuery = 'SELECT COUNT(*) as count FROM pulpit WHERE pulpit = @pulpit';
      const checkParams = [{ name: 'pulpit', value: pulpit }];
      const checkResult = await executeQuery(checkQuery, checkParams);

      if (checkResult[0].count > 0) {
        // Обновляем существующую кафедру
        await executeQuery(
          'UPDATE pulpit SET pulpit_name = @pulpit_name, faculty = @faculty WHERE pulpit = @pulpit',
          [
            { name: 'pulpit', value: pulpit },
            { name: 'pulpit_name', value: pulpit_name },
            { name: 'faculty', value: faculty },
          ]
        );
      } else {
        // Добавляем новую кафедру
        await executeQuery(
          'INSERT INTO pulpit (pulpit, pulpit_name, faculty) VALUES (@pulpit, @pulpit_name, @faculty)',
          [
            { name: 'pulpit', value: pulpit },
            { name: 'pulpit_name', value: pulpit_name },
            { name: 'faculty', value: faculty },
          ]
        );
      }
    
      // Возвращаем данные о добавленной/обновленной кафедре
      const result = await executeQuery(
        'SELECT pulpit, pulpit_name, faculty FROM pulpit WHERE pulpit = @pulpit AND faculty = @faculty',
        [
          { name: 'pulpit', value: pulpit },
          { name: 'faculty', value: faculty },
        ]
      );
    
      return result[0];
    },
    delPulpit: async ({ pulpit }) => {
      const existingPulpit = await executeQuery(
        'SELECT * FROM pulpit WHERE pulpit = @pulpit',
        [{ name: 'pulpit', value: pulpit }]
      );
    
      if (existingPulpit.length > 0) {
        await executeQuery('DELETE FROM pulpit WHERE pulpit = @pulpit', [
          { name: 'pulpit', value: pulpit },
        ]);
        return true;
      } else {
        return false;
      }
    },
    getTeachers: async ({ teacher }) => {
      let query = 'SELECT teacher, teacher_name, pulpit FROM teacher';
      let params = [];
    
      if (teacher) {
        query += ' WHERE teacher = @teacher';
        params.push({ name: 'teacher', value: teacher });
      }
    
      const teachers = await executeQuery(query, params);
      return teachers;
    },
    setTeacher: async ({ teacher: parm }) => {
      const { teacher, teacher_name, pulpit } = parm;
    
      // Проверяем, существует ли преподаватель
      const checkQuery = 'SELECT COUNT(*) as count FROM teacher WHERE teacher = @teacher';
      const checkParams = [{ name: 'teacher', value: teacher }];
      const checkResult = await executeQuery(checkQuery, checkParams);
    
      if (checkResult[0].count > 0) {
        // Преподаватель существует — обновляем
        const updateQuery = `
          UPDATE teacher
          SET teacher_name = @teacher_name, pulpit = @pulpit
          WHERE teacher = @teacher
        `;
        const updateParams = [
          { name: 'teacher_name', value: teacher_name },
          { name: 'department', value: pulpit },
          { name: 'teacher', value: teacher },
        ];
        await executeQuery(updateQuery, updateParams);
      } else {
        // Преподаватель не существует — добавляем
        const insertQuery = `
          INSERT INTO teacher (teacher, teacher_name, pulpit)
          VALUES (@teacher, @teacher_name, @pulpit)
        `;
        const insertParams = [
          { name: 'teacher', value: teacher },
          { name: 'teacher_name', value: teacher_name },
          { name: 'pulpit', value: pulpit },
        ];
        await executeQuery(insertQuery, insertParams);
      }
    
      // Возвращаем данные о добавленном/измененном преподавателе
      return {
        teacher,
        teacher_name,
        pulpit,
      };
    },
    delTeacher: async ({ teacher }) => {
      const existingTeacher = await executeQuery(
        'SELECT * FROM teacher WHERE teacher = @teacher',
        [{ name: 'teacher', value: teacher }]
      );
    
      if (existingTeacher.length > 0) {
        await executeQuery('DELETE FROM teacher WHERE teacher = @teacher', [
          { name: 'teacher', value: teacher },
        ]);
        return true;
      } else {
        return false;
      }
    },
  };
  
  // Создание HTTP-сервера
  const server = http.createServer(async (req, res) => {
    if (req.method === 'POST' && req.url === '/graphql') {
      let body = '';
  
      req.on('data', chunk => {
        body += chunk.toString();
      });
  
      req.on('end', async () => {
        try {
          const { query, variables } = JSON.parse(body);
          const result = await graphql({ schema, source: query, rootValue: root, variableValues: variables });
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not Found' }));
    }
  });
  
  // Запуск сервера
  const PORT = 3000;
  server.listen(PORT, () => {
    console.log(`HTTP GraphQL сервер запущен на http://localhost:${PORT}/graphql`);
  });
