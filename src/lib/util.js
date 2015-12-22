

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
