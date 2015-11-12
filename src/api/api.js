'use strict';

import Hapi from 'hapi';
import HapiAuthCookie from 'hapi-auth-cookie';
import Routes from './routes';
import log from 'loglevel';
import Db from './db';

var logLevel = log.levels.DEBUG;
if (process.env.LOG_LEVEL) {
  logLevel = parseInt(process.env.LOG_LEVEL);
}

log.setLevel(logLevel);

var server = new Hapi.Server();
server.connection({
  port: process.env.API_PORT
});

server.register([HapiAuthCookie], function(err) {

  server.auth.strategy('session', 'cookie', {
    password: process.env.COOKIE_SECRET, // cookie secret
    cookie: 'session', // Cookie name
    isSecure: false, // required for non-https applications
    ttl: 24 * 60 * 60 * 1000 // Set session to 1 day
  });

  server.route(Routes);

  server.start(function() {
    console.log('Server running at:', server.info.uri);
    if (process.send) {
      process.send('online');
    } else {
      console.log('The API server is running at http://localhost:' + server.get('port'));
    }

  });
});
