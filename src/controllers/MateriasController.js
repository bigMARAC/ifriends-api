const Aluno = require('../models/Aluno')
const Materia = require('../models/Materia')

module.exports = {
    async index(req, res) {
        const materias = await Materia.findAll()

        return res.status(200).json({ materias })
    },

    async store(req, res) {
        const { nome, cor } = req.body
        if (nome && cor) {
            const materia = await Materia.create({ cor, nome })
            return res.status(200).send(materia)
        } else {
            return res.status(400).send('Campos Inválidos')
        }
    },

    async destroy(req, res) {
        const { id } = req.params
        const materia = await Materia.findByPk(id)
        if (materia) {
            await materia.destroy()
            return res.json('Matéria deletada com sucesso')
        }
        return res.status(400).json({ Erro: 'Matéria não encontrada' })
    },
}