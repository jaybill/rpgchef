import _ from 'lodash';
import log from 'loglevel';
import Sequelize from 'sequelize';

export default function NewWeapon(DbConn) {
  const Weapons = DbConn.define('weapons',
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      "damage": Sequelize.STRING,
      "damageSlashing": Sequelize.BOOLEAN,
      "damageBludgeoning": Sequelize.BOOLEAN,
      "damagePiercing": Sequelize.BOOLEAN,
      "martial": Sequelize.BOOLEAN,
      "ammunition": Sequelize.BOOLEAN,
      "finesse": Sequelize.BOOLEAN,
      "heavy": Sequelize.BOOLEAN,
      "light": Sequelize.BOOLEAN,
      "loading": Sequelize.BOOLEAN,
      "rangeMinInFt": Sequelize.BIGINT,
      "rangeMaxInFt": Sequelize.BIGINT,
      "reach": Sequelize.BOOLEAN,
      "thrown": Sequelize.BOOLEAN,
      "twoHanded": Sequelize.BOOLEAN,
      "versatile": Sequelize.STRING,
      "priceInCp": Sequelize.BIGINT,
      "weightInLb": Sequelize.FLOAT

    }, {
      timestamps: false
    }

  );


  return Weapons;
}
