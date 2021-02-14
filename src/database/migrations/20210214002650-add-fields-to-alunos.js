'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('alunos', 'desc',{
          type: Sequelize.DataTypes.STRING
        }, { transaction: t }),
        queryInterface.addColumn('alunos', 'turma',{
          type: Sequelize.DataTypes.STRING
        }, { transaction: t }), 
        queryInterface.addColumn('alunos', 'phone', {
          type: Sequelize.DataTypes.STRING
        }, { transaction: t }),
        queryInterface.addColumn('alunos', 'instagram', {
          type: Sequelize.DataTypes.STRING,
        }, { transaction: t })
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('alunos', 'desc', { transaction: t }),
        queryInterface.removeColumn('alunos', 'turma', { transaction: t }),
        queryInterface.removeColumn('alunos', 'phone', { transaction: t }),
        queryInterface.removeColumn('alunos', 'instagram', { transaction: t }),
      ]);
    });
  }
};
