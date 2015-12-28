import md5 from 'md5';
import Uri from 'urijs';
import _ from 'lodash';
import fs from 'fs';
import popsicle from 'popsicle';

export const getHash = (userid, username) => {
  return md5(userid + username + process.env.SALT);
}
export const sendPasswordResetEmail = (user) => {
  var hash = getHash(user.get('id'), user.get('username'));
  var url = new Uri(process.env.SERVER_URL + "/resetpassword");
  url.query({
    username: user.get('username'),
    hash: hash
  });

  var emailTemplate = _.template("Hi there\!\n\nYou (or someone pretending to be you) recently requested \na password reset for an account on RPG Chef. If you didn't\nrequest this, you can safely ignore this email. Otherwise, \nplease click on the link below:\n\n<%= url %>");

  user.email({
    subject: 'Reset your password',
    text: emailTemplate({
      url: url.toString()
    })
  });

}
export default {
  getHash,
  sendPasswordResetEmail
}

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



}
