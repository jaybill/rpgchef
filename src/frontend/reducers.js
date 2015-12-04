import log from 'loglevel';
import ActionConstants from './actionconstants';
import { combineReducers } from 'redux';

function session(state = {
    isLoggedIn: false,
    loggingIn: false,
    error: null,
    user: null
  }, action) {

  log.debug(action.type);
  switch (action.type) {

    case ActionConstants.LOGIN_START:
      return Object.assign({}, state, {
        isLoggedIn: false,
        loggingIn: true,
        error: null,
        user: null
      });
      break;
    case ActionConstants.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isLoggedIn: true,
        loggingIn: false,
        error: null,
        user: action.payload
      });
      break;

    case ActionConstants.LOGIN_FAILURE:
      return Object.assign({}, state, {
        isLoggedIn: false,
        loggingIn: false,
        user: null,
        error: action.payload
      });

      break;

    default:
      return state;

  }

  return state;

}

const app = combineReducers({
  session
});

export default {
  app
};
