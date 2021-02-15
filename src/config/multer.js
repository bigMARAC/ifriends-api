const path = require('path')
const multer = require('multer')
const crypto = require('crypto')
const Aluno = require('./../models/Aluno')

module.exports = {
    dest: path.resolve(__dirname, "..", "uploads"),
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, "..", "tmp", "uploads"))
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, async (err, hash) => {
                if (err) cb(err)

                const [, token] = req.headers.authorization.split(' ')

                const aluno = await Aluno.findOne({
                    where: { token }
                })

                const [, mime] = file.originalname.split('.')

                const fileName = `${aluno.id}.${mime}`

                cb(null, fileName)
            })
        }
    }),
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/pjpeg',
            'image/jpg',
            'image/png',
            'image/gif'
        ]

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Formato inválido'))
        }
    }
}