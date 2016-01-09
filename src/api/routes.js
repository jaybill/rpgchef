import Auth from './handlers/auth';
import Generate from './handlers/generate';
import My from './handlers/my';
import path from 'path';
import URIjs from 'urijs';
var routes = [
  {
    method: 'POST',
    path: '/api/login',
    config: Auth.handlers.login,
  },
  {
    method: 'GET',
    path: '/api/logout',
    config: Auth.handlers.logout
  },
  {
    method: 'POST',
    path: '/api/register',
    config: Auth.handlers.register
  },
  {
    method: 'POST',
    path: '/api/account',
    config: Auth.handlers.accountUpdate
  },
  {
    method: 'POST',
    path: '/api/confirm',
    config: Auth.handlers.confirm
  },
  {
    method: 'POST',
    path: '/api/forgotpassword',
    config: Auth.handlers.forgotPassword
  },
  {
    method: 'POST',
    path: '/api/verifyreset',
    config: Auth.handlers.verifyReset
  },
  {
    method: 'POST',
    path: '/api/resetpassword',
    config: Auth.handlers.resetPassword
  },
  {
    method: 'GET',
    path: '/api/me',
    config: Auth.handlers.me
  },
  {
    method: 'GET',
    path: '/api/generate/weapons',
    config: Generate.handlers.weapons
  },
  {
    method: 'GET',
    path: '/api/generate/effects',
    config: Generate.handlers.effects
  },
  {
    method: 'GET',
    path: '/api/my/weapons',
    config: My.handlers.weapons
  },
  {
    method: ['POST'],
    path: '/api/my/weapon',
    config: My.handlers.upsertUserWeapon
  },
  {
    method: 'GET',
    path: '/api/my/weapon/{id?}',
    config: My.handlers.getUserWeapon
  },
  {
    method: 'DELETE',
    path: '/api/my/weapon/{id?}',
    config: My.handlers.deleteUserWeapon
  },
  {
    method: 'GET',
    path: '/{file*}',
    handler: {
      file: function(request) {
        let filename = request.params.file || "/";
        const uri = new URIjs(filename);
        /* 
           This will probably bite me someday, but for now,
           I'm passing any url without an extension to the index page,
           the thought being that any statc content will be files with 
           an extension. Eventually I'll probably have ngnix only pass
           urls that start with /api through to the app and have the rest
           of the stuff served up directly.
        */
        if (!uri.suffix()) {
          filename = "index.html";
        }


        return path.join(__dirname, "public", filename);
      }
    }
  }
];

export default routes;
