import md5 from 'md5';
import Uri from 'urijs';
import _ from 'lodash';
import fs from 'fs';
import popsicle from 'popsicle';
import Db from './db';

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

    console.log(JSON.stringify(dbEffects));

  }).catch(err => {
    console.log(err);
  }).finally(() => {
    process.exit();
  });

}
