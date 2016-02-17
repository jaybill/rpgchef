import S3Stream from 's3-upload-stream';
import AWS from 'aws-sdk';
import fs from 'fs';
import Dnd5eLaTeX from '../lib/dnd5elatex';
import _ from 'lodash';
import uuid from 'node-uuid';
import Slug from 'slug';
import SpawnStream from 'spawn-stream';
import log from 'loglevel';
import path from 'path';
export const print = (m, callback) => {


  let upload;
  let filename;

  const gsStream = SpawnStream('gs', [
    '-sDEVICE=pdfwrite',
    '-dCompatibilityLevel=1.4',
    '-dConvertCMYKImagesToRGB=true',
    '-dCompressFonts=true',
    '-dDetectDuplicateImages=true',
    '-dDownsampleColorImages=true',
    '-dDownsampleGrayImages=true',
    '-dDownsampleMonoImages=true',
    '-dColorImageResolution=150',
    '-dGrayImageResolution=150',
    '-dMonoImageResolution=150',
    '-dNOPAUSE',
    '-dQUIET',
    '-dBATCH',
    '-sOutputFile=-',
    '-_']);

  const exiftoolStream = SpawnStream('exiftool',
    [
      '-',
      '-o -',
      '-Title=This is the Title',
      '-Author=Jimmy Jimmy',
      '-Creator=RpgChef.com',
      '-Producer=RpgChef.com'
    ]);

  const NERF_AWS = (process.env.NERF_AWS == "true");

  if (!NERF_AWS) {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });

    const S3 = new AWS.S3();
    const s3Stream = S3Stream(S3);
    filename = "pdftemp/" + uuid.v1() + "/" + Slug(m.name) + ".pdf";
    upload = s3Stream.upload({
      "Bucket": process.env.AWS_BUCKET,
      "Key": filename
    });
    upload.on("error", (err) => {
      const e = new Error({
        ee: err,
        NERF_AWS: NERF_AWS
      });
      callback(err, null);
      return;
    });
    upload.on("uploaded", (details) => {
      const url = S3.getSignedUrl('getObject', {
        Expires: 86400,
        Bucket: details.Bucket,
        Key: details.Key
      });
      callback(null, url);
    });

  } else {
    filename = uuid.v1() + "_" + Slug(m.name) + ".pdf";
    let filepath = path.join(process.env.LOCAL_DOWNLOAD_PATH, filename);

    upload = fs.createWriteStream(filepath);

    upload.on("close", () => {
      const url = process.env.LOCAL_DOWNLOAD_URL + "/" + filename;
      callback(null, url);
    });

    upload.on("error", (err) => {
      callback(err, null);
      return;
    });

  }

  exiftoolStream.on("error", (err) => {
    callback(err, null);
    return;
  });


  gsStream.on("error", (err) => {
    callback(err, null);
    return;
  });

  const pdfStream = Dnd5eLaTeX
    .makePdf(m.content)
    .pipe(gsStream)
    .pipe(exiftoolStream)
    .pipe(upload);

  pdfStream.on("error", (err) => {
    callback(err, null);
    return;
  });


};

