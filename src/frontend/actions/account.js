import { createAsyncActionGroup, extractMessage } from './util';
import { createAction } from 'redux-actions';
import log from 'loglevel';
import { account as accountCall } from '../api';
import ActionConstants from '../actionconstants';

const accountActions = createAsyncActionGroup("account", {});
const sessionUsernameUpdate = createAction(ActionConstants.SESSION_USERNAME_UPDATE);

export const failure = accountActions.failure;

export const account = function(user) {

  return dispatch => {
    dispatch(accountActions.start());
    accountCall(user).then((result) => {
      if (result.status == 200) {
        dispatch(sessionUsernameUpdate(user.username));
        dispatch(accountActions.success(result.body));
      } else {
        if (result.body.statusCode == 400) {
          throw new Error(extractMessage(result.body.message));
        } else {
          throw new Error(result.body.message);
        }

      }
      return;
    }).catch(err => {
      log.debug(err.message);
      dispatch(accountActions.failure(err.message))
    });
  }
};
