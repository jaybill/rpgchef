import ActionConstants from '../actionconstants';
import { asyncState } from './util';

export const weapons = function(state = {
    post: {
      message: null,
      working: false,
      failed: false,
      succeeded: false,
      weapons: null,
    },
    defaultWeaponsLoaded: false
  }, action) {

  switch (action.type) {

    case ActionConstants.DEFAULTWEAPONS_SUCCESS:
      return Object.assign({}, state, {
        defaultWeaponsLoaded: true
      });

      break;

    case ActionConstants.WEAPONS_START:
      return Object.assign({}, state, {
        post: {
          message: null,
          working: true,
          failed: false,
          succeeded: false,
          weapons: null
        }

      });
      break;

    case ActionConstants.WEAPONS_SUCCESS:
      return Object.assign({}, state, {
        post: {
          message: null,
          working: false,
          failed: false,
          succeeded: true,
          weapons: action.payload
        }
      });
      break;

    case ActionConstants.WEAPONS_FAILURE:
      return Object.assign({}, state, {
        post: {
          message: action.payload,
          working: false,
          failed: true,
          succeeded: false,
          weapons: null
        }
      });
      break;

    default:
      return state;
      break;
  }
}
