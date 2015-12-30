import log from 'loglevel';
import Boom from 'boom';
import Joi from 'joi';
import _ from 'lodash';
import Db, { conn } from '../db';

const Generate = {};

Generate.handlers = {

  weapons: {
    auth: 'session',
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      }
    },
    handler: (request, reply) => {

      Db.Weapons.findAll().then((ws) => {
        reply(ws);
      }).catch(err => {
        log.error(err);
        reply([]);
      });

    }
  },
  effects: {
    auth: 'session',
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      }
    },
    validate: {
      query: {
        effectCount: Joi.number().min(1).max(2).required(),
        weaponCount: Joi.number().min(1).max(10).required()
      }
    },
    handler: (request, reply) => {

      const promises = [];
      for (let i = 0; i < request.query.weaponCount; i++) {
        const r = [];
        promises.push(
          Db.Effects.findAll({
            offset: [
              "floor(random()*(select count(*) from effects))"
            ],
            limit: 1
          }).then((effects) => {

            r.push(effects[0]);
            if (request.query.effectCount == 2) {
              return Db.Effects.findAll({
                where: {
                  id: {
                    $ne: effects[0].id
                  }
                },
                offset: [
                  "floor(random()*((select count(*) from effects)-1))"
                ],
                limit: 1
              });
            } else {
              return null;
            }

          }).then((effects) => {
            if (effects) {
              r.push(effects[0]);
            }
            return (r);
          }).catch(err => {
            log.error(err);
            return [];
          })
        );
      }
      return Promise.all(promises).then((results) => {
        reply(results);
      });
    }
  }
}

export default Generate;
