import _ from 'lodash';
import log from 'loglevel';
import Sequelize from 'sequelize';

export default function NewMonster(DbConn) {
  const Monsters = DbConn.define('monsters',
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
      "xp": Sequelize.BIGINT,
      "CHA": Sequelize.BIGINT,
      "CON": Sequelize.BIGINT,
      "DEX": Sequelize.BIGINT,
      "INT": Sequelize.BIGINT,
      "STR": Sequelize.BIGINT,
      "WIS": Sequelize.BIGINT,
      "size": Sequelize.STRING,
      "speed": Sequelize.STRING,
      "senses": Sequelize.STRING,
      "skills": Sequelize.STRING,
      "traits": Sequelize.JSONB,
      "actions": Sequelize.JSONB,
      "alignment": Sequelize.STRING,
      "challenge": Sequelize.STRING,
      "hitpoints": Sequelize.STRING,
      "languages": Sequelize.STRING,
      "armorclass": Sequelize.STRING,
      "raceOrType": Sequelize.STRING,
      "savingThrows": Sequelize.STRING,
      "legendaryPoints": Sequelize.BIGINT,
      "damageImmunities": Sequelize.STRING,
      "damageResistances": Sequelize.STRING,
      "legendaryActions": Sequelize.JSONB,
      "conditionImmunities": Sequelize.STRING,
      "damageVulnerabilities": Sequelize.STRING
    }, {
      timestamps: false
    }
  );
  return Monsters;
}
