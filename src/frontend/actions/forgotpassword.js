import { createAsyncActionGroup } from './util';
import { createAction } from 'redux-actions';
import Api from '../api';

// FORGOTPASSWORD
const forgotPasswordActions = createAsyncActionGroup("forgotPassword", {});

export const forgotPassword = function(username) {
  return dispatch => {
    dispatch(forgotPasswordActions.start());
    Api.forgotPassword(username).then((result) => {

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
