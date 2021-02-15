const { Model, DataTypes } = require('sequelize')

class Aluno extends Model {
    static init(sequelize) {
        super.init({
            desc: DataTypes.STRING,
            phone: DataTypes.STRING,
            instagram: DataTypes.STRING,
            matricula: DataTypes.STRING,
            turma: DataTypes.STRING,
            nome: DataTypes.STRING,
            senha: DataTypes.STRING,
            token: DataTypes.STRING,
            foto: DataTypes.STRING
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