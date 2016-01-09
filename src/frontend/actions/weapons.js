import { createAsyncActionGroup } from './util';
import { createAction } from 'redux-actions';
import log from 'loglevel';
import { weapons as weaponsCall, effects as effectsCall } from '../api';
import store from 'store';
import DnD5e from '../../lib/dnd5e';
import ActionConstants from "../actionconstants";
import { logEvent } from '../analytics';

const weaponsActions = createAsyncActionGroup("weapons", {});

const defaultWeaponActions = createAsyncActionGroup("defaultWeapons", {});

const getAllWeapons = () => {
  const w = store.get('weapons');
  const wv = store.get('weaponsVersion');

  return new Promise((resolve, reject) => {
    if (w && parseInt(wv) == 1) {
      log.debug("Loading weapons from cache");
      resolve(w);
    } else {
      log.debug("Loading weapons from API");
      weaponsCall().then((result) => {
        if (result.status == 200) {
          store.set('weapons', result.body);
          store.set('weaponsVersion', "1");
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

export const defaultWeapons = () => {

  return dispatch => {
    dispatch(defaultWeaponActions.start());
    getAllWeapons().then(() => {
      dispatch(defaultWeaponActions.success());
      return;
    }).catch((err) => {
      dispatch(defaultWeaponActions.failure(err));
      return;
    });
  }

}
export const weapons = function(effectCount, weaponCount) {

  return dispatch => {
    logEvent("Generate", "Weapons",
      "Effects: " + effectCount + ", Count: " + weaponCount);

    const allWeapons = store.get('weapons');

    if (!allWeapons || !allWeapons.length) {
      log.error("Default weapons not loaded.");
      dispatch(defaultWeapons());
      dispatch(weaponsActions.failure("get weapons failed, default weapons not loaded"));
      return
    }

    dispatch(weaponsActions.start());
    effectsCall(effectCount, weaponCount).then((results) => {
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
