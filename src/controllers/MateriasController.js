const { update } = require('../models/Aluno')
const Aluno = require('../models/Aluno')
const Materia = require('../models/Materia')
const sequelize = require('sequelize')

module.exports = {
    async index(req, res) {
        const materias = await Materia.findAll({
            order: ['nome']
        })

        return res.status(200).json({ materias })
    },

    async store(req, res) {
        const { nome, cor } = req.body
        if (nome) {
            const materia = await Materia.create({ cor, nome })
            return res.status(200).send(materia)
        } else {
            return res.status(400).send({ erro: 'Campos inválidos' })
        }
    },

    async update(req, res) {
        const { id } = req.params
        const { nome, cor } = req.body
        const materia = await Materia.findByPk(id)

        if (materia) {
            if (nome) materia.nome = nome
            if (cor) materia.cor = cor

            await materia.save()

            res.status(200).json('Materia atualizada com sucesso')

        } else {
            res.status(400).json({ erro: 'Matéria não encontrada' })
        }
    },

    async destroy(req, res) {
        const { id } = req.params
        const materia = await Materia.findByPk(id)
        if (materia) {
            await materia.destroy()
            return res.json('Matéria deletada com sucesso')
        }
        return res.status(400).json({ erro: 'Matéria não encontrada' })
    },
}