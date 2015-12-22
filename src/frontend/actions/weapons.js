import { createAsyncActionGroup } from './util';
import { createAction } from 'redux-actions';
import log from 'loglevel';
import { weapons as weaponsCall } from '../api';
import store from 'store';
import DnD5e from '../../lib/dnd5e';
import ActionConstants from "../actionconstants";


export const randomWeapons = function(count) {


  return dispatch => {

    const dnd5e = new DnD5e({
      weapons: store.get('weapons')
    });

    dispatch(createAction(ActionConstants.RANDOM_WEAPONS_DONE)(dnd5e.randomWeapons()));

  }

}
const weaponsActions = createAsyncActionGroup("weapons", {});

export const weapons = function() {

  return dispatch => {

    const w = store.get('weapons');

    if (w) {
      log.debug("Loading weapons from cache");
      dispatch(weaponsActions.success(w));
      return;
    } else {
      log.debug("Loading weapons from API");
      dispatch(weaponsActions.start());
      weaponsCall().then((result) => {
        if (result.status == 200) {
          store.set('weapons', result.body);

        } else {
          log.error(result);
          throw new Error(result);
        }
        return null;
      }).catch(err => {
        log.debug(err);
        dispatch(weaponsActions.failure("get weapons failed"))
      });
    }
  }

};
