import { createAsyncActionGroup } from './util';
import { createAction } from 'redux-actions';
import log from 'loglevel';
import { userweaponUpsert as doUserweaponUpsert, userweaponDelete as doUserweaponDel } from '../api';
import ActionConstants from '../actionconstants';

export const removeUserWeapon = createAction(ActionConstants.USERWEAPON_REMOVE);

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

const userweaponDelActions = createAsyncActionGroup("USERWEAPON_DELETE", {});
export const userweaponDelete = function(uw) {
  return dispatch => {
    dispatch(removeUserWeapon(uw));
    dispatch(userweaponDelActions.start());
    doUserweaponDel(uw).then((result) => {
      if (result.status == 200) {
        dispatch(userweaponDelActions.success(result.body));
      } else {
        log.error(result);
        throw new Error("Bad response");
      }
      return;
    }).catch(err => {
      log.debug(err);
      dispatch(userweaponDelActions.failure("userweapon failed"))
    });
  }
};
