import { createAction } from 'redux-actions';
import log from 'loglevel';
import _ from 'lodash';

import ActionConstants from '../actionconstants';

export function createAsyncActionGroup(namePrefix, config) {
  let actionGroup = {};

  const configProps = ['start', 'success', 'failure'];

  for (const cp in configProps) {
    let cpn = configProps[cp];
    if (typeof config[cpn] === 'function') {
      actionGroup[cpn] = config[cpn];
    } else {
      let name = namePrefix + "_" + cpn;
      name = name.toUpperCase();
      actionGroup[cpn] = createAction(ActionConstants[name]);
    }
  }

  return actionGroup;
}

export function extractMessage(errMessage) {
  const re = /\[(.*?)\]/;
  let m;
  let message;
  if ((m = re.exec(errMessage)) !== null) {
    if (m.index === re.lastIndex) {
      re.lastIndex++;
    }
    message = m[0].substring(1, m[0].length - 1);
  }

  return message;
}
