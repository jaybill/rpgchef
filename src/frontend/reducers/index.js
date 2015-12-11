import { combineReducers } from 'redux';
import register from './register';
import session from './session';
import confirm from './confirm';
import forgotPassword from './forgotpassword';
import resetPassword from './resetpassword';

const app = combineReducers({
  register,
  session,
  confirm,
  forgotPassword
});

export default {
  app
};
