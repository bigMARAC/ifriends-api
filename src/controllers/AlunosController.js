const Aluno = require('../models/Aluno')
const Materia = require('../models/Materia')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { secret } = require('./../config/token');
const { Op } = require("sequelize");
const Sequelize = require("sequelize")

module.exports = {
    async store(req, res) {
        const {
            desc,
            phone,
            instagram,
            matricula,
            turma,
            nome,
            senha,
            ids
        } = req.body

        if (instagram && phone && desc && turma && nome && matricula && senha) {
            bcrypt.hash(senha, 10, async function (err, hash) {
                if (!err) {
                    const teste = await Aluno.findOne({
                        where: { matricula }
                    })
                    if (!teste) {
                        try {
                            const aluno = await Aluno.create({
                                desc,
                                phone,
                                instagram,
                                matricula,
                                turma,
                                nome,
                                senha: hash
                            })
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
                                { expiresIn: 7200 } // 2 horas
                            )

                            aluno.token = token
                            await aluno.save()

                            return res.status(200).json({ aluno })

                        } catch (error) {
                            return res.status(400).json({ erro: error })
                        }
                    } else {
                        return res.status(400).json({ erro: "Matrícula em uso" })
                    }
                } else {
                    return res.status(400).json({ erro: err })
                }
            })
        } else {
            return res.status(400).json({ erro: "Campos inválidos" })
        }
    },

    async auth(req, res) {
        const { matricula, senha } = req.body
        const aluno = await Aluno.findOne({
            where: {
                matricula
            }
        })

        if (matricula && senha) {
            if (aluno) {
                const token = jwt.sign(
                    { user: aluno.id },
                    secret,
                    { expiresIn: 7200 } // 2 horas
                )
                aluno.token = token
                await aluno.save()

                bcrypt.compare(senha, aluno.senha, function (err, result) {
                    if (err) {
                        return res.status(400).json({ erro: err })
                    }

                    if (result) {
                        return res.status(200).json({ auth: true, nome: aluno.nome, token: aluno.token })
                    }
                    return res.status(401).json({ erro: 'Senha incorreta' })
                });
            } else {
                return res.status(400).json('Usuário não encontrado')
            }
        } else {
            res.status(400).json({ erro: "Campos inválidos" })
        }
    },

    async me(req, res) {
        const [, token] = req.headers.authorization.split(' ')

        if (token) {
            const aluno = await Aluno.findOne({
                where: { token },
                include: { association: 'materias' }
            })
            if (aluno) {
                return res.status(200).json({ aluno })
            }
            return res.status(400).json({ erro: "Usuário não encontrado" })
        }
        return res.status(400).json({ erro: "Baerer Token inválido" })
    },

    async index(req, res) {
        const ids = []
        const [, token] = req.headers.authorization.split(' ')

        if (token) {
            try {
                const aluno = await Aluno.findOne({
                    where: { token },
                    include: { association: 'matches' }
                })

                for (match of aluno.matches) {
                    ids.push(match.destino_id)
                }

                const alunos = await Aluno.findAll({
                    order: Sequelize.literal('rand()'),
                    where: {
                        id: {
                            [Op.notIn]: ids,
                        },
                        token: {
                            [Op.ne]: token
                        }
                    },
                    attributes: ['desc', 'phone', 'instagram', 'matricula', 'turma', 'nome', 'id', 'foto'],
                    include: {
                        association: 'materias',
                        through: {
                            attributes: []
                        }
                    }
                })
                return res.status(200).json({ alunos })
            } catch (error) {
                return res.status(400).json({ erro: error })
            }
        }
        return res.status(400).json({ erro: "Bearer Token inválido" })
    },

    async update(req, res) {
        const { aluno_id, nome, desc, matricula, ids } = req.body
        const before = []
        const aluno = await Aluno.findByPk(aluno_id, {
            include: { association: 'materias' }
        })

        if (aluno) {
            if (nome) aluno.nome = nome
            if (matricula) aluno.matricula = matricula
            if (desc) aluno.desc = desc

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
            return res.json({ aluno: novoAluno })
        } else {
            return res.status(400).json({ aluno })
        }
    },

    async destroy(req, res) {
        const { id } = req.params
        const aluno = await Aluno.findByPk(id)
        if (aluno) {
            await aluno.destroy()
            return res.stauts(200).json("Usuário deletado com sucesso")
        }
        return res.status(400).json({ erro: 'Usuário não encontrado' })
    },

    async photo(req, res) {
        const foto = req.file.filename
        const [, token] = req.headers.authorization.split(' ')

        if (foto) {
            const aluno = await Aluno.findOne({
                where: { token }
            })
            aluno.foto = foto
            await aluno.save()
            return res.status(200).json({ success: "Foto salva com sucesso" })
        } else {
            return res.status(400).json({ erro: 'Foto inválida' })
        }
    }
}