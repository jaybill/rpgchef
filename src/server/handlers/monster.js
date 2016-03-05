import log from 'loglevel';
import Boom from 'boom';
import Joi from 'joi';
import _ from 'lodash';
import Db, { conn } from '../db';
import Sequelize from 'sequelize';

const Monster = {};

Monster.handlers = {
  monster: {
    auth: 'session',
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      }
    },
    validate: {
      params: {
        id: Joi.number().integer().required().min(0).label("Id")
      }
    },
    handler: (request, reply) => {
      Db.Monsters.findById(request.params.id).then((monster) => {
        if (!monster) {
          throw Boom.create(404, "No monster with id [" + request.params.id + "]");
        }
        reply(monster);
      }).catch(err => {
        log.error(err);
        if (err.isBoom) {
          reply(err);
        } else {
          reply(Boom.create(500));
        }
      });
    }
  },
  monsters: {
    auth: 'session',
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      }
    },
    handler: (request, reply) => {
      Db.Monsters.findAll().then((monsters) => {
        reply(monsters);
      }).catch(err => {
        log.error(err);
        reply([]);
      });
    }
  },
  monsterByName: {
    auth: 'session',
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      }
    },
    validate: {
      query: {
        q: Joi.string().min(1).max(100).required(),
        limit: [Joi.number().max(100).optional(), Joi.allow(null)]
      }
    },
    handler: (request, reply) => {

      const crit = {
        attributes: ['id', 'name'],
        where: [{
          name: {
            $iLike: "%" + request.query.q + "%"
          }
        }],
        order: ['name']
      };

      if (request.query.limit && request.query.limit > 0) {
        crit.limit = request.query.limit;
      }

      Db.Monsters.findAll(crit).then((monsters) => {
        reply(monsters);
      }).catch(err => {
        log.error(err);
        reply([]);
      });
    }
  }
};

export default Monster;
