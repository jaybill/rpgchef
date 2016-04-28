import { createAsyncActionGroup, extractMessage } from './util';
import { createAction } from 'redux-actions';
import { register as registerCall } from '../api';
import { logEvent } from '../analytics';

// REGISTER
const registerActions = createAsyncActionGroup("register", {});
export const registerFailure = registerActions.failure;

export const register = function(registration) {

  return dispatch => {
    dispatch(registerActions.start());
    registerCall(registration).then((result) => {

      if (result.status == 200) {
        logEvent("Account", "Create", "Register");
        dispatch(registerActions.success(result.body.username));
        return;
      } else {
        if (result.body.statusCode == 422) {
          dispatch(registerActions.failure(["That email address is already in use."]));
          return;
        }

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

