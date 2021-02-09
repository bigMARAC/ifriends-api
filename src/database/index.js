const Sequelize = require('sequelize')
const config = require('./../config/db')
const Aluno = require('../models/Aluno')
const Materia = require('../models/Materia')

const conn = new Sequelize(config)

Aluno.init(conn)
Materia.init(conn)

Aluno.associate(conn.models)
Materia.associate(conn.models)

module.exports = conn