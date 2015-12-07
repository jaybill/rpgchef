import popsicle from 'popsicle';
import urijs from 'urijs';

export const login = function(credentials) {
  return callServer('/login', 'POST', null, credentials);
}
export const logout = function() {
  return callServer('/logout', 'GET');
}
export const me = function() {
  return callServer('/me', 'GET');
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

export default {
  login,
  logout,
  me
}
