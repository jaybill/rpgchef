import log from 'loglevel';
import Boom from 'boom';
import Joi from 'joi';
import _ from 'lodash';
import Db, { conn } from '../db';


const Module = {};

Module.handlers = {

  getModule: {
    auth: 'session',
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      }
    },
    validate: {
      params: {
        id: Joi.number().integer().required().min(0).label("Id")
      }
    },

    handler: (request, reply) => {
      const userId = request.auth.credentials.id;
      Db.Modules.findById(request.params.id).then((mm) => {
        if (mm) {
          if (mm.get("userId") != userId) {
            reply(Boom.create(403,
              "Module with id [" + request.params.id + "] does not belong to you"));
          } else {
            reply(_.omit(mm.dataValues, 'userId'));
          }
        } else {
          reply(Boom.create(404, "No module with id [" + request.params.id + "]"));
        }

      }).catch(err => {
        log.error(err);
        reply(Boom.create(500));
      });
    }
  },

  deleteModule: {
    auth: 'session',
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      }
    },
    validate: {
      params: {
        id: Joi.number().integer().required().min(0).label("Id")
      }
    },

    handler: (request, reply) => {
      const userId = request.auth.credentials.id;
      return Db.Modules.findById(request.params.id).then((mm) => {
        if (mm) {
          if (mm.get("userId") != userId) {
            reply(Boom.create(403,
              "Module with id [" + request.params.id + "] does not belong to you"));
          } else {
            return mm.destroy().then(() => {
              reply("OK");
            }).catch(err => {
              throw err;
            });
          }
        } else {
          reply(Boom.create(404, "No module with id [" + request.params.id + "]"));
        }

      }).catch(err => {
        log.error(err);
        reply(Boom.create(500));
      });
    }
  },


  upsertModule: {
    auth: 'session',
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      }
    },
    validate: {
      payload: {
        id: Joi.number().integer().min(0).label("Id"),
        name: Joi.string().min(1).max(500).label('Name'),
        content: Joi.object().required().label('Content')
      }
    },
    handler: (request, reply) => {
      const userId = request.auth.credentials.id;
      const {id, name, content} = request.payload;

      const nm = Object.assign({}, request.payload, {
        userId: userId
      });

      Db.Modules.findById(nm.id).then((mm) => {
        if (mm && mm.get("userId") == userId) {
          return mm.update(nm);
        } else {
          return Db.Modules.create(_.omit(nm, 'id'));
        }

      }).then((mm) => {
        reply(_.omit(mm.dataValues, 'userId'));
      }).catch(err => {
        reply(Boom.create(422, err.message));
      });
    }
  },

  getModules: {
    auth: 'session',
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      }
    },
    handler: (request, reply) => {
      const userId = request.auth.credentials.id;
      Db.Modules.findAll({
        attributes: ['id', 'name'],
        where: [{
          userId: userId
        }]
      }).then((mm) => {
        reply(mm);
      }).catch(err => {
        log.error(err);
        reply([]);
      });

    }
  }

};


export default Module;
