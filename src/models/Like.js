const { Model, DataTypes } = require('sequelize')

class Like extends Model {
    static init(sequelize) {
        super.init({
            match: DataTypes.BOOLEAN
        }, {
            sequelize,
            tableName: 'likes'
        })
    }

    static associate(models) {
        this.belongsTo(models.Aluno, { foreignKey: 'origem_id', as: 'send' })
        this.belongsTo(models.Aluno, { foreignKey: 'destino_id', as: 'receive' })
    }
}

module.exports = Like