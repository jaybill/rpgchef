import { createAsyncActionGroup } from './util';
import { createAction } from 'redux-actions';
import Api from '../api';

// CONFIRM
const confirmActions = createAsyncActionGroup("confirm", {});

export const confirm = function(code) {
  return dispatch => {
    dispatch(confirmActions.start());
    Api.confirm(code).then((result) => {

      if (result.status == 200) {
        dispatch(confirmActions.success(result.body));
      } else {

        dispatch(confirmActions.failure("Confirm failed."));
      }
      return;
    }).catch(err => dispatch(confirmActions.failure("Confirm failed.")));
  }
};
