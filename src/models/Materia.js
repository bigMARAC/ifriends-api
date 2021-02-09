const { Model, DataTypes } = require('sequelize')

class Materia extends Model {
    static init(sequelize) {
        super.init({
            cor: DataTypes.STRING,
            nome: DataTypes.STRING
        }, {
            sequelize,
            tableName: 'materias'
        })
    }

    static associate(models) {
        this.belongsToMany(models.Aluno, { foreignKey: 'materia_id', through: 'alunos_materias', as: 'alunos' })
    }
}

module.exports = Materia