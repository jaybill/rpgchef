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

function extractMessage(errMessage) {
  const re = /\[(.*?)\]/;
  let m;
  let message;
  if ((m = re.exec(errMessage)) !== null) {
    if (m.index === re.lastIndex) {
      re.lastIndex++;
    }
    message = m[0].substring(1, m[0].length - 1);
  }

  return message;
}

// REGISTER
const registerActions = createAsyncActionGroup("register", {});
export const registerFailure = registerActions.failure;

export const register = function(registration) {
  log.debug("Register action!");
  return dispatch => {
    dispatch(registerActions.start());
    Api.register(registration).then((result) => {
      log.debug(result);
      if (result.status == 200) {
        log.debug(result.body);
        dispatch(registerActions.success(result.body.username));
        return;
      } else {
        if (result.body.statusCode == 422) {
          dispatch(registerActions.failure(["That email address is already in use."]));
          return;
        }
        log.debug(result.body);
        let message = "";
        if (result.body.message) {
          message = extractMessage(result.body.message);
        }

        dispatch(registerActions.failure([message]));
      }
      return;
    }).catch(err => dispatch(registerActions.failure(["Registration failed"])));
  }
};


// CONFIRM
const confirmActions = createAsyncActionGroup("confirm", {});

export const confirm = function(code) {
  return dispatch => {
    dispatch(confirmActions.start());
    Api.confirm(code).then((result) => {
      log.debug(result);
      if (result.status == 200) {
        dispatch(confirmActions.success(result.body));
      } else {
        log.debug(result.body);
        dispatch(confirmActions.failure("Confirm failed."));
      }
      return;
    }).catch(err => dispatch(confirmActions.failure("Confirm failed.")));
  }
};

// VERIFYRESET
const verifyResetActions = createAsyncActionGroup("verifyReset", {});

export const verifyReset = function(code) {
  return dispatch => {
    dispatch(verifyResetActions.start());
    Api.verifyReset(code).then((result) => {
      log.debug(result);
      if (result.status == 200) {
        dispatch(verifyResetActions.success(result.body));
      } else {
        log.debug(result.body);
        dispatch(verifyResetActions.failure("Verify Reset failed."));
      }
      return;
    }).catch(err => dispatch(verifyResetActions.failure("Verify Reset failed.")));
  }
};


// FORGOTPASSWORD
const forgotPasswordActions = createAsyncActionGroup("forgotPassword", {});

export const forgotPassword = function(username) {
  return dispatch => {
    dispatch(forgotPasswordActions.start());
    Api.forgotPassword(username).then((result) => {
      log.debug(result);
      if (result.status == 200) {
        dispatch(forgotPasswordActions.success(result.body));
      } else {
        if (result.status == 404) {
          dispatch(forgotPasswordActions.failure("There is no user with that email."));
        } else {

          if (result.body.message) {
            dispatch(forgotPasswordActions.failure(extractMessage(result.body.message)));
          } else {
            throw new Error("Nope");
          }


        }

      }
      return;
    }).catch(err => dispatch(forgotPasswordActions.failure("Could not send password reset email.")));
  }
};
