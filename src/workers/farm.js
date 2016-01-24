import WorkerFarm from 'node-worker-farm';
import log from 'loglevel';
import path from 'path';
//import Db from '../server/db';

class Farm {

  constructor() {
    this.workers = WorkerFarm(path.join(__dirname, 'workers'), ['print']);
    this.print = this.print.bind(this);
  }

  print(m) {
    this.workers.print(m, (err, url) => {
      if (err) {
        log.error(err);
      }
      log.debug(url);
      m.update({
        pdfUrl: url
      });
    });
  }

}

const farm = new Farm();
export default farm;
