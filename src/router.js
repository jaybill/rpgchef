import { create as createRouter, HistoryLocation, HashLocation } from 'react-router';
import routes from './routes';
import log from 'loglevel';


log.debug(create);

export default createRouter({
  location: HistoryLocation,
  routes: routes
});
