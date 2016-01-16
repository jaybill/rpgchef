import md5 from 'md5';
import Uri from 'urijs';
import _ from 'lodash';
import fs from 'fs';
import popsicle from 'popsicle';
import Db from './db';
import CsvParse from 'csv-parse';
import { convertToCoppers } from '../lib/util';

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
      } catch (err) {
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
