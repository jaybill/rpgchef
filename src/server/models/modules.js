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
    },
    pdfUrl: Sequelize.STRING,
    pdfCreatedOn: Sequelize.DATE,
    author: Sequelize.STRING,
    subtitle: Sequelize.STRING,
    hasCover: Sequelize.BOOLEAN,
    coverUrl: Sequelize.STRING,
    version: Sequelize.STRING
  });
  Modules.beforeUpdate(updatePdfCreatedOn);
  return Modules;
}

var updatePdfCreatedOn = (instance, options) => {
  if (!instance.changed('pdfUrl')) {
    return null;
  } else {
    if (instance.get('pdfUrl') != null) {
      return instance.set('pdfCreatedOn', Sequelize.fn("now"));
    } else {
      return null;
    }
  }
};
