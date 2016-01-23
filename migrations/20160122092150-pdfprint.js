'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'modules',
      'pdfUrl',
      Sequelize.STRING
    ).then(() => {
      return queryInterface.addColumn(
        'modules',
        'pdfCreatedOn',
        Sequelize.DATE
      );
    });
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('modules', 'pdfUrl').then(() => {
      return queryInterface.removeColumn('modules', 'pdfCreatedOn');
    });
  }
};
