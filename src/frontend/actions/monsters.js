import { createAsyncActionGroup } from './util';
import { createAction } from 'redux-actions';
import log from 'loglevel';
import { monstersByName as monstersCall, monster as monsterCall } from '../api';
import ActionConstants from '../actionconstants';

export const monsterReset = createAction(ActionConstants.MONSTER_RESET);

const monstersActions = createAsyncActionGroup("MONSTERS", {});
export const monsters = function(startswith, limit) {
  return dispatch => {
    dispatch(monstersActions.start());
    return monstersCall(startswith, limit).then((result) => {
      if (result.status == 200) {
        return dispatch(monstersActions.success(result.body));
      } else {
        log.error(result);
        throw new Error("Bad response");
        return;
      }
      return;
    }).catch(err => {
      log.debug(err);
      return dispatch(monstersActions.failure("monsters failed"));
    });
  };
};

const monsterActions = createAsyncActionGroup("MONSTER", {});
export const monster = function(id) {
  return dispatch => {
    dispatch(monsterActions.start());
    return monsterCall(id).then((result) => {
      if (result.status == 200) {
        return dispatch(monsterActions.success(result.body));
      } else {
        log.error(result);
        throw new Error("Bad response");
      }
      return;
    }).catch(err => {
      log.debug(err);
      return dispatch(monsterActions.failure("monster failed"));
    });
  };
};
