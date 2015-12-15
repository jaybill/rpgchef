import { createAsyncActionGroup } from './util';
import { createAction } from 'redux-actions';
import { logout as logoutCall } from '../api';

// LOGOUT
const logoutActions = createAsyncActionGroup("logout", {});
export const logout = function() {
  return dispatch => {
    dispatch(logoutActions.start());
    logoutCall().then((result) => {
      dispatch(logoutActions.success());
    }).catch(err => {
      dispatch(logoutActions.failure("Logout failed."));
      return err;
    });
  }
};
