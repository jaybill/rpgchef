import log from 'loglevel';
import Boom from 'boom';
import Joi from 'joi';
import _ from 'lodash';
import Db, { conn } from '../db';
import Farm from '../../workers/farm';

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
        return null;
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
        subtitle: [Joi.string().max(500).optional(), Joi.allow(null)],
        author: [Joi.string().optional().max(500), Joi.allow(null)],
        content: Joi.array().required().label('Content'),
        version: Joi.number().optional().integer().min(0).allow(null).label("Version")
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
  },
  makePdf: {
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
      const id = request.params.id;
      const userId = request.auth.credentials.id;
      return Db.Modules.findById(parseInt(id)).then((m) => {
        if (!m) {
          throw Boom.create(404, "Module with id [" + id + "] does exist");
        }
        if (m.get("userId") != userId) {
          throw Boom.create(403, "Module with id [" + id + "] does not belong to you");
        }
        return m;
      }).then((m) => {
        return m.update({
          pdfUrl: null,
          pdfCreatedOn: null
        });
      }).then((m) => {
        Farm.print(m);
        reply("OK");
      }).catch((err) => {
        let e = err;
        log.error(err);
        if (!err.isBoom()) {
          e = Boom.create(500, err.message);
        }
        reply(e);
      });
    }
  },

  getPdf: {
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
      Db.Modules.findOne({
        where: {
          id: request.params.id,
          userId: userId
        },
        attributes: ['pdfUrl']
      }).then((mm) => {
        if (mm) {
          reply(mm);
        } else {
          reply(Boom.create(404, "No module with id [" + request.params.id + "]"));
        }

      }).catch(err => {
        log.error(err);
        reply(Boom.create(500));
      });
    }
  }

};


export default Module;
