import Db from '../server/db';

module.exports = (inp, callback) => {
  callback(null, inp + ' BAR (' + process.pid + ')')
}
