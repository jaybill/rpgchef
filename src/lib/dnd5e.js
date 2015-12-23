import _ from 'lodash';

export default class DnD5e {

  constructor(data) {
    this.data = data;
    this.randomWeapons = this.randomWeapons.bind(this);



  }

  randomWeapons(count = 1, props = 1) {

    if (count > 2) {
      count = 2;
    }

    if (props > 2) {
      props = 2;
    }

    if (count < 1) {
      count = 1;
    }

    if (props < 1) {
      props = 1;
    }

    const {weapons, effects} = this.data;
    if (!weapons) {
      throw new Error("To use randomWeapons, you must supply the DnD5e class with an object that has a 'weapons' property tha contains an array of weapon objects.");
      return;
    }

    if (!effects) {
      throw new Error("To use randomWeapons, you must supply the DnD5e class with an object that has an 'effects' property tha contains an array of effects objects.");
      return;
    }

    const patterns = {
      oneProp: [
        "<%= adj %> <%= item %>",
        "<%= item %> of <%= noun %>",
        "<%= title %>'s <%= item %>"
      ],
      twoProp: [
        "<%= adj %> <%= item %> of <%= noun %>",
        "<%= title %>'s <%= adj %> <%= item %>"
      ]
    };

    const magicWeapons = _.sample(weapons, count);

    for (let i = 0; i < magicWeapons.length; i++) {

      let pattern;


      magicWeapons[i].properties = _.trim(magicWeapons[i].properties);

      if (magicWeapons[i].properties.length && magicWeapons[i].properties[magicWeapons[i].properties.length - 1] != ".") {
        magicWeapons[i].properties += ". ";
      }
      if (magicWeapons[i].group != "Basic") {
        magicWeapons[i].properties = magicWeapons[i].group + ". Requires attunement. " + magicWeapons[i].properties;
      } else {
        magicWeapons[i].properties = "Requires attunement. " + magicWeapons[i].properties;
      }

      const r = {};

      if (props == 1) {
        pattern = _.sample(patterns.oneProp);
        const template = _.template(pattern);
        magicWeapons[i].name = template({
          adj: _.sample(effects[0].adjectives),
          noun: _.sample(effects[0].nouns),
          title: _.sample(effects[0].titles),
          item: magicWeapons[i].name
        });

        magicWeapons[i].properties += effects[0].effect;

      } else {
        pattern = _.sample(patterns.twoProp);
        const template = _.template(pattern);
        magicWeapons[i].name = template({
          adj: _.sample(effects[0].adjectives),
          noun: _.sample(effects[1].nouns),
          title: _.sample(effects[1].titles),
          item: magicWeapons[i].name
        });

        magicWeapons[i].properties += effects[0].effect;
        magicWeapons[i].properties += " Additionally, " + effects[1].effect;


      }




    }
    return magicWeapons;

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
