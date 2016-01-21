import ActionConstants from '../actionconstants';

import { asyncState, updateStateAsync } from './util';

export const module = function(state, action) {

  if (!state || action.type == ActionConstants.MODULE_RESET) {
    state = {
      get: Object.assign({}, asyncState),
      post: Object.assign({}, asyncState),
      del: Object.assign({}, asyncState),
      list: Object.assign({}, asyncState)
    };
  }

  const newState = {};
  newState.post = updateStateAsync(state.post, action, "MODULE_POST");
  newState.del = updateStateAsync(state.del, action, "MODULE_DEL");
  newState.get = updateStateAsync(state.get, action, "MODULE_GET");
  newState.list = updateStateAsync(state.list, action, "MODULE_LIST");

  return newState;
};
