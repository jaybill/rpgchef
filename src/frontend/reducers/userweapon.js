import { asyncState, updateStateAsync } from './util';

export const userweapon = function(state, action) {

  if (!state) {
    state = {
      post: Object.assign({}, asyncState)
    };
  }

  const newState = {};
  newState.post = updateStateAsync(state.post, action, "USERWEAPON_POST");



  return newState;

}
