import log from 'loglevel';
import Boom from 'boom';
import Joi from 'joi';
import _ from 'lodash';
import Db, { conn } from '../db';
import Farm from '../../workers/farm';

const Workers = {};

Workers.handlers = {

  print: {
    auth: 'session',
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      }
    },
    handler: (request, reply) => {
      Farm.print(request.payload);
      reply("OK");
    }
  }
};

export default Workers;
