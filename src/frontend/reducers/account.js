import ActionConstants from '../actionconstants';

export const account = function(state = {
    message: null,
    working: false,
    failed: false,
    succeeded: false,
    user: {}
  }, action) {

  switch (action.type) {

    case ActionConstants.ACCOUNT_UPDATE:
      return Object.assign({}, state, {
        user: action.payload
      });
      break;


    case ActionConstants.ACCOUNT_START:
      return Object.assign({}, state, {
        message: null,
        working: true,
        failed: false,
        succeeded: false

      });
      break;

    case ActionConstants.ACCOUNT_SUCCESS:
      return Object.assign({}, state, {
        message: "Account updated.",
        working: false,
        failed: false,
        succeeded: true,
        user: action.payload
      });
      break;

    case ActionConstants.ACCOUNT_FAILURE:
      return Object.assign({}, state, {
        message: action.payload,
        working: false,
        failed: true,
        succeeded: false

      });
      break;

    default:
      return state;
      break;
  }
}
