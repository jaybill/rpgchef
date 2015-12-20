import _ from 'lodash';
import log from 'loglevel';
import Sequelize from 'sequelize';

export default function NewWeaponGroups(DbConn) {
  const WeaponGroups = DbConn.define('weapongroups',
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      }
    }, {
      timestamps: false
    }
  );


  return WeaponGroups;
}

