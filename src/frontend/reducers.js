import log from 'loglevel';
import ActionConstants from './actionconstants';
import { combineReducers } from 'redux';

function session(state = {
    isLoaded: false,
    isLoggedIn: false,
    loggingIn: false,
    loggingOut: false,
    error: null,
    user: null
  }, action) {

  log.debug(action.type);
  switch (action.type) {

    case ActionConstants.ME_SUCCESS:
      return Object.assign({}, state, {
        isLoaded: true,
        isLoggedIn: true,
        loggingIn: false,
        error: null,
        user: action.payload
      });

      break;
    case ActionConstants.ME_FAILURE:
      return Object.assign({}, state, {
        isLoaded: true,
        isLoggedIn: false,
        loggingIn: false,
        error: null,
        user: null
      });

      break;


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

    case ActionConstants.LOGOUT_START:
      return Object.assign({}, state, {
        isLoggedIn: false,
        loggingOut: true,
        error: null,
        user: null
      });
      break;

    case ActionConstants.LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        isLoggedIn: false,
        loggingOut: false,
        error: null,
        user: null
      });
      break;

    case ActionConstants.LOGOUT_FAILURE:
      return Object.assign({}, state, {
        isLoggedIn: false,
        loggingOut: false,
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