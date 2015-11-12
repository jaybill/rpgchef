import Bcrypt from '../bcrypt';
import mailgun from 'mailgun-js';
import _ from 'lodash';
import md5 from 'md5';
import log from 'loglevel';
import Sequelize from 'sequelize';
import DbConn from '../dbconn';
import Uri from 'urijs';

var Users = DbConn.define('users',
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: Sequelize.STRING,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    emailConfirmed: Sequelize.BOOLEAN,
    active: Sequelize.BOOLEAN

  }, {
    instanceMethods: {
      toJSON: function() {
        var values = this.get();
        delete values.password;
        return values;
      },
      email: function(message) {
        message.from = 'RPG Chef <jaybill@rpgchef.com>';
        message.to = this.get('username');
        var mg = mailgun({
          apiKey: process.env.MAILGUN_API_KEY,
          domain: process.env.MAILGUN_DOMAIN
        });

        mg.messages().send(message, function(error, body) {
          if (error) {
            log.error(error);
          }
        });
        return;
      }
    }
  });

var sendWelcomeEmail = (user, options) => {
  var hash = md5(user.get('id') + user.get('username') + process.env.SALT);
  var url = new Uri(process.env.SERVER_URL + "/confirm");
  url.query({
    username: user.get('username'),
    hash: hash
  });

  var emailTemplate = _.template("Hi there\!\n\nYou (or someone pretending to be you) recently signed \nup for an account on RPG Chef. To confirm your email, \nplease click on the link below:\n\n<%= url %>");

  user.email({
    subject: 'Confirm Your Email',
    text: emailTemplate({
      url: url.toString()
    })
  });

}
var hashPasswordHook = (instance, options) => {
  if (!instance.changed('password')) {
    return;
  }
  return Bcrypt.hash(instance.get('password')).then((hash) => {
    return instance.set('password', hash);
  }).catch((err) => {
    log.debug(err);
  });

}
Users.beforeCreate(hashPasswordHook);
Users.afterCreate(sendWelcomeEmail);
Users.beforeUpdate(hashPasswordHook);

export default Users;
