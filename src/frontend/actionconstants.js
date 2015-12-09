import keyMirror from 'keymirror';
import _ from 'lodash';

function asyncKeys(prefix) {

  var out = {};

  return {
    [prefix + "_START"]: null,
    [prefix + "_SUCCESS"]: null,
    [prefix + "_FAILURE"]: null
  };


}

function makeKeys() {
  let km = {};

  km = Object.assign(km, asyncKeys("LOGIN"));
  km = Object.assign(km, asyncKeys("LOGOUT"));
  km = Object.assign(km, asyncKeys("ME"));
  km = Object.assign(km, asyncKeys("REGISTER"));

  return km;

}

var km = keyMirror(makeKeys());

export default km;
