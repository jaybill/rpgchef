import AWS from 'aws-sdk';

const aws = (gr, operation, params) => {
  return new Promise((resolve, reject) => {
    var a = new AWS[gr]();
    a[operation](params, function(error, data) {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};

export default aws;
