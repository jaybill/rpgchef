import _ from 'lodash';
import log from 'loglevel';
import Sequelize from 'sequelize';

export default function NewModule(DbConn) {
  const Modules = DbConn.define('modules', {

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
    content: {
      type: Sequelize.JSONB,
      default: {}
    }
  });
  return Modules;
}


