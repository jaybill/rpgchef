import ActionConstants from '../actionconstants';
import log from 'loglevel';
import { asyncState, updateStateAsync } from './util';

export const module = function(state, action) {

  if (!state || action.type == ActionConstants.MODULE_RESET) {
    state = {
      get: Object.assign({}, asyncState),
      post: Object.assign({}, asyncState),
      del: Object.assign({}, asyncState),
      list: Object.assign({}, asyncState),
      makePdf: Object.assign({}, asyncState),
      getPdf: Object.assign({}, asyncState)
    };
  }

  const newState = {};
  if (action.type == ActionConstants.MODULE_POST_RESET) {
    newState.post = Object.assign({}, asyncState);
  } else {
    newState.post = updateStateAsync(state.post, action, "MODULE_POST");
  }

  newState.del = updateStateAsync(state.del, action, "MODULE_DEL");
  newState.get = updateStateAsync(state.get, action, "MODULE_GET");
  newState.list = updateStateAsync(state.list, action, "MODULE_LIST");

  if (action.type == ActionConstants.MODULE_PDF_RESET) {
    log.debug("resetting!");
    newState.getPdf = Object.assign({}, asyncState);
    newState.makePdf = Object.assign({}, asyncState);
  } else {
    newState.getPdf = updateStateAsync(state.getPdf, action, "MODULE_GETPDF");
    newState.makePdf = updateStateAsync(state.makePdf, action, "MODULE_MAKEPDF");
  }
  return newState;
};
