import { createAsyncActionGroup } from './util';
import { createAction } from 'redux-actions';
import Api from '../api';

// ME
const meActions = createAsyncActionGroup("me", {});
export const me = function() {
  return dispatch => {
    dispatch(meActions.start());
    Api.me().then((result) => {
      if (result.status == 200) {
        dispatch(meActions.success(result.body));
      } else {
        dispatch(meActions.failure("Not logged in."));
      }
      return;
    }).catch(err => dispatch(meActions.failure("Get session failed.")));
  }
};
