'use strict';

import bodyParser from 'body-parser';
import compression from 'compression';
import express from 'express';
import path from 'path';

var server = express();

server.set('port', (process.env.SERVER_PORT || 8080));
server.use(compression());
server.use(express.static(path.join(__dirname + "/public")));
server.use(bodyParser.urlencoded({
  extended: true
}));

server.get('/mailinglist', (req, res, next) => {
  res.sendFile(path.join(__dirname + "/public/mailinglist.html"));
});


server.all('*', (req, res, next) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

server.listen(server.get('port'), function() {
  if (process.send) {
    process.send('online');
  } else {
    console.log('The server is running at http://localhost:' + server.get('port'));
  }
});
