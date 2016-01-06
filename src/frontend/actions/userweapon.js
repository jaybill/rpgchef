import { createAsyncActionGroup } from './util';
import { createAction } from 'redux-actions';
import log from 'loglevel';
import { userweaponUpsert as doUserweaponUpsert } from '../api';

const userweaponPostActions = createAsyncActionGroup("USERWEAPON_POST", {});
export const userweaponUpsert = function(uw) {
  return dispatch => {
    dispatch(userweaponPostActions.start());
    doUserweaponUpsert(uw).then((result) => {
      if (result.status == 200) {
        dispatch(userweaponPostActions.success(result.body));
      } else {
        log.error(result);
        throw new Error("Bad response");
      }
      return;
    }).catch(err => {
      log.debug(err);
      dispatch(userweaponPostActions.failure("userweapon failed"))
    });
  }
};
