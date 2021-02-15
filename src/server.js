const express = require('express')
const routes = require('./routes')
const cors = require('cors')
const path = require('path')

require('./database')

const app = express()

app.use(express.static(__dirname + '/tmp'));
app.use(express.json())
app.use(cors())
app.use(routes)

app.listen(777)

console.log('🚀 Servidor rodando na porta 777')