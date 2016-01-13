import log from 'loglevel';
import { asyncState, updateStateAsync } from './util';

export const subscribe = function(state, action) {
  log.debug(action.type);
  if (!state) {
    state = {
      post: Object.assign({}, asyncState),
      get: Object.assign({}, asyncState),
      del: Object.assign({}, asyncState)
    };
  }

  const newState = {};
  newState.post = updateStateAsync(state.post, action, "SUBSCRIBE_POST");
  newState.get = updateStateAsync(state.get, action, "SUBSCRIBE_GET");
  newState.del = updateStateAsync(state.del, action, "SUBSCRIBE_DEL");


  return newState;

}
