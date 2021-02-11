const jwt = require('jsonwebtoken')
const Aluno = require('./../models/Aluno')
const { secret } = require('./../config/token')

module.exports = {
    async check(req, res, next) {
        if (req.headers.authorization) {
            const [, token] = req.headers.authorization.split(' ')

            const a = await Aluno.findOne({
                where: { token }
            })

            if (a) {
                try {
                    const user = jwt.verify(token, secret)
                    const aluno = await Aluno.findByPk(user.user, {
                        include: { association: 'materias' }
                    })

                    if (aluno && aluno.id == a.id) {
                        req.auth = aluno
                        next()
                    } else {
                        res.status(401)
                    }
                } catch (error) {
                    res.status(401).json({ Erro: error })
                }
            } else {
                res.status(401).json({ Erro: 'Usuário não autenticado' })
            }


        } else {
            res.status(401).json({ Erro: 'Usuário não autenticado' })
        }
    }
}