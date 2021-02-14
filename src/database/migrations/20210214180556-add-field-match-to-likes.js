'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn (
      'likes',
      'match',
      {
        type: Sequelize.BOOLEAN
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn (
      'likes',
      'match'
    )
  }
};
