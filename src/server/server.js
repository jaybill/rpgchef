'use strict';

import Hapi from 'hapi';
import HapiAuthCookie from 'hapi-auth-cookie';
import HapiCorsHeaders from 'hapi-cors-headers';
import Routes from './routes';
import log from 'loglevel';
import Db from './db';
import inert from 'inert';


var logLevel = log.levels.DEBUG;
if (process.env.LOG_LEVEL) {
  logLevel = parseInt(process.env.LOG_LEVEL);
}

log.setLevel(logLevel);

var server = new Hapi.Server();
server.connection({
  port: process.env.SERVER_PORT,
});

server.register([HapiAuthCookie, inert], function(err) {

  server.auth.strategy('session', 'cookie', {
    password: process.env.COOKIE_SECRET, // cookie secret
    cookie: 'session', // Cookie name
    isSecure: false, // required for non-https applications
    ttl: 24 * 60 * 60 * 1000 // Set session to 1 day
  });

  server.route(Routes);

  server.ext('onPreResponse', HapiCorsHeaders);

  server.start(function() {

    if (process.send) {
      process.send('online');
    } else {
      console.log('Server running at:', server.info.uri);
    }

  });
});
