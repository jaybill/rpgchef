import { createAsyncActionGroup, extractMessage } from './util';
import { createAction } from 'redux-actions';
import log from 'loglevel';
import { account as accountCall } from '../api';
import ActionConstants from '../actionconstants';

const accountActions = createAsyncActionGroup("account", {});

export const update = createAction(ActionConstants.ACCOUNT_UPDATE);

export const account = function(user) {


  return dispatch => {
    dispatch(update(user));

    dispatch(accountActions.start());
    accountCall({
      username: user.username
    }).then((result) => {
      if (result.status == 200) {
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
