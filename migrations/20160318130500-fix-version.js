'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.changeColumn(
      'modules',
      'version',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    );
  },

  down: function(queryInterface, Sequelize) {
    queryInterface.changeColumn(
      'modules',
      'version',
      {
        type: Sequelize.BIGINT,
        allowNull: true
      }
    );
  }
};
