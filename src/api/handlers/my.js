import log from 'loglevel';
import Boom from 'boom';
import Joi from 'joi';
import _ from 'lodash';
import Db, { conn } from '../db';

const My = {};


My.handlers = {

  deleteUserWeapon: {
    auth: 'session',
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      }
    },
    validate: {
      params: {
        id: Joi.number().integer().required().min(0).label("Id"),
      }
    },

    handler: (request, reply) => {
      const userId = request.auth.credentials.id;
      Db.UserWeapons.findById(request.params.id).then((uw) => {
        if (uw) {
          if (uw.get("userId") != userId) {
            reply(Boom.create(403,
              "Userweapon with id [" + request.params.id + "] does not belong to you"));
          } else {
            uw.destroy().then(() => {
              reply("OK");
            }).catch(err => {
              throw err
            });
          }
        } else {
          reply(Boom.create(404, "No userweapon with id [" + request.params.id + "]"));
        }

      }).then((uw) => {

      }).catch(err => {
        log.error(err);
        reply(Boom.create(500))
      });
    }
  },


  getUserWeapon: {
    auth: 'session',
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      }
    },
    validate: {
      params: {
        id: Joi.number().integer().required().min(0).label("Id"),
      }
    },

    handler: (request, reply) => {
      const userId = request.auth.credentials.id;
      Db.UserWeapons.findById(request.params.id).then((uw) => {
        if (uw) {
          if (uw.get("userId") != userId) {
            reply(Boom.create(403,
              "Userweapon with id [" + request.params.id + "] does not belong to you"));
          } else {
            reply(_.omit(uw.dataValues, 'userId'));
          }
        } else {
          reply(Boom.create(404, "No userweapon with id [" + request.params.id + "]"));
        }

      }).catch(err => {
        log.error(err);
        reply(Boom.create(500))
      });
    }
  },

  upsertUserWeapon: {
    auth: 'session',
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      }
    },
    validate: {
      payload: {
        id: Joi.number().integer().min(0).label("Id"),
        weaponId: Joi.number().integer().required().min(0).max(100).label("Id"),
        name: Joi.string().min(1).max(500).required().label('Name'),
        magicProps: Joi.string().max(10000).required().label('Magic Properties'),
        priceInCp: Joi.number().integer().min(0).label("Price")
      }
    },
    handler: (request, reply) => {
      const userId = request.auth.credentials.id;
      const {weaponId} = request.payload;

      const nw = Object.assign({}, request.payload, {
        userId: userId
      });

      Db.Weapons.count({
        where: {
          id: weaponId
        }
      }).then((weaponCount) => {
        if (weaponCount != 1) {
          throw new Error("weaponId " + weaponId + " does not exist");
        }
        return
      }).then(() => {
        return Db.UserWeapons.findById(nw.id).then((wp) => {
          if (wp && wp.get("userId") == userId) {
            return wp.update(nw);
          } else {
            return Db.UserWeapons.create(_.omit(nw, 'id'));
          }
        });
      }).then((wp) => {
        reply(_.omit(wp.dataValues, 'userId'));
      }).catch(err => {
        reply(Boom.create(422, err.message));
      });
    }
  },

  weapons: {
    auth: 'session',
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      }
    },
    handler: (request, reply) => {
      const userId = request.auth.credentials.id;
      Db.UserWeapons.findAll({
        attributes: ['id', 'name', 'weaponId', 'magicProps', 'priceInCp'],
        where: [{
          userId: userId
        }]
      }).then((ws) => {
        log.debug();


        reply(ws);
      }).catch(err => {
        log.error(err);
        reply([]);
      });

    }
  }

}

export default My;
