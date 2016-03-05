import Auth from './handlers/auth';
import Generate from './handlers/generate';
import My from './handlers/my';
import Module from './handlers/module';
import Payment from './handlers/payment';
import File from './handlers/file';
import Monster from './handlers/monster';

import path from 'path';
import URIjs from 'urijs';

var routes = [
  {
    method: 'POST',
    path: '/api/login',
    config: Auth.handlers.login
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
    method: 'GET',
    path: '/api/monsters',
    config: Monster.handlers.monsters
  },
  {
    method: 'GET',
    path: '/api/monsters/named',
    config: Monster.handlers.monsterByName
  },
  {
    method: 'GET',
    path: '/api/monster/{id?}',
    config: Monster.handlers.monster
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
    method: ['POST'],
    path: '/api/payment/subscribe',
    config: Payment.handlers.subscribe
  },
  {
    method: ['GET'],
    path: '/api/payment/subscribe',
    config: Payment.handlers.details
  },
  {
    method: ['DELETE'],
    path: '/api/payment/subscribe',
    config: Payment.handlers.cancel
  },
  {
    method: ['POST'],
    path: '/api/module',
    config: Module.handlers.upsertModule
  },
  {
    method: ['DELETE'],
    path: '/api/module/{id?}',
    config: Module.handlers.deleteModule
  },
  {
    method: ['GET'],
    path: '/api/module/{id?}',
    config: Module.handlers.getModule
  },
  {
    method: ['GET'],
    path: '/api/modules',
    config: Module.handlers.getModules
  },
  {
    method: ['GET'],
    path: '/api/module/pdf/{id?}',
    config: Module.handlers.getPdf
  },
  {
    method: ['POST'],
    path: '/api/module/pdf/{id?}',
    config: Module.handlers.makePdf
  },
  {
    method: ['POST'],
    path: '/api/upload',
    config: File.handlers.upload
  },
  {
    method: ['DELETE'],
    path: '/api/upload',
    config: File.handlers.remove
  },
  {
    method: ['GET'],
    path: '/api/upload/display/{fileparts*2}',
    config: File.handlers.display
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
