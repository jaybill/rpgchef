import Auth from './auth';

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
  }

];

export default routes;
