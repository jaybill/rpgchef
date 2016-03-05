import ActionConstants from '../actionconstants';
import log from 'loglevel';

import { asyncState, updateStateAsync } from './util';

export const monsters = function(state, action) {

  if (!state) {
    state = {
      monster: Object.assign({}, asyncState),
      monsters: Object.assign({}, asyncState)
    };
  }

  const newState = {};

  if (action.type == "MONSTER_RESET") {
    newState.monster = Object.assign({}, asyncState);
    newState.monsters = Object.assign({}, asyncState);
  } else {
    newState.monster = updateStateAsync(state.monster, action, "MONSTER");
    newState.monsters = updateStateAsync(state.monsters, action, "MONSTERS");
  }
  return newState;
};
