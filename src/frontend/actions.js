import { createAction } from 'redux-actions';
import log from 'loglevel';
import Api from './api';
import _ from 'lodash';

import ActionConstants from './actionconstants';


function createAsyncActionGroup(namePrefix, config) {
  let actionGroup = {};

  const configProps = ['start', 'success', 'failure'];

  for (const cp in configProps) {
    let cpn = configProps[cp];
    if (typeof config[cpn] === 'function') {
      actionGroup[cpn] = config[cpn];
    } else {
      let name = namePrefix + "_" + cpn;
      name = name.toUpperCase();
      actionGroup[cpn] = createAction(ActionConstants[name]);
    }
  }

  return actionGroup;
}

// LOGIN
const loginActions = createAsyncActionGroup("login", {});

export const login = function(credentials) {
  return dispatch => {
    dispatch(loginActions.start());
    Api.login(credentials).then((result) => {
      log.debug(result);
      if (result.status == 200) {
        dispatch(loginActions.success(result.body));
      } else {
        log.debug(result.body);
        dispatch(loginActions.failure("Login failed."));
      }
      return;
    }).catch(err => dispatch(loginActions.failure("Login failed")));
  }
};

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

// LOGOUT
const logoutActions = createAsyncActionGroup("logout", {});
export const logout = function() {
  return dispatch => {
    dispatch(logoutActions.start());
    Api.logout().then((result) => {
      dispatch(logoutActions.success());
    }).catch(err => {
      dispatch(logoutActions.failure("Logout failed."));
      return err;
    });
  }
};
