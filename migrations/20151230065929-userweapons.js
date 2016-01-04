'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('userweapons', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      weaponId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        refrences: {
          model: 'weapons',
          key: 'id',
          onDelete: "CASCADE"
        }
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
      magicProps: Sequelize.STRING,
      priceInCp: Sequelize.BIGINT
    }).then(() => {
      return queryInterface.sequelize.query('ALTER TABLE "public"."userweapons" ADD CONSTRAINT "fkuW" FOREIGN KEY ("weaponId") REFERENCES "public"."weapons" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;');
    }).then(() => {
      return queryInterface.sequelize.query('ALTER TABLE "public"."userweapons" ADD CONSTRAINT "fkU" FOREIGN KEY ("userId") REFERENCES "public"."users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;');
    });

  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('userweapons');
  }
};
