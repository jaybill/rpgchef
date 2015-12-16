import { createAsyncActionGroup } from './util';
import { createAction } from 'redux-actions';
import log from 'loglevel';
import { account as accountCall } from '../api';

const accountActions = createAsyncActionGroup("account", {});
export const account = function() {
  return dispatch => {
    dispatch(accountActions.start());
    accountCall().then((result) => {
      if (result.status == 200) {
        dispatch(accountActions.success(result.body));
      } else {
        log.error(result);
        throw new Error("Bad response");
      }
      return;
    }).catch(err => {
        log.debug(err);
        dispatch(accountActions.failure("account failed"))
    });
  }
};
