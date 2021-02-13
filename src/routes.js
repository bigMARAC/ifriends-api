const express = require('express')
const AlunosController = require('./controllers/AlunosController')
const MateriasController = require('./controllers/MateriasController')
const LikesController = require('./controllers/LikesController')
const Auth = require('./middlewares/Auth')

const routes = express.Router()

// alunos - rotas abertas
routes.post('/alunos', AlunosController.store) // criar um aluno
routes.post('/login', AlunosController.auth) // autenticar um aluno

// alunos - rotas autenticadas
routes.get('/me', Auth.check, AlunosController.me) // exibir o aluno que está autenticado
routes.get('/alunos', Auth.check, AlunosController.index) // listar alunos
routes.put('/alunos', Auth.check, AlunosController.update) // atualizar um aluno
routes.delete('/alunos/:id', Auth.check, AlunosController.destroy) // apagar um aluno

// materias - rotas abertas
routes.get('/materias', MateriasController.index) // listar materias

// materias - rotas autenticadas
routes.post('/materias', Auth.check, MateriasController.store) // criar materia
routes.put('/materias/:id', Auth.check, MateriasController.update) // atualizar uma materia
routes.delete('/materias/:id', Auth.check, MateriasController.destroy) // apagar uma materia

// match
routes.post('/match', Auth.check,LikesController.store) // dar like em outro aluno
routes.get('/match/:aluno_id', Auth.check,LikesController.index) // listar os matches de um aluno
routes.delete('/match/:origem_id', Auth.check,LikesController.delete) // cancelar um match

module.exports = routes