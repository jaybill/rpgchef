import { createAsyncActionGroup } from './util';
import { createAction } from 'redux-actions';
import log from 'loglevel';
import { weapons as weaponsCall, effects as effectsCall } from '../api';
import store from 'store';
import DnD5e from '../../lib/dnd5e';
import ActionConstants from "../actionconstants";


const weaponsActions = createAsyncActionGroup("weapons", {});

export const weapons = function(effectCount, weaponCount) {

  return dispatch => {

    const w = store.get('weapons');

    const getAllWeapons = () => {
      return new Promise((resolve, reject) => {
        if (w) {
          log.debug("Loading weapons from cache");
          resolve(w);
        } else {
          log.debug("Loading weapons from API");
          weaponsCall().then((result) => {
            if (result.status == 200) {
              store.set('weapons', result.body);
              resolve(weapons);
            } else {
              log.error(results);
              reject(result);
            }
          }, (err) => {
            log.error(err);
            reject(err)
          });
        }
      });
    };

    let allWeapons = [];

    dispatch(weaponsActions.start());
    getAllWeapons().then((weapons) => {
      allWeapons = weapons;
      return effectsCall(effectCount, weaponCount);
    }).then((results) => {

      if (results.status == 200) {
        const dnd5e = new DnD5e({
          weapons: allWeapons,
          effects: results.body
        });

        dispatch(weaponsActions.success(dnd5e.randomWeapons(effectCount, weaponCount)));
      } else {
        throw new Error(results);
      }
    }).catch(err => {
      log.debug(err);
      dispatch(weaponsActions.failure("get weapons failed"));
    });

  }

};
