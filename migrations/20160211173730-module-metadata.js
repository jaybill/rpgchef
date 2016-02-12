'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'modules',
      'author',
      Sequelize.STRING
    ).then(() => {
      return queryInterface.addColumn(
        'modules',
        'subtitle',
        Sequelize.STRING
      );
    }).then(() => {
      return queryInterface.addColumn(
        'modules',
        'version',
        Sequelize.BIGINT
      );
    });
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('modules', 'author').then(() => {
      return queryInterface.removeColumn('modules', 'subtitle');
    }).then(() => {
      return queryInterface.removeColumn('modules', 'version');
    });
  }
};
