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
  km = Object.assign(km, asyncKeys("CONFIRM"));
  km = Object.assign(km, asyncKeys("FORGOTPASSWORD"));
  km = Object.assign(km, asyncKeys("RESETPASSWORD"));
  km = Object.assign(km, asyncKeys("VERIFYRESET"));
  km = Object.assign(km, asyncKeys("WEAPONS"));

  let accountKeys = asyncKeys("ACCOUNT");
  accountKeys["ACCOUNT_UPDATE"] = null;
  km = Object.assign(km, accountKeys);

  let extraKeys = {};
  extraKeys["SESSION_USERNAME_UPDATE"] = null;

  km = Object.assign(km, extraKeys);

  return km;

}

var km = keyMirror(makeKeys());

export default km;
