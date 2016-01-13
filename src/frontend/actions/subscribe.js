import { createAsyncActionGroup } from './util';
import { createAction } from 'redux-actions';
import log from 'loglevel';
import { subscribePost as subscribeCall, subscribeGet as subscribeGetCall, getStripeToken } from '../api';


const subscribeGetActions = createAsyncActionGroup("SUBSCRIBE_GET", {});
export const subscribeGet = function() {
  return dispatch => {
    dispatch(subscribeGetActions.start());
    subscribeGetCall().then((result) => {
      if (result.status == 200) {
        dispatch(subscribeGetActions.success(result.body));
      } else {
        throw new Error(result);
      }
      return null;
    }).catch(err => {
      log.error(err);
      dispatch(subscribeGetActions.failure("Get subscription failed."))
    });
  }
};


const subscribePostActions = createAsyncActionGroup("SUBSCRIBE_POST", {});
export const subscribePost = function(sub) {
  return dispatch => {
    dispatch(subscribePostActions.start());

    getStripeToken({
      number: sub.number,
      cvc: sub.cvc,
      exp_month: sub.exp_month,
      exp_year: sub.exp_year
    }).then((response) => {
      return subscribeCall({
        plan: sub.plan,
        token: response
      });
    }).then((result) => {
      if (result.status == 200) {
        dispatch(subscribePostActions.success(result.body));
      } else {
        log.error(result);
        throw new Error("Bad response");
      }
      return;
    }).catch(err => {
      log.debug(err);
      dispatch(subscribePostActions.failure(err.message || "Card Verification Error"))
    });
  }
};
