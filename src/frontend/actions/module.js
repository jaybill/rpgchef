import { createAsyncActionGroup } from './util';
import { createAction } from 'redux-actions';
import log from 'loglevel';
import { makeModulePdf as makePdfCall, getModulePdf as getPdfCall, postModule as postModuleCall, getModules as getModulesCall, getModule as getModuleCall, delModule as delModuleCall } from '../api';
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
      log.error(err);
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
        return [
          dispatch(modulePostActions.success(result.body)),
          dispatch(moduleGetActions.success(result.body)),
          dispatch(modulesGet())];
      } else {
        log.error(result);
        throw new Error("Bad response");
      }

    }).catch(err => {
      log.error(err);
      if (typeof m.content == "object") {
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
      log.error(err);
      dispatch(modulesGetActions.failure("modulesGet failed"));
    });
  };
};
export const modulePdfReset = createAction(ActionConstants.MODULE_PDF_RESET);
const makePdfActions = createAsyncActionGroup("MODULE_MAKEPDF", {});
export const makePdf = function(id) {
  return dispatch => {
    dispatch(makePdfActions.start());
    return makePdfCall(id).then((result) => {
      if (result.status == 200) {
        return [
          dispatch(makePdfActions.success(result.body)),
          dispatch(getPdf(id))
        ];
      } else {
        log.error(result);
        throw new Error("Bad response");
      }
    }).catch(err => {
      log.error(err);
      dispatch(makePdfActions.failure("makePdf failed"));
    });
  };
};

const getPdfActions = createAsyncActionGroup("MODULE_GETPDF", {});
export const getPdf = function(id) {
  return dispatch => {
    dispatch(getPdfActions.start());
    let _timer;

    const pingForPdf = () => {
      getPdfCall(id).then((result) => {
        if (result.status == 200) {
          if (result.body.pdfUrl) {
            window.clearInterval(_timer);
            return dispatch(getPdfActions.success(result.body));
          }
        } else {
          log.error(result);
          throw new Error("Bad response");
        }
        return null;
      }).catch(err => {
        log.error(err);
        dispatch(getPdfActions.failure("getPdf failed"));
      });
    };
    _timer = window.setInterval(pingForPdf, 500, dispatch, id);
  };
};
