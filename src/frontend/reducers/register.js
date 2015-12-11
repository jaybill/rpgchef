import ActionConstants from '../actionconstants';

const register = function(state = {
    errors: [],
    registering: false,
    emailSentTo: null,
    complete: false
  }, action) {


  switch (action.type) {

    case ActionConstants.REGISTER_START:
      return Object.assign({}, state, {
        registering: true,
        errors: [],
        emailSentTo: null,
        complete: false
      });
      break;

    case ActionConstants.REGISTER_SUCCESS:
      return Object.assign({}, state, {
        errors: [],
        registering: false,
        emailSentTo: action.payload,
        complete: true
      });
      break;

    case ActionConstants.REGISTER_FAILURE:
      return Object.assign({}, state, {
        errors: action.payload,
        registering: false,
        complete: false
      });
      break;

    default:
      return state;
      break;

  }

}
export default register;
