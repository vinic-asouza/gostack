const express = require('express');

const server = express();

server.use(express.json());

//localhost:3000/users

//----------------------------------------

// //QUERY PARAMS
// server.get('/users/', (req, res) => {
//     //Navegador:
//     //http://localhost:3000/users?nome=Vinicius
//     const nome = req.query.nome
//     return res.json({ message: `Hello ${nome}` })
// })

//----------------------------------------

// //ROUTE PARAMS
// server.get('/users/:id', (req, res) => {
//     //Navegador:
//     //http://localhost:3000/users/1
//     const { id } = req.params
//     return res.json({ message: `Usuário: ${id}` })
// })

//----------------------------------------

// //CRUD (Array)
// const users = ['Diego', 'Claudio', 'Victor']

// server.get('/users', (req, res) => {
//     return res.json(users)
// })

// server.get('/users/:index', (req, res) => {
//     //Imsomnia:
//     //http://localhost:3000/users/1
//     const { index } = req.params
//     return res.json(users[index])
// })

// server.post('/users', (req, res) => {
//     const { name } = req.body;

//     users.push(name);

//     return res.json(users);
// })

// server.put('/users/:index', (req, res) => {
//     const { index } = req.params
//     const { name } = req.body

//     users[index] = name

//     return res.json(users);
// })

// server.delete('/users/:index', (req, res) => {
//     const { index } = req.params
//     users.splice(index, 1)

//     return res.json(users);
// })

//----------------------------------------

//Middlewares
const users = ['Diego', 'Claudio', 'Victor']

server.use((req, res, next) => {
    console.time('Request')
    console.log(`Método: ${req.method}; URL: ${req.url}`)

    next();

    console.timeEnd('Request')
})

function checkUserExists(req, res, next) {
    if(!req.body.name) {
        return res.status(400).json({ error: 'User not found on request body'})
    }

    return next()
}

function checkUserInArray(req, res, next) {
    const user = users[req.params.index]

    if(!user) {
        return res.status(400).json({ error: 'User does not exists'})
    }

    req.user = user;

    return next()
}

server.get('/users', (req, res) => {
    return res.json(users)
})

server.get('/users/:index', checkUserInArray, (req, res) => {
    //Imsomnia:
    //http://localhost:3000/users/1
    return res.json(req.user)
})

server.post('/users', checkUserExists, (req, res) => {
    const { name } = req.body;

    users.push(name);

    return res.json(users);
})

server.put('/users/:index', checkUserExists, checkUserInArray, (req, res) => {
    const { index } = req.params
    const { name } = req.body

    users[index] = name

    return res.json(users);
})

server.delete('/users/:index', checkUserInArray, (req, res) => {
    const { index } = req.params
    users.splice(index, 1)

    return res.json(users);
})

//----------------------------------------


server.listen(3000);