import popsicle from 'popsicle';
import urijs from 'urijs';

export const login = function(credentials) {
  return callServer('/login', 'POST', null, credentials);
}
export const confirm = function(code) {
  return callServer('/confirm', 'POST', null, code);
}
export const verifyReset = function(code) {
  return callServer('/verifyreset', 'POST', null, code);
}
export const resetPassword = function(newpass) {
  return callServer('/resetpassword', 'POST', null, newpass);
}
export const forgotPassword = function(username) {
  return callServer('/forgotpassword', 'POST', null, {
    username: username
  });
}
export const register = function(registration) {
  return callServer('/register', 'POST', null, registration);
}
export const account = function(account) {
  return callServer('/account', 'POST', null, account);
}
export const logout = function() {
  return callServer('/logout', 'GET');
}
export const me = function() {
  return callServer('/me', 'GET');
}
export const weapons = function() {
  return callServer('/generate/weapons', 'GET');
}
export const effects = function(count) {
  const query = {};
  if (count) {
    query.count = count;
  }

  return callServer('/generate/effects', 'GET', query);
}
function callServer(url, method, query, data, headers) {

  const uri = new urijs(process.env.API_URL + url);

  if (query) {
    uri.query(query);
  }

  return popsicle({
    method: method,
    body: data,
    headers: headers,
    url: uri.toString(),
    options: {
      withCredentials: true
    }
  });

}
