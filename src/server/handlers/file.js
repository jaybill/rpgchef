import log from 'loglevel';
import Boom from 'boom';
import Joi from 'joi';
import _ from 'lodash';
import Db, { conn } from '../db';
import S3Stream from 's3-upload-stream';
import AWS from 'aws-sdk';
import uuid from 'node-uuid';
import bluebird from 'bluebird';

const File = {};

function getPathFromKey(userId, moduleId, key) {
  return "uploads/user_" + userId + "/module_" + moduleId + "/" + key;
}

function getModulePath(userId, moduleId) {
  return "uploads/user_" + userId + "/module_" + moduleId;
}

function getFileKey(userId, moduleId) {
  const key = uuid.v1();

  return {
    path: "uploads/user_" + userId + "/module_" + moduleId + "/" + key,
    key: key
  };
}

File.handlers = {

  remove: {
    auth: 'session',
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      }
    },
    validate: {
      payload: {
        moduleId: Joi.number().required(),
        filename: [Joi.string().max(500).optional(), Joi.allow(null)]
      }
    },
    handler: function(request, reply) {
      const userId = request.auth.credentials.id;
      Db.Modules.findById(request.payload.moduleId).then((mm) => {
        if (!mm) {
          throw Boom.create(404, "No module with id [" + request.payload.moduleId + "]");
        }
      }).then(() => {
        AWS.config.update({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        });
        const S3 = bluebird.promisifyAll(new AWS.S3());
        let kk;
        if (request.payload.filename) {
          kk = getPathFromKey(userId, request.payload.moduleId, request.payload.filename);
          S3.deleteObject({
            'Bucket': process.env.AWS_BUCKET,
            'Key': kk
          }, (err, data) => {
            if (err) {
              log.error(err, err.stack);
              throw Boom.create(500, "Could not delete " + kk);
            } else {
              reply("OK");
            }
          });
        } else {
          kk = getModulePath(userId, request.payload.moduleId);
          const listObjects = bluebird.promisify(S3.listObjects);

          listObjects({
            'Bucket': process.env.AWS_BUCKET,
            'Prefix': kk
          }).then((err, data) => {

            log.debug("err", err);
            log.debug("data", data);

            reply("OK");
          });


        }




      }).catch((err) => {
        log.error(err);
        reply(err);
      });

    }
  },

  upload: {
    payload: {
      output: 'stream',
      parse: true,
      allow: ['multipart/form-data']
    },
    auth: 'session',
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      }
    },
    validate: {
      payload: {
        moduleId: Joi.number().required(),
        file: Joi.any().required(),
        replaces: [Joi.string().max(500).optional(), Joi.allow(null)]
      }
    },
    handler: function(request, reply) {
      const userId = request.auth.credentials.id;
      var self = this;
      var file = request.payload.file;

      Db.Modules.findById(request.payload.moduleId).then((mm) => {
        if (!mm) {
          throw Boom.create(404, "No module with id [" + request.payload.moduleId + "]");
        }
      }).then(() => {
        if (!file.hapi.filename) {
          return reply(Boom.badData('must be a file'));
        }

        AWS.config.update({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        });

        const S3 = new AWS.S3();
        const s3Stream = S3Stream(S3);
        var fileKey = getFileKey(userId, request.payload.moduleId);
        var upload = s3Stream.upload({
          'Bucket': process.env.AWS_BUCKET,
          'Key': fileKey.path,
          'ContentType': file.hapi.headers['content-type']
        });

        upload.on('error', function(err) {
          log.error("Error uploading");
          return reply(Boom.wrap(err, 500, 'put'));
        });
        upload.on('uploaded', function(data) {
          return reply({
            filename: fileKey.key
          });
        });

        if (request.payload.replaces) {
          S3.deleteObject({
            'Bucket': process.env.AWS_BUCKET,
            'Key': getPathFromKey(userId, request.payload.moduleId, request.payload.replaces)
          }, (err, data) => {
            if (err) {
              log.error(err, err.stack);
            }
            file.pipe(upload);
          });
        } else {
          file.pipe(upload);
        }

      }).catch((err) => {
        log.error(err);
        reply(err);
      });

    }
  }

};

export default File;
