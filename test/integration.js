import _ from 'lodash';
import './setup';
import { handler } from '../src';
import context from './mocks/context';
import { newLaunchRequest, newIntentRequest, newSessionEndRequest } from './mocks/event';

// utility functions to make integration testing easier:

const newGenericRequest = (value, state) => {
  const slots = {
    spokenText: {
      name: 'spokenText',
      value,
    },
  };
  return newIntentRequest('GenericIntent', slots, state);
};

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

describe('LaunchRequest', () => {
  it('should reply to LaunchRequest', (done) => {
    performTest(newLaunchRequest(), done, (result) => {
      result.response.outputSpeech.text.should.equal('Welcome to Family Feud. Are you ready to play?');
    });
  });
});
describe('Response to Welcome', () => {
  let welcomedState;
  before((done) => {
    applyRequest(newLaunchRequest())
      .then((state) => {
        welcomedState = state;
        done();
      })
      .catch(done);
  });
  it('should ask question after saying yes to welcome', (done) => {
    const request = newGenericRequest('yes', welcomedState);
    performTest(request, done, (result) => {
      result.response.outputSpeech.text.should.equal('What do people yell at their dogs?');
    });
  });
  it('should repeat question after saying no to welcome', (done) => {
    const request = newGenericRequest('no', welcomedState);
    performTest(request, done, (result) => {
      result.response.outputSpeech.text.should.equal('Welcome to Family Feud. Are you ready to play?');
    });
  });
});
describe('Response to Question', () => {
  let questionState;
  before((done) => {
    applyRequests([newLaunchRequest(), newGenericRequest('yes')])
      .then((state) => {
        questionState = state;
        done();
      })
      .catch(done);
  });
  it('should welcome user if answer sit to question', (done) => {
    const request = newGenericRequest('sit', questionState);
    performTest(request, done, (result) => {
      result.response.outputSpeech.text.should.equal('Welcome to Family Feud. Are you ready to play?');
    });
  });
  it('should repeat question after saying stay question', (done) => {
    const request = newGenericRequest('stay', questionState);
    performTest(request, done, (result) => {
      result.response.outputSpeech.text.should.equal('What do people yell at their dogs?');
    });
  });
});
describe('SessionEndRequest', () => {
  it('should reply to SessionEndRequest', (done) => {
    performTest(newSessionEndRequest(), done, (result) => {
      should.equal(result, undefined);
    });
  });
});
