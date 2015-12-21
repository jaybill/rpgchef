module.exports = {
  up: function(queryInterface, Sequelize) {

    return queryInterface.createTable('weapongroups', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      parentId: {
        type: Sequelize.BIGINT,
        refrences: {
          model: 'weapongroups',
          key: 'id',
          onDelete: "CASCADE"
        },
        allowNull: true
      },
    }).then(function(results) {
      return queryInterface.createTable('weapons', {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          allowNull: false
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        damage: {
          type: Sequelize.STRING,
          allowNull: false
        },
        priceInCp: {
          type: Sequelize.BIGINT,
          allowNull: true
        },
        weightInLb: {
          type: Sequelize.FLOAT,
          allowNull: true
        },
        "properties": {
          type: Sequelize.STRING,
          allowNull: true
        },

        groupId: {
          type: Sequelize.BIGINT,
          allowNull: false,
          refrences: {
            model: 'weapongroups',
            key: 'id',
            onDelete: "CASCADE"
          }
        }
      });


    }).then(() => {
      return queryInterface.sequelize.query('ALTER TABLE "public"."weapongroups" ADD CONSTRAINT "fkWg" FOREIGN KEY ("parentId") REFERENCES "public"."weapongroups" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;');

    }).then(() => {
      return queryInterface.sequelize.query('ALTER TABLE "public"."weapons" ADD CONSTRAINT "fkW" FOREIGN KEY ("groupId") REFERENCES "public"."weapongroups" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;');

    });

  },

  down: function(queryInterface, Sequelize) {

    return queryInterface.dropTable('weapons').then(() => {
      return queryInterface.dropTable('weapongroups');
    });


  }
};
