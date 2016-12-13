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

describe('hello world', () => {
  it('should reply to LaunchRequest', (done) => {
    testRequest(newLaunchRequest(), done, (result) => {
      result.response.outputSpeech.text.should.equal('Welcome to the Alexa Skills Kit, you can say hello');
    });
  });
  it('should reply to IntentRequest - GenericIntent', (done) => {
    const slots = {
      spokenText: {
        name: 'spokenText',
        value: 'hi',
      },
    };
    testRequest(newIntentRequest('GenericIntent', slots), done, (result) => {
      result.response.outputSpeech.text.should.equal('You said hi');
    });
  });
  it('should reply to SessionEndRequest', (done) => {
    testRequest(newSessionEndRequest(), done, (result) => {
      should.equal(result, undefined);
    });
  });
});
