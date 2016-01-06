import { combineReducers } from 'redux';
import { register } from './register';
import { session } from './session';
import { confirm } from './confirm';
import { forgotPassword } from './forgotpassword';
import { resetPassword } from './resetpassword';
import { account } from './account';
import { weapons } from './weapons';
import { userweapon } from './userweapon';
import { userweaponlist } from './userweaponlist';

const app = combineReducers({
  register,
  session,
  confirm,
  forgotPassword,
  resetPassword,
  account,
  weapons,
  userweapon,
  userweaponlist
});

export default {
  app
};
