const express = require('express')
const AlunosController = require('./controllers/AlunosController')
const MateriasController = require('./controllers/MateriasController')
const Auth = require('./middlewares/Auth')

const routes = express.Router()

// alunos - rotas abertas
routes.post('/login', AlunosController.auth) // autenticar aluno
routes.post('/alunos', AlunosController.store) // criar aluno

// alunos - rotas autenticadas
routes.get('/alunos', Auth.check, AlunosController.index) // listar alunos
routes.delete('/alunos/:id', Auth.check, AlunosController.destroy) // apagar aluno
routes.post('/alunos/materias', Auth.check, AlunosController.add) // vincular uma matéria a um aluno

// materias - rotas autenticadas
routes.post('/materias', Auth.check, MateriasController.store) // criar materia
routes.get('/materias', Auth.check, MateriasController.index) // listar materias
routes.delete('/materias/:id', Auth.check, MateriasController.destroy) // apagar materias

module.exports = routes