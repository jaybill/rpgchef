import md5 from 'md5';
import Uri from 'urijs';
import _ from 'lodash';
import fs from 'fs';
import popsicle from 'popsicle';
import Db from './db';
import CsvParse from 'csv-parse';
import { convertToCoppers } from '../lib/util';
import DnD5e from '../lib/dnd5e';

export const escape = () => {
  const t = fs.readFileSync('./build/latex/example.tex', {
    encoding: 'utf-8'
  });
  const allLines = t;
  const lines = allLines.split("\n");
  console.log(lines);
  process.exit();
}

export const monster = () => {

  const dd = new DnD5e();

  const prem = fs.readFileSync('./fixtures/pre-monsters.json', {
    encoding: 'utf-8'
  });
  const preMonsters = JSON.parse(prem);
  const monsters = [];

  _.forEach(preMonsters, (pm) => {
    const nm = _.omit(pm, [
      "HP",
      "AC",
      "type",
      "traits",
      "actions",
      "legendaryActions",
      "abilities",
      "lairActions",
      "regionalEffects",
      "regionalEffectsFade"
    ]);
    nm.xp = dd.getXPbyCR(nm.challenge);
    nm.hitpoints = pm.HP;
    nm.armorclass = pm.AC;
    nm.alignment = _.capitalize(nm.alignment);
    nm.raceOrType = pm.type;

    _.forEach(_.chunk(pm.abilities.split(" "), 2), (pp) => {
      nm[pp[0]] = pp[1];
    });
    const NewTraits = [];
    let spelltraits = _.remove(pm.traits, (s) => {
      return _.startsWith(s, '•') || _.startsWith(s, 'Spellcasting') || _.startsWith(s, 'Innate Spellcasting');
    });

    if (spelltraits.length) {

      spelltraits = spelltraits.map((s) => {
        var re = /^•/;
        var subst = '*';
        return s.replace(re, subst);
      });

      const spIndex = _.findIndex(spelltraits, (s) => {
        return _.startsWith(s, 'Spellcasting');
      });

      if (spIndex > 0) {
        const ics = spelltraits.slice(0, spIndex);
        ics.splice(1, 0, " ");
        let cs = spelltraits.slice(spIndex);
        cs.splice(1, 0, " ");
        pm.traits.unshift(cs.join("\n"));
        pm.traits.unshift(ics.join("\n"));
      } else {
        let cs = spelltraits;
        cs.splice(1, 0, " ");
        pm.traits.unshift(cs.join("\n"));
      }

    }

    _.forEach(pm.traits, (tt) => {
      NewTraits.push({
        name: _.trim(tt.slice(0, tt.indexOf("."))),
        content: _.trim(tt.substr(tt.indexOf(".") + 1))
      });
    });
    nm.traits = JSON.stringify(NewTraits);

    const NewActions = [];
    _.forEach(pm.actions, (tt) => {
      NewActions.push({
        name: _.trim(tt.slice(0, tt.indexOf("."))),
        content: _.trim(tt.substr(tt.indexOf(".") + 1))
      });
    });
    nm.actions = JSON.stringify(NewActions);

    const NewLeActions = [];
    _.forEach(pm.legendaryActions, (tt) => {
      NewLeActions.push({
        name: _.trim(tt.slice(0, tt.indexOf("."))),
        content: _.trim(tt.substr(tt.indexOf(".") + 1))
      });
    });
    nm.legendaryActions = JSON.stringify(NewLeActions);
    monsters.push(nm);
  });

  console.log(JSON.stringify(monsters));
  process.exit();
};

export const parsePreEffects = () => {

  const pef = fs.readFileSync('./fixtures/pre-effects.json', {
    encoding: 'utf-8'
  });

  const preEffects = JSON.parse(pef);
  const newEffects = [];

  const {words, effects} = preEffects;

  _.forEach(effects, (effect) => {

    const effectTemplate = _.template(effect.effect);

    _.forEach(effect.words, (ew) => {

      _.forEach(words[ew], (word) => {

        const templateVars = {};
        templateVars[ew] = word;
        newEffects.push({
          effect: effectTemplate(templateVars),
          nouns: [],
          adjectives: [],
          titles: []
        });

      });

    });


  });
  console.log(JSON.stringify(newEffects));
}
export const synonyms = (word) => {

  let url = "http://words.bighugelabs.com/api/2/" + process.env.BH_THES_KEY + "/" + word + "/json";

  popsicle(url).then((res) => {

    if (res.status > 199 && res.status < 400) {

      const words = JSON.parse(res.body);
      if (!words.noun) {
        words.noun = {
          syn: []
        };
      }

      if (!words.adjective) {
        words.adjective = {
          syn: []
        };
      }

      const ucNouns = _.map(words.noun.syn, (noun) => {
        return _.capitalize(noun);
      });

      const ucAdjs = _.map(words.adjective.syn, (adj) => {
        return _.capitalize(adj);
      });


      console.log(JSON.stringify({
        nouns: ucNouns || [],
        adjectives: ucAdjs || []
      }));

    } else {
      console.error("Error.", res.body)
    }


  });

};

export const exportEffects = () => {

  return Db.Effects.findAll().then((dbEffects) => {

    const newEffects = _.map(dbEffects, (d) => {
      return {
        effect: d.effect,
        titles: d.titles,
        adjectives: d.adjectives,
        nouns: d.nouns,
        priceInCp: d.priceInCp
      }
    });

    console.log(JSON.stringify(newEffects));

  }).catch(err => {
    console.log(err);
  }).finally(() => {
    process.exit();
  });

}
export const newWeapons = () => {

  const w = fs.readFileSync('./fixtures/weapons.csv', {
    encoding: 'utf-8'
  });



  const loadWeapons = (wl) => {

    return new Promise((resolve, reject) => {
      try {
        CsvParse(wl, {
          columns: true
        }, (err, output) => {
          if (!err) {
            resolve(output);
          } else {
            reject(err);
          }
        });
      } catch ( err ) {
        reject(err);
      }
    });

  };

  const tfx = (v) => {
    if (v == "X") {
      return true;
    } else {
      return false;
    }
  };



  loadWeapons(w).then((wl) => {
    const nw = _.map(wl, (ww) => {

      let rangeMinInFt = null;
      let rangeMaxInFt = null;

      if (ww.range) {
        const parts = ww.range.split("/");
        rangeMinInFt = parseInt(parts[0]);
        rangeMaxInFt = parseInt(parts[1]);
      }


      return {
        name: ww.name,
        damage: "",
        damageSlashing: tfx(ww.damageSlashing),
        damageBludgeoning: tfx(ww.damageBludgeoning),
        damagePiercing: tfx(ww.damagePiercing),
        martial: tfx(ww.martial),
        ammunition: tfx(ww.ammunition),
        finesse: tfx(ww.finesse),
        heavy: tfx(ww.heavy),
        light: tfx(ww.light),
        loading: tfx(ww.loading),
        rangeMinInFt: rangeMinInFt || null,
        rangeMaxInFt: rangeMaxInFt || null,
        reach: tfx(ww.reach),
        thrown: tfx(ww.thrown),
        twoHanded: tfx(ww.twoHanded),
        versatile: ww.versatile || null,
        priceInCp: convertToCoppers(ww.cost.slice(2) + ww.cost.slice(0, 2)),
        weightInLb: parseInt(ww.weight)
      }

    });

    console.log(JSON.stringify(nw));
    process.exit();

  }).catch((err) => {
    console.log("Error!", err);
  });

}
