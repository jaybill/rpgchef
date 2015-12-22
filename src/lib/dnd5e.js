import _ from 'lodash';

export default class DnD5e {

  constructor(data) {
    this.data = data;
    this.randomWeapons = this.randomWeapons.bind(this);
  }

  randomWeapons(count = 1) {
    const {weapons, effects} = this.data;
    if (!weapons) {
      throw new Error("To use randomWeapons, you must supply the DnD5e class with an object that has a 'weapons' property tha contains an array of weapon objects.");
      return;
    }

    if (!effects) {
      throw new Error("To use randomWeapons, you must supply the DnD5e class with an object that has an 'effects' property tha contains an array of effects objects.");
      return;
    }


    return _.sample(this.data.weapons, count);

  }


  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  getUniqueRandomInts(min, max, count) {
    if (count > max) {
      throw ("Cannot generate more unique ints than the max int.");
    }
    const arr = [];
    while (arr.length < count) {
      var randomnumber = this.getRandomInt(min, max);
      var found = false;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == randomnumber) {
          found = true;
          break
        }
      }
      if (!found) {
        arr[arr.length] = randomnumber;
      }
    }
    return arr;

  }

  fixCurrency(m) {
    var copper = m % 10;
    m = (m - copper) / 10;
    var silver = m % 10;
    var gold = (m - silver) / 10;
    return {
      cp: copper,
      sp: silver,
      gp: gold
    };
  }

  getCurrencyString(cp) {

    var o = this.fixCurrency(cp);

    var out = [];
    if (o.gp) {
      out.push(o.gp + "gp");
    }

    if (o.sp) {
      out.push(o.sp + "sp");
    }

    if (o.cp) {
      out.push(o.cp + "cp");
    }

    return out.join(" ");

  }



}
