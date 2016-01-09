import { UPDATE_PATH } from 'redux-simple-router';
import log from 'loglevel';

export const pathknower = function(state = {
    path: ""
  }, action) {

  switch (action.type) {
    case UPDATE_PATH:
      return Object.assign({}, {
        path: action.path
      }, state);
      break;
    default:
      return state;
      break;
  }
}
