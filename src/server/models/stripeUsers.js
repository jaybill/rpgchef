import _ from 'lodash';
import log from 'loglevel';
import Sequelize from 'sequelize';

export default function NewStripeUsers(DbConn) {
  const StripeUsers = DbConn.define('stripeUsers', {
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
    customer: Sequelize.JSONB,
    subscription: Sequelize.JSONB
  }, {
    timestamps: false
  }
  );
  return StripeUsers;
}
