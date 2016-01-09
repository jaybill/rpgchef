import _ from 'lodash';
import log from 'loglevel';
import Sequelize from 'sequelize';

export default function NewUserWeapon(DbConn) {
  const UserWeapons = DbConn.define('userweapons',
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      weaponId: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      userId: {
        type: Sequelize.BIGINT,
        allowNull: false
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      magicProps: Sequelize.STRING,
      priceInCp: Sequelize.BIGINT
    }, {
      timestamps: false
    }
  );
  return UserWeapons;
}
