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
  let extraKeys = {};
  km = Object.assign(km, asyncKeys("LOGIN"));
  km = Object.assign(km, asyncKeys("LOGOUT"));
  km = Object.assign(km, asyncKeys("ME"));
  km = Object.assign(km, asyncKeys("REGISTER"));
  km = Object.assign(km, asyncKeys("CONFIRM"));
  km = Object.assign(km, asyncKeys("FORGOTPASSWORD"));
  km = Object.assign(km, asyncKeys("RESETPASSWORD"));
  km = Object.assign(km, asyncKeys("VERIFYRESET"));
  km = Object.assign(km, asyncKeys("WEAPONS"));
  km = Object.assign(km, asyncKeys("DEFAULTWEAPONS"));
  km = Object.assign(km, asyncKeys("USERWEAPON_POST"));
  km = Object.assign(km, asyncKeys("USERWEAPON_DELETE"));
  km = Object.assign(km, asyncKeys("USERWEAPONLIST"));
  km = Object.assign(km, asyncKeys("ACCOUNT"));
  km = Object.assign(km, asyncKeys("SUBSCRIBE_POST"));
  km = Object.assign(km, asyncKeys("SUBSCRIBE_GET"));
  km = Object.assign(km, asyncKeys("SUBSCRIBE_DEL"));
  km = Object.assign(km, asyncKeys("MODULE_POST"));
  km = Object.assign(km, asyncKeys("MODULE_GET"));
  km = Object.assign(km, asyncKeys("MODULE_DEL"));
  km = Object.assign(km, asyncKeys("MODULE_LIST"));
  km = Object.assign(km, asyncKeys("MODULE_MAKEPDF"));
  km = Object.assign(km, asyncKeys("MODULE_GETPDF"));
  km = Object.assign(km, asyncKeys("UPLOAD_IMAGE"));
  km = Object.assign(km, asyncKeys("DELETE_IMAGE"));
  km = Object.assign(km, asyncKeys("MONSTERS"));
  km = Object.assign(km, asyncKeys("MONSTER"));

  extraKeys["MONSTER_RESET"] = null;
  extraKeys["MODULE_RESET"] = null;
  extraKeys["MODULE_POST_RESET"] = null;
  extraKeys["MODULE_PDF_RESET"] = null;
  extraKeys["UPLOAD_IMAGE_RESET"] = null;
  extraKeys["UPLOAD_PROGRESS"] = null;
  extraKeys["DELETE_IMAGE_RESET"] = null;
  extraKeys["ACCOUNT_UPDATE"] = null;
  extraKeys["SESSION_USERNAME_UPDATE"] = null;
  extraKeys["RANDOM_WEAPONS_DONE"] = null;
  extraKeys["USERWEAPON_REMOVE"] = null;

  km = Object.assign(km, extraKeys);
  return km;
}

var km = keyMirror(makeKeys());

export default km;
