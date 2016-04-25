import log from 'loglevel';
import Boom from 'boom';
import Joi from 'joi';
import _ from 'lodash';
import Db, { conn } from '../db';
import S3Stream from 's3-upload-stream';
import AWS from 'aws-sdk';
import aws from '../../lib/aws';
import { getPathFromKey, getModulePath, getFileKey } from '../../lib/util';
import gm from 'gm';
import Stream from 'stream';
import mimeTypes from 'mime-types';
const File = {};

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

File.handlers = {

  display: {
    auth: 'session',
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      }
    },
    validate: {
      params: {
        fileparts: Joi.string().required().max(500)
      }
    },
    handler: function(request, reply) {
      const fileparts = request.params.fileparts.split('/');
      const moduleId = fileparts[0];
      const key = fileparts[1];
      const userId = request.auth.credentials.id;
      Db.Modules.findById(moduleId).then((mm) => {
        if (!mm) {
          throw Boom.create(404, "No module with id [" + moduleId + "]");
        }
        if (mm.userId != userId) {
          throw Boom.create(403, "Not your module");
        }
      }).then(() => {
        const filename = getPathFromKey(userId, moduleId, key);
        const S3 = new AWS.S3();
        const url = S3.getSignedUrl('getObject', {
          Bucket: process.env.AWS_BUCKET,
          Key: filename
        });
        reply('x').redirect(url);
      }).catch((err) => {
        log.error(err);
        reply(err);
      });

    }
  },
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
        if (mm.userId != userId) {
          throw Boom.create(403, "Not your module");
        }
      }).then(() => {
        let prefix;
        if (request.payload.filename) {
          prefix = getPathFromKey(userId, request.payload.moduleId, request.payload.filename);
        } else {
          prefix = getModulePath(userId, request.payload.moduleId);
        }

        return aws("S3", "listObjects", {
          Bucket: process.env.AWS_BUCKET,
          Prefix: prefix
        }).then((toDelete) => {
          if (toDelete.Contents && toDelete.Contents.length) {
            const dd = [];
            _.forEach(toDelete.Contents, (d) => {
              dd.push({
                Key: d.Key
              });
            });
            return aws("S3", "deleteObjects", {
              Bucket: process.env.AWS_BUCKET,
              Delete: {
                Objects: dd
              }
            });
          } else {
            return;
          }
        });
      }).then((data) => {
        reply("OK");
      }).catch((err) => {
        log.error(err);
        reply(Boom.create(500, err));
      });
    }
  },
  upload: {
    payload: {
      output: 'stream',
      parse: true,
      allow: ['multipart/form-data'],
      maxBytes: 5242880
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
      const S3 = new AWS.S3();

      const originalStream = Stream.PassThrough();
      const thumbStream = Stream.PassThrough();

      file.pipe(originalStream);
      file.pipe(thumbStream);

      Db.Modules.findById(request.payload.moduleId).then((mm) => {
        if (!mm) {
          throw Boom.create(404, "No module with id [" + request.payload.moduleId + "]");
        }
      }).then(() => {
        if (!file.hapi.filename) {
          return reply(Boom.badData('No file uploaded.'));
        }

        const allowable = ['image/jpeg', 'image/png'];


        if (_.indexOf(allowable, file.hapi.headers['content-type']) == -1) {
          return reply(Boom.badData('File must be a JPG or a PNG and have the correct extension.'));
        }

        const ext = mimeTypes.extension(file.hapi.headers['content-type']);

        const s3Stream = S3Stream(S3);
        var fileKey = getFileKey(userId, request.payload.moduleId);
        var upload = s3Stream.upload({
          'Bucket': process.env.AWS_BUCKET,
          'Key': fileKey.path + "." + ext,
          'ContentType': file.hapi.headers['content-type']
        });

        upload.on('error', function(err) {
          log.error("Error uploading");
          return reply(Boom.wrap(err, 500, 'put'));
        });
        upload.on('uploaded', function(data) {
          // make low-res version
          const s3StreamThumb = S3Stream(S3);

          var thumbKey = fileKey.path + "." + ext + "_thumb";
          var uploadThumb = s3StreamThumb.upload({
            'Bucket': process.env.AWS_BUCKET,
            'Key': thumbKey,
            'ContentType': file.hapi.headers['content-type']
          });

          uploadThumb.on('error', function(err) {
            log.error("Error uploading thumbnail");
            return reply(Boom.wrap(err, 500, 'put'));
          });
          uploadThumb.on('uploaded', function(data) {
            return reply({
              filename: fileKey.key + "." + ext
            });
          });
          gm(thumbStream).resize('600', '450').stream().pipe(uploadThumb);
        });
        if (request.payload.replaces) {
          const kkkk = getPathFromKey(
            userId,
            request.payload.moduleId,
            request.payload.replaces);

          aws("S3", "listObjects", {
            Bucket: process.env.AWS_BUCKET,
            Prefix: kkkk
          }).then((toDelete) => {

            const dd = [];
            _.forEach(toDelete.Contents, (d) => {
              dd.push({
                Key: d.Key
              });
            });
            if (dd.length) {
              return aws("S3", "deleteObjects", {
                Bucket: process.env.AWS_BUCKET,
                Delete: {
                  Objects: dd
                }
              });
            }
            return;

          }).then(() => {
            originalStream.pipe(upload);
          }).catch((err) => {
            log.error(err);
            reply(Boom.wrap(err, 500));
          });

        } else {
          originalStream.pipe(upload);
        }

      }).catch((err) => {
        log.error(err);
        reply(err);
      });

    }
  }

};

export default File;
