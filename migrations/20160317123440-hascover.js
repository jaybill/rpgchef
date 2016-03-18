'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'modules',
      'hasCover',
      Sequelize.BOOLEAN
    );
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('modules', 'hasCover');
  }
};
