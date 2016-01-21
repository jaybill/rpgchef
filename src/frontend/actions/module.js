import { createAsyncActionGroup } from './util';
import { createAction } from 'redux-actions';
import log from 'loglevel';
import { postModule as postModuleCall, getModules as getModulesCall, getModule as getModuleCall, delModule as delModuleCall } from '../api';
import ActionConstants from '../actionconstants';

export const moduleReset = createAction(ActionConstants.MODULE_RESET);

const moduleGetActions = createAsyncActionGroup("MODULE_GET", {});

export const moduleGet = function(id) {
  return dispatch => {
    dispatch(moduleGetActions.start());
    getModuleCall(id).then((result) => {
      if (result.status == 200) {
        dispatch(moduleGetActions.success(result.body));
      } else {
        log.error(result);
        throw new Error("Bad response");
      }
      return;
    }).catch(err => {
      log.debug(err);
      dispatch(moduleGetActions.failure("moduleGet failed"));
    });
  };
};

const modulePostActions = createAsyncActionGroup("MODULE_POST", {});
export const modulePostFailure = modulePostActions.failure;

export const modulePost = function(m) {
  return dispatch => {
    dispatch(moduleGetActions.success(m));
    dispatch(modulePostActions.start());
    postModuleCall(m).then((result) => {
      if (result.status == 200) {
        dispatch(modulePostActions.success(result.body));
        dispatch(moduleGetActions.success(result.body));
      } else {
        log.error(result);
        throw new Error("Bad response");
      }
      return;
    }).catch(err => {
      log.debug(err);
      if (typeof m.content == "object") {
        log.debug(typeof m.content);
        m.content = JSON.stringify(m.content);
      }

      dispatch(modulePostActions.failure({
        message: "Unable to save",
        payload: m
      }));
    });
  };
};

const modulesGetActions = createAsyncActionGroup("MODULE_LIST", {});
export const modulesGet = function(id) {
  return dispatch => {
    dispatch(modulesGetActions.start());
    getModulesCall().then((result) => {
      if (result.status == 200) {
        dispatch(modulesGetActions.success(result.body));
      } else {
        log.error(result);
        throw new Error("Bad response");
      }
      return;
    }).catch(err => {
      log.debug(err);
      dispatch(modulesGetActions.failure("modulesGet failed"));
    });
  };
};

const moduleDelActions = createAsyncActionGroup("MODULE_DEL", {});
export const moduleDel = function() {
  return dispatch => {
    dispatch(moduleDelActions.start());
    delModuleCall().then((result) => {
      if (result.status == 200) {
        dispatch(moduleDelActions.success(result.body));
      } else {
        log.error(result);
        throw new Error("Bad response");
      }
      return;
    }).catch(err => {
      log.debug(err);
      dispatch(moduleDelActions.failure("moduleDel failed"));
    });
  };
};
