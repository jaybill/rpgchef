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

