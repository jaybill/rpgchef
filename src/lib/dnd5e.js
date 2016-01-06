import _ from 'lodash';
import log from 'loglevel';

export default class DnD5e {

  constructor(data) {
    this.data = data;
    this.randomWeapons = this.randomWeapons.bind(this);
    this.getBaseProperties = this.getBaseProperties.bind(this);
    this.mergedWeapons = this.mergedWeapons.bind(this);

  }


  getBaseProperties(weapon) {
    const updates = {
      properties: _.capitalize(weapon.name) + ". ",
      damage: weapon.damage
    };

    var damageTypes = [];

    if (weapon.damageSlashing) {
      damageTypes.push("slashing");
    }

    if (weapon.damageBludgeoning) {
      damageTypes.push("bludgeoning");
    }

    if (weapon.damagePiercing) {
      damageTypes.push("piercing");
    }

    updates.damage += " " + damageTypes.join(" and ");

    const props = [];

    if (weapon.martial) {
      props.push("martial");
    }

    if (weapon.ammunition) {
      props.push("ammunition (range " + weapon.rangeMinInFt + "/" + weapon.rangeMaxInFt + ")");
    }

    if (weapon.finesse) {
      props.push("finesse");
    }

    if (weapon.heavy) {
      props.push("heavy");
    }

    if (weapon.light) {
      props.push("light");
    }

    if (weapon.loading) {
      props.push("loading");
    }

    if (weapon.reach) {
      props.push("reach");
    }

    if (weapon.thrown) {
      props.push("thrown (range " + weapon.rangeMinInFt + "/" + weapon.rangeMaxInFt + ")");
    }

    if (weapon.twoHanded) {
      props.push("two-handed");
    }

    if (weapon.versatile) {
      props.push("Versatile (" + weapon.versatile + ")");
    }
    if (props.length) {
      updates.properties += _.capitalize(props.join(", ") + ". ");
    }

    return Object.assign({}, weapon, updates);

  }

  mergedWeapons() {
    const {weapons, magicWeapons} = this.data;
    if (!weapons) {
      throw new Error("To use mergedWeapons, you must supply the DnD5e class with an object that has a 'weapons' property tha contains an array of weapon objects.");
      return;
    }

    if (!magicWeapons) {
      throw new Error("To use mergedWeapons, you must supply the DnD5e class with an object that has a 'magicWeapons' property tha contains an array of magic weapon objects.");
      return;
    }
    const mw = [];

    _.forEach(magicWeapons, (magicWeapon) => {

      const baseWeapon = this.getBaseProperties(_.find(weapons, (w) => {
        return w.id == magicWeapon.weaponId
        }));

        const updates = {
          name: magicWeapon.name,
          properties: baseWeapon.properties + " " + magicWeapon.magicProps,
          priceInCp: magicWeapon.priceInCp
        };

        mw.push(Object.assign(baseWeapon, updates));

      });

      return mw;

    }

    randomWeapons(effectCount = 1, weaponCount = 1) {

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

      const magicWeapons = _.sample(weapons, weaponCount);

      for (let i = 0; i < magicWeapons.length; i++) {

        let pattern;

        magicWeapons[i] = this.getBaseProperties(magicWeapons[i]);

        const r = {};

        if (effectCount == 1) {
          pattern = _.sample(patterns.oneProp);
          const template = _.template(pattern);
          magicWeapons[i].name = template({
            adj: _.sample(effects[i][0].adjectives),
            noun: _.sample(effects[i][0].nouns),
            title: _.sample(effects[i][0].titles),
            item: magicWeapons[i].name
          });

          magicWeapons[i].magicProps = "Requires attunement. " + effects[i][0].effect;

          magicWeapons[i].priceInCp = parseInt(magicWeapons[i].priceInCp)
            + parseInt(effects[i][0].priceInCp);


        } else {
          pattern = _.sample(patterns.twoProp);
          const template = _.template(pattern);
          magicWeapons[i].name = template({
            adj: _.sample(effects[i][0].adjectives),
            noun: _.sample(effects[i][1].nouns),
            title: _.sample(effects[i][1].titles),
            item: magicWeapons[i].name
          });

          magicWeapons[i].magicProps = "Requires attunement. " + effects[i][0].effect;

          let se = effects[i][1].effect;

          se = se[0].toLowerCase() + se.slice(1);

          magicWeapons[i].magicProps += " Additionally, " + se;

          magicWeapons[i].priceInCp = parseInt(magicWeapons[i].priceInCp)
            + parseInt(effects[i][0].priceInCp)
            + parseInt(effects[i][1].priceInCp);
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
