import { createAsyncActionGroup, extractMessage } from './util';
import { createAction } from 'redux-actions';
import { verifyReset as verifyResetCall, resetPassword as resetPasswordCall } from '../api';

// VERIFYRESET
const verifyResetActions = createAsyncActionGroup("verifyReset", {});

export const verifyReset = function(code) {
  return dispatch => {
    dispatch(verifyResetActions.start());
    verifyResetCall(code).then((result) => {
      if (result.status == 200) {
        dispatch(verifyResetActions.success());
      } else {
        dispatch(verifyResetActions.failure("Verify Reset failed."));
      }
      return;
    }).catch(err => {
      log.debug("Err from verify", err);
      dispatch(verifyResetActions.failure("Verify Reset failed."))
    });

  }
};

// RESETPASSWORD
const resetPasswordActions = createAsyncActionGroup("resetPassword", {});

export const resetPasswordFailure = resetPasswordActions.failure;

export const resetPassword = function(newpass) {
  return dispatch => {
    dispatch(resetPasswordActions.start());
    resetPasswordCall(newpass).then((result) => {
      if (result.status == 200) {
        dispatch(resetPasswordActions.success());
      } else {
        if (result.status == 400) {
          let message = "";
          if (result.body.message) {
            message = extractMessage(result.body.message);
          }
          dispatch(resetPasswordActions.failure(message));
        } else {
          dispatch(resetPasswordActions.failure("Password Reset failed."));
        }

      }
      return;
    }).catch(err => {
      dispatch(resetPasswordActions.failure("Password reset failed."))
    });

  }
};
