'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('alunos_materias', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      aluno_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'alunos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      materia_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'materias', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('alunos_materias');
  }
};
