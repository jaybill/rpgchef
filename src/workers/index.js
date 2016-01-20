import Db from '../server/db';
import S3Stream from 's3-upload-stream';
import AWS from 'aws-sdk';
import fs from 'fs';
import Dnd5eLaTeX from '../lib/dnd5elatex';


export const print = (j, callback) => {
  const s3Stream = S3Stream(new AWS.S3());
  const upload = s3Stream.upload({
    "Bucket": process.env.AWS_BUCKET,
    "Key": "test.pdf"
  });

  const pdfStream = Dnd5eLaTeX.makePdf(j).pipe(upload);

  pdfStream.on("error", (err) => {
    callback(err, null);
    return;
  });

  let i = 0;
  upload.on("finish", () => {

    if (i < 1) {
      i++;
    } else {
      callback(null, "PDF printed");
    }
  });
};

