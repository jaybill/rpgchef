import { createAsyncActionGroup } from './util';
import { createAction } from 'redux-actions';
import log from 'loglevel';
import { subscribeDel as cancelCall } from '../api';

const cancelActions = createAsyncActionGroup("SUBSCRIBE_DEL", {});
export const cancel = function() {
  return dispatch => {
    dispatch(cancelActions.start());
    cancelCall().then((result) => {
      if (result.status == 200) {
        dispatch(cancelActions.success(result.body));
      } else {
        log.error(result);
        throw new Error("Bad response");
      }
      return;
    }).catch(err => {
      log.debug(err);
      dispatch(cancelActions.failure("cancel failed"))
    });
  }
};
