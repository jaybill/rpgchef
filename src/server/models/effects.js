import _ from 'lodash';
import log from 'loglevel';
import Sequelize from 'sequelize';

export default function NewEffects(DbConn) {
  const Effects = DbConn.define('effects', {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    priceInCp: {
      type: Sequelize.BIGINT,
      allowNull: true
    },
    effect: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    titles: {
      type: Sequelize.ARRAY({
        type: Sequelize.STRING
      }),
      allowNull: false
    },
    adjectives: {
      type: Sequelize.ARRAY({
        type: Sequelize.STRING
      }),
      allowNull: false
    },
    nouns: {
      type: Sequelize.ARRAY({
        type: Sequelize.STRING
      }),
      allowNull: false
    }
  }, {
    timestamps: false
  });

  return Effects;

}
