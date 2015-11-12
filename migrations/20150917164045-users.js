'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      password: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      emailConfirmed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }

    }).then(function(results) {
      return queryInterface.addIndex(
        'users',
        ['username'],
        {
          indexName: 'usernameIndex',
          indicesType: 'UNIQUE'
        })
    });

  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.removeIndex('users', 'usernameIndex').then(function() {
      return queryInterface.dropTable('users');
    });
  }
};
