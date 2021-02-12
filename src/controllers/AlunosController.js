const Aluno = require('../models/Aluno')
const Materia = require('../models/Materia')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { secret } = require('./../config/token');

module.exports = {
    async index(req, res) {
        const alunos = await Aluno.findAll({
            attributes: ['matricula', 'nome', 'id'],
            include: {
                association: 'materias',
                through: {
                    attributes: []
                }
            }
        })

        return res.status(200).json({ alunos })
    },

    async me(req, res) {
        const [, token] = req.headers.authorization.split(' ')
        const aluno = await Aluno.findOne({
            where: { token },
            include: { association: 'materias' }
        })
        res.status(200).json({ aluno })
    },

    async update(req, res) {
        const { aluno_id, nome, matricula, ids } = req.body
        const before = []
        const aluno = await Aluno.findByPk(aluno_id, {
            include: { association: 'materias' }
        })

        if (aluno) {
            if (nome) aluno.nome = nome
            if (matricula) aluno.matricula = matricula

            await aluno.save()
        } else {
            res.status(400).json({ erro: 'Usuário não encontrado' })
        }

        for (const materia of aluno.materias) {
            before.push(materia.id)
        }

        if (aluno && ids) {
            for (const id of ids) {
                const materia = await Materia.findByPk(id)

                if (!materia) {
                    return res.status(400).json({ erro: "Materia não encontrada", id })
                }

                await aluno.addMateria(materia)

                for (b of before) {
                    if (b == id) {
                        await aluno.removeMateria(materia)
                    }
                }
            }
            const novoAluno = await Aluno.findByPk(aluno_id, {
                include: {
                    association: 'materias',
                    through: {
                        attributes: []
                    }
                }
            })
            return res.json({ novoAluno })
        } else {
            return res.status(400).json({ aluno })
        }
    },

    async store(req, res) {
        const { nome, matricula, senha, ids } = req.body
        if (nome && matricula && senha) {
            bcrypt.hash(senha, 10, async function (err, hash) {
                if (!err) {
                    const aluno = await Aluno.create({ nome, matricula, senha: hash })
                    for (const id of ids) {
                        const materia = await Materia.findByPk(id)
                        if (!materia) {
                            return res.status(400).json({ erro: "Materia não encontrada", id })
                        }

                        await aluno.addMateria(materia)
                    }

                    const token = jwt.sign(
                        { user: aluno.id },
                        secret,
                        { expiresIn: 86400 } // 24 horas
                    )

                    aluno.token = token
                    await aluno.save()

                    return res.status(200).json({ aluno })

                } else {
                    return res.status(400).json({ erro: err })
                }
            })
        } else {
            return res.status(400).send('Campos Inválidos')
        }
    },

    async auth(req, res) {
        const { matricula, senha } = req.body
        const aluno = await Aluno.findOne({
            where: {
                matricula
            }
        })

        if (aluno) {
            const token = jwt.sign(
                { user: aluno.id },
                secret,
                { expiresIn: 86400 } // 24 horas
            )

            aluno.token = token
            await aluno.save()

            bcrypt.compare(senha, aluno.senha, function (err, result) {
                if (result) {
                    return res.status(200).json({ auth: true, nome: aluno.nome, token: aluno.token })
                }
                return res.status(401).json({ erro: 'Senha incorreta' })
            });
        } else {
            return res.status(400).json('Usuário não encontrado')
        }


    },

    async destroy(req, res) {
        const { id } = req.params
        const aluno = await Aluno.findByPk(id)
        if (aluno) {
            await aluno.destroy()
            return res.json('Usuário deletado com sucesso')
        }
        return res.status(400).json({ erro: 'Usuário não encontrado' })
    }

    // async addOrDelete(req, res) {
    //     const { aluno_id, ids } = req.body
    //     const before = []
    //     const aluno = await Aluno.findByPk(aluno_id, {
    //         include: { association: 'materias' }
    //     })


    //     for (const materia of aluno.materias) {
    //         before.push(materia.id)
    //     }

    //     if (aluno) {
    //         for (const id of ids) {
    //             const materia = await Materia.findByPk(id)

    //             if (!materia) {
    //                 return res.status(400).json({ erro: "Materia não encontrada", id })
    //             }

    //             await aluno.addMateria(materia)

    //             for (b of before) {
    //                 if (b == id) {
    //                     await aluno.removeMateria(materia)
    //                 }
    //             }

    //         }
    //         return res.json('Materia(s) alteradas(s) com sucesso')
    //     }
    //     return res.status(400).json({ erro: "Campos inválidos" })
    // },
}