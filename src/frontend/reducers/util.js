import ActionConstants from '../actionconstants';

export const asyncState = {
  message: null,
  working: false,
  failed: false,
  succeeded: false,
  payload: null

}
export const updateStateAsync = (state, action, constant) => {

  switch (action.type) {

    case ActionConstants[constant + "_START"]:
      return Object.assign({}, state, {
        message: null,
        working: true,
        failed: false,
        succeeded: false,
        payload: null
      });
      break;

    case ActionConstants[constant + "_SUCCESS"]:
      return Object.assign({}, state, {
        message: null,
        working: false,
        failed: false,
        succeeded: true,
        payload: action.payload
      });
      break;

    case ActionConstants[constant + "_FAILURE"]:
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
