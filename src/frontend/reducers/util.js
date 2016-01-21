import ActionConstants from '../actionconstants';

export const asyncState = {
  message: null,
  working: false,
  failed: false,
  succeeded: false,
  payload: null

};
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

      let message;
      let payload;

      if (action.payload.message) {
        message = action.payload.message;
        payload = action.payload.payload;
      } else {
        message = action.payload;
      }

      return Object.assign({}, state, {
        message: message,
        working: false,
        failed: true,
        succeeded: false,
        payload: payload
      });
      break;

    default:
      return state;
      break;
  }


}
