import { createAsyncActionGroup } from './util';
import { createAction } from 'redux-actions';
import { confirm as confirmCall } from '../api';
import { logEvent } from '../analytics';

// CONFIRM
const confirmActions = createAsyncActionGroup("confirm", {});

export const confirm = function(code) {
  return dispatch => {
    dispatch(confirmActions.start());
    confirmCall(code).then((result) => {

      if (result.status == 200) {
        logEvent("Account", "Create", "Confirm");
        dispatch(confirmActions.success(result.body));
      } else {

        dispatch(confirmActions.failure("Confirm failed."));
      }
      return;
    }).catch(err => dispatch(confirmActions.failure("Confirm failed.")));
  };
};
