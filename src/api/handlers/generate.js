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
        return Db.WeaponGroups.findAll().then(wg => {
          return {
            weapons: ws,
            weaponGroups: wg
          };
        });
      }).then(ww => {
        const wwg = [];

        _.forIn(ww.weapons, (w) => {


          const subgroup = _.find(ww.weaponGroups, (wg) => {
            return wg.id == w.groupId;
          });

          const group = _.find(ww.weaponGroups, (wg) => {
            return subgroup.parentId == wg.id;
          });

          wwg.push({
            id: w.id,
            name: w.name,
            priceInCp: w.priceInCp,
            weightInLb: w.weightInLb,
            properties: w.properties,
            damage: w.damage,
            group: group.name,
            subgroup: subgroup.name
          });

        });

        reply(wwg);

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
