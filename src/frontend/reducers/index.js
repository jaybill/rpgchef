import { combineReducers } from 'redux';
import { register } from './register';
import { session } from './session';
import { confirm } from './confirm';
import { forgotPassword } from './forgotpassword';
import { resetPassword } from './resetpassword';
import { account } from './account';
import { weapons } from './weapons';

const app = combineReducers({
  register,
  session,
  confirm,
  forgotPassword,
  resetPassword,
  account,
  weapons
});

export default {
  app
};
