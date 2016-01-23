import log from 'loglevel';
import Boom from 'boom';
import Joi from 'joi';
import _ from 'lodash';
import Db from '../db';
import Bcrypt from '../bcrypt';
import { getHash, sendPasswordResetEmail } from '../util';

const Auth = {};

Auth.handlers = {

  accountUpdate: {
    auth: 'session',
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      }
    },
    validate: {
      payload: {
        username: Joi.string().email().required().label('Username'),
        password: Joi.string().alphanum().min(3).label('Password')
      }
    },
    handler: (request, reply) => {
      const userId = request.auth.credentials.id;

      return Db.Users.findOne({
        where: {

          username: request.payload.username,
          id: {
            $ne: userId
          }

        }
      }).then((user) => {

        if (user) {
          throw {
            name: "UsernameTakenError",
            message: "That email address is already in use."
          };

        }

      }).then(() => {

        return Db.Users.findById(userId).then((user) => {

          if (request.payload.password) {
            user.set("password", request.payload.password);
          }

          if (user.get("username") != request.payload.username) {
            user.set("username", request.payload.username);
            user.set("emailConfirmed", false);
          }
          user.save().then((updatedUser) => {
            request.auth.session.set(user);
            reply(updatedUser);
          }).catch(err => {
            throw (err);
          });

        }).catch((err) => {
          reply(Boom.create(500, err.message));
        });

      }).catch((err) => {
        if (err) {
          if (err.name == "UsernameTakenError") {
            reply(Boom.create(422, err.message));
          } else {
            reply(Boom.create(500, err.message));
          }
        }
      });





    }
  },




  forgotPassword: {
    validate: {
      payload: {
        username: Joi.string().email().required().label('Email Address')
      }
    },
    handler: (request, reply) => {

      return Db.Users.findOne({
        where: {
          username: request.payload.username
        }
      }).then((user) => {

        if (!user) {
          throw {
            name: "UserNotFoundError",
            message: "There is no user with that email."
          };
          return;
        }
        sendPasswordResetEmail(user);
        reply("OK");
      }).catch(err => {
        if (err.name == "UserNotFoundError") {
          reply(Boom.create(404, err.message));
        } else {
          log.debug(err);
          reply(Boom.create(500, err.message));
        }
      });

    }
  },

  confirm: {
    validate: {
      payload: {
        username: Joi.string().email().required().label('Email Address'),
        hash: Joi.string().required().label("Hash")
      }
    },
    handler: (request, reply) => {

      return Db.Users.findOne({
        where: {
          username: request.payload.username
        }
      }).then((user) => {
        log.debug("user", user);
        if (!user) {
          throw {
            name: "UserNotFoundError",
            message: "Username does not exist"
          };
          return;
        }
        const hash = getHash(user.get('id'), user.get('username'));
        if (hash != request.payload.hash) {
          throw {
            name: "HashCheckFailed",
            message: "The hash is not valid for this username"
          };
          return;
        }
        user.set('emailConfirmed', true);

        user.save().then((result) => {
          reply(result);
        }).catch(err => reply(Boom.create(500, err.message)));

      }).catch(err => reply(Boom.create(406, err.message)));

    }
  },
  verifyReset: {
    validate: {
      payload: {
        username: Joi.string().email().required().label('Email Address'),
        hash: Joi.string().required().label("Hash")
      }
    },
    handler: (request, reply) => {

      return Db.Users.findOne({
        where: {
          username: request.payload.username
        }
      }).then((user) => {
        log.debug("user", user);
        if (!user) {
          throw {
            name: "UserNotFoundError",
            message: "Username does not exist"
          };
          return;
        }
        const hash = getHash(user.get('id'), user.get('username'));
        log.debug(hash, request.payload.hash);
        if (hash != request.payload.hash) {
          throw {
            name: "HashCheckFailed",
            message: "The hash is not valid for this username"
          };
          return;
        }
        reply("OK");

      }).catch(err => reply(Boom.create(406, err.message)));

    }
  },
  resetPassword: {
    validate: {
      payload: {
        username: Joi.string().email().required().label('Email Address'),
        hash: Joi.string().required().label("Hash"),
        password: Joi.string().alphanum().min(3).required().label('Password')
      }
    },
    handler: (request, reply) => {

      return Db.Users.findOne({
        where: {
          username: request.payload.username
        }
      }).then((user) => {
        log.debug("user", user);
        if (!user) {
          throw {
            name: "UserNotFoundError",
            message: "Username does not exist"
          };
          return;
        }
        const hash = getHash(user.get('id'), user.get('username'));
        log.debug(hash, request.payload.hash);
        if (hash != request.payload.hash) {
          throw {
            name: "HashCheckFailed",
            message: "The hash is not valid for this username"
          };
          return;
        }

        user.set('password', request.payload.password);

        user.save().then((result) => {
          reply("OK");
        }).catch(err => reply(Boom.create(500, err.message)));
      }).catch(err => {
        reply(Boom.create(406, err.message));
      });

    }
  },
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
};

export default Auth;
