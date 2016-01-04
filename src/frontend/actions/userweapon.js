import { createAsyncActionGroup } from './util';
import { createAction } from 'redux-actions';
import log from 'loglevel';
import { userweapon as userweaponCall } from '../api';

const userweaponActions = createAsyncActionGroup("userweapon", {});
export const userweapon = function(uw) {
  return dispatch => {
    dispatch(userweaponActions.start());
    userweaponCall(uw).then((result) => {
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
