const express = require('express')
const AlunosController = require('./controllers/AlunosController')
const MateriasController = require('./controllers/MateriasController')

const routes = express.Router()

routes.post('/login', AlunosController.auth) // autenticar aluno
routes.post('/alunos', AlunosController.store) // criar aluno
routes.get('/alunos', AlunosController.index) // listar alunos
routes.delete('/alunos/:id', AlunosController.destroy) // apagar aluno

routes.post('/alunos/materias', AlunosController.add)

routes.post('/materias', MateriasController.store) // criar materia
routes.get('/materias', MateriasController.index) // listar materias
routes.delete('/materias/:id', MateriasController.destroy) // apagar materias

module.exports = routes