import WorkerFarm from 'node-worker-farm';
import log from 'loglevel';
import path from 'path';

class Farm {

  constructor() {
    this.workers = WorkerFarm(path.join(__dirname, 'workers'), ['print']);
    this.print = this.print.bind(this);
  }

  print(j) {
    this.workers.print(j, (err, outp) => {
      if (err) {
        log.error(err);
      }
      log.debug(outp);
    });
  }

}

const farm = new Farm();
export default farm;
