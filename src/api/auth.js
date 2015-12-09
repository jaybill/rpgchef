import log from 'loglevel';
import Boom from 'boom';
import Joi from 'joi';
import _ from 'lodash';
import Db from './db';
import Bcrypt from './bcrypt';

var Auth = {};

Auth.handlers = {
  register: {
    validate: {
      payload: {
        username: Joi.string().email().required().label('Email Address'),
        password: Joi.string().alphanum().min(3).required().label('Password')
      }
    },
    handler: (request, reply) => {

      return Db.Users.findOne({
        where: {
          username: request.payload.username
        }
      }).then((user) => {
        if (user) {
          throw {
            name: "UsernameTakenError",
            message: "Username taken"
          };
        } else {
          return Db.Users.create(request.payload);
        }
      }).then((user) => {
        reply(user);
      }).catch((err) => {

        if (err) {
          if (err.name == "UsernameTakenError") {
            reply(Boom.create(422, err.message));
          } else {

            reply(Boom.badImplementation());
          }
        }
      });

    }
  },


  logout: {
    auth: 'session',
    handler: (request, reply) => {
      request.auth.session.clear();
      return reply();
    }
  },

  me: {
    auth: 'session',
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      }
    },
    handler: (request, reply) => {
      return reply(request.auth.credentials);
    }
  },

  login: {
    auth: {
      mode: 'try',
      strategy: 'session'
    },
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      }
    },
    validate: {
      payload: {
        username: Joi.string(),
        password: Joi.string()
      }
    },
    handler: (request, reply) => {


      if (request.auth.isAuthenticated) {
        request.auth.session.clear();
      }


      var user;
      return Db.Users.findOne({
        where: {
          username: request.payload.username
        }
      }).then((dbUser) => {
        user = dbUser;
        return Bcrypt.compare(request.payload.password, user.password);

      }).then((validPassword) => {
        if (validPassword) {
          user.password = null;
          request.auth.session.set(user);
          return reply(user);
        } else {
          throw new Error("bad password");
        }
      }).catch((err) => {
        reply(Boom.unauthorized());
      });

    }
  }
}

export default Auth;
