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
  it('should reply to IntentRequest - HelloWorldIntent', (done) => {
    testRequest(newIntentRequest('HelloWorldIntent'), done, (result) => {
      result.response.outputSpeech.text.should.equal('Hello World!');
    });
  });
  it('should reply to SessionEndRequest', (done) => {
    testRequest(newSessionEndRequest(), done, (result) => {
      should.equal(result, undefined);
    });
  });
});
