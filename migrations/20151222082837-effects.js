'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {



    return queryInterface.createTable('effects', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      effect: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      titles: {
        type: Sequelize.ARRAY({
          type: Sequelize.STRING
        }),
        allowNull: false
      },
      adjectives: {
        type: Sequelize.ARRAY({
          type: Sequelize.STRING
        }),
        allowNull: false
      },
      nouns: {
        type: Sequelize.ARRAY({
          type: Sequelize.STRING
        }),
        allowNull: false
      }
    });

  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('effects');

  }
};
