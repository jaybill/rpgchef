import ActionConstants from '../actionconstants';

export const account = function(state = {
    message: null,
    working: false,
    failed: false,
    succeeded: false,
    payload: null
  }, action) {

  switch (action.type) {

    case ActionConstants.ACCOUNT_START:
      return Object.assign({}, state, {
        message: null,
        working: true,
        failed: false,
        succeeded: false,
        payload: null
      });
      break;

    case ActionConstants.ACCOUNT_SUCCESS:
      return Object.assign({}, state, {
        message: null,
        working: false,
        failed: false,
        succeeded: true,
        payload: action.payload
      });
      break;

    case ActionConstants.ACCOUNT_FAILURE:
      return Object.assign({}, state, {
        message: action.payload,
        working: false,
        failed: true,
        succeeded: false,
        payload: null
      });
      break;

    default:
      return state;
      break;
  }
}