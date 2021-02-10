const { Model, DataTypes } = require('sequelize')

class Aluno extends Model {
    static init(sequelize) {
        super.init({
            matricula: DataTypes.STRING,
            nome: DataTypes.STRING,
            senha: DataTypes.STRING
        }, {
            sequelize,
            tableName: 'alunos'
        })
    }

    static associate(models) {
        this.belongsToMany(models.Materia, { foreignKey: 'aluno_id', through: 'alunos_materias', as: 'materias' })
        this.hasMany(models.Like, { foreignKey: 'origem_id', as: 'matches' })
    }
}

module.exports = Aluno