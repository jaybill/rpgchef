import ActionConstants from '../actionconstants';

export const forgotPassword = function(state = {
    error: null,
    sending: false,
    complete: false
  }, action) {

  switch (action.type) {

    case ActionConstants.FORGOTPASSWORD_START:
      return Object.assign({}, state, {
        error: null,
        sending: true,
        complete: false
      });
      break;

    case ActionConstants.FORGOTPASSWORD_SUCCESS:
      return Object.assign({}, state, {
        error: null,
        sending: false,
        complete: true
      });
      break;

    case ActionConstants.FORGOTPASSWORD_FAILURE:
      return Object.assign({}, state, {
        error: action.payload,
        sending: false,
        complete: false
      });
      break;

    default:

      return state;
      break;

  }
}
