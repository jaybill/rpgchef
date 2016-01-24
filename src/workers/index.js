import S3Stream from 's3-upload-stream';
import AWS from 'aws-sdk';
import fs from 'fs';
import Dnd5eLaTeX from '../lib/dnd5elatex';
import _ from 'lodash';
import uuid from 'node-uuid';
import Slug from 'slug';

export const print = (m, callback) => {
  const S3 = new AWS.S3();
  const s3Stream = S3Stream(S3);

  const filename = "pdftemp/" + uuid.v1() + "/" + Slug(m.name) + ".pdf";
  const upload = s3Stream.upload({
    "Bucket": process.env.AWS_BUCKET,
    "Key": filename
  });

  const pdfStream = Dnd5eLaTeX.makePdf(m.content).pipe(upload);

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

