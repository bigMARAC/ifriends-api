const Aluno = require('../models/Aluno')
const Materia = require('../models/Materia')
const bcrypt = require('bcrypt');

module.exports = {
    async index(req, res) {
        const alunos = await Aluno.findAll({
            include: {
                association: 'materias',
                through: {
                    attributes: []
                }
            }
        })

        return res.status(200).json({ alunos })
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
                            return res.status(400).json({ Erro: "Materia não encontrada", id })
                        }

                        await aluno.addMateria(materia)
                    }
                    return res.status(200).json({ id: aluno.id, nome, matricula })

                } else {
                    return res.status(400).json({ Erro: err })
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
        bcrypt.compare(senha, aluno.senha, function (err, result) {
            if (result) {
                return res.status(200).json({ auth: 'Usuário autenticado', nome: aluno.nome })
            }
            return res.status(400).json({ auth: 'Usuário não autenticado' })
        });
    },

    async add(req, res) {
        const { aluno_id, ids } = req.body
        const aluno = await Aluno.findByPk(aluno_id)
        console.log(ids, aluno)

        if (aluno) {
            for (const id of ids) {
                const materia = await Materia.findByPk(id)

                if (!materia) {
                    return res.status(400).json({ Erro: "Materia não encontrada", id })
                }

                await aluno.addMateria(materia)
            }
            return res.json(aluno)
        }
        return res.status(400).json({ Erro: "Campos inválidos" })
    },

    async destroy(req, res) {
        const { id } = req.params
        const aluno = await Aluno.findByPk(id)
        if (aluno) {
            await aluno.destroy()
            return res.json('Usuário deletado com sucesso')
        }
        return res.status(400).json({ Erro: 'Usuário não encontrado' })
    }
}