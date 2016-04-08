'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'modules',
      'metadata',
      Sequelize.JSONB
    );
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('modules', 'metadata');
  }
};
