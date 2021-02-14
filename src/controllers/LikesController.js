const Like = require('../models/Like')
const Aluno = require('../models/Aluno')

module.exports = {
    async index(req, res) {
        const [, token] = req.headers.authorization.split(' ')
        const data = []

        const aluno = await Aluno.findOne({
            where: { token },
            include: {
                association: 'matches',
                where: { match: true }
            }
        })
        if (aluno) {
            for(const match of aluno.matches){
                const novo = await Aluno.findByPk(match.destino_id, {
                    attributes: [ 'id', 'nome', 'turma', 'phone', 'instagram', 'desc']
                })
                data.push(novo)
            }
            return res.status(200).json(data)
        } else {
            return res.status(400).json({ erro: "Usuário não possui match" })
        }
    },

    async store(req, res) {
        const { origem_id, destino_id } = req.body

        const origem = await Aluno.findByPk(origem_id)
        const destino = await Aluno.findByPk(destino_id)

        if (origem && destino) {

            const matchs = await Like.findAll({
                where: { origem_id: destino_id }
            })

            const like = await Like.create({ origem_id: origem_id, destino_id })

            if (matchs) {
                for (match of matchs) {
                    if (match.destino_id == origem_id && match.origem_id == destino_id) {
                        like.match = true
                        match.match = true
                        await match.save()
                        await like.save()
                        return res.json({ match: true })
                    }
                }
            }
            like.match = false
            await like.save()
            return res.status(200).json({ match: false, like })
        } else {
            return res.status(401).json({ erro: 'ID de usuário inválido' })
        }
    },

    async delete(req, res) {
        const { origem_id } = req.params
        const { destino_id } = req.body

        const match = await Like.findOne({
            where: { origem_id, destino_id }
        })

        if (match) {
            await match.destroy()
            return res.status(200).json('Match cancelado com sucesso')
        }

        return res.status(400).json({ erro: 'Match inexistente' })
    }
}