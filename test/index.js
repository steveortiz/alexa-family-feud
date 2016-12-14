import './setup';
import { handler } from '../src';
import context from './mocks/context';
import { newLaunchRequest, newIntentRequest, newSessionEndRequest } from './mocks/event';

// utility function to reduce boilerplate
const testRequest = (request, done, verifyResult) => {
  handler(request, context, (err, result) => {
    if (!err) {
      verifyResult(result);
    }
    done(err);
  });
};

const newGenericRequest = (value, state) => {
  const slots = {
    spokenText: {
      name: 'spokenText',
      value,
    },
  };
  return newIntentRequest('GenericIntent', slots, state);
};

describe('hello world', () => {
  it('should reply to LaunchRequest', (done) => {
    testRequest(newLaunchRequest(), done, (result) => {
      result.response.outputSpeech.text.should.equal('Welcome to Family Feud. Are you ready to play?');
    });
  });
  it('should ask question after saying yes to welcome', (done) => {
    const request = newGenericRequest('yes', { controller: 'welcome' });
    testRequest(request, done, (result) => {
      result.response.outputSpeech.text.should.equal('What do people yell at their dogs?');
    });
  });
  it('should welcome user if answer sit to question', (done) => {
    const request = newGenericRequest('sit', { controller: 'faceOff' });
    testRequest(request, done, (result) => {
      result.response.outputSpeech.text.should.equal('Welcome to Family Feud. Are you ready to play?');
    });
  });
  it('should repeat question after saying no to welcome', (done) => {
    const request = newGenericRequest('no', { controller: 'welcome' });
    testRequest(request, done, (result) => {
      result.response.outputSpeech.text.should.equal('Welcome to Family Feud. Are you ready to play?');
    });
  });
  it('should repeat question after saying stay question', (done) => {
    const request = newGenericRequest('stay', { controller: 'faceOff' });
    testRequest(request, done, (result) => {
      result.response.outputSpeech.text.should.equal('What do people yell at their dogs?');
    });
  });
  it('should reply to SessionEndRequest', (done) => {
    testRequest(newSessionEndRequest(), done, (result) => {
      should.equal(result, undefined);
    });
  });
});
