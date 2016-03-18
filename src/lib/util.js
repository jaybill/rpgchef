import uuid from 'node-uuid';

export const getPathFromKey = (userId, moduleId, key) => {
  return "uploads/user_" + userId + "/module_" + moduleId + "/" + key;
};

export const getModulePath = (userId, moduleId) => {
  return "uploads/user_" + userId + "/module_" + moduleId;
};

export const getFileKey = (userId, moduleId) => {
  const key = uuid.v1();

  return {
    path: "uploads/user_" + userId + "/module_" + moduleId + "/" + key,
    key: key
  };
};

export const stringToBoolean = (string) => {
  switch (string.toLowerCase().trim()) {
    case "true":
    case "yes":
    case "1":
      return true;
    case "false":
    case "no":
    case "0":
    case null:
      return false;
    default:
      return Boolean(string);
  }
};

export function convertToCoppers(str) {
  str = str || "";
  var fstr = str.toLowerCase();
  var amt = parseInt(fstr);

  switch (true) {
    case fstr.indexOf('gp') > -1:
      amt = amt * 100;
      break;
    case fstr.indexOf('sp') > -1:
      amt = amt * 10;
      break;
    case fstr.indexOf('cp') > -1:
      amt = amt;
      break;
    case fstr.indexOf('pp') > -1:
      amt = amt * 1000;
      break;
    default:
      amt = 0;
  }
  return amt;
}
