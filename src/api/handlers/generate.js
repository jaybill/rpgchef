import log from 'loglevel';
import Boom from 'boom';
import Joi from 'joi';
import _ from 'lodash';
import Db from '../db';

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
  }
}

export default Generate;
