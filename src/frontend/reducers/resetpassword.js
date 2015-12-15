import ActionConstants from '../actionconstants';
import log from 'loglevel';

export const resetPassword = function(state = {
    error: null,
    verifying: true,
    verified: false,
    resetting: false,
    reset: false,
    resetError: null
  }, action) {

  log.debug(action.type);

  switch (action.type) {

    case ActionConstants.VERIFYRESET_START:
      return Object.assign({}, state, {
        error: null,
        verifying: true,
        verified: false
      });
      break;

    case ActionConstants.VERIFYRESET_FAILURE:
      return Object.assign({}, state, {
        error: action.payload,
        verifying: false,
        verified: false
      });
      break;

    case ActionConstants.VERIFYRESET_SUCCESS:

      return Object.assign({}, state, {
        error: null,
        verifying: false,
        verified: false
      });

      break;

    case ActionConstants.RESETPASSWORD_START:

      return Object.assign({}, state, {
        resetError: null,
        resetting: true,
        reset: false
      });

      break;


    case ActionConstants.RESETPASSWORD_SUCCESS:

      return Object.assign({}, state, {
        resetError: null,
        resetting: false,
        reset: true
      });

      break;

    case ActionConstants.RESETPASSWORD_FAILURE:

      return Object.assign({}, state, {
        resetError: action.payload,
        resetting: false,
        reset: false
      });

      break;

    default:
      return state;
      break;
  }

};

