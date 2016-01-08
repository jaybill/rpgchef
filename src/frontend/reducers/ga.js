import { UPDATE_PATH } from 'redux-simple-router';
import log from 'loglevel';

export const ga =  (state={path:""}, action)=> {
    log.debug("HAI");
    switch(action.type) {
    case UPDATE_PATH:
        // do something here
        log.debug(action.payload);
        return Object.assign({},{path: action.payload},state);
        break;
    default:
        return state;
        break;
    }
}
