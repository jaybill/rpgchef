import _ from 'lodash';
import log from 'loglevel';
import Sequelize from 'sequelize';

export default function NewWeapon(DbConn) {
  const Weapons = DbConn.define('weapons',
    {
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
        allowNull: false
      }
    }, {
      timestamps: false
    }

  );


  return Weapons;
}
