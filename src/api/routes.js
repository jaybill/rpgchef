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
    method: 'GET',
    path: '/me',
    config: Auth.handlers.me
  }

];

export default routes;
