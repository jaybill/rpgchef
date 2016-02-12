import S3Stream from 's3-upload-stream';
import AWS from 'aws-sdk';
import fs from 'fs';
import Dnd5eLaTeX from '../lib/dnd5elatex';
import _ from 'lodash';
import uuid from 'node-uuid';
import Slug from 'slug';
import SpawnStream from 'spawn-stream';

export const print = (m, callback) => {

  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });
  const S3 = new AWS.S3();
  const s3Stream = S3Stream(S3);

  const filename = "pdftemp/" + uuid.v1() + "/" + Slug(m.name) + ".pdf";
  const upload = s3Stream.upload({
    "Bucket": process.env.AWS_BUCKET,
    "Key": filename
  });



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

  const pdfStream = Dnd5eLaTeX
    .makePdf(m.content)
    .pipe(gsStream)
    .pipe(exiftoolStream)
    .pipe(upload);

  exiftoolStream.on("error", (err) => {
    callback(err, null);
    return;
  });


  gsStream.on("error", (err) => {
    callback(err, null);
    return;
  });

  pdfStream.on("error", (err) => {
    callback(err, null);
    return;
  });

  upload.on("error", (err) => {
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
};

