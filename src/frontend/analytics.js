import log from 'loglevel';

export const analytics = (path, options) => {
  if (!options) {
    options = {};
  }
  options.page = path;
  log.debug("logging pageview of: " + path);
  ga('send', 'pageview', options);
};

export const logEvent = (category, action, label) => {

  log.debug("logging event: ", category, action, label);
  ga('send', {
    hitType: 'event',
    eventCategory: category,
    eventAction: action,
    eventLabel: label
  });

};

export const pageView = (path) => {

  analytics(path);
};
