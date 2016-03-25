import { createAsyncActionGroup } from './util';
import { createAction } from 'redux-actions';
import log from 'loglevel';
import { backgrounds as backgroundsCall } from '../api';

const backgroundsActions = createAsyncActionGroup("backgrounds", {});
export const backgrounds = function() {
  return dispatch => {
    dispatch(backgroundsActions.start());
    backgroundsCall().then((result) => {
      if (result.status == 200) {
        dispatch(backgroundsActions.success(result.body));
      } else {
        log.error(result);
        throw new Error("Bad response");
      }
      return;
    }).catch(err => {
        log.debug(err);
        dispatch(backgroundsActions.failure("backgrounds failed"))
    });
  }
};
