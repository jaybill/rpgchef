import log from 'loglevel';
import ActionConstants from './actionconstants';

const initialState = {
  user: {
    username: null,
    loggedIn: false
  }
};

function rootReducer(state = initialState, action) {

  //log.debug(action);

  switch (action.type) {

    case ActionConstants.LOGIN:
      log.debug(action.payload);
      break;

  }

  return state

}

export default {
  rootReducer
}
