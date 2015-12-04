import { createAction } from 'redux-actions';
import log from 'loglevel';
import Api from './api';

import ActionConstants from './actionconstants';

// LOGIN

export const loginStart = createAction(ActionConstants.LOGIN_START);
export const loginSuccess = createAction(ActionConstants.LOGIN_SUCCESS);
export const loginFailure = createAction(ActionConstants.LOGIN_FAILURE);

export const login = function(credentials) {
  return dispatch => {
    dispatch(loginStart());
    Api.login(credentials).then((result) => {
      log.debug(result);
      if (result.status == 200) {
        dispatch(loginSuccess(result.body));
      } else {
        log.debug(result.body);
        dispatch(loginFailure("Login failed."));
      }
    }).catch(err => dispatch(loginFailure("Login failed")));
  }
}
export const meStart = createAction(ActionConstants.ME_START);
export const meSuccess = createAction(ActionConstants.ME_SUCCESS);
export const meFailure = createAction(ActionConstants.ME_FAILURE);

export const me = function() {
  return dispatch => {
    dispatch(meStart());
    Api.me().then((result) => {
      if (result.status == 200) {
        dispatch(meSuccess(result.body));
      } else {
        dispatch(meFailure("Get session failed."));
      }
    }).catch(err => dispatch(loginFailure("Get session failed")));
  }
}
