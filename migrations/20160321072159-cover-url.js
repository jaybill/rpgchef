'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'modules',
      'coverUrl',
      Sequelize.STRING
    );
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('modules', 'coverUrl');
  }
};
