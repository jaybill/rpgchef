import ActionConstants from '../actionconstants';

const confirm = function(state = {
    error: null,
    confirming: true
  }, action) {

  switch (action.type) {

    case ActionConstants.CONFIRM_START:
      return Object.assign({}, state, {
        error: null,
        confirming: true,
      });
      break;

    case ActionConstants.CONFIRM_SUCCESS:
      return Object.assign({}, state, {
        error: null,
        confirming: false,
      });
      break;

    case ActionConstants.CONFIRM_FAILURE:
      return Object.assign({}, state, {
        error: "Unable to confirm your email.",
        confirming: false,
      });
      break;

    default:
      return state;
      break;
  }
}
export default confirm;
