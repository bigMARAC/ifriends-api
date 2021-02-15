'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn (
      'alunos',
      'foto',
      {
        type: Sequelize.STRING
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn (
      'alunos',
      'foto'
    )
  }
};
