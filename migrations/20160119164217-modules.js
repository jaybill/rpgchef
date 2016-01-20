'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('modules', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      userId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        refrences: {
          model: 'users',
          key: 'id'
        }
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      content: Sequelize.JSONB,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    }).then(() => {
      return queryInterface.sequelize.query('ALTER TABLE "public"."modules" ADD CONSTRAINT "fkM" FOREIGN KEY ("userId") REFERENCES "public"."users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;');
    });

  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('modules');
  }
};
