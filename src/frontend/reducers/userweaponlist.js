import ActionConstants from '../actionconstants';
import log from 'loglevel';
import _ from 'lodash';

export const userweaponlist = function(state = {
    message: null,
    working: false,
    failed: false,
    succeeded: false,
    payload: null
  }, action) {
  log.debug(action.type);
  switch (action.type) {

    case ActionConstants.USERWEAPON_REMOVE:
      log.debug(action, state.payload);
      return Object.assign({}, state, {
        payload: _.filter(state.payload, (i) => {
          return i.id != action.payload
          })
        });

        break;

      case ActionConstants.USERWEAPONLIST_START:
        return Object.assign({}, state, {
          message: null,
          working: true,
          failed: false,
          succeeded: false,
          payload: null
        });
        break;

      case ActionConstants.USERWEAPONLIST_SUCCESS:
        return Object.assign({}, state, {
          message: null,
          working: false,
          failed: false,
          succeeded: true,
          payload: action.payload
        });
        break;

      case ActionConstants.USERWEAPONLIST_FAILURE:
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
