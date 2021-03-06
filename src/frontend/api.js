import popsicle from 'popsicle';
import urijs from 'urijs';
import log from 'loglevel';
export const login = (credentials) => {
  return callServer('/login', 'POST', null, credentials);
};

export const confirm = (code) => {
  return callServer('/confirm', 'POST', null, code);
};

export const verifyReset = (code) => {
  return callServer('/verifyreset', 'POST', null, code);
};

export const resetPassword = (newpass) => {
  return callServer('/resetpassword', 'POST', null, newpass);
};

export const forgotPassword = (username) => {
  return callServer('/forgotpassword', 'POST', null, {
    username: username
  });
};

export const register = (registration) => {
  return callServer('/register', 'POST', null, registration);
};

export const account = (account) => {
  return callServer('/account', 'POST', null, account);
};

export const logout = () => {
  return callServer('/logout', 'GET');
};

export const me = () => {
  return callServer('/me', 'GET');
};

export const weapons = () => {
  return callServer('/generate/weapons', 'GET');
};

export const getModule = (id) => {
  return callServer('/module/' + id, 'GET');
};

export const getModulePdf = (id) => {
  return callServer('/module/pdf/' + id, 'GET');
};

export const makeModulePdf = (id) => {
  return callServer('/module/pdf/' + id, 'POST');
};


export const postModule = (m) => {
  m.name = m.name || "Untitled";
  return callServer('/module', 'POST', null, m);
};

export const delModule = (id) => {
  return callServer('/module/' + id, 'DELETE');
};

export const getModules = () => {
  return callServer('/modules');
};

export const effects = (effectCount, weaponCount) => {
  const query = {};
  if (effectCount) {
    query.effectCount = effectCount;
  }
  if (weaponCount) {
    query.weaponCount = weaponCount;
  }
  return callServer('/generate/effects', 'GET', query);
};

export const userweaponUpsert = (userweapon) => {
  return callServer('/my/weapon', 'POST', null, userweapon);
};

export const userweaponsGet = (id) => {
  return callServer('/my/weapons', 'GET');
};

export const userweaponGet = (id) => {
  return callServer('/my/weapon/' + id, 'GET');
};

export const userweaponDelete = (id) => {
  return callServer('/my/weapon/' + id, 'DELETE');
};

export const subscribePost = (subscription) => {
  return callServer('/payment/subscribe', 'POST', null, subscription);
};

export const subscribeGet = () => {
  return callServer('/payment/subscribe', 'GET');
};

export const subscribeDel = () => {
  return callServer('/payment/subscribe', 'DELETE');
};

export const monstersByName = (startswith, limit) => {
  return callServer('/monsters/named', 'GET', {
    q: startswith,
    limit: limit
  });
};

export const monster = (id) => {
  return callServer('/monster/' + id, 'GET');
};


export const uploadFile = (file, moduleId, replaces, onDone, onError, onProgress) => {

  const dd = {
    file: file,
    moduleId: moduleId
  };
  if (replaces) {
    dd.replaces = replaces;
  }

  const uri = new urijs(process.env.API_URL + "/upload");

  const request = popsicle({
    method: "POST",
    body: dd,
    headers: {
      "Content-Type": "multipart/form-data"
    },
    url: uri.toString(),
    options: {
      withCredentials: true
    }
  });

  request.progress(() => {
    onProgress(request);
  });

  request.then((response) => {
    onDone(response);
  }).catch(err => {
    onError(err);
  });

};

export const deleteFile = (file, moduleId) => {
  return callServer('/upload', 'DELETE', null, {
    filename: file,
    moduleId: moduleId
  });
};

export const getStripeToken = (cc) => {

  return new Promise((resolve, reject) => {

    Stripe.card.createToken({
      number: cc.number,
      cvc: cc.cvc,
      exp_month: cc.exp_month,
      exp_year: cc.exp_year
    }, (status, response) => {

      if (response.error) {
        reject(response.error);
      } else {
        resolve(response);
      }
    });
  });

};

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
