import './setup';
import { applyRequest, performTest } from './integration-helpers';
import { newLaunchRequest, newGenericRequest } from './mocks/event';
import { WELCOME_MESSAGE, REPEAT_MESSAGE } from '../src/welcome-controller';

describe('welcome-integration: LaunchRequest', () => {
  it('should reply to LaunchRequest', (done) => {
    performTest(newLaunchRequest(), done, (result) => {
      result.response.outputSpeech.text.should.equal(WELCOME_MESSAGE);
    });
  });
});
describe('welcome-integration: Response to Welcome', () => {
  let welcomedState;
  before((done) => {
    applyRequest(newLaunchRequest())
      .then((state) => {
        welcomedState = state;
        done();
      })
      .catch(done);
  });
  it('goes to rules if answer is rules', (done) => {
    const request = newGenericRequest('rules', welcomedState);
    performTest(request, done, (result) => {
      result.sessionAttributes.controller.should.equal('rules');
      result.response.outputSpeech.text.should.equal('rules'); // TODO: this will change
    });
  });
  it('goes to face-off if answer is play', (done) => {
    const request = newGenericRequest('play', welcomedState);
    performTest(request, done, (result) => {
      result.sessionAttributes.controller.should.equal('faceOff');
      result.response.outputSpeech.text.should.equal('face-off'); // TODO: this will change
    });
  });
  it('should repeat question if something unexpected is said', (done) => {
    const request = newGenericRequest('foo', welcomedState);
    performTest(request, done, (result) => {
      // welcome is the default controller, but it is never explicitly set
      // so there is no test to see that the controller is 'welcome'
      result.response.outputSpeech.text.should.equal(REPEAT_MESSAGE);
    });
  });
});
