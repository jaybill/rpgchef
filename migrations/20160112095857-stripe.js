'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {

    return queryInterface.createTable('stripeUsers', {
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
      customer: Sequelize.JSONB,
      subscription: Sequelize.JSONB
    }).then(() => {
      return queryInterface.sequelize.query('ALTER TABLE "public"."stripeUsers" ADD CONSTRAINT "fkU" FOREIGN KEY ("userId") REFERENCES "public"."users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;');
    });

  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('stripeUsers');
  }
};
