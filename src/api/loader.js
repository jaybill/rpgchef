import Minimist from 'minimist';
import log from 'loglevel';
import _ from 'lodash';
import { synonyms, parsePreEffects, exportEffects } from './utilLoader';


var argv = Minimist(process.argv.slice(2));

const mode = argv._[0];

const availableModes = ["preeffects", "synonyms", "export"];

switch (mode) {

  case "preeffects":
    parsePreEffects();
    break;

  case "synonyms":
    if (!argv.word) {
      console.error("\nYou must supply a word, e.g. --word fire\n");
      process.exit();
    } else {
      synonyms(argv.word, argv.pos);
    }
    break;

  case "export":
    exportEffects();
    break;

  default:
    console.error("\nNo such mode. Available modes are:\n" + availableModes.join(", ") + "\n");
    usage();
    process.exit();

    break;
}


function usage() {

  console.log("\nExample usage: \n node loader.js [mode]\n ");

}
