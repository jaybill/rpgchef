import Auth from './handlers/auth';
import Generate from './handlers/generate';
import My from './handlers/my';

var routes = [
  {
    method: 'POST',
    path: '/login',
    config: Auth.handlers.login,
  },
  {
    method: 'GET',
    path: '/logout',
    config: Auth.handlers.logout
  },
  {
    method: 'POST',
    path: '/register',
    config: Auth.handlers.register
  },
  {
    method: 'POST',
    path: '/account',
    config: Auth.handlers.accountUpdate
  },
  {
    method: 'POST',
    path: '/confirm',
    config: Auth.handlers.confirm
  },
  {
    method: 'POST',
    path: '/forgotpassword',
    config: Auth.handlers.forgotPassword
  },
  {
    method: 'POST',
    path: '/verifyreset',
    config: Auth.handlers.verifyReset
  },
  {
    method: 'POST',
    path: '/resetpassword',
    config: Auth.handlers.resetPassword
  },
  {
    method: 'GET',
    path: '/me',
    config: Auth.handlers.me
  },
  {
    method: 'GET',
    path: '/generate/weapons',
    config: Generate.handlers.weapons
  },
  {
    method: 'GET',
    path: '/generate/effects',
    config: Generate.handlers.effects
  },
  {
    method: 'GET',
    path: '/my/weapons',
    config: My.handlers.weapons
  },
  {
    method: 'POST',
    path: '/my/weapon',
    config: My.handlers.upsertUserWeapon
  }



];

export default routes;
