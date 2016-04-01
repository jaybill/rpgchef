import S3Stream from 's3-upload-stream';
import AWS from 'aws-sdk';
import S3Client from 's3';
import fs from 'fs';
import Dnd5eLaTeX from '../lib/dnd5elatex';
import awsAsync from '../lib/aws';
import { getPathFromKey, getModulePath, getFileKey } from '../lib/util';
import Latex from 'latex';
import _ from 'lodash';
import uuid from 'node-uuid';
import Slug from 'slug';
import SpawnStream from 'spawn-stream';
import Log from 'log';
import path from 'path';
import tmp from 'tmp';


export const print = (m, callback) => {
  const log = new Log('debug', fs.createWriteStream('/tmp/worker.log'));

  let upload;
  let filename;
  const tmpdir = tmp.dirSync({
    unsafeCleanup: true,
    prefix: "rpgchefPdf_"
  });

  log.debug("Creating temp dir %s", tmpdir.name);

  log.debug("Creating GS stream");

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

  log.debug("Creating exiftool stream");
  const exiftoolStream = SpawnStream('exiftool',
    [
      '-',
      '-o -',
      '-Title=' + (m.name || "Untitled"),
      '-Author=' + (m.author || "Unknown"),
      '-Creator=RpgChef.com',
      '-Producer=RpgChef.com'
    ]);

  log.debug("Setting up aws - using bucket %s", process.env.AWS_BUCKET);
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });

  const S3 = new AWS.S3();
  log.debug("Creating s3 stream");
  const s3Stream = S3Stream(S3);
  log.debug("Creating s3 client");
  const s3client = S3Client.createClient({
    s3client: S3
  });

  filename = "pdftemp/" + uuid.v1() + "/" + Slug(m.name) + ".pdf";
  log.debug("creating %s", filename);
  log.debug("Creating upload stream");
  upload = s3Stream.upload({
    "Bucket": process.env.AWS_BUCKET,
    "Key": filename
  });
  upload.on("error", (err) => {
    log.error(err);
    callback(err, null);
    return;
  });
  upload.on("uploaded", (details) => {
    log.debug("Uploaded %s", details.Key);
    const url = S3.getSignedUrl('getObject', {
      Expires: 86400,
      Bucket: details.Bucket,
      Key: details.Key
    });
    log.debug("Removing temp dir");
    tmpdir.removeCallback();
    callback(null, url);
  });


  exiftoolStream.on("error", (err) => {
    log.error(err);
    callback(err, null);
    return;
  });

  gsStream.on("error", (err) => {
    log.error(err);
    callback(err, null);
    return;
  });

  const DownloadAsync = (s3Params, tmpdir) => {
    return new Promise((resolve, reject) => {
      const downloader = s3client.downloadDir({
        s3Params: s3Params,
        localDir: tmpdir
      });

      downloader.on("error", (err) => {
        log.error(err);
        reject(err);
      });

      downloader.on("end", () => {
        log.debug("Finished download");
        resolve(true);
      });
    });
  };

  const latexContent = Dnd5eLaTeX.getLatexForModule(m, tmpdir.name);
  //  callback(latexContent);

  const downloads = [];
  DownloadAsync({
    Bucket: process.env.AWS_BUCKET,
    Prefix: getModulePath(m.userId, m.id)
  }, tmpdir.name).then(() => {
    log.debug("Generating LaTeX and pouring into pipe");
    Latex(latexContent)
      .pipe(gsStream)
      .pipe(exiftoolStream)
      .pipe(upload);
  }).catch((err) => {
    log.error(err);
    callback(err, null);
    return;
  });
};
