import popsicle from 'popsicle';
import urijs from 'urijs';

export const doLogin = function(credentials) {
  return callServer('/login', 'POST', null, credentials);
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
    url: uri.toString()
  }

  );

}
