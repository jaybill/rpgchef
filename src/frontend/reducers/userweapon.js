import { asyncState, updateStateAsync } from './util';

export const userweapon = function(state, action) {

  if (!state) {
    state = {
      post: Object.assign({}, asyncState),
      del: Object.assign({}, asyncState)
    };
  }

  const newState = {};
  newState.post = updateStateAsync(state.post, action, "USERWEAPON_POST");
  newState.del = updateStateAsync(state.del, action, "USERWEAPON_POST");


  return newState;

}
