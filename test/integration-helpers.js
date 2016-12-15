import _ from 'lodash';
import { handler } from '../src';
import context from './mocks/context';

// utility functions to make integration testing easier:

// returns the new state
const applyRequest = (request, state) => new Promise((resolve, reject) => {
  const combinedRequestState = _.cloneDeep(request);
  if (state) {
    combinedRequestState.session.attributes = _.cloneDeep(state);
  }
  handler(combinedRequestState, context, (err, result) => {
    if (err) {
      reject(err);
    } else {
      resolve(result.sessionAttributes);
    }
  });
});

// returns the new state
const applyRequests = (requests, state) => new Promise((resolve, reject) => {
  if (requests.length === 0) {
    resolve(state);
  } else {
    const applyState = state || _.get(requests, '[0].session.attributes', {});
    applyRequest(requests[0], applyState)
      .then((newState) => {
        resolve(applyRequests(requests.slice(1), newState));
      })
      .catch(reject);
  }
});

const performTest = (request, done, verifyResult) => {
  handler(request, context, (err, result) => {
    if (!err) {
      verifyResult(result);
    }
    done(err);
  });
};

export {
  applyRequest,
  applyRequests,
  performTest,
};
