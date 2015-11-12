import bcrypt from 'bcrypt-nodejs';

class Bcrypt {
  compare(test, hash) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(test, hash, function(err, res) {
        resolve(res);
      });
    });
  }

  hash(text) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(text, null, null, function(err, hash) {
        resolve(hash);
      });
    });
  }

}

export default new Bcrypt();
