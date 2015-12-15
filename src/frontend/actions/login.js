import { createAsyncActionGroup } from './util';
import { createAction } from 'redux-actions';
import Api from '../api';

// LOGIN
const loginActions = createAsyncActionGroup("login", {});

export const login = function(credentials) {
  return dispatch => {
    dispatch(loginActions.start());
    Api.login(credentials).then((result) => {

      if (result.status == 200) {
        dispatch(loginActions.success(result.body));
      } else {

        dispatch(loginActions.failure("Login failed."));
      }
      return;
    }).catch(err => dispatch(loginActions.failure("Login failed")));
  }
};
