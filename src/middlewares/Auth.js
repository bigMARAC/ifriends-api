const jwt = require('jsonwebtoken')
const Aluno = require('./../models/Aluno')
const { secret } = require('./../config/token')

module.exports = {
    async check(req, res, next) {
        if (req.headers.authorization) {
            const [, token] = req.headers.authorization.split(' ')

            const aluno = await Aluno.findOne({
                where: { token }
            })

            if (aluno) {
                next()
            } else {
                res.status(401).json({ erro: 'Usuário não autenticado' })
            }

        } else {
            res.status(401).json({ erro: 'Usuário não autenticado' })
        }
    }
}