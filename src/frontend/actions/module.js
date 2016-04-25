import { createAsyncActionGroup } from './util';
import { createAction } from 'redux-actions';
import log from 'loglevel';
import { makeModulePdf as makePdfCall, getModulePdf as getPdfCall, postModule as postModuleCall, getModules as getModulesCall, getModule as getModuleCall, delModule as delModuleCall, uploadFile as uploadCall, deleteFile as deleteImageCall } from '../api';
import ActionConstants from '../actionconstants';
import _ from 'lodash';
export const moduleReset = createAction(ActionConstants.MODULE_RESET);
export const modulePostReset = createAction(ActionConstants.MODULE_POST_RESET);
const moduleGetActions = createAsyncActionGroup("MODULE_GET", {});

export const moduleGet = function(id) {
  return dispatch => {
    dispatch(moduleGetActions.start());
    return getModuleCall(id).then((result) => {
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
    return [dispatch(moduleGetActions.success(m)),
      dispatch(modulePostActions.start()),
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

        return dispatch(modulePostActions.failure({
          message: "Unable to save",
          payload: m
        }));
      })];
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

const moduleDelActions = createAsyncActionGroup("MODULE_DEL", {});
export const moduleDel = function(id) {
  return dispatch => {
    dispatch(moduleDelActions.start());
    return delModuleCall(id).then((result) => {
      if (result.status == 200) {
        return dispatch(moduleDelActions.success(result.body));
      } else {
        log.error(result);
        throw new Error("Bad response");
      }
    }).catch(err => {
      log.error(err);
      dispatch(moduleDelActions.failure("moduleDel failed"));
    });
  };
};
export const uploadReset = createAction(ActionConstants.UPLOAD_IMAGE_RESET);
export const uploadProgress = createAction(ActionConstants.UPLOAD_PROGRESS);
const uploadActions = createAsyncActionGroup("UPLOAD_IMAGE", {});
export const upload = function(k, file, moduleId, replaces) {
  return (dispatch) => {
    const onDone = (result) => {
      try {
        if (result.status == 200) {
          return dispatch(uploadActions.success({
            k: k,
            moduleId: moduleId,
            filename: result.body.filename
          }));
        } else if (result.status == 422) {
          throw new Error(result.body.message);
        } else if (result.status == 400) {

          if (_.startsWith(result.body.message, "Payload content length greater than maximum")) {
            throw new Error("Maxium image size must be less than 5MB");
          }

          throw new Error(result.body.message);
        } else {

          log.error(result);
          throw new Error("Bad Response");
        }
      } catch ( e ) {
        log.error(e);
        return dispatch(uploadActions.failure({
          k: k,
          moduleId: moduleId,
          message: e.message
        }));
      };
    };

    const onError = (err) => {
      log.error(err);
      dispatch(uploadActions.failure({
        k: k,
        moduleId: moduleId,
        message: err.message
      }));
    };

    const onProgress = (r) => {
      dispatch(uploadProgress({
        k,
        r: (r.uploadedBytes / r.uploadLength) * 100
      }));
    };

    dispatch(uploadActions.start());
    uploadCall(file, moduleId, replaces, onDone, onError, onProgress);
    return null;
    /*r.post.progress(function() {
      log.debug(r); //=> { uploaded: 1, downloaded: 0, completed: 0.5, aborted: false }
    });*/

  };
};

export const deleteImageReset = createAction(ActionConstants.DELETE_IMAGE_RESET);
const deleteImageActions = createAsyncActionGroup("DELETE_IMAGE", {});
export const deleteImage = function(file, moduleId, k) {
  return dispatch => {
    dispatch(deleteImageActions.start());
    return deleteImageCall(file, moduleId).then((result) => {
      if (result.status == 200 && result.body == "OK") {
        return dispatch(deleteImageActions.success(
          {
            filename: file,
            moduleId: moduleId,
            k: k
          }));
      } else {
        log.error(result);
        throw new Error("Bad response");
      }
    }).catch(err => {
      log.error(err);
      dispatch(deleteImageActions.failure({
        k: k,
        moduleId: moduleId,
        message: "delete image failed"
      }));
    });
  };
};



export const modulePdfReset = createAction(ActionConstants.MODULE_PDF_RESET);
const makePdfActions = createAsyncActionGroup("MODULE_MAKEPDF", {});
export const makePdf = function(module) {
  return dispatch => {
    dispatch(makePdfActions.start());
    dispatch(modulePostActions.start());
    return postModuleCall(module).then((result) => {
      if (result.status == 200) {
        dispatch(modulePostActions.success(result.body)),
        dispatch(moduleGetActions.success(result.body)),
        dispatch(modulesGet());

        if (!result.body.content || !result.body.content.length) {
          throw new Error("Module has no content.");
        }

      } else {
        log.error(result.status, result.body);
        if (typeof module.content == "object") {
          module.content = JSON.stringify(module.content);
        }

        dispatch(modulePostActions.failure({
          message: "Unable to save",
          payload: module
        }));
        throw new Error("Can't save module");
      }

      return makePdfCall(module.id);

    }).then((result) => {
      if (result.status == 200) {
        return [
          dispatch(makePdfActions.success(result.body)),
          dispatch(getPdf(module.id))
        ];
      } else {
        log.error(result);
        throw new Error("Bad response");
      }
    }).catch(err => {
      log.error(err);
      dispatch(makePdfActions.failure(err.message || err));
    });
  };
};

const getPdfActions = createAsyncActionGroup("MODULE_GETPDF", {});
export const getPdf = function(id) {
  return dispatch => {
    dispatch(getPdfActions.start());
    let _timer;
    let tries = 0;
    const pingForPdf = () => {
      if (tries < 120) {
        tries++;
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
          window.clearInterval(_timer);
          dispatch(getPdfActions.failure("PDF failed."));
        });
      } else {
        window.clearInterval(_timer);
        dispatch(getPdfActions.failure("PDF timeout."));
      }
    };
    _timer = window.setInterval(pingForPdf, 500, dispatch, id);
  };
};
