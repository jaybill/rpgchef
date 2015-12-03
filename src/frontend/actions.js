import { createAction } from 'redux-actions';
import { doLogin } from './api';
import log from 'loglevel';


import ActionConstants from './actionconstants';

export const login = createAction(ActionConstants.LOGIN, doLogin);
