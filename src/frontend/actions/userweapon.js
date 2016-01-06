import { createAsyncActionGroup } from './util';
import { createAction } from 'redux-actions';
import log from 'loglevel';
import { userweaponUpsert as doUserweaponUpsert } from '../api';

const userweaponActions = createAsyncActionGroup("userweapon_post", {});
export const userweaponUpsert = function(uw) {
  return dispatch => {
    dispatch(userweaponActions.start());
    doUserweaponUpsert(uw).then((result) => {
      if (result.status == 200) {
        dispatch(userweaponActions.success(result.body));
      } else {
        log.error(result);
        throw new Error("Bad response");
      }
      return;
    }).catch(err => {
      log.debug(err);
      dispatch(userweaponActions.failure("userweapon failed"))
    });
  }
};
