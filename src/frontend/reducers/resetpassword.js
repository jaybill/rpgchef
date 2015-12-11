import ActionConstants from '../actionconstants';

const resetPassword = function(state = {
    error: [],
    verifying: true,
    verified: false
  }, action) {

  switch (action.type) {

    case ActionConstants.VERIFYRESET_START:
      return Object.assign({}, state, {
        error: [],
        verifying: true,
        verified: false
      });
      break;

    case ActionConstants.VERIFYRESET_FAILURE:
      return Object.assign({}, state, {
        error: [action.payload],
        verifying: false,
        verified: false
      });
      break;

    case ActionConstants.VERIFYRESET_SUCCESS:
      return Object.assign({}, state, {
        error: [],
        verifying: false,
        verified: false
      });

      break;

    default:
      return state;
      break;
  }

};


export default resetPassword;
