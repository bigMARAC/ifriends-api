const Like = require('../models/Like')
const Aluno = require('../models/Aluno')

module.exports = {
    async store(req, res) {
        const { origem_id } = req.params
        const { destino_id } = req.body

        const origem = await Aluno.findByPk(origem_id)
        const destino = await Aluno.findByPk(destino_id)

        if (origem && destino) {

            const matchs = await Like.findAll({
                where: { origem_id: destino_id }
            })

            if (matchs) {
                for (match of matchs) {
                    if (match.destino_id == origem_id && match.origem_id == destino_id) {
                        return res.json('Its a Match!')
                    }
                }
                const like = await Like.create({ origem_id: origem_id, destino_id })
                return res.status(200).json({ like })
            } 
        } else {
            return res.status(401).json({ Erro: 'ID de usuário inválido' })
        }

    }
}