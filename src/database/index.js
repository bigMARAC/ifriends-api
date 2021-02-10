const Sequelize = require('sequelize')
const config = require('./../config/db')
const Aluno = require('../models/Aluno')
const Materia = require('../models/Materia')
const Like = require('../models/Like')

const conn = new Sequelize(config)

Aluno.init(conn)
Materia.init(conn)
Like.init(conn)

Aluno.associate(conn.models)
Materia.associate(conn.models)
Like.associate(conn.models)

module.exports = conn