import { createAsyncActionGroup } from './util';
import { createAction } from 'redux-actions';
import log from 'loglevel';
import { weapons as weaponsCall } from '../api';

const weaponsActions = createAsyncActionGroup("weapons", {});
export const weapons = function() {
  return dispatch => {
    dispatch(weaponsActions.start());
    weaponsCall().then((result) => {
      if (result.status == 200) {
        dispatch(weaponsActions.success(result.body));
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
};
