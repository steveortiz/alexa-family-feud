import {
  applyRequests,
} from '../integration-helpers';
import {
  newLaunchRequest,
  newGenericRequest,
} from './event';

const getState = (requests, done, callback) =>
applyRequests(requests)
  .then((state) => {
    callback(state);
    done();
  })
  .catch(done);

const welcomeRequests = [newLaunchRequest()];
const getWelcomedState = (done, callback) =>
  getState(welcomeRequests, done, callback);

const coinflipRequests = [...welcomeRequests, newGenericRequest('play')];
const getCoinFlipState = (done, callback) =>
  getState(coinflipRequests, done, callback);

export { getWelcomedState, getCoinFlipState }; // eslint-disable-line import/prefer-default-export
