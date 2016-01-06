import { createAsyncActionGroup } from './util';
import { createAction } from 'redux-actions';
import log from 'loglevel';
import store from 'store';
import DnD5e from '../../lib/dnd5e';
import { userweaponsGet as userweaponlistCall } from '../api';

const userweaponlistActions = createAsyncActionGroup("userweaponlist", {});
export const userweaponlist = function() {
  return dispatch => {
    const allWeapons = store.get('weapons');

    if (!allWeapons || !allWeapons.length) {
      log.error("Default weapons not loaded.");
      dispatch(defaultWeapons());
      dispatch(userweaponlistActions.failure("get weapons failed, default weapons not loaded"))
      return
    }


    dispatch(userweaponlistActions.start());
    userweaponlistCall().then((result) => {
      if (result.status == 200) {

        const dnd5e = new DnD5e({
          weapons: allWeapons,
          magicWeapons: result.body
        });

        dispatch(userweaponlistActions.success(dnd5e.mergedWeapons()));
        return;
      } else {
        log.error(result);
        throw new Error("Bad response");
        return;
      }
      return;
    }).catch(err => {
      log.debug(err);
      dispatch(userweaponlistActions.failure("userweaponlist failed"))
    });
  }
};
